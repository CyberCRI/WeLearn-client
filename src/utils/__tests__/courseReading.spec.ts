import { describe, it, expect, vi } from 'vitest';
import {
  askUsableAnswer,
  buildReadingRequest,
  guessLanguage,
  MAX_TEXT_LENGTH,
  buildOutlineRequest,
  parseOutlineAnswer,
  textParts,
  parseJsonObject,
  parseReadingAnswer
} from '@/utils/courseReading';

// reused from the "design your course" prototype; its word-for-word dropping is replaced by
// utils/courseCheck (tested there), which keeps and marks instead of dropping
describe('guessLanguage', () => {
  it('recognises French and English syllabi', () => {
    expect(guessLanguage('Ce cours présente les outils de la statistique et des données.')).toBe(
      'fr'
    );
    expect(guessLanguage('This course introduces the tools of statistics and data.')).toBe('en');
  });

  it('uses the fallback when it cannot tell', () => {
    expect(guessLanguage('PIB, inflation', 'en')).toBe('en');
  });
});

describe('buildReadingRequest', () => {
  it('sends the syllabus as the only source and the instructions as the question', () => {
    const request = buildReadingRequest('Le texte du syllabus.', 'en');
    expect(request.lang).toBe('en');
    expect(request.query).toContain('Copy every value word for word');
    expect(request.sources).toHaveLength(1);
    expect(request.sources[0].payload.slice_content).toBe('Le texte du syllabus.');
  });

  it('asks for every objective and competency, at every level, with no number expected', () => {
    for (const lang of ['fr', 'en'] as const) {
      const { query } = buildReadingRequest('Texte.', lang);
      expect(query).toMatch(lang === 'fr' ? /compétences/ : /competencies/);
      expect(query).toMatch(lang === 'fr' ? /pas de nombre attendu/ : /no expected number/);
    }
  });

  it('cuts only a very long text', () => {
    const long = 'a'.repeat(MAX_TEXT_LENGTH + 10);
    expect(buildReadingRequest(long, 'fr').sources[0].payload.slice_content).toHaveLength(
      MAX_TEXT_LENGTH
    );
  });
});

describe('the outline of a long syllabus', () => {
  it('reads a long syllabus in parts, with the same rules for topics and overview', () => {
    const long = 'a'.repeat(MAX_TEXT_LENGTH) + 'b'.repeat(10);
    expect(textParts(long).map((part) => part.length)).toEqual([MAX_TEXT_LENGTH, 10]);
    expect(textParts('short')).toEqual(['short']);
    const request = buildOutlineRequest('Plan du cours', 'fr');
    expect(request.query).toContain('"topics" : les thèmes principaux du cours');
    expect(request.query).not.toContain('"objectives"');
    expect(request.sources[0].payload.slice_content).toBe('Plan du cours');
  });

  it('reads the topics and overview it returns, or nothing usable', () => {
    expect(
      parseOutlineAnswer(
        '{"summary": "Un cours.", "topics": [{"title": "Le PIB", "subtopics": ["Mesure"], "source": "Chapitre 1"}]}'
      )
    ).toEqual({
      summary: 'Un cours.',
      topics: [{ title: 'Le PIB', subtopics: ['Mesure'], source: 'Chapitre 1' }]
    });
    expect(parseOutlineAnswer('{"summary": "Un cours."}')).toBeNull();
    expect(parseOutlineAnswer('pas de JSON')).toBeNull();
  });
});

