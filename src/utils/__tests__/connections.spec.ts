import { describe, it, expect } from 'vitest';
import {
  buildAdaptationRequest,
  buildIdeasRequest,
  buildSelectionRequest,
  buildVerificationRequest,
  isQuotedIn,
  namesIn,
  parseVerification,
  restatesChange,
  isAboutProcess,
  speaksOfSustainability,
  MAX_PROBLEMS,
  unbackedNames,
  withChecks,
  namesConcept,
  verifiedQuote,
  cleanCitations,
  parseAdaptation,
  parseIdeas,
  parseSelection,
  partOfCourse,
  placeInCourse,
  sourceLink,
  type ConfirmedCourse,
  type ConnectionIdea
} from '@/utils/connections';
import type { Document } from '@/types';

const COURSE: ConfirmedCourse = {
  title: 'Introduction à la macroéconomie',
  discipline: 'économie',
  level: 'Licence 1',
  overview: 'Un cours sur les grands indicateurs.',
  topics: ['Les grandeurs de la macroéconomie (Le PIB : définition et mesure, L’inflation)'],
  objectives: ['Comprendre leur définition et leur mesure.'],
  competencies: ['Rédiger une note de conjoncture'],
  sessions: []
};
const PARTS = [
  'Les grandeurs de la macroéconomie',
  'Le PIB : définition et mesure',
  'L’inflation',
  'Comprendre leur définition et leur mesure.'
];

const doc = (id: string, content: string, url = `https://example.org/${id}`): Document =>
  ({
    score: 0.9,
    payload: {
      document_id: id,
      document_title: `Title ${id}`,
      document_url: url,
      document_corpus: 'conversation',
      document_lang: 'fr',
      document_details: {},
      document_sdg: [],
      slice_content: content
    }
  }) as unknown as Document;

const IDEA: ConnectionIdea = {
  title: 'Les limites du PIB',
  anchor: 'Le PIB : définition et mesure',
  anchorLabel: null,
  why: 'Le PIB ne mesure pas les dégâts environnementaux.',
  queries: ['limites du PIB', 'GDP limits']
};

describe('connections: requests', () => {
  it('sends the confirmed course as the only source of the ideas, in its language', () => {
    const request = buildIdeasRequest(COURSE, 'fr');
    expect(request.sources).toHaveLength(1);
    const text = (request.sources[0] as any).payload.slice_content;
    expect(text).toContain('Titre : Introduction à la macroéconomie');
    expect(text).toContain('- Comprendre leur définition et leur mesure.');
    expect(text).toContain('Compétences');
    expect(request.query).toContain('Pas de lien fondé sur un simple mot-clé');
    expect(request.query).toContain('Propose au plus 4 liens possibles');
  });

  it('gives each candidate its source line, and the idea, for the selection', () => {
    const request = buildSelectionRequest(COURSE, IDEA, [doc('a', 'Texte.')], 'en');
    expect(request.query).toContain('Title: Les limites du PIB');
    expect(request.query).toContain('Doc 1 to Doc 1');
    expect((request.sources[0] as Document).payload.slice_content).toMatch(
      /^Source : conversation · fr\nTexte\.$/
    );
  });
});

describe('connections: ideas', () => {
  it('ties each idea to the course part it names, or to nothing', () => {
    expect(partOfCourse('le pib', PARTS)).toBe('Le PIB : définition et mesure');
    // a longer text holding a part: the most precise part
    expect(
      partOfCourse('Les grandeurs de la macroéconomie : L’inflation et ses causes', PARTS)
    ).toBe('Les grandeurs de la macroéconomie');
    expect(partOfCourse('La biodiversité', PARTS)).toBeNull();
    expect(partOfCourse(null, PARTS)).toBeNull();
  });

  it('reads the ideas, leaving out an incomplete one', () => {
    const ideas = parseIdeas(
      JSON.stringify({
        ideas: [
          {
            title: 'Les limites du PIB',
            anchor: 'Le PIB',
            anchor_label: 'Mesure du PIB',
            why: 'Parce que.',
            queries: ['q1', 'q2', 'q3']
          },
          { title: 'Sans question', anchor: 'Le PIB', why: 'Parce que.', queries: [] },
          // a label for a part that is not in the course is not kept
          {
            title: 'Ailleurs',
            anchor: 'La biodiversité',
            anchor_label: 'Biodiversité',
            why: 'Parce que.',
            queries: ['q']
          }
        ]
      }),
      PARTS
    );
    expect(ideas).toEqual([
      {
        title: 'Les limites du PIB',
        anchor: 'Le PIB : définition et mesure',
        anchorLabel: 'Mesure du PIB',
        why: 'Parce que.',
        queries: ['q1', 'q2'],
        use: null
      },
      {
        title: 'Ailleurs',
        anchor: null,
        anchorLabel: null,
        why: 'Parce que.',
        queries: ['q'],
        use: null
      }
    ]);
    expect(parseIdeas('pas de JSON', PARTS)).toBeNull();
  });
});

