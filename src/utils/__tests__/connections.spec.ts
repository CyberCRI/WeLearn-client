import { describe, it, expect } from 'vitest';
import {
  buildIdeasRequest,
  buildSelectionRequest,
  cleanCitations,
  parseAdaptation,
  parseIdeas,
  parseSelection,
  sourceLink,
  type ConfirmedCourse,
  type ConnectionIdea
} from '@/utils/connections';
import type { Document } from '@/types';

const doc = (title: string, content: string, url = `https://example.org/${title}`): Document =>
  ({
    id: title,
    score: 1,
    payload: {
      document_id: title,
      document_title: title,
      document_url: url,
      document_sdg: [8],
      document_corpus: 'insee',
      document_desc: '',
      document_details: { publisher: 'INSEE' } as any,
      slice_content: content,
      slice_sdg: 8,
      document_lang: 'fr',
      document_scrape_date: ''
    }
  }) as Document;

const course: ConfirmedCourse = {
  title: 'Introduction à la macroéconomie',
  discipline: 'économie',
  level: 'L1 – S1',
  isLesson: false,
  topics: ['Le PIB', 'Le chômage'],
  sessions: [],
  objectives: ['Comprendre ce que mesure le PIB.'],
  description: null
};
const parts = ['Introduction à la macroéconomie', ...course.topics, ...course.objectives];

const idea: ConnectionIdea = {
  title: 'Les limites du PIB',
  anchor: 'Le PIB',
  why: 'Le PIB ne mesure pas le bien-être.',
  how: 'Comparer le PIB à d’autres indicateurs.',
  queries: ['limites du PIB comme mesure du bien-être', 'beyond GDP well-being indicators']
};

const candidates = [
  doc('Nouveaux indicateurs de richesse', 'Le PIB ne mesure ni le bien-être ni la soutenabilité.'),
  doc('Programme de lutte contre la pauvreté en Indonésie', 'A cash transfer programme in Java.'),
  doc('Sans lien', 'Le PIB ne mesure pas tout.', 'not-a-link')
];

describe('buildIdeasRequest', () => {
  it('asks for ideas from the course alone, with targeted search questions', () => {
    const request = buildIdeasRequest(course, 'fr');
    expect(request.sources).toHaveLength(1);
    expect((request.sources[0] as any).payload.slice_content).toContain(
      'Titre : Introduction à la macroéconomie'
    );
    expect(request.query).toContain('deux questions de recherche précises');
  });
});

describe('parseIdeas', () => {
  it('keeps ideas with search questions, and their place only when it is in the course', () => {
    const parsed = parseIdeas(
      JSON.stringify({
        ideas: [
          { ...idea, queries: ['q1', 'q2', 'q3'] },
          { ...idea, anchor: 'Un thème inventé' },
          { ...idea, queries: [] }
        ]
      }),
      parts
    );
    expect(parsed).toHaveLength(2);
    expect(parsed![0].queries).toEqual(['q1', 'q2']);
    expect(parsed![0].anchor).toBe('Le PIB');
    expect(parsed![1].anchor).toBeNull();
    expect(parseIdeas('Désolé.', parts)).toBeNull();
  });
});

describe('buildSelectionRequest', () => {
  it('gives the AI each candidate with its source, for this idea only', () => {
    const request = buildSelectionRequest(course, idea, candidates, 'fr');
    expect(request.query).toContain('Titre : Les limites du PIB');
    expect((request.sources[0] as Document).payload.slice_content).toMatch(
      /^Source : insee · INSEE/
    );
    // the original resource is left unchanged
    expect(candidates[0].payload.slice_content).toBe(
      'Le PIB ne mesure ni le bien-être ni la soutenabilité.'
    );
  });
});

