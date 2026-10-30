import { describe, it, expect } from 'vitest';
import {
  availableMinutes,
  buildActivityRequest,
  buildIdeasRequest,
  buildQueriesRequest,
  isFeasible,
  parseActivity,
  parseIdeas,
  parseQueries,
  parseRejected,
  selectCandidates,
  conceptQueries,
  missingConcepts,
  isInPeriod,
  whyInfeasible,
  approachFromText,
  teacherIdea,
  type ActivityIdea
} from '@/utils/activityDesign';
import type { Document } from '@/types';

const doc = (title: string, content: string): Document =>
  ({
    id: title,
    score: 1,
    payload: {
      document_id: title,
      document_title: title,
      document_url: `https://example.org/${title}`,
      document_sdg: [7],
      document_corpus: 'openalex',
      document_desc: '',
      document_details: {} as any,
      slice_content: content,
      slice_sdg: 7,
      document_lang: 'en',
      document_scrape_date: ''
    }
  }) as Document;

const context = {
  subject: 'Comparer béton, acier et bois',
  students: 'Génie civil, Licence 3',
  time: 'une séance de 2 h',
  goal: ''
};

const candidates = [
  doc(
    'Timber products',
    'Wood-based construction consumes 3800 GJ of total energy whereas steel and concrete based struc - ture consumes 7350 and 5500 GJ energy, respectively.'
  ),
  doc('LCA of facades', 'This study assesses facade materials of an educational building.'),
  doc('Green building', 'Wood stores carbon and is a renewable material.')
];

const INVENTORY = [
  {
    document: 1,
    contains: 'data',
    what: 'Énergie totale de bâtiments en bois, acier et béton.',
    quantitative: true,
    evidence:
      '« Wood-based construction consumes 3800 GJ of total energy whereas steel and concrete based structure consumes 7350 and 5500 GJ energy, respectively ».'
  },
  {
    document: 2,
    contains: 'data',
    what: 'Une ACV de façades.',
    quantitative: true,
    evidence: 'This study assesses facade materials of an educational building.'
  },
  {
    document: 3,
    contains: 'concept',
    what: 'Le bois stocke du carbone.',
    quantitative: false,
    evidence: 'Not in the text.'
  }
];

const answer = (ideas: unknown[], inventory: unknown[] = INVENTORY) =>
  JSON.stringify({ inventory, ideas });

const idea = (overrides: Record<string, unknown> = {}) => ({
  title: 'Comparer trois structures',
  type: 'analyse de données',
  students_do: 'Les étudiant·e·s comparent.',
  duration: '1 h',
  why: 'Parce que.',
  documents: [1],
  uses_data: true,
  scenario: null,
  ...overrides
});

describe('search questions', () => {
  it('asks for questions from the context, and reads them', () => {
    expect((buildQueriesRequest(context, 'fr').sources[0] as any).payload.slice_content).toContain(
      'Génie civil, Licence 3'
    );
    expect(
      parseQueries(
        '{"concepts": [["béton", "concrete"], "acier", []], "queries": ["a", "", "b", "c", "d"]}'
      )
    ).toMatchObject({ queries: ['a', 'b', 'c'], concepts: [['béton', 'concrete'], ['acier']] });
    expect(parseQueries('Désolé.')).toBeNull();
  });
});

describe('inventory and ideas', () => {
  it('gives the AI the documents found, with their source, before any idea', () => {
    const request = buildIdeasRequest(context, candidates, 'fr', { type: 'débat', avoid: ['A'] });
    expect(request.sources).toHaveLength(3);
    expect((request.sources[0] as Document).payload.slice_content).toMatch(/^Source : openalex/);
    expect(request.query).toContain('Inventaire');
    expect(request.query).toContain('débat');
  });

  it('keeps what a document verifiably contains (despite pdf hyphenation)', () => {
    const [parsed] = parseIdeas(answer([idea()]), candidates)!;
    expect(parsed.resources).toHaveLength(1);
    expect(parsed.resources[0]).toMatchObject({ material: 'data', isQuantitative: true });
  });

  it('a "data" claim without values in its quote becomes a study, not data', () => {
    const [parsed] = parseIdeas(answer([idea({ documents: [2], uses_data: false })]), candidates)!;
    expect(parsed.resources[0]).toMatchObject({ material: 'study', isQuantitative: false });
  });

  it('drops a data analysis without verified values, and an activity on nothing without a scenario', () => {
    const parsed = parseIdeas(
      answer([
        idea({ title: 'Données de façade', documents: [2], uses_data: true }),
        idea({ title: 'Sur un document non vérifié', documents: [3], uses_data: false }),
        idea({
          title: 'Jeu de rôle',
          documents: [],
          uses_data: false,
          scenario: 'Un conseil municipal…'
        })
      ]),
      candidates
    )!;
    expect(parsed.map((item) => item.title)).toEqual(['Jeu de rôle']);
    expect(parsed[0].scenario).toBe('Un conseil municipal…');
  });

  it('returns [] when nothing can be supported, null when the answer is unusable', () => {
    expect(parseIdeas(answer([idea({ documents: [3] })]), candidates)).toEqual([]);
    expect(parseIdeas('Désolé.', candidates)).toBeNull();
  });

  it('the teacher’s own idea uses the resources already verified', () => {
    const [parsed] = parseIdeas(answer([idea()]), candidates)!;
    const own = teacherIdea('Une visite de chantier. En groupes.', parsed.resources);
    expect(own).toMatchObject({ title: 'Une visite de chantier', isTeacherIdea: true });
    expect(own.resources).toEqual(parsed.resources);
  });
});

