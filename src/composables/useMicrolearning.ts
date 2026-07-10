import { ref, computed, type ComputedRef } from 'vue';
import type { DiscValue, Discipline, DisciplineMeta } from '@/types/microlearning';
import { ScreensEnum } from '@/types/microlearning';
import { DATA } from '@/stores/microlearning/data';
import i18n from '@/localisation/i18n';

export function useMicrolearning() {
  // =====================
  // STATE GLOBAL
  // =====================
  const screen = ref<ScreensEnum>(ScreensEnum.welcome);

  const disc = ref<DiscValue | null>(null);
  const current_disc = ref<DisciplineMeta | null>(null);
  const step = ref(0);
  const actChoice = ref<string | null>(null);

  const DISC_META: Record<string, DisciplineMeta> = {
    math: { id: 'math', name: 'Mathématiques', icon: '📐' },
    history: { id: 'history', name: 'Histoire', icon: '🏛' },
    economics: { id: 'economics', name: 'Économie', icon: '📊' },
    law: { id: 'law', name: 'Droit', icon: '⚖️' },
    philosophy: { id: 'philosophy', name: 'Philosophie', icon: '💭' },
    psychology: { id: 'psychology', name: 'Psychologie', icon: '🧠' }
  };

  const DISC_LIST: DisciplineMeta[] = Object.values(DISC_META);
  // [
  //   { id: 'math', name: 'Mathématiques', icon: '📐' },
  //   { id: 'history', name: 'Histoire', icon: '🏛' },
  //   { id: 'economics', name: 'Économie', icon: '📊' },
  //   { id: 'law', name: 'Droit', icon: '⚖️' },
  //   { id: 'philosophy', name: 'Philosophie', icon: '💭' },
  //   { id: 'psychology', name: 'Psychologie', icon: '🧠' }
  // ];

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

  function selectDiscipline(key: string) {
    disc.value = key as DiscValue;
    current_disc.value = DISC_META[disc.value];
    goToBriefing();
  }

  function goToBriefing() {
    screen.value = ScreensEnum.briefing;
  }

  function startTrail() {
    step.value = 0;
    actChoice.value = null;
    screen.value = ScreensEnum.trail;
  }

  function nextStep() {
    if (!currentData.value) return;

    if (isLastStep.value) {
      screen.value = ScreensEnum.complete;
    } else {
      step.value++;
      actChoice.value = null;
    }
  }

  function prevStep() {
    if (step.value > 0) step.value--;
  }

  function restart() {
    screen.value = ScreensEnum.welcome;
    disc.value = null;
    step.value = 0;
    actChoice.value = null;
  }

  function chooseActivity(choice: string) {
    actChoice.value = choice;
  }

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

    // derived
    currentData,
    currentStep,
    currentMeta,
    progress,
    isLastStep,

    // actions
    selectDiscipline,
    goToBriefing,
    startTrail,
    nextStep,
    prevStep,
    restart,
    chooseActivity
  };
}