describe('connections: one concrete change (3b)', () => {
  const resource = {
    document: doc('a', 'Le PIB ignore la dégradation des ressources naturelles.'),
    usefulness: 'Montre ce que le PIB ignore.',
    evidence: 'Le PIB ignore la dégradation des ressources naturelles.'
  };
  const answer = (value: Record<string, unknown>) =>
    JSON.stringify({
      kind: 'topic',
      original: 'Le PIB : définition et mesure',
      suggested: 'Ajouter un exemple de ce que le PIB ne compte pas.',
      why: 'Les étudiants voient les limites de l’indicateur.',
      documents: [1],
      evidence: [{ document: 1, quote: 'Le PIB ignore la dégradation des ressources naturelles.' }],
      support: 'strong',
      ...value
    });

  it('asks for one scoped change from the connection and its own resources', () => {
    const request = buildAdaptationRequest(COURSE, IDEA, [resource], 'fr');
    expect(request.query).toContain('UNE seule modification');
    expect(request.query).toContain('Titre : Les limites du PIB');
    expect(request.query).toContain("l'effet des prix de l'énergie sur l'inflation");
    expect(request.sources).toHaveLength(1);
    // without resources, the course itself is the source
    const bare = buildAdaptationRequest(COURSE, IDEA, [], 'en');
    expect((bare.sources[0] as any).payload.document_corpus).toBe('course');
  });

  it('reads the change, the original as the teacher wrote it, and what supports it', () => {
    const proposal = parseAdaptation(answer({ original: 'le PIB' }), PARTS, [resource]);
    expect(proposal).toMatchObject({
      kind: 'topic',
      original: 'Le PIB : définition et mesure',
      support: 'strong'
    });
    expect(proposal?.resources).toEqual([{ ...resource, quote: resource.evidence }]);
  });

  it('never presents as changed something the course does not contain', () => {
    expect(
      parseAdaptation(answer({ original: 'Séance 9 : la croissance verte' }), PARTS, [resource])
        ?.original
    ).toBeNull();
    expect(parseAdaptation(answer({ original: null }), PARTS, [resource])?.original).toBeNull();
  });

  it('keeps the sentence that backs the change, only when it is really in that resource', () => {
    const proposal = parseAdaptation(
      answer({
        evidence: [
          { document: 1, quote: '« Le PIB ignore la dégradation des ressources naturelles. »' },
          { document: 1, quote: 'Une autre phrase.' }
        ]
      }),
      PARTS,
      [resource]
    );
    expect(proposal?.resources[0].quote).toBe(
      'Le PIB ignore la dégradation des ressources naturelles.'
    );
    // an invented sentence is not kept, and "strong" then becomes "partial"
    const invented = parseAdaptation(
      answer({ evidence: [{ document: 1, quote: 'Le PIB baisse avec la pollution.' }] }),
      PARTS,
      [resource]
    );
    expect(invented?.resources[0].quote).toBeNull();
    expect(invented?.support).toBe('partial');
  });

  it("places an addition that names no course part in its connection's own part", () => {
    const unnamed = answer({ kind: 'teaching', original: null });
    expect(parseAdaptation(unnamed, PARTS, [resource], 'L’inflation')?.original).toBe(
      'L’inflation'
    );
    // never for a revised objective or an assessment change, nor with an anchor not in the course
    expect(
      parseAdaptation(
        answer({ kind: 'assessment', original: null }),
        PARTS,
        [resource],
        'L’inflation'
      )?.original
    ).toBeNull();
    expect(parseAdaptation(unnamed, PARTS, [resource], 'La biodiversité')?.original).toBeNull();
    expect(parseAdaptation(unnamed, PARTS, [resource])?.original).toBeNull();
  });

  it('never writes a new objective for a course without objectives', () => {
    const noObjectives = { ...COURSE, objectives: [] };
    const request = buildAdaptationRequest(noObjectives, IDEA, [resource], 'en');
    expect(request.query).toContain('Learning objectives: none stated in the syllabus');
    const ideas = buildIdeasRequest(noObjectives, 'en');
    expect((ideas.sources[0] as any).payload.slice_content).toContain(
      'Learning objectives: none stated in the syllabus'
    );
    // a "revised objective" must revise an objective of the course
    expect(
      parseAdaptation(answer({ kind: 'objective', original: 'Explain incentives.' }), PARTS, [
        resource
      ])
    ).toBeNull();
    expect(
      parseAdaptation(
        answer({ kind: 'objective', original: 'Comprendre leur définition et leur mesure.' }),
        PARTS,
        [resource]
      )?.original
    ).toBe('Comprendre leur définition et leur mesure.');
  });

  it('reads optional notes apart from the change: a GreenComp competence only from the framework', () => {
    const proposal = parseAdaptation(
      answer({
        guidance: {
          learning: 'Expliquer ce que le PIB ne mesure pas.',
          greencomp: { id: 'critical_thinking', how: 'Les étudiants interrogent un indicateur.' },
          teaching: 'Une courte comparaison entre le PIB et un indice de bien-être.',
          check: 'Les étudiants citent une limite du PIB.'
        }
      }),
      PARTS,
      [resource]
    );
    expect(proposal?.guidance).toEqual({
      learning: 'Expliquer ce que le PIB ne mesure pas.',
      greencomp: { id: 'critical_thinking', how: 'Les étudiants interrogent un indicateur.' },
      teaching: 'Une courte comparaison entre le PIB et un indice de bien-être.',
      check: 'Les étudiants citent une limite du PIB.'
    });
    // the change itself is unchanged by them
    expect(proposal?.suggested).toBe('Ajouter un exemple de ce que le PIB ne compte pas.');
    const loose = parseAdaptation(
      answer({
        guidance: {
          learning: 'Le PIB baisserait de 12 %.',
          greencomp: { id: 'green_skills', how: 'Un lien.' },
          teaching: '',
          check: null
        }
      }),
      PARTS,
      [resource]
    );
    expect(loose?.guidance).toEqual({
      learning: null,
      greencomp: null,
      teaching: null,
      check: null
    });
    // a competence named without explaining the link is not kept
    expect(
      parseAdaptation(answer({ guidance: { greencomp: { id: 'critical_thinking' } } }), PARTS, [
        resource
      ])?.guidance.greencomp
    ).toBeNull();
    expect(parseAdaptation(answer({}), PARTS, [resource])?.guidance).toEqual({
      learning: null,
      greencomp: null,
      teaching: null,
      check: null
    });
  });

  it('keeps the change with its connection: a broader level is fine, another part is not followed', () => {
    const topics = [
      {
        value: 'Les grandeurs de la macroéconomie',
        subtopics: ['Le PIB : définition et mesure', 'L’inflation']
      }
    ];
    const parse = (original: string) =>
      parseAdaptation(answer({ original }), PARTS, [resource], IDEA.anchor, topics)?.original;
    // the connection's own part
    expect(parse('Le PIB : définition et mesure')).toBe('Le PIB : définition et mesure');
    // the topic that contains it: the same place, at a broader level
    expect(parse('Les grandeurs de la macroéconomie')).toBe('Les grandeurs de la macroéconomie');
    // a sibling subtopic: the change goes where its connection is
    expect(parse('L’inflation')).toBe('Le PIB : définition et mesure');
    // a revised objective is never moved
    expect(
      parseAdaptation(
        answer({ kind: 'objective', original: 'Comprendre leur définition et leur mesure.' }),
        PARTS,
        [resource],
        IDEA.anchor,
        topics
      )?.original
    ).toBe('Comprendre leur définition et leur mesure.');
  });

  it('tidies notes so they read alike: capital first letter, one closing full stop', () => {
    const proposal = parseAdaptation(
      answer({
        guidance: {
          learning: '  analyser  les chaînes d’approvisionnement',
          greencomp: { id: 'problem_framing', how: 'les étudiant·e·s formulent le problème :' },
          teaching: 'Une discussion de cas ?',
          check: null
        }
      }),
      PARTS,
      [resource]
    );
    expect(proposal?.guidance.learning).toBe('Analyser les chaînes d’approvisionnement.');
    expect(proposal?.guidance.greencomp?.how).toBe('Les étudiant·e·s formulent le problème.');
    expect(proposal?.guidance.teaching).toBe('Une discussion de cas ?');
  });

  it('asks for the competence from what students do, favouring none', () => {
    const request = buildAdaptationRequest(COURSE, IDEA, [resource], 'en');
    expect(request.query).toContain('No competence is preferred');
    expect(request.query).toContain('If none is clearly justified by what students do, use null');
    expect(request.query).toContain('starting with a capitalised observable action verb');
  });

  it('asks for the notes with the GreenComp definitions, as outcomes not methods', () => {
    const request = buildAdaptationRequest(COURSE, IDEA, [resource], 'en');
    expect(request.query).toContain('- critical_thinking : assess information and arguments');
    expect(request.query).toContain('a learning outcome, not a method');
    expect(request.query).toContain('without changing assessment rules, weights or schedule');
    expect(request.query).toContain('"guidance": {"learning": string|null');
  });

  it('is strongly supported only by a verified sentence of a direct resource', () => {
    const context = { ...resource, role: 'context' as const };
    const strong = (resources: (typeof resource & { role?: 'context' })[]) =>
      parseAdaptation(answer({ support: 'strong' }), PARTS, resources)?.support;
    // the same verified sentence, from a resource that only gives context: partial at most
    expect(strong([context])).toBe('partial');
    expect(strong([resource])).toBe('strong');
    // the request says which documents only give context
    const query = buildAdaptationRequest(COURSE, IDEA, [resource, context], 'fr');
    const [direct, background] = query.sources as Document[];
    expect(direct.payload.slice_content).toContain('Rôle : appui direct');
    expect(background.payload.slice_content).toContain('Rôle : contexte seulement');
    expect(query.query).toContain('Un document de contexte peut situer la modification');
  });

  it('is never more than unsupported without a cited resource', () => {
    expect(
      parseAdaptation(answer({ documents: [], evidence: [] }), PARTS, [resource])?.support
    ).toBe('none');
    expect(
      parseAdaptation(answer({ documents: [4], evidence: [] }), PARTS, [resource])?.support
    ).toBe('none');
    expect(parseAdaptation(answer({ support: 'partial' }), PARTS, [resource])?.support).toBe(
      'partial'
    );
  });

  it('refuses an unusable answer, an unknown kind, or a figure the resources do not contain', () => {
    expect(parseAdaptation('pas de JSON', PARTS, [resource])).toBeNull();
    expect(parseAdaptation(answer({ kind: 'activity' }), PARTS, [resource])).toBeNull();
    expect(parseAdaptation(answer({ suggested: '' }), PARTS, [resource])).toBeNull();
    expect(
      parseAdaptation(answer({ why: 'Le PIB baisserait de 12 %.' }), PARTS, [resource])
    ).toBeNull();
  });
});

