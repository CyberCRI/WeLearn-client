import { defineStore } from 'pinia';
import { type Ref, ref, useId } from 'vue';
import { getFromStorage, saveToStorage } from '@/utils/storage';
import { getUserAndSession } from '@/utils/auth';
import { use } from 'marked';

type OnboardingState = {
  hasSeenWelcome: boolean;
};

const defaultOnboardingState: OnboardingState = {
  hasSeenWelcome: false
};

export const useUserStore = defineStore('user', () => {
  const userId: Ref<string | null> = ref(localStorage.getItem('userId'));
  const sessionId: Ref<string | null> = ref(localStorage.getItem('sessionId'));

  const setUserIdAndSessionId = async (referer: string | null) => {
    const userAndSession = await getUserAndSession(userId.value, sessionId.value, referer);
    userId.value = userAndSession?.userId;
    sessionId.value = userAndSession?.sessionId;
    localStorage.setItem('userId', userAndSession?.userId || '');
    localStorage.setItem('sessionId', userAndSession?.sessionId || '');

    return {
      userId: userId.value,
      sessionId: sessionId.value
    };
  };
  const onboardingState = ref<Ref<OnboardingState>>(
    getFromStorage('onboardingState') || defaultOnboardingState
  );

  const setHasSeenWelcome = (val: boolean) => {
    onboardingState.value.hasSeenWelcome = val;
    saveToStorage('onboardingState', onboardingState.value);
  };

  return {
    onboardingState,
    setHasSeenWelcome,
    setUserIdAndSessionId,
    userId,
    sessionId
  };
});