describe('parseReadingAnswer', () => {
  it('reads a JSON answer, even with text around it', () => {
    const parsed = parseReadingAnswer(
      'Voici : {"title": " Macroéconomie ", "topics": ["PIB", 3, ""], "objectives": [{"text": "Définir le PIB.", "scope": "other"}]} Fin.'
    );
    expect(parsed?.title).toBe('Macroéconomie');
    expect(parsed?.topics).toEqual([{ title: 'PIB', subtopics: [], source: 'PIB' }]);
    expect(parsed?.objectives).toEqual([{ text: 'Définir le PIB.', scope: 'unspecified' }]);
    expect(parsed?.sessions).toEqual([]);
    expect(parsed?.discipline).toBeNull();
  });

  it('tells an answer that stopped before its end, and keeps what it holds', () => {
    const cut = parseReadingAnswer(
      '{"objectives": [{"text": "Define GDP.", "scope": "course"}], "topics": ["GDP", "Infla'
    );
    expect(cut?.objectives).toHaveLength(1);
    expect(cut?.topics).toEqual([]);
    expect(cut?.isAnswerCut).toBe(true);
    expect(parseReadingAnswer('{"topics": ["GDP"]}')?.isAnswerCut).toBe(false);
  });

  it('reads the AI overview and the topics it names, with the line each comes from', () => {
    const parsed = parseReadingAnswer(
      '{"summary": " Un cours sur le PIB. ", "topics": [{"title": "Le PIB", "subtopics": ["Mesure", 2], "source": "Chapitre 1. Le PIB"}, {"subtopics": []}]}'
    );
    expect(parsed?.summary).toBe('Un cours sur le PIB.');
    expect(parsed?.topics).toEqual([
      { title: 'Le PIB', subtopics: ['Mesure'], source: 'Chapitre 1. Le PIB' }
    ]);
  });

  it('keeps a session that has only its label, drops an empty one', () => {
    const parsed = parseReadingAnswer(
      '{"sessions": [{"label": "Week 8", "title": null}, {"label": null, "title": " "}]}'
    );
    expect(parsed?.sessions).toEqual([{ label: 'Week 8', title: null }]);
  });

  it('tells an answer cut before its objectives were complete from one cut later', () => {
    expect(
      parseReadingAnswer('{"objectives": [{"text": "A.", "scope": "course"}, {"te')
    ).toMatchObject({
      isAnswerCut: true,
      isObjectivesCut: true
    });
    expect(
      parseReadingAnswer('{"objectives": [], "topics": [{"title": "GDP"}], "sessions": [{"lab')
    ).toMatchObject({ isAnswerCut: true, isObjectivesCut: false });
  });

  it('keeps a suggested discipline only when none is stated', () => {
    expect(
      parseReadingAnswer('{"discipline": null, "discipline_suggested": "Gestion"}')
    ).toMatchObject({ discipline: null, disciplineSuggested: 'Gestion' });
    expect(
      parseReadingAnswer('{"discipline": "Économie", "discipline_suggested": "Gestion"}')
    ).toMatchObject({ discipline: 'Économie', disciplineSuggested: null });
  });

  it('returns null for anything that is not one JSON object', () => {
    expect(parseReadingAnswer('Je ne peux pas répondre.')).toBeNull();
    expect(parseReadingAnswer('{not json}')).toBeNull();
    expect(parseReadingAnswer('[1, 2]')).toBeNull();
  });
});

describe('reading material of different shapes', () => {
  it('asks again for one course only when the teacher chose it', () => {
    expect(buildReadingRequest('Texte.', 'fr', 'Droit des contrats').query).toContain(
      'Ne traite que le cours intitulé « Droit des contrats »'
    );
    expect(buildReadingRequest('Texte.', 'fr').query).not.toContain('Ne traite que');
  });

  it('reads the material type, and an unknown one as "other"', () => {
    expect(parseReadingAnswer('{"material_type": "lesson"}')?.material_type).toBe('lesson');
    expect(parseReadingAnswer('{"material_type": "book"}')?.material_type).toBe('other');
  });
});

describe('parseJsonObject', () => {
  it('puts back an object the model forgot to close before closing a list', () => {
    const answer =
      '{"sessions":[{"label":"Séance 10","title":"Révisions"],"objectives":[],"title":"A \\"b\\" ]"}';
    expect(parseJsonObject(answer)).toEqual({
      sessions: [{ label: 'Séance 10', title: 'Révisions' }],
      objectives: [],
      title: 'A "b" ]'
    });
  });

  it('still returns null for text that is not JSON', () => {
    expect(parseJsonObject('{not json at all}')).toBeNull();
  });
});

