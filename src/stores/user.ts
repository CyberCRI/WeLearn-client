import { defineStore } from 'pinia';
import { type Ref, ref } from 'vue';
import { getFromStorage, saveToStorage } from '@/utils/storage';

type OnboardingState = {
  hasSeenWelcome: boolean;
};

const defaultOnboardingState: OnboardingState = {
  hasSeenWelcome: false
};

export const useUserStore = defineStore('user', () => {
  const onboardingState = ref<Ref<OnboardingState>>(
    getFromStorage('onboardingState') || defaultOnboardingState
  );

  const setHasSeenWelcome = (val: boolean) => {
    onboardingState.value.hasSeenWelcome = val;
    saveToStorage('onboardingState', onboardingState.value);
  };

  return {
    onboardingState,
    setHasSeenWelcome
  };
});