describe('the activity', () => {
  const [chosen] = parseIdeas(answer([idea()]), candidates)!;
  const selfContained: ActivityIdea = {
    ...chosen,
    resources: [],
    usesData: false,
    scenario: 'Un conseil municipal choisit un matériau.'
  };

  it('is written from the verified resources, or from its own scenario', () => {
    const withData = buildActivityRequest(context, chosen, 'fr', 'plus court');
    expect(withData.sources).toEqual([candidates[0]]);
    expect(withData.query).toContain('Doc 1 (data, valeurs exploitables)');
    expect(withData.query).toContain('plus court');
    const own = buildActivityRequest(context, selfContained, 'fr');
    expect(own.sources).toEqual([]);
    expect(own.query).toContain('Scénario prévu : Un conseil municipal choisit un matériau.');
    expect(own.query).toContain('écris toi-même le matériel indispensable');
  });

  const activity = (overrides: Record<string, unknown> = {}) =>
    JSON.stringify({
      title: 'Comparer trois structures',
      objective: 'Comparer.',
      format: '2 h',
      student_instructions: 'Comparez.',
      provided_material: 'Questions guides : …',
      preparation: 'Partager le document (Doc 1).',
      steps: ['Lire (30 min).', 'Comparer (45 min).', 'Discuter (30 min).'],
      student_output: 'Un tableau.',
      check: 'Une question.',
      limitation: null,
      greencomp: [
        { id: 'systems_thinking', how: 'Étape 2 : relier énergie et matériau.' },
        { id: 'critical_thinking', how: 'Sans étape.' }
      ],
      documents: [1],
      ...overrides
    });

  it('keeps provided material, cleaned citations and only step-anchored GreenComp', () => {
    const parsed = parseActivity(activity(), [candidates[0]], context)!;
    expect(parsed.providedMaterial).toBe('Questions guides : …');
    expect(parsed.preparation).toBe('Partager le document (« Timber products »).');
    expect(parsed.greencomp.map((item) => item.id)).toEqual(['systems_thinking']);
  });

  it('refuses steps that do not fit the time, or figures no resource contains', () => {
    expect(availableMinutes('une séance de 1 h 30')).toBe(90);
    expect(availableMinutes('quelques séances')).toBeNull();
    expect(
      parseActivity(activity({ steps: ['Lire (90 min).', 'Discuter (60 min).'] }), [], context)
    ).toBeNull();
    expect(
      parseActivity(activity({ steps: ['Le béton émet 7,3 % de plus.'] }), [candidates[2]])
    ).toBeNull();
  });

  it('without verified data, a first answer asking the teacher for data is redone; a retry is flagged', () => {
    const asking = activity({ preparation: 'Préparer un jeu de données d’ACV.', documents: [] });
    expect(parseActivity(asking, [], context, { hasData: false, isStrict: true })).toBeNull();
    expect(parseActivity(asking, [], context, { hasData: false })?.assumesMissing).toBe(true);
    expect(
      parseActivity(asking, [], context, { hasData: true, isStrict: true })?.assumesMissing
    ).toBe(false);
  });
});

describe('material written by WeLearn', () => {
  it('is checked for figures too', () => {
    const parsed = parseActivity(
      JSON.stringify({
        title: 'T',
        steps: ['Lire (10 min).'],
        provided_material: 'NO₂ : 20 000 cas (estimé à 50 % des cas).',
        greencomp: []
      }),
      [candidates[2]]
    );
    expect(parsed).toBeNull();
  });
});

