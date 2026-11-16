import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { apiErrorDetail } from '@/utils/apiErrors';
import { getGuestQuota } from '@/utils/fetch';
import { clearFromStorage } from '@/utils/storage';
import type { ApiSchema } from '@/types/api';
import type { GuestQuotaFeature } from '@/types';

const SIGNUP_REASONS = { chat: 'chatLimit', syllabus: 'syllabusLimit' } as const;

// the browser counter used before the API counted the quota: nothing reads it anymore
const LEGACY_STORAGE_KEY = 'guestUsage';

const isGuestQuotaFeature = (value: unknown): value is GuestQuotaFeature =>
  typeof value === 'string' && value in SIGNUP_REASONS;

// the API counts what a guest can do per day (per anonymous user, sliding 24h window) and
// answers 403 GUEST_QUOTA_EXCEEDED past it. this store shows what is left and opens the signup
// prompt. until the quota is loaded, or when it can't be, the API decides alone
export const useGuestQuotaStore = defineStore('guestQuota', () => {
  const quota = ref<ApiSchema<'GuestQuotaResponse'> | null>(null);
  clearFromStorage(LEGACY_STORAGE_KEY);

  // call once the session exists, and after each question or syllabus of a guest
  const refresh = async () => {
    if (!useAuthStore().isGuest) {
      quota.value = null;
      return;
    }
    try {
      quota.value = await getGuestQuota();
    } catch (error) {
      console.error('Failed to fetch the guest quota:', error);
    }
  };

  // undefined while unknown (not loaded, not a guest)
  const remaining = (feature: GuestQuotaFeature) => quota.value?.[feature]?.remaining;
  const limit = (feature: GuestQuotaFeature) => quota.value?.[feature]?.limit;

  // logged-in users and environments without auth have no limit
  const canUse = (feature: GuestQuotaFeature) =>
    !useAuthStore().isGuest || remaining(feature) !== 0;

  // true when the guest can go on, otherwise opens the signup prompt
  const checkQuota = (feature: GuestQuotaFeature) => {
    if (canUse(feature)) return true;
    useAuthStore().askToSignUp(SIGNUP_REASONS[feature]);
    return false;
  };

  // true when the API refused a guest past their quota: the signup prompt is then open
  const handleQuotaError = (error: unknown): boolean => {
    const detail = apiErrorDetail(error);
    if (detail?.code !== 'GUEST_QUOTA_EXCEEDED' || !isGuestQuotaFeature(detail.feature)) {
      return false;
    }
    const featureQuota = quota.value?.[detail.feature];
    if (featureQuota) featureQuota.remaining = 0;
    useAuthStore().askToSignUp(SIGNUP_REASONS[detail.feature]);
    return true;
  };

  const $reset = () => {
    quota.value = null;
  };

  return { quota, remaining, limit, canUse, checkQuota, refresh, handleQuotaError, $reset };
});
