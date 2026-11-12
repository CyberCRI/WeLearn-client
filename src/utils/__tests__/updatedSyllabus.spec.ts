import { describe, it, expect } from 'vitest';
import {
  buildUpdatedCourse,
  changesText,
  groupChanges,
  updatedCourseMarkdown,
  type ApprovedChange,
  type CourseToUpdate,
  type ExportLabels
} from '@/utils/updatedSyllabus';
import type { Document } from '@/types';

const COURSE: CourseToUpdate = {
  title: 'Introduction à la gestion',
  discipline: 'Gestion',
  level: 'Licence 1',
  overview: 'Un cours sur la gestion.',
  topics: [
    { title: 'Stratégie', subtopics: ['Diagnostic'] },
    { title: 'Marketing', subtopics: [] }
  ],
  objectives: ['Donner les bases.', 'Présenter les outils.'],
  competencies: ['Communiquer.'],
  sessions: [
    'Semaine du 01/12 – CM6 Management',
    'Semaine du 15/12 – CM7 Évaluation',
    'Semaine du 08/12 – CM5 « Marketing »'
  ]
};

const resource = {
  document: {
    payload: {
      document_id: 'a',
      document_title: 'Les écotafeurs',
      document_url: 'https://example.org/a'
    }
  } as unknown as Document,
  usefulness: 'Utile.',
  evidence: 'Une phrase.',
  quote: 'Une phrase.'
};

const change = (id: number, values: Partial<ApprovedChange>): ApprovedChange => ({
  connectionId: id,
  connection: `Lien ${id}`,
  kind: 'topic',
  placement: null,
  original: null,
  text: `Changement ${id}.`,
  why: `Parce que ${id}.`,
  resources: [],
  ...values
});

const LABELS: ExportLabels = {
  documentTitle: 'Cours mis à jour',
  note: 'Plan mis à jour.',
  overview: 'Présentation',
  objectives: 'Objectifs',
  competencies: 'Compétences',
  topics: 'Thèmes',
  outline: 'Plan',
  toPlace: 'À placer',
  revised: 'Reformulé',
  added: 'Ajout',
  replaces: 'Remplace',
  why: 'Pourquoi',
  sources: 'Sources',
  placement: 'Placement suggéré',
  changesTitle: 'Modifications approuvées',
  placementUnknown: 'Emplacement à choisir',
  kinds: {
    objective: 'Objectif reformulé',
    topic: 'Ajout à un thème',
    teaching: 'Ajustement',
    assessment: 'Évaluation'
  }
};

const CHANGES = [
  change(1, {
    kind: 'objective',
    placement: 'Présenter les outils.',
    original: 'Présenter les outils.'
  }),
  change(2, { placement: 'Diagnostic', resources: [resource] }),
  change(3, { kind: 'teaching', placement: 'Semaine du 15/12 – CM7 Évaluation' }),
  change(4, { kind: 'assessment', placement: null })
];

describe('the updated course', () => {
  it('puts each accepted change in its place, a revised objective instead of its original', () => {
    const updated = buildUpdatedCourse(COURSE, CHANGES);
    expect(updated.objectives).toMatchObject([
      { text: 'Donner les bases.', original: null, added: [] },
      // the revision travels with the objective, so it can be edited where it shows
      {
        text: 'Changement 1.',
        original: 'Présenter les outils.',
        revision: { text: 'Changement 1.' },
        added: []
      }
    ]);
    // a subtopic's change goes to its topic
    expect(updated.topics[0].added.map((c) => c.connectionId)).toEqual([2]);
    expect(updated.sessions[1].added.map((c) => c.connectionId)).toEqual([3]);
    // no place: kept apart, never put somewhere by guess
    expect(updated.unplaced.map((c) => c.connectionId)).toEqual([4]);
    // the course itself is not changed
    expect(updated.topics.map((t) => t.title)).toEqual(['Stratégie', 'Marketing']);
    expect(COURSE.objectives).toEqual(['Donner les bases.', 'Présenter les outils.']);
  });

  it('keeps the session a topic is taught in, when the outline names it reliably', () => {
    const updated = buildUpdatedCourse(COURSE, [
      change(5, { placement: 'Marketing' }),
      change(6, { placement: 'Stratégie' })
    ]);
    expect(updated.topics[1].added[0].session).toBe('CM5 · Semaine du 08/12');
    // no session names it: none is invented
    expect(updated.topics[0].added[0].session).toBeNull();
    expect(
      updatedCourseMarkdown(COURSE, [change(5, { placement: 'Marketing' })], LABELS)
    ).toContain(
      '  - **Ajout à un thème :** Changement 5.\n    - Placement suggéré : CM5 · Semaine du 08/12'
    );
  });

  it('groups the changes in the course order, the unplaced last', () => {
    expect(
      groupChanges(COURSE, [CHANGES[3], CHANGES[2], CHANGES[1], CHANGES[0]]).map(
        ({ placement, changes }) => [placement, changes.map((c) => c.connectionId)]
      )
    ).toEqual([
      ['Présenter les outils.', [1]],
      ['Diagnostic', [2]],
      ['Semaine du 15/12 – CM7 Évaluation', [3]],
      [null, [4]]
    ]);
  });

  it('writes the outline for word: the course, the changes marked in place, then the list', () => {
    const markdown = updatedCourseMarkdown(COURSE, CHANGES, LABELS);
    expect(markdown).toContain('# Introduction à la gestion');
    expect(markdown).toContain('> Plan mis à jour.');
    expect(markdown).toContain(
      '- **Reformulé** Changement 1.\n  - Remplace : Présenter les outils.'
    );
    expect(markdown).toContain(
      '- **Stratégie** : Diagnostic\n  - **Ajout à un thème :** Changement 2.\n    - Sources : [Les écotafeurs](https://example.org/a)'
    );
    // the outline holds a change: shown
    expect(markdown).toContain('## Plan');
    expect(markdown).toContain('## À placer\n- **Évaluation :** Changement 4.');
    expect(markdown).toContain('## Modifications approuvées');
    expect(markdown).toContain('  - Pourquoi : Parce que 2.');
    // nothing written beyond the course and the approved changes
    expect(markdown).not.toContain('undefined');
  });

  it('copies the changes as plain text, grouped by where they belong', () => {
    const text = changesText(COURSE, CHANGES, LABELS);
    expect(text.split('\n\n')[0]).toBe(
      'Présenter les outils.\n- Objectif reformulé : Changement 1.\n  Pourquoi : Parce que 1.'
    );
    expect(text).toContain('  Sources : Les écotafeurs (https://example.org/a)');
    expect(text).toContain('Emplacement à choisir\n- Évaluation : Changement 4.');
  });
});
