import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import i18n from '@/localisation/i18n';
import { useAuthStore } from '@/stores/auth';
import { getAccountAccess } from '@/utils/fetch';
import { getFromStorage, saveToStorage } from '@/utils/storage';
import { formatDay } from '@/utils/time';
import type { ApiSchema } from '@/types/api';

// the accounts already told their access is limited, in this browser: a sha-256 hash of their
// keycloak id rather than the id, and only the last few, as a browser is rarely shared by more
const NOTICE_SEEN_KEY = 'limitedAccessNoticeSeen';
const MAX_SEEN_ACCOUNTS = 5;
const HASH_PATTERN = /^[0-9a-f]{64}$/;

// null where the browser has no web crypto (a page not served over https): the notice is then
// shown, not remembered
export const hashAccountId = async (id: string): Promise<string | null> => {
  try {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(id));
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join(
      ''
    );
  } catch {
    return null;
  }
};

// the most recent last, each account once
const saveSeenAccounts = (hashes: string[]) => {
  const seen = hashes.filter((hash, i) => hashes.lastIndexOf(hash) === i).slice(-MAX_SEEN_ACCOUNTS);
  saveToStorage(NOTICE_SEEN_KEY, seen);
  return seen;
};

// older versions kept the ids themselves: hashed on read, and saved back that way
const readSeenAccounts = async (): Promise<string[]> => {
  const stored = getFromStorage(NOTICE_SEEN_KEY);
  if (!Array.isArray(stored)) return [];
  const entries = stored.filter((entry): entry is string => typeof entry === 'string');
  if (entries.every((entry) => HASH_PATTERN.test(entry))) return entries;
  const hashes = await Promise.all(
    entries.map((entry) => (HASH_PATTERN.test(entry) ? entry : hashAccountId(entry)))
  );
  return saveSeenAccounts(hashes.filter((hash): hash is string => !!hash));
};

// a Google or email login, not an institution one, gets 6 months of access. the API says until
// when, and answers 403 ACCESS_EXPIRED once it has ended (handled in utils/api.ts)
export const useAccountAccessStore = defineStore('accountAccess', () => {
  const access = ref<ApiSchema<'AccountAccessResponse'> | null>(null);
  const isNoticeOpen = ref(false);

  const isLimited = computed(() => access.value?.limited === true);

  const accessUntilLabel = computed(() => {
    const day = access.value?.access_until;
    return day ? formatDay(day, i18n.global.locale.value) : null;
  });

  const daysLeft = computed(() => access.value?.days_left ?? null);

  const accountHash = async () => {
    const id = useAuthStore().tokenParsed?.sub;
    return id ? hashAccountId(id) : null;
  };

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
    if (!isLimited.value || !useAuthStore().tokenParsed?.sub) return;
    const hash = await accountHash();
    if (!hash || !(await readSeenAccounts()).includes(hash)) isNoticeOpen.value = true;
  };

  const closeNotice = async () => {
    isNoticeOpen.value = false;
    const hash = await accountHash();
    if (hash) saveSeenAccounts([...(await readSeenAccounts()), hash]);
  };

  return { access, isLimited, accessUntilLabel, daysLeft, isNoticeOpen, refresh, closeNotice };
});
