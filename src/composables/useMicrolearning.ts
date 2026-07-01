import { ref, computed, type Ref } from 'vue';
import { DISC_META, type DiscValue } from '@/types/microlearning';
import { DATA } from '@/stores/microlearning/data';

export function useMicrolearning() {
  // =====================
  // STATE GLOBAL
  // =====================
  const screen = ref<'welcome' | 'briefing' | 'trail' | 'complete'>('welcome');

  const disc = ref<DiscValue | null>(null);
  const step = ref(0);
  const actChoice = ref<string | null>(null);

  // =====================
  // DERIVED STATE
  // =====================
  const currentData = computed(() => {
    if (!disc.value) return null;
    return DATA[disc.value];
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

  function selectDiscipline(key: DiscValue) {
    disc.value = key;
  }

  function goToBriefing() {
    screen.value = 'briefing';
  }

  function startTrail() {
    step.value = 0;
    actChoice.value = null;
    screen.value = 'trail';
  }

  function nextStep() {
    if (!currentData.value) return;

    if (isLastStep.value) {
      screen.value = 'complete';
    } else {
      step.value++;
      actChoice.value = null;
    }
  }

  function prevStep() {
    if (step.value > 0) step.value--;
  }

  function restart() {
    screen.value = 'welcome';
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