describe('teaching methods', () => {
  it('keeps a method from the repertoire, and otherwise names it from what the resources allow', () => {
    const parsed = parseIdeas(
      answer([
        idea({ title: 'A', approach: 'comparative_data_analysis' }),
        idea({ title: 'B', approach: 'grand projet ambitieux' }),
        idea({
          title: 'C',
          approach: 'tout',
          documents: [],
          uses_data: false,
          scenario: 'Un jeu de rôle.'
        })
      ]),
      candidates
    )!;
    expect(parsed.map((item) => item.approach)).toEqual([
      'comparative_data_analysis',
      'comparative_data_analysis',
      'problem_based_learning'
    ]);
    expect(teacherIdea('Mon idée.', []).approach).toBeNull();
  });
});

describe('data tables', () => {
  const timber = doc(
    'Timber products',
    'For example, wood-based building construction consumes 3800 gigajouls (GJ) of total energy whereas steel and concrete based struc - ture consumes 7350 and 5500 GJ energy, respectively. Similarly, on carbon emission, wood-based construction emits 73000kg carbon emission whereas steel and con - crete based construction emits 105,000 and 132,000 kg carbon, respectively (APA 2017).'
  );
  const activityWith = (dataTable: unknown) =>
    JSON.stringify({
      title: 'T',
      approach: 'comparative_data_analysis',
      steps: ['Lire (10 min).'],
      greencomp: [],
      data_table: dataTable,
      documents: [1]
    });
  const table = {
    caption: 'Exemple de construction de bâtiment',
    columns: ['Structure', 'Énergie totale (GJ)', 'Émissions (kg de carbone)'],
    rows: [
      ['Bois', '3800', '73 000'],
      ['Acier', '7350', '105 000'],
      ['Béton', '5500', '132 000']
    ],
    document: 1,
    context: 'Exemples de construction de bâtiments, pas une empreinte par matériau.',
    reported_from: null,
    comparable: false
  };

  it('keeps values found in the document and names the publication it takes them from', () => {
    const parsed = parseActivity(activityWith(table), [timber], undefined, { isStrict: true })!;
    expect(parsed.approach).toBe('comparative_data_analysis');
    expect(parsed.dataTable).toMatchObject({
      reportedFrom: 'APA (2017)',
      isComparable: false,
      context: 'Exemples de construction de bâtiments, pas une empreinte par matériau.'
    });
  });

  it('a caption or context that adds a number the document does not contain is not kept', () => {
    const scenario = { ...table, context: 'Valeurs pour une construction de 100 m².' };
    expect(
      parseActivity(activityWith(scenario), [timber], undefined, { isStrict: true })
    ).toBeNull();
  });

  it('a column with values the document does not contain is left out, the verified ones stay', () => {
    const recalculated = {
      ...table,
      columns: [...table.columns, 'Pollution de l’eau (indice)'],
      rows: table.rows.map((row, index) => [...row, ['100', '400', '325'][index]])
    };
    const parsed = parseActivity(activityWith(recalculated), [timber], undefined, {
      isStrict: true
    })!;
    expect(parsed.dataTable?.columns).toEqual(table.columns);
    expect(parsed.dataTable?.rows).toEqual(table.rows);
  });

  it('a table without a verified column of values, or without context, is asked again once, then left out', () => {
    const wrong = { ...table, rows: [['Bois', '3900', '73 001']] };
    expect(parseActivity(activityWith(wrong), [timber], undefined, { isStrict: true })).toBeNull();
    expect(parseActivity(activityWith(wrong), [timber])?.dataTable).toBeNull();
    expect(
      parseActivity(activityWith({ ...table, context: '' }), [timber], undefined, {
        isStrict: true
      })
    ).toBeNull();
  });
});