describe('askUsableAnswer', () => {
  it('asks once more when the first answer cannot be used, then gives up', async () => {
    const send = vi
      .fn()
      .mockResolvedValueOnce({ data: { answer: 'Sorry, here is a summary.' } })
      .mockResolvedValueOnce({ data: { answer: '{"title": "Macro"}' } });
    expect(await askUsableAnswer(send, parseReadingAnswer)).toMatchObject({ title: 'Macro' });
    expect(send).toHaveBeenCalledTimes(2);

    const never = vi.fn().mockResolvedValue({ data: { answer: 'no json' } });
    expect(await askUsableAnswer(never, parseReadingAnswer)).toBeNull();
    expect(never).toHaveBeenCalledTimes(2);
  });
});

describe('courseReading: checked against the syllabus', () => {
  const HRA =
    'HUMAN RIGHTS ADVOCACY\nFORMS OF ACTION, STRATEGIES, METHODS\nObjective of the Course\nThis course aims to train students on how to successfully engage in human rights\nadvocacy in various settings (courts, NGOs, United Nations).\nSummary\nThis course provides an overview of the terrain of international human rights advocacy,\nincluding forms of action, strategies, and methods. In particular, this course will help students develop their advocacy skills by introducing\nthem to the methods of strategic litigation.\nSYLLABUS\nProfessor: Eugénie MERIEAU\nThe course is divided into four overarching themes: ‘Core\nHuman Rights Treaties and Mechanisms’, ‘Civil and Political Rights’, ‘Socio-economic\nRights’, and ‘The Future of Human Rights’.\nTheme 1: Main Human Rights Treaties and Mechanisms, Universal Periodic Review,\nAdvocacy\nTheme 2: Right to life, freedom from torture, freedom from persecution\nTheme 3: Freedom of expression, freedom of assembly\nTheme 4: Right to an adequate standard of living, right to housing\nBibliography';

  it('never takes a person, a date or a label for the course title', async () => {
    const { isCourseTitle } = await import('@/utils/courseReading');
    expect(isCourseTitle('Professor: Eugénie MERIEAU')).toBe(false);
    expect(isCourseTitle('Enseignante : Marie Dupont')).toBe(false);
    expect(isCourseTitle('2026')).toBe(false);
    expect(isCourseTitle('2')).toBe(false);
    expect(isCourseTitle('Session: July 2026')).toBe(false);
    expect(isCourseTitle('Syllabus')).toBe(false);
    expect(isCourseTitle('HUMAN RIGHTS ADVOCACY')).toBe(true);
    expect(isCourseTitle('Introduction à la gestion')).toBe(true);
    expect(isCourseTitle(null)).toBe(false);
  });

  it('reads the numbered themes as written, a heading cut by a line break included', async () => {
    const { numberedTopics } = await import('@/utils/courseReading');
    expect(numberedTopics(HRA).map(({ title }) => title)).toEqual([
      'Main Human Rights Treaties and Mechanisms, Universal Periodic Review, Advocacy',
      'Right to life, freedom from torture, freedom from persecution',
      'Freedom of expression, freedom of assembly',
      'Right to an adequate standard of living, right to housing'
    ]);
    // fewer than three, or not numbered from 1: not a list of topics
    expect(numberedTopics('Theme 1: A\nTheme 2: B')).toEqual([]);
    expect(numberedTopics('Chapter 4: A\nChapter 5: B\nChapter 6: C')).toEqual([]);
    // weeks and sessions are the outline's
    expect(numberedTopics('Week 1: A\nWeek 2: B\nWeek 3: C')).toEqual([]);
  });

  it("keeps the syllabus's numbered themes when the AI regrouped and repeated them", async () => {
    const { preferNumberedTopics } = await import('@/utils/courseReading');
    const regrouped = [
      {
        title: 'Core Human Rights Treaties and Mechanisms',
        subtopics: ['Advocacy'],
        source: 'Core Human Rights Treaties and Mechanisms'
      },
      {
        title: 'Civil and Political Rights',
        subtopics: ['Right to life'],
        source: 'Civil and Political Rights'
      },
      {
        title: 'Civil and Political Rights',
        subtopics: ['Freedom of expression'],
        source: 'Civil and Political Rights'
      },
      {
        title: 'Socio-economic Rights',
        subtopics: ['Right to housing'],
        source: 'Socio-economic Rights'
      }
    ];
    expect(preferNumberedTopics(regrouped, HRA).map(({ title }) => title)).toEqual([
      'Main Human Rights Treaties and Mechanisms, Universal Periodic Review, Advocacy',
      'Right to life, freedom from torture, freedom from persecution',
      'Freedom of expression, freedom of assembly',
      'Right to an adequate standard of living, right to housing'
    ]);
  });

  it("keeps the AI's topics when they follow the syllabus: its numbering, or its own higher headings", async () => {
    const { preferNumberedTopics } = await import('@/utils/courseReading');
    const faithful = [
      {
        title: 'Main Human Rights Treaties',
        subtopics: ['UPR'],
        source: 'Main Human Rights Treaties and Mechanisms'
      },
      { title: 'Right to life', subtopics: [], source: 'Right to life, freedom from torture' },
      {
        title: 'Freedom of expression',
        subtopics: [],
        source: 'Freedom of expression, freedom of assembly'
      },
      {
        title: 'Adequate standard of living',
        subtopics: [],
        source: 'Right to an adequate standard of living'
      }
    ];
    expect(preferNumberedTopics(faithful, HRA)).toEqual(faithful);
    const parts =
      'Partie I: Introduction\nChapitre 1: Concepts\nChapitre 2: Science\nPartie II : Marchés\nChapitre 3: Offre';
    const underParts = [
      { title: 'Introduction', subtopics: ['Concepts', 'Science'], source: 'Introduction' },
      { title: 'Marchés', subtopics: ['Offre'], source: 'Marchés' }
    ];
    expect(preferNumberedTopics(underParts, parts)).toEqual(underParts);
  });

  it('merges a topic named twice, without numbered topics in the syllabus', async () => {
    const { preferNumberedTopics } = await import('@/utils/courseReading');
    expect(
      preferNumberedTopics(
        [
          { title: 'Rights', subtopics: ['A'], source: null },
          { title: 'rights', subtopics: ['B', 'A'], source: null }
        ],
        'no numbering here'
      )
    ).toEqual([{ title: 'Rights', subtopics: ['A', 'B'], source: null }]);
  });
});