describe('connections: quotes and concepts', () => {
  const text =
    'Continuous operation is a big hindrance for MES systems, as this mode makes it more diffi- cult to boost product concentration. Key to circularity is identifying material flows with the aim 82 J. Jonker and N. Faber being to close material loops.';
  const source = doc('m', text);

  it('finds a sentence despite what pdf extraction adds, never a changed one', () => {
    // a word cut by a hyphen
    expect(
      isQuotedIn(
        'Continuous operation is a big hindrance for MES systems, as this mode makes it more difficult to boost product concentration.',
        source
      )
    ).toBe(true);
    // a page header inside the sentence
    expect(
      isQuotedIn(
        'Key to circularity is identifying material flows with the aim being to close material loops.',
        source
      )
    ).toBe(true);
    // one word changed or added: not the document's sentence
    expect(
      isQuotedIn(
        'Key to circularity is identifying energy flows with the aim being to close material loops.',
        source
      )
    ).toBe(false);
    expect(isQuotedIn('Continuous operation is a small hindrance.', source)).toBe(false);
  });

  it('keeps only the true sentence of a stitched quote, and nothing of an invented one', () => {
    expect(
      verifiedQuote(
        'Key to circularity is identifying material flows with the aim being to close material loops. Moreover, circular models always cut costs by half for every company.',
        source
      )
    ).toBe(
      'Key to circularity is identifying material flows with the aim being to close material loops.'
    );
    expect(
      verifiedQuote(
        'Circular models always cut costs by half for every company in the sector.',
        source
      )
    ).toBeNull();
  });

  it('a direct resource names the course concept in its own words, in the quoted sentence', () => {
    expect(
      namesConcept('The material balance closes around the reactor.', ['material balance'])
    ).toBe(true);
    expect(namesConcept('Recycling saves resources.', ['material balance'])).toBe(false);
    expect(namesConcept('Recycling saves resources.', [])).toBe(false);
    expect(namesConcept('Recycling saves resources.', 'recycling')).toBe(false);
  });

  it('makes a theme-only quote context, never direct', () => {
    const candidates = [
      doc('r', 'Recycling saves resources and energy across many industries today.')
    ];
    const selection = parseSelection(
      JSON.stringify({
        keep: true,
        concept: 'material balance with reaction',
        resources: [
          {
            document: 1,
            relevance: 'direct',
            concept_terms: ['material balance'],
            usefulness: 'Shows the value of recycling.',
            evidence: 'Recycling saves resources and energy across many industries today.'
          }
        ]
      }),
      IDEA,
      candidates
    );
    expect(selection?.resources).toEqual([]);
    expect(selection?.background?.[0].role).toBe('context');
  });
});