describe('a method is offered only when its conditions are met', () => {
  const context = { subject: 'Matériaux', students: 'L3', time: '2 h', goal: 'Comparer' };

  it('drops a data comparison without values and a case study without a case', () => {
    const parsed = parseIdeas(
      answer([
        idea({
          title: 'A',
          approach: 'comparative_data_analysis',
          documents: [2],
          uses_data: false
        }),
        idea({ title: 'B', approach: 'case_study', documents: [2], uses_data: false }),
        idea({ title: 'C', approach: 'structured_debate', documents: [2], uses_data: false })
      ]),
      candidates,
      context
    )!;
    expect(parsed.map((item) => item.title)).toEqual(['C']);
  });

  it('keeps long projects, living labs and community projects for the contexts that allow them', () => {
    const resources = [
      {
        document: candidates[0],
        usefulness: 'u',
        material: 'data' as const,
        isQuantitative: true,
        evidence: 'e'
      }
    ];
    expect(isFeasible('lca_project', resources, context)).toBe(false);
    expect(isFeasible('lca_project', resources, { ...context, time: '6 séances de 2 h' })).toBe(
      true
    );
    expect(isFeasible('lca_project', [], { ...context, time: '6 séances de 2 h' })).toBe(false);
    const semester = { ...context, time: 'un semestre' };
    expect(isFeasible('living_lab', resources, semester)).toBe(false);
    expect(
      isFeasible('living_lab', resources, { ...semester, goal: 'avec une collectivité partenaire' })
    ).toBe(true);
    expect(isFeasible('structured_debate', [], context)).toBe(true);
  });

  it("keeps the chosen idea's method in the activity; for the teacher's own idea, a feasible one", () => {
    const activity = JSON.stringify({
      title: 'T',
      approach: 'lca_project',
      steps: ['Lire (10 min).']
    });
    expect(parseActivity(activity, [], context, { approach: 'critical_analysis' })?.approach).toBe(
      'critical_analysis'
    );
    expect(parseActivity(activity, [], context, { resources: [] })?.approach).toBe(
      'problem_based_learning'
    );
  });
});

describe('search questions', () => {
  it('leaves out the citations the endpoint adds', () => {
    expect(
      parseQueries(
        JSON.stringify({
          queries: [
            'Impacts du béton ? <a href="https://example.invalid/context">[Doc 1]</a>',
            'Wood [Doc 1]'
          ]
        })
      )
    ).toMatchObject({ queries: ['Impacts du béton ?', 'Wood'] });
  });
});

describe('ideas rely only on their verified resources', () => {
  it('drops an idea that names another document, by number or by title', () => {
    const dallas = doc('Seasonal ozone exposure in Dallas-Fort Worth', 'Ozone and asthma.');
    const parsed = parseIdeas(
      answer([
        idea({ title: 'A', students_do: 'Comparer les documents 1 et 2.' }),
        idea({
          title: 'B',
          students_do: 'Comparer avec « Seasonal ozone exposure in Dallas-Fort Worth ».'
        }),
        idea({ title: 'C' })
      ]),
      [...candidates, dallas]
    )!;
    expect(parsed.map((item) => item.title)).toEqual(['C']);
  });
});

describe('choosing the documents for the context', () => {
  const concepts = [
    ['béton', 'concrete'],
    ['acier', 'steel'],
    ['bois', 'timber', 'wood']
  ];
  const scored = (document: Document, score: number) => ({ ...document, score });
  const glazing = doc(
    'Glazing in office buildings',
    'Single glass and double glass in a hot climate.'
  );
  const timber = doc('Timber products', 'Wood emits less than steel and concrete.');
  const concrete = doc('Recycled concrete', 'Recycled aggregates in concrete.');
  const steelWood = doc('Halls', 'Une halle en acier et une halle en bois.');

  it('sets aside documents that miss the key concepts, and ranks them by their places in every question’s results', () => {
    const { accepted, rejected } = selectCandidates(
      [
        [scored(timber, 0.74), scored(glazing, 0.77), scored(steelWood, 0.7)],
        [scored(timber, 0.8), scored(concrete, 0.75)],
        [scored(steelWood, 0.72)]
      ],
      concepts
    );
    expect(accepted.map((document) => document.payload.document_title)).toEqual([
      'Timber products',
      'Halls'
    ]);
    expect(rejected.map((item) => [item.document.payload.document_title, item.reason])).toEqual([
      ['Recycled concrete', 'missing: acier, bois'],
      ['Glazing in office buildings', 'missing: béton, acier, bois']
    ]);
  });

  it('a document that mentions more of the key concepts comes first', () => {
    const { accepted } = selectCandidates(
      [[scored(steelWood, 0.9), scored(timber, 0.7)]],
      concepts
    );
    expect(accepted.map((document) => document.payload.document_title)).toEqual([
      'Timber products',
      'Halls'
    ]);
  });

  it('without key concepts, nothing is set aside', () => {
    expect(selectCandidates([[glazing, timber]], []).accepted).toHaveLength(2);
  });

  it('searches the key concepts themselves when too few documents pass', () => {
    expect(conceptQueries(concepts)).toEqual(['béton acier bois', 'concrete steel wood']);
  });

  it('reads the documents the ideas answer sets aside, with its reason', () => {
    expect(
      parseRejected(
        JSON.stringify({
          rejected: [{ document: 2, reason: 'façades, pas la structure' }, { document: 9 }]
        }),
        candidates
      )
    ).toEqual([{ document: candidates[1], reason: 'façades, pas la structure' }]);
  });

  it('without any relevant document, only the context is sent and only self-contained activities are asked', () => {
    const body = buildIdeasRequest(context, [], 'fr');
    expect(body.sources).toHaveLength(1);
    expect(body.query).toContain('Aucun document de la base ne traite directement de ce sujet');
  });
});

