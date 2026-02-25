import { defineStore } from 'pinia';
import { type Ref, ref } from 'vue';
import { getFromStorage, saveToStorage } from '@/utils/storage';
import { getUserAndSession } from '@/utils/auth';

type OnboardingState = {
  hasSeenWelcome: boolean;
};

const defaultOnboardingState: OnboardingState = {
  hasSeenWelcome: false
};

export const useUserStore = defineStore('user', () => {
  const userId: Ref<string | undefined> = ref(localStorage.getItem('userId') || undefined);
  const sessionId: Ref<string | undefined> = ref(localStorage.getItem('sessionId') || undefined);

  const setUserIdAndSessionId = async (referer?: string) => {
    const userAndSession = await getUserAndSession(userId.value, sessionId.value, referer);
    userId.value = userAndSession?.userId;
    sessionId.value = userAndSession?.sessionId;

    if (userId.value !== localStorage.getItem('userId')) {
      localStorage.setItem('userId', userId.value || '');
    }

    if (sessionId.value !== localStorage.getItem('sessionId')) {
      localStorage.setItem('sessionId', sessionId.value || '');
    }

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
