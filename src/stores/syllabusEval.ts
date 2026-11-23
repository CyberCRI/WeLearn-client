import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { clearAnswers, hasAnswers, useEvalForms } from '@/composables/useEvalForms';
import { useFeatureFlipStore } from '@/stores/featureFlip';
import type { CoursePath } from '@/types';
import type { EvalAnswers } from '@/types/learn/discipline';

// the self-evaluation of syllabus v2, as in the microlearning: "before" ahead of the path
// question, "after" under the final syllabus once the teacher downloaded it, for either path. asked only the first time in this
// browser: unlike the microlearning, a form skipped is done too, nothing sent
export const PRE_FORM = 'syllabus_v2_pre';
export const POST_FORM = 'syllabus_v2_post';

export const useSyllabusEvalStore = defineStore('syllabusEval', () => {
  const { isFormSubmitted, registerFormAnswer, setSavedForm } = useEvalForms();
  const isSyllabusV2 = useFeatureFlipStore().isFeatureEnabled('syllabusV2');

  const preAnswers = reactive<EvalAnswers>({});
  const postAnswers = reactive<EvalAnswers & { path?: CoursePath }>({});

  // answered or skipped during this visit: the form goes away at once, without waiting for the
  // answers to be saved. one that could not be saved is asked again on the next visit
  const isPreDone = ref(false);
  const isPostDone = ref(false);
  const isPreDue = computed(() => isSyllabusV2 && !isPreDone.value && !isFormSubmitted(PRE_FORM));
  const isPostDue = computed(
    () => isSyllabusV2 && !isPostDone.value && !isFormSubmitted(POST_FORM)
  );
  // "after" waits for the syllabus to be downloaded: the teacher answers with it in hand
  const hasDownloaded = ref(false);
  const isPostShown = computed(() => isPostDue.value && hasDownloaded.value);
  const offerPost = () => {
    hasDownloaded.value = true;
  };

  const skip = (answers: EvalAnswers, form: string) => {
    clearAnswers(answers);
    setSavedForm(form, true);
  };

  const submit = (answers: EvalAnswers, form: string) => {
    if (hasAnswers(answers)) void registerFormAnswer(answers, form);
    else skip(answers, form);
  };

  // sent with the path, so the answers of each path can be told apart
  const submitPost = (path: CoursePath) => {
    isPostDone.value = true;
    if (hasAnswers(postAnswers)) postAnswers.path = path;
    submit(postAnswers, POST_FORM);
  };

  return {
    preAnswers,
    postAnswers,
    isPreDue,
    isPostDue,
    isPostShown,
    offerPost,
    submitPre: () => {
      isPreDone.value = true;
      submit(preAnswers, PRE_FORM);
    },
    skipPre: () => {
      isPreDone.value = true;
      skip(preAnswers, PRE_FORM);
    },
    submitPost,
    skipPost: () => {
      isPostDone.value = true;
      skip(postAnswers, POST_FORM);
    }
  };
});