describe('connections: selection', () => {
  const candidates = [
    doc('a', 'Le PIB ignore la dégradation des ressources naturelles. Autre phrase.'),
    doc('b', 'Un texte sans rapport.'),
    doc('c', 'Une phrase sans lien.', 'not a link')
  ];
  const answer = (value: unknown) => JSON.stringify(value);

  it('keeps only resources whose quoted sentence is really in them, with a real link', () => {
    const selection = parseSelection(
      answer({
        keep: true,
        why: 'Le PIB laisse de côté l’environnement.',
        resources: [
          {
            document: 1,
            relevance: 'direct',
            same_sense: true,
            establishes: true,
            sustainability_terms: ['ressources naturelles'],
            concept_terms: ['PIB'],
            usefulness: 'Montre ce que le PIB ignore.',
            evidence: '« Le PIB ignore la dégradation des ressources naturelles. »'
          },
          // the quote is not in the document
          {
            document: 2,
            relevance: 'direct',
            same_sense: true,
            establishes: true,
            sustainability_terms: ['ressources naturelles'],
            concept_terms: ['PIB'],
            usefulness: 'Utile.',
            evidence: 'Une phrase inventée.'
          },
          // no real link
          {
            document: 3,
            relevance: 'direct',
            same_sense: true,
            establishes: true,
            sustainability_terms: ['ressources naturelles'],
            concept_terms: ['PIB'],
            usefulness: 'Utile.',
            evidence: 'Une phrase sans lien.'
          },
          // a document that was not given
          {
            document: 9,
            relevance: 'direct',
            same_sense: true,
            establishes: true,
            sustainability_terms: ['ressources naturelles'],
            concept_terms: ['PIB'],
            usefulness: 'Utile.',
            evidence: 'x'
          }
        ]
      }),
      IDEA,
      candidates
    );
    expect(selection?.why).toBe('Le PIB laisse de côté l’environnement.');
    expect(selection?.resources).toEqual([
      {
        document: candidates[0],
        usefulness: 'Montre ce que le PIB ignore.',
        evidence: 'Le PIB ignore la dégradation des ressources naturelles.'
      }
    ]);
  });

  it('keeps only direct support as support; context apart, labelled; anything else left out', () => {
    const contextOnly = parseSelection(
      JSON.stringify({
        keep: true,
        why: 'Une affirmation que seul un document de contexte permettrait.',
        resources: [
          {
            document: 1,
            subject: 'Le développement durable en général',
            relevance: 'context',
            usefulness: 'Donne le contexte.',
            evidence: 'Le PIB ignore la dégradation des ressources naturelles.'
          },
          // a tangential document is never kept, even with a quote found in it
          {
            document: 2,
            relevance: 'tangential',
            usefulness: 'Rien.',
            evidence: 'Un texte sans rapport.'
          }
        ]
      }),
      IDEA,
      candidates
    );
    // not supported: the idea keeps its own words, the context resource kept apart
    expect(contextOnly?.resources).toEqual([]);
    expect(contextOnly?.why).toBe(IDEA.why);
    expect(contextOnly?.background).toEqual([
      {
        document: candidates[0],
        usefulness: 'Donne le contexte.',
        evidence: 'Le PIB ignore la dégradation des ressources naturelles.',
        role: 'context'
      }
    ]);
    // the earlier name of the judgement is read as context too
    expect(
      parseSelection(
        JSON.stringify({
          keep: true,
          resources: [
            {
              document: 1,
              relevance: 'indirect',
              usefulness: 'Montre ce que le PIB ignore.',
              evidence: 'Le PIB ignore la dégradation des ressources naturelles.'
            }
          ]
        }),
        IDEA,
        candidates
      )?.resources
    ).toEqual([]);
  });

  it('asks to judge resources against the course concept, not the sustainability theme', () => {
    const query = buildSelectionRequest(COURSE, IDEA, candidates, 'en').query;
    expect(query).toContain('precise disciplinary concept or mechanism');
    expect(query).toContain('A document on the general sustainability theme is not "direct"');
    expect(query).toContain('That a sentence appears in the document proves nothing');
    expect(query).toContain('"relevance": "direct"|"context"');
  });

  it('keeps an idea the AI could not support, without resources, never dropped', () => {
    expect(parseSelection(answer({ keep: false }), IDEA, candidates)).toEqual({
      title: IDEA.title,
      anchor: IDEA.anchor,
      anchorLabel: IDEA.anchorLabel,
      why: IDEA.why,
      resources: [],
      background: [],
      queries: IDEA.queries,
      use: null
    });
    const noValidResource = parseSelection(
      answer({
        keep: true,
        resources: [
          {
            document: 2,
            relevance: 'direct',
            same_sense: true,
            establishes: true,
            sustainability_terms: ['ressources naturelles'],
            concept_terms: ['PIB'],
            usefulness: 'U.',
            evidence: 'Inventée.'
          }
        ]
      }),
      IDEA,
      candidates
    );
    expect(noValidResource?.resources).toEqual([]);
    expect(parseSelection('pas de JSON', IDEA, candidates)).toBeNull();
  });

  it('never states a figure the resources do not contain', () => {
    const selection = parseSelection(
      answer({
        keep: true,
        why: 'Le PIB baisserait de 12 % avec les dégâts.',
        resources: [
          {
            document: 1,
            relevance: 'direct',
            same_sense: true,
            establishes: true,
            sustainability_terms: ['ressources naturelles'],
            concept_terms: ['autre phrase'],
            usefulness: 'Montre ce que le PIB ignore.',
            evidence: 'Autre phrase.'
          },
          {
            document: 1,
            relevance: 'direct',
            same_sense: true,
            establishes: true,
            sustainability_terms: ['ressources naturelles'],
            concept_terms: ['PIB'],
            usefulness: 'Doublon.',
            evidence: 'Autre phrase.'
          }
        ]
      }),
      IDEA,
      candidates
    );
    expect(selection?.why).toBe(IDEA.why);
    expect(selection?.resources).toHaveLength(1);
  });

  it('names the real resource instead of "Doc N", and links to the quoted passage', () => {
    expect(cleanCitations('Voir [Doc 1] et Docs 1 et 2.', candidates)).toBe(
      'Voir « Title a » et « Title a », « Title b ».'
    );
    expect(sourceLink(candidates[0], 'Le PIB ignore la dégradation')).toBe(
      'https://example.org/a#:~:text=Le%20PIB%20ignore%20la%20d%C3%A9gradation'
    );
    expect(sourceLink(candidates[0])).toBe('https://example.org/a');
  });
});

