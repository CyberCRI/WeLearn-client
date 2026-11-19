import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import i18n from '@/localisation/i18n';
import { useAuthStore } from '@/stores/auth';
import { getAccountAccess } from '@/utils/fetch';
import { getFromStorage, saveToStorage } from '@/utils/storage';
import type { ApiSchema } from '@/types/api';

// the accounts (keycloak ids) already told their access is limited, in this browser
const NOTICE_SEEN_KEY = 'limitedAccessNoticeSeen';

// a Google or email login, not an institution one, gets 6 months of access. the API says until
// when, and answers 403 ACCESS_EXPIRED once it has ended (handled in utils/api.ts)
export const useAccountAccessStore = defineStore('accountAccess', () => {
  const access = ref<ApiSchema<'AccountAccessResponse'> | null>(null);
  const isNoticeOpen = ref(false);

  const isLimited = computed(() => access.value?.limited === true);

  // the date alone, read as UTC so a timezone west of UTC does not show the day before
  const accessUntilLabel = computed(() => {
    const day = access.value?.access_until;
    if (!day) return null;
    return new Date(`${day}T00:00:00Z`).toLocaleDateString(i18n.global.locale.value, {
      dateStyle: 'long',
      timeZone: 'UTC'
    });
  });

  const daysLeft = computed(() => access.value?.days_left ?? null);

  const seenAccounts = (): string[] => {
    const seen = getFromStorage(NOTICE_SEEN_KEY);
    return Array.isArray(seen) ? seen : [];
  };

  const accountId = () => useAuthStore().tokenParsed?.sub;

  // call once logged in
  const refresh = async () => {
    if (!useAuthStore().isAuthenticated) {
      access.value = null;
      return;
    }
    try {
      access.value = await getAccountAccess();
    } catch (error) {
      // a 403 ACCESS_EXPIRED already logs the user out
      console.error('Failed to fetch the account access:', error);
      return;
    }
    const id = accountId();
    if (isLimited.value && id && !seenAccounts().includes(id)) isNoticeOpen.value = true;
  };

  const closeNotice = () => {
    isNoticeOpen.value = false;
    const id = accountId();
    if (id && !seenAccounts().includes(id)) saveToStorage(NOTICE_SEEN_KEY, [...seenAccounts(), id]);
  };

  return { access, isLimited, accessUntilLabel, daysLeft, isNoticeOpen, refresh, closeNotice };
});
