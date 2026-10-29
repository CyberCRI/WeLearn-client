import { defineStore } from 'pinia';
import { type Ref, ref } from 'vue';
import { clearFromStorage, getFromStorage, saveToStorage } from '@/utils/storage';
import { basePostAxios } from '@/utils/fetch';
import { useChatStore } from '@/stores/chat';
import { useSearchStore } from '@/stores/search';

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
    // copy, so updates don't mutate the shared default
    getFromStorage('onboardingState') || { ...defaultOnboardingState }
  );

  const userMetricsDataAction = async (
    val: boolean,
    userData?: { institution: string; role: string; consentRefused: boolean }
  ) => {
    onboardingState.value.hasSeenMetricsData = val;
    saveToStorage('onboardingState', onboardingState.value);

    if (userData && !userData.consentRefused) {
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

  // the previous user's history must not show up for the next one;
  // language and onboarding are device preferences, they stay
  const clearUserData = () => {
    useChatStore().$reset();
    useSearchStore().$reset();
    // storage only for the hidden TestMAS page, its in-memory state goes on reload
    clearFromStorage('courseMetadaRef');
    clearFromStorage('userMetricsData');
  };

  // call with every user id the API returns. Without a sessionId (sign-up), a
  // user change drops the stored session: the next user_and_session stores a new one
  const syncUserId = (userId: string, sessionId?: string) => {
    const storedUserId = getFromStorage('userId');

    if (storedUserId && storedUserId !== userId) {
      clearUserData();
      if (getFromStorage('sessionId') !== sessionId) {
        clearFromStorage('sessionId');
      }
    }

    if (sessionId) saveToStorage('sessionId', sessionId);
    saveToStorage('userId', userId);
  };

  return {
    onboardingState,
    setHasSeenWelcome,
    userMetricsDataAction,
    syncUserId
  };
});
