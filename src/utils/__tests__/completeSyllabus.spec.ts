import { describe, it, expect } from 'vitest';
import {
  anchorsFor,
  completeSyllabusDocx,
  locate,
  planComplete,
  validatePlan,
  type CompleteLabels,
  insertionPoint,
  insertionPoints,
  sourcesLine
} from '@/utils/completeSyllabus';
import type { ApprovedChange, CourseToUpdate } from '@/utils/updatedSyllabus';

// a syllabus with its schedule, assessment and bibliography: all of it must come through
const SYLLABUS = [
  'INTRODUCTION À LA GESTION',
  'OBJECTIFS',
  '1. Donner les bases nécessaires pour comprendre le fonctionnement des entreprises.',
  '4. Sensibiliser aux nouveaux défis des gestionnaires.',
  'CONTENU DU COURS',
  'CM2 & CM3 « Stratégie »',
  'Semaines des 29/09 et 13/10',
  'CM7 « Évaluation des performances »',
  'Semaine du 15/12',
  'MODALITÉS D’ÉVALUATION',
  '• Études de cas (20%), dont 5% pour la présentation orale',
  '• Examen final (50%)',
  'BIBLIOGRAPHIE',
  'Helfer, J-P., Kalika, M. et Orsoni, J. (2019). Stratégie. Vuibert.',
  ...Array.from(
    { length: 6 },
    (_, i) => `Ligne de contenu ${i + 1} avec un peu de texte du syllabus.`
  )
].join('\n');

const COURSE: CourseToUpdate = {
  title: 'Introduction à la gestion',
  discipline: 'Gestion',
  level: null,
  overview: null,
  topics: [
    { title: 'Stratégie', subtopics: [], source: 'CM2 & CM3 « Stratégie »' },
    { title: 'Évaluation des performances', subtopics: [], source: null },
    { title: 'Marketing', subtopics: [], source: null }
  ],
  objectives: [
    'Donner les bases nécessaires pour comprendre le fonctionnement des entreprises.',
    'Sensibiliser aux nouveaux défis des gestionnaires.'
  ],
  competencies: [],
  sessions: ['Semaine du 15/12 – CM7 « Évaluation des performances »']
};

const change = (id: number, values: Partial<ApprovedChange>): ApprovedChange => ({
  connectionId: id,
  connection: `Lien ${id}`,
  kind: 'topic',
  placement: null,
  original: null,
  text: `Changement ${id}.`,
  why: '',
  resources: [],
  ...values
});

