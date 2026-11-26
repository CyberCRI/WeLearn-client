import { reactive } from 'vue';
import { basePostAxios } from '@/utils/fetch';
import {
  clearFromStorage,
  clearFromStorageWhere,
  getFromStorage,
  saveToStorage
} from '@/utils/storage';
import type { EvalAnswers } from '@/types/learn/discipline';

// a self-evaluation form for research: each answer is sent once to /metric/form_data. what was
// saved is kept in storage under the form's name with a common prefix, so they can all be found
// again: `true` once every answer is saved, else the questions already saved
export type SavedForm = true | string[];

export const EVAL_FORM_PREFIX = 'evalForm:';
// older versions used the bare form name: `<discipline>_microlearning_<pre|post>`,
// `syllabus_v2_<pre|post>`
const LEGACY_FORM_KEY = /^(\w+_microlearning|syllabus_v2)_(pre|post)$/;

const storageKey = (formName: string) => `${EVAL_FORM_PREFIX}${formName}`;

// moved under the prefix on first read
const readStoredForm = (formName: string) => {
  const stored = getFromStorage(storageKey(formName));
  if (stored !== null || !LEGACY_FORM_KEY.test(formName)) return stored;
  const legacy = getFromStorage(formName);
  if (legacy !== null) {
    saveToStorage(storageKey(formName), legacy);
    clearFromStorage(formName);
  }
  return legacy;
};

// the forms belong to whoever answered them: cleared when the user changes
export const clearSavedForms = () =>
  clearFromStorageWhere((key) => key.startsWith(EVAL_FORM_PREFIX) || LEGACY_FORM_KEY.test(key));

const isAnswered = (value: EvalAnswers[keyof EvalAnswers]) => value !== undefined && value !== '';

export const hasAnswers = (ans: EvalAnswers) => Object.values(ans).some(isAnswered);

export function clearAnswers(answers: EvalAnswers) {
  for (const key of Object.keys(answers)) delete answers[key as keyof EvalAnswers];
}

export function useEvalForms() {
  // reactive, unlike localStorage, so the screens follow a submit
  const savedForms = reactive<Record<string, SavedForm>>({});
  // questions whose POST is still running, so a quick Back then Next doesn't send them twice
  const sendingQuestions = new Set<string>();

  function getSavedForm(form_name: string): SavedForm {
    if (savedForms[form_name] !== undefined) return savedForms[form_name];
    const stored = readStoredForm(form_name);
    return stored === true || Array.isArray(stored) ? stored : [];
  }

  function setSavedForm(form_name: string, saved: SavedForm) {
    savedForms[form_name] = saved;
    saveToStorage(storageKey(form_name), saved);
  }

  function isFormSubmitted(form_name: string) {
    return getSavedForm(form_name) === true;
  }

  // one POST per answer, each sent at most once: a submitted form is never sent again, and after
  // a partial failure only the answers that failed are sent on the next try
  async function registerFormAnswer(ans: EvalAnswers, form_name: string) {
    if (isFormSubmitted(form_name)) return;
    const questions = Object.keys(ans) as (keyof EvalAnswers)[];
    const alreadySaved = getSavedForm(form_name) as string[];
    const toSend = questions.filter(
      (key) => !alreadySaved.includes(key) && !sendingQuestions.has(`${form_name}/${key}`)
    );
    toSend.forEach((key) => sendingQuestions.add(`${form_name}/${key}`));

    const results = await Promise.allSettled(
      toSend.map((key) =>
        basePostAxios('/metric/form_data', {
          form_name,
          question: key,
          answer: String(ans[key] ?? ''),
          answer_type: 'text'
        })
      )
    );
    toSend.forEach((key) => sendingQuestions.delete(`${form_name}/${key}`));

    // read again: another call may have saved answers while these requests ran
    const current = getSavedForm(form_name);
    if (current === true) return ans;
    const saved = [...current, ...toSend.filter((_, i) => results[i].status === 'fulfilled')];
    const isComplete = questions.every((key) => saved.includes(key));
    if (isComplete) setSavedForm(form_name, true);
    else if (saved.length) setSavedForm(form_name, saved);

    if (results.some((result) => result.status === 'rejected')) {
      console.error('error while saving the answer');
    }
    return isComplete ? ans : undefined;
  }

  return { getSavedForm, setSavedForm, isFormSubmitted, registerFormAnswer };
}
