import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useDraftStore } from '../draft';
import { useTutorStore } from '../tutor';
import { useConnectionsStore, type Connection } from '../connections';
import {
  DRAFT_KEY,
  canStore,
  isWholeDraft,
  readStoredDraft,
  textFingerprint,
  writeDraft
} from '@/utils/draft';
import { planComplete, validatePlan } from '@/utils/completeSyllabus';

const TEXT = [
  'INTRODUCTION À LA GESTION',
  'OBJECTIFS',
  'Donner les bases nécessaires pour comprendre le fonctionnement des entreprises.',
  'CONTENU',
  'Stratégie d’entreprise et diagnostic',
  'Marketing',
  'ÉVALUATION',
  'Examen final (50%)',
  'Ce cours présente les fonctions de l’entreprise et les décisions de ses dirigeants. '.repeat(4)
].join('\n');

const accepted: Connection = {
  id: 3,
  title: 'Stratégie et climat',
  anchor: 'Stratégie d’entreprise et diagnostic',
  anchorLabel: null,
  why: '',
  resources: [],
  decision: 'selected',
  development: {
    status: 'ready',
    proposal: {
      kind: 'topic',
      original: 'Stratégie d’entreprise et diagnostic',
      suggested: 'Ajouter un cas sur les risques climatiques.',
      why: 'Cela relie la stratégie au climat.',
      support: 'strong',
      resources: [],
      guidance: {
        learning: 'Analyser un risque climatique.',
        greencomp: { id: 'systems_thinking', how: 'Les étudiants relient climat et stratégie.' },
        teaching: null,
        check: null
      }
    },
    decision: 'accepted',
    edited: 'Ajouter un cas sur les risques climatiques, version de l’enseignante.',
    placement: null
  }
};

// a course read, checked and adapted: step 4 with one approved and edited change
const prepare = () => {
  const tutor = useTutorStore();
  const connections = useConnectionsStore();
  tutor.choosePath('existing');
  tutor.teachingContext = { ...tutor.teachingContext, title: 'Introduction à la gestion' };
  tutor.documentText = TEXT;
  tutor.courseTopics = [
    { value: 'Stratégie d’entreprise et diagnostic', origin: 'extracted' },
    { value: 'Marketing', origin: 'extracted' }
  ];
  tutor.courseObjectives = [
    {
      value: 'Donner les bases nécessaires pour comprendre le fonctionnement des entreprises.',
      origin: 'extracted'
    }
  ];
  connections.fromDraft(
    {
      status: 'ready',
      candidateCount: 4,
      connections: [accepted],
      confirmedFor: tutor.confirmedCourse,
      parts: tutor.courseParts,
      topics: [],
      language: 'fr',
      isCourseChanged: false
    },
    tutor.confirmedCourse
  );
  tutor.setStep(4);
  return { tutor, connections };
};

describe('syllabus draft', () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('keeps nothing until the teacher asks', () => {
    prepare();
    const draft = useDraftStore();
    draft.save();
    expect(localStorage.getItem(DRAFT_KEY)).toBeNull();
    draft.keep();
    expect(draft.isOn).toBe(true);
    expect(readStoredDraft().state).toBe('found');
  });

  it('restores the whole work after a reload, ready for the complete word document', () => {
    prepare();
    useDraftStore().keep();

    // a reload: new stores, the draft offered, then resumed
    setActivePinia(createPinia());
    const draft = useDraftStore();
    draft.check();
    expect(draft.found?.tutor.teachingContext.title).toBe('Introduction à la gestion');
    expect(draft.restore()).toBe(true);
    const tutor = useTutorStore();
    const connections = useConnectionsStore();
    expect(tutor.step).toBe(4);
    expect(tutor.path).toBe('existing');
    expect(tutor.documentText).toBe(TEXT);
    // the connections belong to the restored course: step 3 does not search again
    expect(connections.isFor(tutor.confirmedCourse)).toBe(true);
    const [change] = connections.acceptedChanges;
    expect(change.text).toBe(
      'Ajouter un cas sur les risques climatiques, version de l’enseignante.'
    );
    expect(change.guidance?.greencomp?.id).toBe('systems_thinking');
    // the complete document can be made again, with the change in its place
    const plan = planComplete(TEXT, tutor.courseToUpdate, connections.acceptedChanges);
    expect(validatePlan(TEXT, connections.acceptedChanges, plan)).toBe(true);
    expect(plan.toPlace).toEqual([]);
    // and the draft keeps being saved
    expect(draft.isOn).toBe(true);
  });

  it('starts a new syllabus without restoring, or removes the draft', () => {
    prepare();
    useDraftStore().keep();
    setActivePinia(createPinia());
    const draft = useDraftStore();
    draft.check();
    draft.startNew();
    expect(draft.found).toBeNull();
    expect(useTutorStore().path).toBeNull();
    // still there for later
    expect(readStoredDraft().state).toBe('found');
    draft.discard();
    expect(readStoredDraft().state).toBe('none');
  });

  it('never restores a draft that is incomplete, from another version, or not matching its text', () => {
    prepare();
    useDraftStore().keep();
    const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || '');

    localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...saved, version: 0 }));
    expect(readStoredDraft().state).toBe('invalid');
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...saved, connections: undefined }));
    expect(readStoredDraft().state).toBe('invalid');
    localStorage.setItem(DRAFT_KEY, '{not json');
    expect(readStoredDraft().state).toBe('invalid');

    // the syllabus text was altered: nothing is restored, the page says so
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ ...saved, tutor: { ...saved.tutor, documentText: TEXT.slice(0, 200) } })
    );
    setActivePinia(createPinia());
    const draft = useDraftStore();
    draft.check();
    expect(draft.restore()).toBe(false);
    expect(draft.isUnusable).toBe(true);
    expect(useTutorStore().path).toBeNull();
    expect(useConnectionsStore().connections).toEqual([]);
  });

  it('says when the browser cannot keep a draft, or its storage is full', () => {
    prepare();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw Object.assign(new Error('full'), { name: 'QuotaExceededError' });
    });
    expect(canStore()).toBe(false);
    const draft = useDraftStore();
    draft.keep();
    expect(draft.isOn).toBe(false);
    expect(draft.problem).toBe('unavailable');
    expect(writeDraft({} as never)).toBe('full');
  });

  it('checks the shape and the text', () => {
    expect(isWholeDraft(null)).toBe(false);
    expect(textFingerprint(null)).toBe('none');
    expect(textFingerprint('abc')).toBe(textFingerprint('abc'));
    expect(textFingerprint('abc')).not.toBe(textFingerprint('abd'));
  });
});