describe('parseSelection', () => {
  const answer = (value: unknown) => JSON.stringify(value);

  it('keeps the resources the AI judged useful, when their quote is in their text', () => {
    const parsed = parseSelection(
      answer({
        keep: true,
        why: 'Le PIB ne dit rien du bien-être (Doc 1).',
        how: 'Débat en classe.',
        resources: [
          {
            document: 1,
            usefulness: 'Présente des indicateurs complémentaires.',
            evidence: '« Le PIB ne mesure ni le bien-être ni la soutenabilité. »'
          },
          { document: 2, usefulness: 'Un cas.', evidence: 'Not in the text.' }
        ]
      }),
      idea,
      candidates
    );
    expect(parsed).toMatchObject({
      title: 'Les limites du PIB',
      anchor: 'Le PIB',
      why: 'Le PIB ne dit rien du bien-être (« Nouveaux indicateurs de richesse »).'
    });
    expect((parsed as any).resources).toEqual([
      { document: candidates[0], usefulness: 'Présente des indicateurs complémentaires.' }
    ]);
  });

  it('drops the idea when the AI keeps nothing, or when no resource passes the checks', () => {
    expect(parseSelection(answer({ keep: false, resources: [] }), idea, candidates)).toEqual({
      keep: false
    });
    // a resource without a real link is never shown
    expect(
      parseSelection(
        answer({
          keep: true,
          why: 'a',
          how: 'b',
          resources: [{ document: 3, usefulness: 'u', evidence: 'Le PIB ne mesure pas tout.' }]
        }),
        idea,
        candidates
      )
    ).toEqual({ keep: false });
  });

  it('drops the idea when it states a figure its resources do not contain', () => {
    expect(
      parseSelection(
        answer({
          keep: true,
          why: 'L’élasticité est de 60 à 70 %.',
          how: 'b',
          resources: [
            {
              document: 1,
              usefulness: 'u',
              evidence: 'Le PIB ne mesure ni le bien-être ni la soutenabilité.'
            }
          ]
        }),
        idea,
        candidates
      )
    ).toEqual({ keep: false });
  });

  it('returns null when the answer is not the expected structure', () => {
    expect(parseSelection('Je ne peux pas.', idea, candidates)).toBeNull();
  });
});

describe('cleanCitations', () => {
  it('turns citations into the titles of the resources they point to', () => {
    expect(
      cleanCitations(
        'Voir <a href="https://x" target="_blank">[Doc 1]</a>. Et **Doc 9**.',
        candidates
      )
    ).toBe('Voir (« Nouveaux indicateurs de richesse »). Et.');
  });
});

describe('parseAdaptation', () => {
  it('reads a short activity: at most 4 steps, and needs a title and steps', () => {
    const parsed = parseAdaptation(
      JSON.stringify({
        title: 'Au-delà du PIB',
        placement: 'Séance sur le PIB',
        objective: 'Discuter les limites du PIB.',
        duration: '20 min',
        steps: ['Lire un extrait (Doc 1).', 'Discuter.', 'Comparer.', 'Synthétiser.', 'De trop.'],
        student_task: 'Comparer deux indicateurs.',
        check: 'Une phrase de synthèse.',
        documents: [1]
      }),
      candidates
    );
    expect(parsed?.steps).toHaveLength(4);
    expect(parsed?.steps[0]).toBe('Lire un extrait (« Nouveaux indicateurs de richesse »).');
    expect(parsed?.documents).toEqual([candidates[0]]);
    expect(
      parseAdaptation(JSON.stringify({ title: 'Sans étapes', steps: [] }), candidates)
    ).toBeNull();
  });
});

describe('cleanCitations: bracketed references', () => {
  it('turns [Doc 1] into the plain title, without brackets', () => {
    expect(cleanCitations('Lisez [Doc 1] puis [Doc 2].', candidates)).toBe(
      'Lisez « Nouveaux indicateurs de richesse » puis « Programme de lutte contre la pauvreté en Indonésie ».'
    );
  });
});

describe('sourceLink', () => {
  it('prefers the publisher’s DOI and opens it at the verified passage', () => {
    const article = {
      ...doc('Article'),
      payload: {
        ...doc('Article').payload,
        document_url: 'https://openalex.org/W1',
        document_details: { doi: 'https://doi.org/10.1/x' } as any
      }
    } as Document;
    expect(sourceLink(article)).toBe('https://doi.org/10.1/x');
    expect(sourceLink(article, 'Wood-based construction consumes 3800 GJ, more or less')).toBe(
      'https://doi.org/10.1/x#:~:text=Wood%2Dbased%20construction%20consumes%203800%20GJ%2C%20more%20or%20less'
    );
    expect(sourceLink(doc('Page'))).toBe('https://example.org/Page');
  });
});

describe('citation lists', () => {
  it('names every document of a list, not only the first', () => {
    const docs = ['A', 'B', 'C'].map(
      (title) => ({ payload: { document_title: title } }) as unknown as Document
    );
    expect(cleanCitations('Lire les Docs 1, 2 et 3.', docs)).toBe('Lire les « A », « B », « C ».');
  });
});
