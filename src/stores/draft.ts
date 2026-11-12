import { defineStore } from 'pinia';
import { computed, ref, watch, type Ref } from 'vue';
import { useConnectionsStore } from '@/stores/connections';
import { useTutorStore } from '@/stores/tutor';
import {
  DRAFT_VERSION,
  canStore,
  courseIdentity,
  readStoredDraft,
  removeDraft,
  textFingerprint,
  writeDraft,
  type SyllabusDraft
} from '@/utils/draft';

// a draft of the syllabus adaptation in this browser, only when the teacher ticks "keep a draft":
// then every change is saved (shortly after it is made); unticking removes it. on opening the
// page a saved draft is offered: resume it, start a new syllabus, or remove it. a draft is
// restored only when it is whole and matches its own course and syllabus text
export type DraftProblem = 'unavailable' | 'full' | 'invalid';

const SAVE_DELAY = 800;

export const useDraftStore = defineStore('draft', () => {
  const tutor = useTutorStore();
  const connections = useConnectionsStore();

  const isOn = ref(false);
  const savedAt: Ref<string | null> = ref(null);
  const problem: Ref<DraftProblem | null> = ref(null);
  // a draft found on opening the page, not restored yet
  const found: Ref<SyllabusDraft | null> = ref(null);
  // a saved draft that cannot be restored (incomplete, earlier version, not matching its text)
  const isUnusable = ref(false);

  // a course being improved, read and checked: steps 2 to 4
  const isSavable = computed(() => tutor.path === 'existing' && tutor.step >= 2 && tutor.step <= 4);

  const check = () => {
    const stored = readStoredDraft();
    found.value = stored.state === 'found' ? stored.draft : null;
    isUnusable.value = stored.state === 'invalid';
    if (stored.state === 'unavailable') problem.value = 'unavailable';
  };

  const save = () => {
    if (!isOn.value || !isSavable.value) return;
    const draft: SyllabusDraft = {
      version: DRAFT_VERSION,
      savedAt: new Date().toISOString(),
      course: courseIdentity(tutor.confirmedCourse),
      text: textFingerprint(tutor.documentText),
      tutor: tutor.toDraft(),
      connections: connections.toDraft()
    };
    const result = writeDraft(draft);
    if (result === 'saved') {
      savedAt.value = draft.savedAt;
      problem.value = null;
    } else {
      problem.value = result;
    }
  };

  const keep = () => {
    if (!canStore()) {
      problem.value = 'unavailable';
      return;
    }
    isOn.value = true;
    save();
  };

  const discard = () => {
    removeDraft();
    isOn.value = false;
    savedAt.value = null;
    problem.value = null;
    found.value = null;
    isUnusable.value = false;
  };

  const restore = () => {
    const draft = found.value;
    if (!draft) return false;
    tutor.fromDraft(draft.tutor);
    // the restored course and text must be the ones the draft was saved with
    const isSame =
      courseIdentity(tutor.confirmedCourse) === draft.course &&
      textFingerprint(tutor.documentText) === draft.text;
    found.value = null;
    if (!isSame) {
      tutor.resetCourse();
      connections.$reset();
      isUnusable.value = true;
      return false;
    }
    connections.fromDraft(draft.connections, tutor.confirmedCourse);
    isOn.value = true;
    savedAt.value = draft.savedAt;
    problem.value = null;
    return true;
  };

  // a new syllabus: the saved draft stays until it is removed, or replaced by keeping a new one
  const startNew = () => {
    found.value = null;
    isUnusable.value = false;
  };

  let timer: ReturnType<typeof setTimeout> | undefined;
  watch(
    [() => tutor.$state, () => connections.$state],
    () => {
      if (!isOn.value) return;
      clearTimeout(timer);
      timer = setTimeout(save, SAVE_DELAY);
    },
    { deep: true }
  );

  return {
    isOn,
    savedAt,
    problem,
    found,
    isUnusable,
    isSavable,
    check,
    save,
    keep,
    discard,
    restore,
    startNew
  };
});
