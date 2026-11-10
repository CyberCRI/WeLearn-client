import { ref, reactive, computed, watch, type ComputedRef } from 'vue';
import { useRoute, useRouter, type LocationQuery } from 'vue-router';
import type {
  ActivitiesStep,
  ActivityRef,
  DiscValue,
  Discipline,
  DisciplineMeta,
  EvalAnswers,
  FlipStep
} from '@/types/microlearning';
import { ScreensEnum } from '@/types/microlearning';
import { DATA } from '@/stores/microlearning/data';
import i18n from '@/localisation/i18n';
import { basePostAxios } from '@/utils/fetch';
import { scrollToTop } from '@/utils/navigation';
import { getFromStorage, saveToStorage } from '@/utils/storage';
import { calculateProgress } from '@/utils/progress';
import { track } from '@/utils/analytics';

type EvalForm = 'pre' | 'post';
type SavedForm = true | string[];

export function useMicrolearning() {
  const route = useRoute();
  const router = useRouter();

  // =====================
  // STATE GLOBAL
  // =====================
  const screen = ref<ScreensEnum>(ScreensEnum.welcome);

  const disc = ref<DiscValue | null>(null);
  const current_disc = ref<DisciplineMeta | null>(null);
  const step = ref(0);

  // Progress kept while navigating back and forth
  const flippedCards = ref<number[]>([]);
  // Store the position, not the text, so the activity follows language switches
  const actChoice = ref<ActivityRef | null>(null);
  const reflectionAnswers = reactive<string[]>([]);

  // Self-evaluation (research data): "before" answers lock once the trail starts
  const preAnswers = reactive<EvalAnswers>({});
  const postAnswers = reactive<EvalAnswers>({});
  const preLocked = ref(false);

  // save state per form name, mirrored in storage: `true` once every answer is saved, else the
  // questions already saved. reactive, unlike localStorage, so the screens follow a submit
  const savedForms = reactive<Record<string, SavedForm>>({});
  // questions whose POST is still running, so a quick Back then Next doesn't send them twice
  const sendingQuestions = new Set<string>();

  const DISC_META: Record<string, DisciplineMeta> = {
    math: { id: 'math', name: 'Mathématiques' },
    history: { id: 'history', name: 'Histoire' },
    economics: { id: 'economics', name: 'Économie' },
    law: { id: 'law', name: 'Droit' },
    philosophy: { id: 'philosophy', name: 'Philosophie' },
    psychology: { id: 'psychology', name: 'Psychologie' },
    geography: { id: 'geography', name: 'Géographie' },
    health: { id: 'health', name: 'Santé' },
    staps: { id: 'staps', name: 'STAPS' },
    letters: { id: 'letters', name: 'Lettres' },
    ecology: { id: 'ecology', name: 'Écologie' },
    art: { id: 'art', name: 'Art' },
    polsci: { id: 'polsci', name: 'Science politique' },
    physics: { id: 'physics', name: 'Physique' },
    anthropology: { id: 'anthropology', name: 'Anthropologie' }
  };

  const DISC_LIST: DisciplineMeta[] = Object.values(DISC_META);

  // =====================
  // DERIVED STATE
  // =====================
  const currentData: ComputedRef<Discipline | null> = computed(() => {
    if (!disc.value) return null;
    return DATA[i18n.global.locale.value][disc.value];
  });

  const currentStep = computed(() => {
    return currentData.value?.steps?.[step.value] ?? null;
  });

  // a form is hidden once all its answers reached the research metrics, see registerFormAnswer
  const shouldHideAutoEvalStart = computed(() => isFormSubmitted(formName('pre')));

  const shouldHideAutoEvalEnd = computed(() => isFormSubmitted(formName('post')));

  const chosenActivity = computed(() => {
    if (!actChoice.value) return null;
    const activities = currentData.value?.steps.find((s) => s.type === 'activities') as
      | ActivitiesStep
      | undefined;
    return activities?.apports[actChoice.value.apport]?.acts[actChoice.value.act] ?? null;
  });

  const flipDone = computed(() => {
    const flip = currentData.value?.steps.find((s) => s.type === 'flip') as FlipStep | undefined;
    return !!flip && flippedCards.value.length === flip.cards.length;
  });

  const currentMeta = computed(() => {
    if (!disc.value) return null;
    return DISC_META[disc.value];
  });

  const isLastStep = computed(() => {
    return !!currentData.value && step.value === currentData.value.steps.length - 1;
  });

  const progress = computed(() => {
    if (!currentData.value) return 0;
    return calculateProgress(step.value, currentData.value.steps.length - 1);
  });

  // =====================
  // ACTIONS
  // =====================

  function clearAnswers(answers: EvalAnswers) {
    for (const key of Object.keys(answers)) delete answers[key as keyof EvalAnswers];
  }

  function resetProgress() {
    step.value = 0;
    flippedCards.value = [];
    actChoice.value = null;
    reflectionAnswers.splice(0);
    clearAnswers(preAnswers);
    clearAnswers(postAnswers);
    preLocked.value = false;
  }

  function setDiscipline(key: string) {
    if (key !== disc.value) resetProgress();
    disc.value = key as DiscValue;
    current_disc.value = DISC_META[key];
  }

  function selectDiscipline(key: string) {
    setDiscipline(key);
    goToBriefing();
  }

  function goToBriefing() {
    screen.value = ScreensEnum.briefing;
  }

  // Pre form already answered for this discipline: go straight to the trail
  function goToautoEvalStart() {
    if (shouldHideAutoEvalStart.value) startTrail();
    else screen.value = ScreensEnum.autoEvalStart;
  }

  function startTrail() {
    step.value = 0;
    screen.value = ScreensEnum.trail;
    track('Microlearning Started', { discipline: current_disc.value?.id ?? 'unknown' });
    if (hasAnswers(preAnswers)) registerFormAnswer(preAnswers, formName('pre'));
  }

  // skipping discards what was filled in, so a half-answered form never reaches the metrics
  function skipAutoEvalStart() {
    clearAnswers(preAnswers);
    startTrail();
  }

  function nextStep() {
    if (!currentData.value) return;
    track('Microlearning Step Completed', {
      discipline: current_disc.value?.id ?? 'unknown',
      stepIndex: step.value
    });

    // Post form already answered for this discipline: go straight to the end
    if (isLastStep.value) {
      if (shouldHideAutoEvalEnd.value) goToComplete();
      else screen.value = ScreensEnum.autoEvalEnd;
    } else {
      step.value++;
    }
  }

  function goToComplete() {
    screen.value = ScreensEnum.complete;
    track('Microlearning Completed', {
      discipline: current_disc.value?.id ?? 'unknown',
      hasPreEval: hasAnswers(preAnswers),
      hasPostEval: hasAnswers(postAnswers)
    });
    if (hasAnswers(postAnswers)) registerFormAnswer(postAnswers, formName('post'));
  }

  function skipAutoEvalEnd() {
    clearAnswers(postAnswers);
    goToComplete();
  }

  function prevStep() {
    if (step.value > 0) step.value--;
    else if (shouldHideAutoEvalStart.value) goToBriefing();
    else goToautoEvalStart();
  }

  function backToTrail() {
    screen.value = ScreensEnum.trail;
  }

  function restart() {
    screen.value = ScreensEnum.welcome;
    disc.value = null;
    current_disc.value = null;
    resetProgress();
  }

  // One-way: cards stay revealed so text can be selected and progress is never undone
  function flipCard(index: number) {
    if (!flippedCards.value.includes(index)) flippedCards.value.push(index);
  }

  function chooseActivity(choice: ActivityRef | null) {
    actChoice.value = choice;
  }

  // Once the user has seen trail content, "before" answers no longer reflect a baseline
  watch(screen, (s) => {
    if (s === ScreensEnum.trail) preLocked.value = true;
    // each screen starts at its top, not at the previous screen's scroll position
    scrollToTop();
  });

  function formName(form: EvalForm) {
    return `${current_disc.value?.id}_microlearning_${form}`;
  }

  function getSavedForm(form_name: string): SavedForm {
    if (savedForms[form_name] !== undefined) return savedForms[form_name];
    const stored = getFromStorage(form_name);
    return stored === true || Array.isArray(stored) ? stored : [];
  }

  function setSavedForm(form_name: string, saved: SavedForm) {
    savedForms[form_name] = saved;
    saveToStorage(form_name, saved);
  }

  function isFormSubmitted(form_name: string) {
    return getSavedForm(form_name) === true;
  }

  const isAnswered = (value: EvalAnswers[keyof EvalAnswers]) => value !== undefined && value !== '';

  const hasAnswers = (ans: EvalAnswers) => Object.values(ans).some(isAnswered);

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

  // =====================
  // URL SYNC (browser back/forward follow our navigation)
  // =====================
  const QUERY_KEYS = ['disc', 'screen', 'step'] as const;

  function toQuery(): Record<string, string> {
    if (screen.value === ScreensEnum.welcome || !disc.value) return {};
    const query: Record<string, string> = { disc: disc.value, screen: screen.value };
    if (screen.value === ScreensEnum.trail) query.step = String(step.value);
    return query;
  }

  function sameAsRoute(query: Record<string, string>) {
    return QUERY_KEYS.every((k) => query[k] === route.query[k]);
  }

  function applyQuery(query: LocationQuery) {
    const d = query.disc as string | undefined;
    const s = query.screen as ScreensEnum | undefined;
    if (
      !d ||
      !DATA[i18n.global.locale.value][d as DiscValue] ||
      !s ||
      !Object.values(ScreensEnum).includes(s)
    ) {
      screen.value = ScreensEnum.welcome;
      return;
    }
    setDiscipline(d);
    const maxStep = (currentData.value?.steps.length ?? 1) - 1;
    step.value = Math.min(Math.max(Number(query.step) || 0, 0), maxStep);
    screen.value = s;
  }

  // Keep unrelated params (e.g. ?lang=) untouched
  function withOtherParams(query: Record<string, string>) {
    const others = { ...route.query };
    QUERY_KEYS.forEach((k) => delete others[k]);
    return { ...others, ...query };
  }

  watch([screen, step, disc], () => {
    const query = toQuery();
    if (!sameAsRoute(query)) router.push({ query: withOtherParams(query) });
  });

  watch(
    () => route.query,
    (query) => {
      if (!sameAsRoute(toQuery())) applyQuery(query);
    }
  );

  // answers live in memory only, so a page refresh starts over from the welcome screen
  if (!sameAsRoute({})) router.replace({ query: withOtherParams({}) });

  // =====================
  // RETURN API
  // =====================
  return {
    // state
    registerFormAnswer,
    screen,
    disc,
    current_disc,
    DISC_META,
    DISC_LIST,
    step,
    actChoice,
    flippedCards,
    flipDone,
    reflectionAnswers,
    preAnswers,
    postAnswers,
    preLocked,
    shouldHideAutoEvalStart,
    shouldHideAutoEvalEnd,

    // derived
    currentData,
    currentStep,
    chosenActivity,
    currentMeta,
    progress,
    isLastStep,

    // actions
    selectDiscipline,
    goToBriefing,
    startTrail,
    skipAutoEvalStart,
    skipAutoEvalEnd,
    goToautoEvalStart,
    nextStep,
    prevStep,
    backToTrail,
    goToComplete,
    restart,
    chooseActivity,
    flipCard
  };
}