describe('robust checks on what the answers give', () => {
  it('reads concepts as objects, and ignores one list holding every notion', () => {
    expect(
      parseQueries(
        JSON.stringify({
          concepts: [
            { fr: 'béton', en: 'concrete', synonyms: [] },
            ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9']
          ],
          queries: ['q']
        })
      )?.concepts
    ).toEqual([['béton', 'concrete']]);
  });

  it('accepts a quote shortened with an ellipsis when each piece is in the document', () => {
    const inventory = (evidence: string) => [
      { document: 1, contains: 'data', what: 'Des valeurs.', quantitative: true, evidence }
    ];
    const ok = parseIdeas(
      answer(
        [idea()],
        inventory('« Wood-based construction consumes 3800 GJ [...] 7350 and 5500 GJ energy »')
      ),
      candidates
    );
    expect(ok).toHaveLength(1);
    const twoSentences = doc(
      'Timber',
      'Steel emits 15% more GHG. Then other words. Concrete emits 29% more.'
    );
    expect(
      parseIdeas(
        answer([idea()], inventory('Steel emits 15% more GHG. Concrete emits 29% more.')),
        [twoSentences]
      )
    ).toHaveLength(1);
    const wrong = parseIdeas(
      answer([idea()], inventory('Wood-based construction consumes 3800 GJ [...] 9999 GJ')),
      candidates
    );
    expect(wrong).toEqual([]);
  });
});

describe('key concepts in the text', () => {
  it('a form of several words also counts through its main words, short words aside', () => {
    const paris = doc('Low-emission vehicles in Paris', 'NO2 and particle concentrations fell.');
    expect(
      missingConcepts(paris, [
        ['particule fine', 'fine particle'],
        ['dioxyde d’azote', 'no2'],
        ['santé publique']
      ])
    ).toEqual([['santé publique']]);
  });
});

describe('the whole teaching context: core concepts, period, kinds of sources', () => {
  it('reads core concepts, the period and the source types of the plan', () => {
    expect(
      parseQueries(
        JSON.stringify({
          concepts: [
            { fr: 'charbon', en: 'coal', synonyms: [], core: true },
            { fr: 'ouvrier', en: 'worker', synonyms: [] }
          ],
          period: { from: 1800, to: 1900 },
          source_types: ['academic_scientific_publications', 'anything'],
          queries: ['q']
        })
      )
    ).toMatchObject({
      core: [true, false],
      period: [1800, 1900],
      sourceTypes: ['academic_scientific_publications']
    });
  });

  it('sets aside a document without a core concept or outside the period', () => {
    const concepts = [['charbon', 'coal'], ['ouvrier', 'worker'], ['industrialisation']];
    const mines = doc(
      'Mines du Nord',
      'En 1860, le charbon et les ouvriers du Nord, au cœur de l’industrialisation.'
    );
    const later = doc(
      'Bataille du charbon',
      'En 1947, le charbon et les ouvriers, après l’industrialisation.'
    );
    const workers = doc('Ouvriers', 'Les ouvriers au XIXe siècle et l’industrialisation.');
    const { accepted, rejected } = selectCandidates([[mines, later, workers]], concepts, {
      core: [true, false, false],
      period: [1800, 1900]
    });
    expect(accepted).toEqual([mines]);
    expect(rejected.map((item) => item.reason)).toEqual([
      'outside 1800-1900',
      'missing core: charbon'
    ]);
  });

  it('recognises a century as well as a year', () => {
    expect(isInPeriod(doc('A', 'Au XIXe siècle, le charbon.'), [1800, 1900])).toBe(true);
    expect(isInPeriod(doc('B', 'Coal in the nineteenth century.'), [1820, 1880])).toBe(true);
    expect(isInPeriod(doc('C', 'Coal in 2020.'), [1800, 1900])).toBe(false);
  });

  it('among equally relevant documents, prefers the kinds of sources suited to the discipline', () => {
    const blog = {
      ...doc('Blog', 'Le charbon.'),
      payload: { ...doc('Blog', 'Le charbon.').payload, document_corpus: 'conversation' }
    };
    const thesis = {
      ...doc('Thèse', 'Le charbon.'),
      payload: { ...doc('Thèse', 'Le charbon.').payload, document_corpus: 'hal' }
    };
    const { accepted } = selectCandidates([[blog, thesis]], [['charbon']], {
      sourceTypes: ['academic_scientific_publications'],
      categoryOf: (corpus) =>
        corpus === 'hal' ? 'academic_scientific_publications' : 'science_communication_and_outreach'
    });
    expect(accepted.map((document) => document.payload.document_title)).toEqual(['Thèse', 'Blog']);
  });
});

