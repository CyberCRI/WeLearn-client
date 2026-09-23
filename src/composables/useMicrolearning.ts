import { ref, reactive, computed, watch, type ComputedRef } from 'vue';
import { useRoute, useRouter, type LocationQuery } from 'vue-router';
import type {
  ActivitiesStep,
  ActivityRef,
  DiscValue,
  Discipline,
  DisciplineMeta,
  FlipStep
} from '@/types/microlearning';
import { ScreensEnum } from '@/types/microlearning';
import { DATA } from '@/stores/microlearning/data';
import i18n from '@/localisation/i18n';

export interface EvalAnswers {
  link?: number;
  confidence?: number;
  willUse?: string;
  feedback?: string;
}

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

  const DISC_META: Record<string, DisciplineMeta> = {
    math: { id: 'math', name: 'Mathématiques', icon: '📐' },
    history: { id: 'history', name: 'Histoire', icon: '🏛' },
    economics: { id: 'economics', name: 'Économie', icon: '📊' },
    law: { id: 'law', name: 'Droit', icon: '⚖️' },
    philosophy: { id: 'philosophy', name: 'Philosophie', icon: '💭' },
    psychology: { id: 'psychology', name: 'Psychologie', icon: '🧠' },
    geography: { id: 'geography', name: 'Géographie', icon: '🗺' },
    health: { id: 'health', name: 'Santé', icon: '🏥' },
    staps: { id: 'staps', name: 'STAPS', icon: '🏃' },
    letters: { id: 'letters', name: 'Lettres', icon: '📖' },
    ecology: { id: 'ecology', name: 'Écologie', icon: '🌿' },
    art: { id: 'art', name: 'Art', icon: '🎨' },
    polsci: { id: 'polsci', name: 'Science politique', icon: '🏛️' }
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
    return (step.value / (currentData.value.steps.length - 1)) * 100;
  });

  // =====================
  // ACTIONS
  // =====================

  function resetProgress() {
    step.value = 0;
    flippedCards.value = [];
    actChoice.value = null;
    reflectionAnswers.splice(0);
    for (const answers of [preAnswers, postAnswers]) {
      for (const key of Object.keys(answers)) delete answers[key as keyof EvalAnswers];
    }
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

  function goToautoEvalStart() {
    screen.value = ScreensEnum.autoEvalStart;
  }

  function startTrail() {
    step.value = 0;
    screen.value = ScreensEnum.trail;
  }

  function nextStep() {
    if (!currentData.value) return;

    if (isLastStep.value) {
      screen.value = ScreensEnum.autoEvalEnd;
    } else {
      step.value++;
    }
  }

  function goToComplete() {
    screen.value = ScreensEnum.complete;
  }

  function prevStep() {
    if (step.value > 0) step.value--;
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

  function toggleCard(index: number) {
    const i = flippedCards.value.indexOf(index);
    if (i === -1) flippedCards.value.push(index);
    else flippedCards.value.splice(i, 1);
  }

  function chooseActivity(choice: ActivityRef | null) {
    actChoice.value = choice;
  }

  // Once the user has seen trail content, "before" answers no longer reflect a baseline
  watch(screen, (s) => {
    if (s === ScreensEnum.trail) preLocked.value = true;
  });

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

  // ponytail: answers live in memory only, so a page refresh starts over from the welcome screen
  if (!sameAsRoute({})) router.replace({ query: withOtherParams({}) });

  // =====================
  // RETURN API
  // =====================
  return {
    // state
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
    goToautoEvalStart,
    nextStep,
    prevStep,
    backToTrail,
    goToComplete,
    restart,
    chooseActivity,
    toggleCard
  };
}
