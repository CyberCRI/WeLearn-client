import { defineStore } from 'pinia';
import { computed, ref, watch, type Ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useConnectionsStore } from '@/stores/connections';
import { useCourseStore } from '@/stores/course';
import { useTutorStore } from '@/stores/tutor';
import {
  DRAFT_VERSION,
  canStore,
  readStoredDraft,
  removeDraft,
  textFingerprint,
  writeDraft,
  type SyllabusDraft
} from '@/utils/courseDraft';

// a draft of the "I have a course" path in this browser, for a logged-in teacher who asks for
// it: from then on every change is saved, shortly after it is made, until they remove it. on
// opening the page a saved draft is offered: resume it, start a new syllabus, or remove it
export type DraftProblem = 'unavailable' | 'full';

const SAVE_DELAY = 800;

export const useCourseDraftStore = defineStore('courseDraft', () => {
  const auth = useAuthStore();
  const tutor = useTutorStore();
  const course = useCourseStore();
  const connections = useConnectionsStore();

  const isOn = ref(false);
  const savedAt: Ref<string | null> = ref(null);
  const problem: Ref<DraftProblem | null> = ref(null);
  // a draft found on opening the page, not restored yet
  const found: Ref<SyllabusDraft | null> = ref(null);
  // a saved draft that cannot be restored (incomplete, from an earlier version, or not matching
  // its syllabus text)
  const isUnusable = ref(false);

  // a course read and being worked on, by a teacher with an account: the text of their syllabus
  // never stays in the browser of a guest
  const isSavable = computed(
    () => auth.isAuthenticated && tutor.path === 'existing' && course.step >= 2 && !!course.reading
  );

  const check = () => {
    if (!auth.isAuthenticated) return;
    const stored = readStoredDraft();
    found.value = stored.state === 'found' ? stored.draft : null;
    isUnusable.value = stored.state === 'invalid';
    problem.value = stored.state === 'unavailable' ? 'unavailable' : null;
  };

  const save = () => {
    if (!isOn.value || !isSavable.value) return;
    const draft: SyllabusDraft = {
      version: DRAFT_VERSION,
      savedAt: new Date().toISOString(),
      text: textFingerprint(course.reading?.text),
      course: course.toDraft(),
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

  // the teacher asks to keep a draft: it replaces the one kept before, if any
  const keep = () => {
    if (!canStore()) {
      problem.value = 'unavailable';
      return;
    }
    found.value = null;
    isUnusable.value = false;
    isOn.value = true;
    save();
  };

  const discard = () => {
    clearTimeout(timer);
    removeDraft();
    isOn.value = false;
    savedAt.value = null;
    problem.value = null;
    found.value = null;
    isUnusable.value = false;
  };

  const restore = () => {
    const draft = found.value;
    found.value = null;
    if (!draft) return false;
    // the syllabus text must be the one the draft was saved with
    if (textFingerprint(draft.course.reading?.text) !== draft.text) {
      isUnusable.value = true;
      return false;
    }
    tutor.path = 'existing';
    course.fromDraft(draft.course);
    connections.fromDraft(draft.connections);
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

  // another course read, or the path left: the draft kept stays as it was, and a new one is kept
  // only if the teacher asks again. sync, so a restore turns the draft on after it
  watch(
    () => course.reading,
    () => {
      clearTimeout(timer);
      isOn.value = false;
      savedAt.value = null;
    },
    { flush: 'sync' }
  );

  let timer: ReturnType<typeof setTimeout> | undefined;
  watch(
    [() => course.$state, () => connections.$state],
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