describe('courseReading: subtopics of numbered topics', () => {
  it('never borrows another numbered theme as a subtopic', async () => {
    const { preferNumberedTopics } = await import('@/utils/courseReading');
    const text =
      'Theme 1: Right to life\nTheme 2: Freedom of expression\nTheme 3: Right to housing';
    const grouped = [
      {
        title: 'Civil rights',
        subtopics: ['Freedom of expression', 'Habeas corpus'],
        source: 'Theme 1: Right to life'
      },
      { title: 'Civil rights', subtopics: [], source: null }
    ];
    expect(preferNumberedTopics(grouped, text)).toEqual([
      { title: 'Right to life', subtopics: ['Habeas corpus'], source: 'Right to life' },
      { title: 'Freedom of expression', subtopics: [], source: 'Freedom of expression' },
      { title: 'Right to housing', subtopics: [], source: 'Right to housing' }
    ]);
  });
});

describe('courseReading: titles of numbered topics', () => {
  it('puts back the heading when the AI cites the right line but names a category', async () => {
    const { preferNumberedTopics } = await import('@/utils/courseReading');
    const text =
      'Theme 1: Right to life\nTheme 2: Freedom of expression\nTheme 3: Right to housing';
    const categories = [
      { title: 'Civil Rights', subtopics: [], source: 'Theme 1: Right to life' },
      {
        title: 'Freedom of expression',
        subtopics: ['Press'],
        source: 'Theme 2: Freedom of expression'
      },
      {
        title: 'Socio-economic Rights',
        subtopics: ['Right to housing'],
        source: 'Theme 3: Right to housing'
      }
    ];
    expect(preferNumberedTopics(categories, text)).toEqual([
      { title: 'Right to life', subtopics: [], source: 'Right to life' },
      {
        title: 'Freedom of expression',
        subtopics: ['Press'],
        source: 'Theme 2: Freedom of expression'
      },
      { title: 'Right to housing', subtopics: [], source: 'Right to housing' }
    ]);
  });
});