describe('connections: where a connection sits in the course', () => {
  const course = {
    topics: ['Évaluation des performances', 'Stratégie'],
    objectives: ['Comprendre les outils de gestion.'],
    competencies: ['Travailler en équipe'],
    sessions: [
      'Semaine du 15/12 – CM7 « Évaluation des performances »',
      'Semaine du 01/12 – CM2 & CM3 Stratégie',
      'Chapitre 1. Introduction'
    ]
  };

  it('splits a session into its subject and its placement', () => {
    expect(placeInCourse(course.sessions[0], { ...course, topics: [] })).toMatchObject({
      kind: 'session',
      subject: 'Évaluation des performances',
      placement: 'CM7 · Semaine du 15/12'
    });
    // a chapter without a week or session label: no placement is invented
    expect(placeInCourse('Chapitre 1. Introduction', course)).toMatchObject({
      subject: 'Chapitre 1. Introduction',
      placement: null
    });
  });

  it('places a topic only through the one session naming it', () => {
    expect(placeInCourse('Évaluation des performances', course)).toMatchObject({
      kind: 'topic',
      subject: 'Évaluation des performances',
      placement: 'CM7 · Semaine du 15/12'
    });
    expect(
      placeInCourse('Stratégie', {
        ...course,
        sessions: [...course.sessions, 'Séance 9 – Stratégie']
      })?.placement
    ).toBeNull();
  });

  it('names an objective or competency by its number, never placed', () => {
    expect(placeInCourse('Comprendre les outils de gestion.', course)).toMatchObject({
      kind: 'objective',
      index: 0,
      placement: null
    });
    expect(placeInCourse('Travailler en équipe', course)).toMatchObject({ kind: 'competency' });
    expect(placeInCourse(null, course)).toBeNull();
  });
});

