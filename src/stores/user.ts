import { defineStore } from 'pinia';
import { type Ref, ref } from 'vue';
import { getFromStorage, saveToStorage } from '@/utils/storage';
import { basePostAxios } from '@/utils/fetch';

type OnboardingState = {
  hasSeenWelcome: boolean;
  hasSeenMetricsData: boolean;
};

const defaultOnboardingState: OnboardingState = {
  hasSeenWelcome: false,
  hasSeenMetricsData: false
};

export const useUserStore = defineStore('user', () => {
  const onboardingState = ref<Ref<OnboardingState>>(
    getFromStorage('onboardingState') || defaultOnboardingState
  );

  const userMetricsDataAction = async (
    val: boolean,
    userData?: { institution: string; role: string; consentGiven: boolean }
  ) => {
    onboardingState.value.hasSeenMetricsData = val;
    saveToStorage('onboardingState', onboardingState.value);

    if (userData && userData.consentGiven) {
      saveToStorage('userMetricsData', userData);
      try {
        await basePostAxios('/user/institution-data', {
          role: userData.role,
          institution: userData.institution
        });
      } catch (error) {
        console.error('Error sending user metrics data:', error);
      }
    }
  };

  const setHasSeenWelcome = (val: boolean) => {
    onboardingState.value.hasSeenWelcome = val;
    saveToStorage('onboardingState', onboardingState.value);
  };

  return {
    onboardingState,
    setHasSeenWelcome,
    userMetricsDataAction
  };
});