describe('the complete updated syllabus', () => {
  it('finds a passage only when it appears once in the text', () => {
    const lines = SYLLABUS.split('\n');
    expect(locate(lines, 'CM2 & CM3 « Stratégie »')).toEqual({ start: 5, end: 5 });
    // "Stratégie" appears twice (schedule and bibliography): not a reliable place
    expect(locate(lines, 'Stratégie')).toBeNull();
    expect(locate(lines, 'Marketing')).toBeNull();
    expect(locate(lines, 'abc')).toBeNull();
  });

  it('places an ambiguous topic through the one session of the outline naming it', () => {
    const course = {
      ...COURSE,
      topics: [{ title: 'Stratégie', subtopics: [], source: 'Stratégie' }],
      sessions: [...COURSE.sessions, 'Semaines des 29/09 et 13/10 – CM2 & CM3 « Stratégie »']
    };
    const changes = [change(1, { placement: 'Stratégie' })];
    const plan = planComplete(SYLLABUS, course, changes);
    expect(plan.toPlace).toEqual([]);
    const at = plan.entries.findIndex((entry) => entry.type === 'change');
    expect(plan.entries[at - 1]).toMatchObject({ text: 'CM2 & CM3 « Stratégie »' });
  });

  it("tries a topic's source line, then its title; a session by its title, then its label", () => {
    expect(anchorsFor(change(1, { placement: 'Stratégie' }), COURSE)).toEqual([
      'CM2 & CM3 « Stratégie »',
      'Stratégie'
    ]);
    expect(
      anchorsFor(
        change(2, { placement: 'Semaine du 15/12 – CM7 « Évaluation des performances »' }),
        COURSE
      )
    ).toEqual([
      'CM7 « Évaluation des performances »',
      'Semaine du 15/12',
      'Semaine du 15/12 – CM7 « Évaluation des performances »'
    ]);
  });

  it('prefers the session titled by the topic when several mention it', () => {
    const course = {
      ...COURSE,
      topics: [{ title: 'Stratégie', subtopics: [], source: null }],
      sessions: ['CM2 & CM3 – Stratégie', 'TD3 – Présentations orales sur le cas « stratégie »']
    };
    expect(anchorsFor(change(1, { placement: 'Stratégie' }), course)).toEqual([
      'Stratégie',
      'Stratégie',
      'CM2 & CM3',
      'CM2 & CM3 – Stratégie'
    ]);
  });

  it('adds to a schedule entry after the whole entry, never inside it', () => {
    const text = [
      'CONTENU DU COURS',
      'CM6 « Management organisationnel »',
      'Semaine du 01/12',
      '(C. Bérard)',
      'TD6',
      'Semaine du 08/12 (3h)',
      '• Présentations orales',
      ...Array.from(
        { length: 10 },
        (_, i) => `Ligne de contenu ${i + 1} avec un peu de texte du syllabus original.`
      )
    ].join('\n');
    const course = {
      ...COURSE,
      topics: [{ title: 'Management organisationnel', subtopics: [], source: null }],
      sessions: ['CM6 – Management organisationnel', 'TD6']
    };
    const changes = [change(1, { kind: 'teaching', placement: 'Management organisationnel' })];
    const plan = planComplete(text, course, changes);
    expect(validatePlan(text, changes, plan)).toBe(true);
    const order = plan.entries.map((entry) =>
      entry.type === 'line' ? entry.text : `+${entry.change.connectionId}`
    );
    expect(order.slice(1, 6)).toEqual([
      'CM6 « Management organisationnel »',
      'Semaine du 01/12',
      '(C. Bérard)',
      '+1',
      'TD6'
    ]);
  });

  it('keeps every line, places each change once, and keeps a revised objective visible', () => {
    const changes = [
      change(1, { placement: 'Stratégie' }),
      change(2, { kind: 'teaching', placement: 'Évaluation des performances' }),
      change(3, {
        kind: 'objective',
        placement: 'Sensibiliser aux nouveaux défis des gestionnaires.',
        original: 'Sensibiliser aux nouveaux défis des gestionnaires.'
      }),
      change(4, { kind: 'teaching', placement: 'Marketing' }),
      change(5, { kind: 'assessment', placement: null })
    ];
    const plan = planComplete(SYLLABUS, COURSE, changes);
    expect(validatePlan(SYLLABUS, changes, plan)).toBe(true);
    const order = plan.entries.map((entry) =>
      entry.type === 'line'
        ? `${entry.isReplaced ? '~' : ''}${entry.text.slice(0, 22)}`
        : `+${entry.change.connectionId}`
    );
    expect(order.slice(3, 10)).toEqual([
      '~4. Sensibiliser aux no',
      '+3',
      'CONTENU DU COURS',
      'CM2 & CM3 « Stratégie ',
      '+1',
      'Semaines des 29/09 et ',
      'CM7 « Évaluation des p'
    ]);
    expect(order[10]).toBe('+2');
    // assessment rules and bibliography untouched
    const kept = plan.entries.flatMap((entry) => (entry.type === 'line' ? [entry.text] : []));
    expect(kept).toContain('• Études de cas (20%), dont 5% pour la présentation orale');
    expect(kept).toContain('Helfer, J-P., Kalika, M. et Orsoni, J. (2019). Stratégie. Vuibert.');
    // no reliable place: waiting, not guessed
    expect(plan.toPlace.map((c) => c.connectionId)).toEqual([4, 5]);
  });

  it('refuses a plan that lost a line, missed a change, or stands on too little text', () => {
    const changes = [change(1, { placement: 'Stratégie' })];
    const plan = planComplete(SYLLABUS, COURSE, changes);
    expect(validatePlan(SYLLABUS, changes, { ...plan, entries: plan.entries.slice(1) })).toBe(
      false
    );
    expect(validatePlan(SYLLABUS, [...changes, change(9, {})], plan)).toBe(false);
    const short = 'OBJECTIFS\nCM2 & CM3 « Stratégie »';
    expect(validatePlan(short, changes, planComplete(short, COURSE, changes))).toBe(false);
  });

  it('tries a part without the closing aside step 2 added to it', () => {
    expect(
      anchorsFor(change(0, { placement: 'Examen final (épreuve écrite de deux heures)' }), COURSE)
    ).toEqual(['Examen final (épreuve écrite de deux heures)', 'Examen final']);
    const plan = planComplete(SYLLABUS, COURSE, [
      change(0, { placement: 'Examen final (épreuve écrite de deux heures)' })
    ]);
    expect(insertionPoints(plan).get(0)?.line).toBe('• Examen final (50%)');
  });

  it('marks a resource that only gives context in the sources line', () => {
    const doc = (title: string) => ({
      document: { payload: { document_title: title, document_url: 'https://example.org' } },
      usefulness: '',
      evidence: '',
      quote: null
    });
    const labels = { sources: 'Sources', context: 'contexte seulement' } as CompleteLabels;
    const line = sourcesLine(
      change(0, {
        resources: [doc('Direct'), { ...doc('Contexte'), role: 'context' as const }] as never
      }),
      labels
    );
    expect(line).toBe(
      'Sources : Direct — https://example.org ; Contexte — https://example.org (contexte seulement)'
    );
  });

  it('says where each change goes, the same place before and after it is accepted', () => {
    const changes = [
      change(0, { placement: 'Stratégie' }),
      change(1, {
        kind: 'objective',
        placement: 'Sensibiliser aux nouveaux défis des gestionnaires.',
        original: 'Sensibiliser aux nouveaux défis des gestionnaires.'
      }),
      change(2, { placement: 'Marketing' })
    ];
    const points = insertionPoints(planComplete(SYLLABUS, COURSE, changes));
    expect(points.get(0)).toEqual({ action: 'insert', line: 'CM2 & CM3 « Stratégie »' });
    expect(points.get(1)).toEqual({
      action: 'replace',
      line: 'Sensibiliser aux nouveaux défis des gestionnaires.'
    });
    // no single passage: not placed, it waits at the end
    expect(points.get(2)).toBeUndefined();
    // one change alone gets the same place as in the whole plan
    expect(insertionPoint(SYLLABUS, COURSE, changes[0])).toEqual(points.get(0));
    expect(insertionPoint(SYLLABUS, COURSE, changes[2])).toBeNull();
  });

  it('writes a word document', async () => {
    const changes = [change(1, { placement: 'Stratégie' })];
    const labels: CompleteLabels = {
      title: 'Syllabus mis à jour',
      note: 'Texte complet.',
      change: 'Modification approuvée',
      replaces: 'Remplace',
      sources: 'Sources',
      toPlace: 'À placer',
      toPlaceNote: 'À placer.',
      kinds: { objective: 'O', topic: 'T', teaching: 'E', assessment: 'A' }
    };
    const blob = await completeSyllabusDocx(planComplete(SYLLABUS, COURSE, changes), labels);
    expect(blob.size).toBeGreaterThan(1000);
  });
});