describe('connections: relevance and evidence checks', () => {
  const answer = (value: unknown) => JSON.stringify(value);
  // the biology evaluation: a source on an artificial NADH system
  const artificial = doc(
    'n',
    'In this artificial photosynthesis system, NADH regenerates the enzyme cascade for CO2 fixation.'
  );
  const direct = { document: artificial, usefulness: 'U.', evidence: 'x' };
  const context = { ...direct, role: 'context' as const };

  it('reads an empty list of ideas as a judgement only with a reason', () => {
    expect(parseIdeas(answer({ ideas: [], none_reason: 'Aucun lien réel.' }), PARTS)).toEqual([]);
    // the algebra evaluation: an empty answer with no reason is unusable, not "nothing found"
    expect(parseIdeas(answer({ ideas: [] }), PARTS)).toBeNull();
    expect(parseIdeas(answer({ ideas: [{ title: 'Sans rien' }] }), PARTS)).toBeNull();
    expect(
      parseIdeas(
        answer({ ideas: [{ title: 'T', why: 'W.', use: 'Le PIB mesure.', queries: ['q'] }] }),
        PARTS
      )?.[0].use
    ).toBe('Le PIB mesure.');
  });

  it('asks for genuine connections only, and passes how the concept is used', () => {
    expect(buildIdeasRequest(COURSE, 'en').query).toContain(
      'Suggest at most 4 possible sustainability connections'
    );
    const query = buildSelectionRequest(COURSE, { ...IDEA, use: 'GDP measures.' }, [], 'en').query;
    expect(query).toContain("Use of the course's concept: GDP measures.");
    expect(query).toContain('"fit": "genuine"|"analogy"|"off_discipline"');
    expect(query).toContain('"same_sense"');
    expect(buildSelectionRequest(COURSE, IDEA, [], 'fr').query).toContain(
      'Usage du concept du cours : -'
    );
  });

  it('marks a connection judged an analogy or off the discipline as forced', () => {
    const candidates = [doc('a', 'Le PIB ignore la dégradation des ressources naturelles.')];
    expect(parseSelection(answer({ fit: 'analogy', keep: true }), IDEA, candidates)?.isForced).toBe(
      true
    );
    expect(
      parseSelection(answer({ fit: 'off_discipline', keep: false }), IDEA, candidates)?.isForced
    ).toBe(true);
    expect(
      parseSelection(answer({ fit: 'genuine', keep: false }), IDEA, candidates)?.isForced
    ).toBe(undefined);
  });

  it('makes a resource direct only when it establishes the claim, in the same sense, on sustainability', () => {
    const candidates = [
      doc('a', 'Le recyclage des déchets ménagers progresse en Europe.'),
      doc('b', 'Le PIB ignore la dégradation des ressources naturelles.'),
      doc('c', 'Le PIB ne compte que la production marchande.')
    ];
    const item = (document: number, evidence: string, extra: object) => ({
      document,
      relevance: 'direct',
      concept_terms: ['PIB', 'recyclage'],
      sustainability_terms: ['ressources naturelles', 'déchets'],
      same_sense: true,
      establishes: true,
      usefulness: 'U.',
      evidence,
      ...extra
    });
    const judged = (
      extra: object,
      n = 2,
      evidence = 'Le PIB ignore la dégradation des ressources naturelles.'
    ) =>
      parseSelection(
        answer({ keep: true, resources: [item(n, evidence, extra)] }),
        IDEA,
        candidates
      );
    // the industrial chemistry evaluation: the key word in another sense is left out entirely
    const otherSense = judged(
      { same_sense: false },
      1,
      'Le recyclage des déchets ménagers progresse en Europe.'
    );
    expect(otherSense?.resources).toEqual([]);
    expect(otherSense?.background).toEqual([]);
    // established for another system only: context, not support
    expect(judged({ establishes: false })?.background).toHaveLength(1);
    expect(judged({ establishes: undefined })?.resources).toEqual([]);
    // the document does not speak of the sustainability side in its own words: context
    const noSustainability = judged({}, 3, 'Le PIB ne compte que la production marchande.');
    expect(noSustainability?.resources).toEqual([]);
    expect(noSustainability?.background).toHaveLength(1);
    expect(judged({})?.resources).toHaveLength(1);
  });

  it('counts a claim as established only with a quote of a direct resource found in it', () => {
    const verification = parseVerification(
      answer({
        claims: [
          {
            claim: 'NADH carries electrons in the Calvin cycle',
            status: 'established',
            document: 1,
            quote: 'NADH carries electrons in the Calvin cycle.'
          },
          {
            claim: 'NADH regenerates the cascade',
            status: 'established',
            document: 1,
            quote:
              'In this artificial photosynthesis system, NADH regenerates the enzyme cascade for CO2 fixation.'
          },
          { claim: 'Context says so', status: 'established', document: 2, quote: 'x' },
          {
            claim: 'Calvin uses NADH',
            status: 'incorrect',
            problem: 'the Calvin cycle uses NADPH'
          },
          { status: 'incorrect' }
        ],
        fit: 'forced',
        fit_problem: 'an analogy'
      }),
      [direct, context]
    );
    expect(verification).toEqual({
      problems: [
        'An analogy.',
        'NADH carries electrons in the Calvin cycle.',
        'Context says so.',
        'The Calvin cycle uses NADPH.'
      ],
      hasIncorrect: true,
      hasUnestablished: true,
      isForced: true
    });
    expect(parseVerification('pas de JSON', [direct])).toBeNull();
    // the psychology run: claims taken from the documents, not from the change, are left out,
    // and the teacher reads a few problems at most
    const change = 'Discuss how moral development shapes choices about waste sorting.';
    expect(restatesChange('Moral development shapes waste sorting choices', change)).toBe(true);
    expect(restatesChange('Kohlberg stage six rests on universal principles', change)).toBe(false);
    const fromDocuments = parseVerification(
      answer({
        claims: [
          { claim: 'Kohlberg stage six rests on universal principles', status: 'not_established' },
          { claim: 'Moral development shapes waste sorting', status: 'not_established' },
          ...['one', 'two', 'three', 'four'].map((n) => ({
            claim: `Moral development shapes sorting ${n}`,
            status: 'not_established'
          }))
        ]
      }),
      [direct],
      change
    );
    expect(fromDocuments?.problems).toHaveLength(MAX_PROBLEMS);
    expect(fromDocuments?.problems[0]).toBe('Moral development shapes waste sorting.');
    expect(parseVerification(answer({ claims: [] }), [direct])).toEqual({
      problems: [],
      hasIncorrect: false,
      hasUnestablished: false,
      isForced: false
    });
  });

  it('finds the names a change states that no direct resource or the course contains', () => {
    expect(
      namesIn('Discuss the Bull’s Head by Picasso and Rauschenberg. NADH and CO2 matter.')
    ).toEqual(['Bull’s', 'Head', 'Picasso', 'Rauschenberg', 'NADH']);
    expect(namesIn('Les ODD et le SDG 13, avec GreenComp.')).toEqual([]);
    // named in the direct resource or the course: backed; only in a context resource: not
    expect(unbackedNames('Use NADH and the PIB with Rauschenberg.', [direct], COURSE)).toEqual([
      'Rauschenberg'
    ]);
    expect(unbackedNames('Use NADH.', [context], COURSE)).toEqual(['NADH']);
    // a name in another language than the resource is found by its stem
    const english = { ...direct, document: doc('h', 'The heatwave in Australia and the Pacific.') };
    expect(
      unbackedNames('En Australie et dans le Pacifique, selon Rauschenberg.', [english], COURSE)
    ).toEqual(['Rauschenberg']);
    // common formulas and nouns are not named examples: "CO₂", "Earth-based"
    expect(
      namesIn('Les émissions de CO₂ comptent. Compare Earth-based fusion with NADPH.')
    ).toEqual(['NADPH']);
  });

  it('accepts a document speaking of sustainability in its own words, even if the terms given are translated', () => {
    const english = doc('e', 'Inequalities by energy sources and environmental quality.');
    expect(speaksOfSustainability(english, ['inégalités de consommation'])).toBe(true);
    const attachment = doc('m', 'Secure attachment predicts choosing primary care as a specialty.');
    expect(speaksOfSustainability(attachment, ['comportement écologique'])).toBe(false);
    expect(speaksOfSustainability(attachment, ['primary care'])).toBe(true);
  });

  it('drops links from a text for the teacher, keeping the words of a markdown link', () => {
    expect(
      cleanCitations(
        'Le seul document ([Biofuels](https://en.wikipedia.org/wiki/B)) (https://x.org/a) le dit.',
        []
      )
    ).toBe('Le seul document (Biofuels) le dit.');
  });

  it('never raises the support of a change, and lowers it with what the check found', () => {
    const proposal = {
      kind: 'topic' as const,
      original: null,
      suggested: 'Show how NADH works.',
      why: 'W.',
      support: 'strong' as const,
      resources: [],
      guidance: { learning: null, greencomp: null, teaching: null, check: null }
    };
    const clean = { problems: [], hasIncorrect: false, hasUnestablished: false, isForced: false };
    expect(withChecks(proposal, clean, [direct], COURSE)).toMatchObject({
      support: 'strong',
      checks: { status: 'checked', problems: [], unbackedNames: [] }
    });
    expect(withChecks({ ...proposal, support: 'partial' }, clean, [direct], COURSE).support).toBe(
      'partial'
    );
    expect(
      withChecks(proposal, { ...clean, hasUnestablished: true, problems: ['P.'] }, [direct], COURSE)
    ).toMatchObject({ support: 'partial', checks: { problems: ['P.'] } });
    expect(withChecks(proposal, { ...clean, hasIncorrect: true }, [direct], COURSE).support).toBe(
      'none'
    );
    expect(withChecks(proposal, { ...clean, isForced: true }, [direct], COURSE).support).toBe(
      'none'
    );
    // judged forced, but a direct resource backs it with a verified sentence: partly supported
    const quoted = { ...proposal, resources: [{ ...direct, quote: 'NADH regenerates.' }] };
    expect(withChecks(quoted, { ...clean, isForced: true }, [direct], COURSE).support).toBe(
      'partial'
    );
    // a context resource's quote does not count
    const contextQuoted = { ...proposal, resources: [{ ...context, quote: 'NADH regenerates.' }] };
    expect(withChecks(contextQuoted, { ...clean, isForced: true }, [direct], COURSE).support).toBe(
      'none'
    );
    // a name only a context resource gives: partly supported
    expect(withChecks(proposal, clean, [context], COURSE)).toMatchObject({
      support: 'partial',
      checks: { unbackedNames: ['NADH'] }
    });
    // the check could not be made
    expect(withChecks(proposal, null, [direct], COURSE)).toMatchObject({
      support: 'partial',
      checks: { status: 'unchecked' }
    });
  });

  it('asks the change again with what was wrong, and checks it apart', () => {
    const resources = [direct];
    expect(buildAdaptationRequest(COURSE, IDEA, resources, 'en').query).not.toContain(
      'A first proposal was checked'
    );
    const again = buildAdaptationRequest(COURSE, IDEA, resources, 'fr', ['NADH est faux.']).query;
    expect(again).toContain('Une première proposition a été vérifiée');
    expect(again).toContain('- NADH est faux.');
    const check = buildVerificationRequest(
      COURSE,
      { suggested: 'Show NADH.', why: 'W.' },
      [direct, context],
      'en'
    );
    expect(check.query).toContain('Proposed change: Show NADH.');
    expect(check.query).toContain('Doc 1 to Doc 2');
    expect((check.sources[1] as Document).payload.slice_content).toContain('Role: context only');
  });
});

describe('connections: explanations for teachers', () => {
  it('keeps the idea reason when the selection explains its process instead of the course', () => {
    expect(
      isAboutProcess(
        'This directly connects the course to the sustainability connection chosen by the teacher, using evidence from the documents.'
      )
    ).toBe(true);
    expect(isAboutProcess('Ce lien relie le cours aux documents fournis.')).toBe(true);
    expect(
      isAboutProcess(
        'Class 12 already examines AI and democracy; a climate-policy case lets students apply accountability to environmental decisions.'
      )
    ).toBe(false);
    const candidates = [doc('a', 'Le PIB ignore la dégradation des ressources naturelles.')];
    const selection = parseSelection(
      JSON.stringify({
        keep: true,
        why: 'Ce lien relie le cours aux documents fournis.',
        resources: [
          {
            document: 1,
            relevance: 'direct',
            same_sense: true,
            establishes: true,
            concept_terms: ['PIB'],
            sustainability_terms: ['ressources naturelles'],
            usefulness: 'Montre ce que le PIB ignore.',
            evidence: 'Le PIB ignore la dégradation des ressources naturelles.'
          }
        ]
      }),
      IDEA,
      candidates
    );
    expect(selection?.why).toBe(IDEA.why);
  });
});
