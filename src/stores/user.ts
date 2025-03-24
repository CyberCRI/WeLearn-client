import { defineStore } from 'pinia';
import { type Ref, ref, computed } from 'vue';
import { getFromStorage, saveToStorage } from '@/utils/storage';

const STEPS_LIST = [
  'WELCOME',
  'INPUT',
  'FILTERS',
  'SEND',
  'RESULTS',
  'ADD_BOOKMARK',
  'CHECK_BOOKMARK'
];

type ONBOARDING_STEP = (typeof STEPS_LIST)[number];

type ONBOARDING_BOOKMARKS_STEP = 'REMOVE' | 'CLEAR';

type ONBOARDING_STATE = 'completed' | 'incomplete' | 'skipped';

type OnboardingState = {
  search: {
    state: ONBOARDING_STATE;
    step: ONBOARDING_STEP;
  };
  chat: {
    state: ONBOARDING_STATE;
    step: ONBOARDING_STEP;
  };
  bookmarks: {
    state: ONBOARDING_STATE;
    step: 'REMOVE' | 'CLEAR';
  };
};

const defaultOnboardingState: OnboardingState = {
  search: {
    state: 'incomplete',
    step: 'WELCOME'
  },
  chat: {
    state: 'incomplete',
    step: 'WELCOME'
  },
  bookmarks: {
    state: 'incomplete',
    step: 'REMOVE'
  }
};

export const useUserStore = defineStore('user', () => {
  const onboardingState = ref<Ref<OnboardingState>>(
    getFromStorage('onboardingState') || defaultOnboardingState
  );

  const setOnboardingState = (
    feat: 'search' | 'chat' | 'bookmarks',
    state: ONBOARDING_STATE,
    step: ONBOARDING_STEP | ONBOARDING_BOOKMARKS_STEP
  ) => {
    onboardingState.value = {
      ...onboardingState.value,
      [feat]: {
        state,
        step
      }
    };
    saveToStorage('onboardingState', onboardingState.value);
  };

  const generalUpdateState = (
    feat: 'search' | 'chat' | 'bookmarks',
    step: ONBOARDING_STEP,
    skipped?: boolean
  ) => {
    if (skipped) {
      setOnboardingState(feat, 'skipped', step);
      return;
    }

    const nextStepIndex = STEPS_LIST.indexOf(step) + 1;

    if (nextStepIndex === STEPS_LIST.length) {
      setOnboardingState(feat, 'completed', step);
      return;
    }
    setOnboardingState(feat, 'incomplete', STEPS_LIST[nextStepIndex]);
  };

  const updateSearchState = (step: ONBOARDING_STEP, skipped?: boolean) => {
    generalUpdateState('search', step, skipped);
  };

  const onboardingSearch: Ref<{ state: ONBOARDING_STATE; step: ONBOARDING_STEP }> = computed(
    () => onboardingState.value.search
  );
  const onboardingChat: Ref<{ state: ONBOARDING_STATE; step: ONBOARDING_STEP }> = computed(
    () => onboardingState.value.chat
  );
  const onboardingBookmarks = computed(() => onboardingState.value.bookmarks);

  return {
    onboardingState,
    onboardingSearch,
    onboardingChat,
    onboardingBookmarks,
    setOnboardingState,
    updateSearchState
  };
});
