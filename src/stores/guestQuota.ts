import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { clearFromStorage, getFromStorage, saveToStorage } from '@/utils/storage';
import type { GuestQuotaFeature } from '@/types';

// what a guest can do before being asked to create an account
export const GUEST_LIMITS: Record<GuestQuotaFeature, number> = {
  chat: 5,
  syllabus: 1
};

const STORAGE_KEY = 'guestUsage';
const SIGNUP_REASONS = { chat: 'chatLimit', syllabus: 'syllabusLimit' } as const;

const emptyUsage = (): Record<GuestQuotaFeature, number> => ({ chat: 0, syllabus: 0 });

// ponytail: counted in the browser only, clearing the storage resets it. the API has no quota yet
// (see guest-access-api-next-steps.md), this is a nudge to sign up, not a cost protection
export const useGuestQuotaStore = defineStore('guestQuota', () => {
  const usage = ref<Record<GuestQuotaFeature, number>>({
    ...emptyUsage(),
    ...getFromStorage(STORAGE_KEY)
  });

  const remaining = (feature: GuestQuotaFeature) =>
    Math.max(0, GUEST_LIMITS[feature] - usage.value[feature]);

  // logged-in users and environments without auth have no limit
  const canUse = (feature: GuestQuotaFeature) => !useAuthStore().isGuest || remaining(feature) > 0;

  // true when the guest can go on, otherwise opens the signup prompt
  const checkQuota = (feature: GuestQuotaFeature) => {
    if (canUse(feature)) return true;
    useAuthStore().askToSignUp(SIGNUP_REASONS[feature]);
    return false;
  };

  // call once the action succeeded, so a failed request does not use the quota
  const consume = (feature: GuestQuotaFeature) => {
    if (!useAuthStore().isGuest) return;
    usage.value[feature] += 1;
    saveToStorage(STORAGE_KEY, usage.value);
  };

  const $reset = () => {
    usage.value = emptyUsage();
    clearFromStorage(STORAGE_KEY);
  };

  return { usage, remaining, canUse, checkQuota, consume, $reset };
});