describe('another approach: only what the context and resources allow', () => {
  const context = {
    subject: 'Industrialisation',
    students: 'L2',
    time: '45 minutes',
    goal: 'Analyser'
  };
  const data = {
    document: candidates[0],
    usefulness: 'u',
    material: 'data' as const,
    isQuantitative: true,
    evidence: 'e'
  };

  it('says why a method cannot be offered', () => {
    expect(whyInfeasible('community_project', [data], context)).toBe('needsPartner');
    expect(whyInfeasible('lca_project', [data], context)).toBe('needsSessions');
    expect(whyInfeasible('comparative_data_analysis', [], context)).toBe('needsData');
    expect(
      whyInfeasible('community_project', [data], {
        ...context,
        time: '6 séances',
        goal: 'avec une association partenaire'
      })
    ).toBeNull();
  });

  it('recognises the method a teacher names in their own words', () => {
    const labels = {
      community_project: ['Projet avec une communauté', 'Community project'],
      living_lab: ['Living lab / co-création', 'Living lab / co-creation']
    };
    expect(approachFromText('un projet avec une communauté', labels)).toBe('community_project');
    expect(approachFromText('Living lab', labels)).toBe('living_lab');
    expect(approachFromText('autre chose', labels)).toBeNull();
  });

  it('reports the ideas it leaves out, and why', () => {
    const leftOut: string[] = [];
    parseIdeas(
      answer([idea({ title: 'P', approach: 'community_project' })]),
      candidates,
      context,
      (approach, reason) => leftOut.push(`${approach}:${reason}`)
    );
    expect(leftOut).toEqual(['community_project:needsPartner']);
  });

  it('asks for methods other than those tried', () => {
    const body = buildIdeasRequest(context, candidates, 'fr', {
      otherThan: ['Analyse comparative de données']
    });
    expect(body.query).toContain('autre approche que : Analyse comparative de données');
  });
});

describe('values stay with their own date, place and population', () => {
  const doc2000 = doc(
    'Energy and income',
    'In 2000, low-income countries used 12 GJ per person and high-income countries 180 GJ per person.'
  );
  const activityWith = (dataTable: unknown) =>
    JSON.stringify({
      title: 'T',
      steps: ['Lire (10 min).'],
      data_table: dataTable,
      documents: [1]
    });
  const table = {
    caption: 'Énergie par personne',
    columns: ['Groupe de pays', 'Énergie (GJ/personne, 2000)'],
    rows: [
      ['Pays à faible revenu', '12'],
      ['Pays à revenu élevé', '180']
    ],
    document: 1,
    context: 'Valeurs de 2000 par groupe de revenu.',
    reported_from: null,
    comparable: true
  };

  it('keeps a table whose labels, headers and values are the document’s', () => {
    expect(
      parseActivity(activityWith(table), [doc2000], undefined, { isStrict: true })?.dataTable
    ).not.toBeNull();
  });

  it('rejects values moved to another date in a header or to another place in the labels', () => {
    const moved = { ...table, columns: ['Pays', 'Énergie (GJ/personne, 1850)'] };
    expect(parseActivity(activityWith(moved), [doc2000], undefined, { isStrict: true })).toBeNull();
    const dated = {
      ...table,
      rows: [
        ['Angleterre 1850', '12'],
        ['France 1850', '180']
      ]
    };
    expect(parseActivity(activityWith(dated), [doc2000], undefined, { isStrict: true })).toBeNull();
  });
});
