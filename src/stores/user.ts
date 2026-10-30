import { defineStore } from 'pinia';
import { type Ref, computed, ref } from 'vue';
import { clearFromStorage, getFromStorage, saveToStorage } from '@/utils/storage';
import type { AnalyticsConsent } from '@/types';
import {
  grantAnalyticsConsent,
  identifyUser,
  resetAnalytics,
  revokeAnalyticsConsent,
  track
} from '@/utils/analytics';
import i18n from '@/localisation/i18n';
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

// CNIL recommends asking again after about 6 months
const CONSENT_MAX_AGE_MS = 182 * 24 * 60 * 60 * 1000;

const getStoredConsent = (): AnalyticsConsent | null => {
  const consent: AnalyticsConsent | null = getFromStorage('analyticsConsent');
  if (!consent || Date.now() - new Date(consent.date).getTime() > CONSENT_MAX_AGE_MS) {
    return null;
  }
  return consent;
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

  const analyticsConsent = ref<AnalyticsConsent | null>(getStoredConsent());
  const shouldAskAnalyticsConsent = computed(() => analyticsConsent.value === null);

  // mixpanel keeps its own opt-in: an expired or missing choice must switch it off too
  const applyAnalyticsConsent = () => {
    if (analyticsConsent.value?.status === 'granted') {
      grantAnalyticsConsent({ language: i18n.global.locale.value });
      return;
    }
    revokeAnalyticsConsent();
  };

  const setAnalyticsConsent = (isGranted: boolean) => {
    analyticsConsent.value = {
      status: isGranted ? 'granted' : 'denied',
      date: new Date().toISOString()
    };
    saveToStorage('analyticsConsent', analyticsConsent.value);

    applyAnalyticsConsent();
    // proof of consent; nothing is sent on refusal
    if (isGranted) track('Analytics Consent', { granted: true });
  };

  // reopens the banner, the stored choice stays applied until a new one is made
  const reviewAnalyticsConsent = () => {
    analyticsConsent.value = null;
  };

  const setHasSeenWelcome = (val: boolean) => {
    onboardingState.value.hasSeenWelcome = val;
    saveToStorage('onboardingState', onboardingState.value);
  };

  // the previous user's history must not show up for the next one;
  // language, onboarding and analytics consent are device preferences, they stay
  const clearUserData = () => {
    resetAnalytics();
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
    identifyUser(userId);
  };

  return {
    onboardingState,
    setHasSeenWelcome,
    userMetricsDataAction,
    syncUserId,
    analyticsConsent,
    shouldAskAnalyticsConsent,
    applyAnalyticsConsent,
    setAnalyticsConsent,
    reviewAnalyticsConsent
  };
});
