import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useGuestQuotaStore } from '../guestQuota';
import { StreamResponseError } from '@/utils/fetch';
import i18n from '@/localisation/i18n';

const auth = vi.hoisted(() => ({ isGuest: true, askToSignUp: vi.fn() }));
vi.mock('@/stores/auth', () => ({ useAuthStore: () => auth }));

const fetchMocks = vi.hoisted(() => ({ getGuestQuota: vi.fn() }));
vi.mock('@/utils/fetch', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/utils/fetch')>()),
  getGuestQuota: fetchMocks.getGuestQuota
}));

const apiQuota = (chat: number, syllabus: number) => ({
  limited: true,
  chat: { limit: 5, remaining: chat, resets_in: 3600 },
  syllabus: { limit: 1, remaining: syllabus, resets_in: 0 }
});

const quotaExceeded = (feature: string) => ({
  response: {
    status: 403,
    data: { detail: { code: 'GUEST_QUOTA_EXCEEDED', feature, retry_after: 120 } }
  }
});

describe('guest quota store', () => {
  beforeEach(() => {
    auth.isGuest = true;
    localStorage.clear();
    setActivePinia(createPinia());
    fetchMocks.getGuestQuota.mockResolvedValue(apiQuota(5, 1));
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('knows nothing before the quota is loaded, and lets the API decide', () => {
    const store = useGuestQuotaStore();

    expect(store.remaining('chat')).toBeUndefined();
    expect(store.canUse('chat')).toBe(true);
    expect(store.checkQuota('chat')).toBe(true);
  });

  it('reads what is left from the API', async () => {
    fetchMocks.getGuestQuota.mockResolvedValue(apiQuota(3, 0));
    const store = useGuestQuotaStore();

    await store.refresh();

    expect(store.remaining('chat')).toBe(3);
    expect(store.limit('chat')).toBe(5);
    expect(store.remaining('syllabus')).toBe(0);
    expect(store.canUse('chat')).toBe(true);
    expect(store.canUse('syllabus')).toBe(false);
  });

  it('does not ask the API for an account', async () => {
    auth.isGuest = false;
    const store = useGuestQuotaStore();

    await store.refresh();

    expect(fetchMocks.getGuestQuota).not.toHaveBeenCalled();
    expect(store.quota).toBeNull();
    expect(store.canUse('chat')).toBe(true);
  });

  it('forgets the quota of a guest who logged in', async () => {
    const store = useGuestQuotaStore();
    await store.refresh();

    auth.isGuest = false;
    await store.refresh();

    expect(store.quota).toBeNull();
  });

  it('keeps the last known quota when the API fails', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const store = useGuestQuotaStore();
    await store.refresh();
    fetchMocks.getGuestQuota.mockRejectedValue(new Error('down'));

    await store.refresh();

    expect(store.remaining('chat')).toBe(5);
    expect(consoleError).toHaveBeenCalled();
  });

  it('opens the signup prompt when nothing is left', async () => {
    fetchMocks.getGuestQuota.mockResolvedValue(apiQuota(0, 1));
    const store = useGuestQuotaStore();
    await store.refresh();

    expect(store.checkQuota('chat')).toBe(false);
    expect(auth.askToSignUp).toHaveBeenCalledWith('chatLimit');
    expect(store.checkQuota('syllabus')).toBe(true);
  });

  it('never limits an account', async () => {
    fetchMocks.getGuestQuota.mockResolvedValue(apiQuota(0, 0));
    const store = useGuestQuotaStore();
    await store.refresh();
    auth.isGuest = false;

    expect(store.checkQuota('chat')).toBe(true);
    expect(auth.askToSignUp).not.toHaveBeenCalled();
  });

  it('drops the browser counter of before the API quota', () => {
    localStorage.setItem('guestUsage', JSON.stringify({ chat: 5, syllabus: 1 }));

    useGuestQuotaStore();

    expect(localStorage.getItem('guestUsage')).toBeNull();
  });

  describe('handleQuotaError', () => {
    it('opens the prompt and marks the feature used up, from an axios error', async () => {
      const store = useGuestQuotaStore();
      await store.refresh();

      expect(store.handleQuotaError(quotaExceeded('syllabus'))).toBe(true);

      expect(auth.askToSignUp).toHaveBeenCalledWith('syllabusLimit');
      expect(store.remaining('syllabus')).toBe(0);
    });

    it.each([
      ['feedback', 'feedbackLimit'],
      ['files', 'filesLimit']
    ])('opens the prompt for the %s limit of the tutor', (feature, reason) => {
      const store = useGuestQuotaStore();

      expect(store.handleQuotaError(quotaExceeded(feature))).toBe(true);
      expect(auth.askToSignUp).toHaveBeenCalledWith(reason);
    });

    it('reads the error of a refused stream', () => {
      const store = useGuestQuotaStore();
      const error = new StreamResponseError(403, quotaExceeded('chat').response.data);

      expect(store.handleQuotaError(error)).toBe(true);
      expect(auth.askToSignUp).toHaveBeenCalledWith('chatLimit');
    });

    it.each([
      ['another error code', { response: { data: { detail: { code: 'THREAD_NOT_FOUND' } } } }],
      ['an unknown feature', quotaExceeded('search')],
      ['a plain text error', { response: { data: 'Bad gateway' } }],
      ['a network error', new Error('offline')]
    ])('ignores %s', (_, error) => {
      const store = useGuestQuotaStore();

      expect(store.handleQuotaError(error)).toBe(false);
      expect(auth.askToSignUp).not.toHaveBeenCalled();
    });
  });

  // the notice relies on the plural forms: none left | 1 left | n left
  describe('notice text', () => {
    const initialLocale = i18n.global.locale.value;
    afterEach(() => {
      i18n.global.locale.value = initialLocale;
    });

    it.each([
      [0, 'you have used your 5 free questions for today, come back tomorrow'],
      [1, '1 free question left out of 5 today'],
      [3, '3 free questions left out of 5 today']
    ])('shows %i chat questions left', (n, text) => {
      i18n.global.locale.value = 'en';

      expect(i18n.global.t('authentication.guestQuota.chat', { n, limit: 5 }, n)).toContain(text);
    });

    it.each([
      [0, 'vous avez utilisé votre syllabus gratuit du jour, revenez demain'],
      [1, 'vous pouvez créer 1 syllabus gratuit aujourd’hui']
    ])('shows %i syllabus left in french', (n, text) => {
      i18n.global.locale.value = 'fr';

      expect(i18n.global.t('authentication.guestQuota.syllabus', { n, limit: 1 }, n)).toContain(
        text
      );
    });
  });
});
