import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useUserStore } from '../user';
import { basePostAxios } from '@/utils/fetch';

vi.mock('@/utils/fetch', () => ({
  basePostAxios: vi.fn()
}));

const storedOnboarding = () => JSON.parse(localStorage.getItem('onboardingState') || 'null');

describe('user store', () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.restoreAllMocks();
  });

  it('starts with nothing seen', () => {
    expect(useUserStore().onboardingState).toEqual({
      hasSeenWelcome: false,
      hasSeenMetricsData: false
    });
  });

  it('restores the onboarding state from storage', () => {
    localStorage.setItem(
      'onboardingState',
      JSON.stringify({ hasSeenWelcome: true, hasSeenMetricsData: false })
    );

    expect(useUserStore().onboardingState.hasSeenWelcome).toBe(true);
  });

  it('remembers that the welcome was seen', () => {
    const store = useUserStore();

    store.setHasSeenWelcome(true);

    expect(store.onboardingState.hasSeenWelcome).toBe(true);
    expect(storedOnboarding().hasSeenWelcome).toBe(true);
  });

  it('remembers the metrics step without sending anything when there is no data', async () => {
    const store = useUserStore();

    await store.userMetricsDataAction(true);

    expect(store.onboardingState.hasSeenMetricsData).toBe(true);
    expect(storedOnboarding().hasSeenMetricsData).toBe(true);
    expect(basePostAxios).not.toHaveBeenCalled();
  });

  it('sends and stores the user data when consent is given', async () => {
    const userData = { institution: 'LPI', role: 'teacher', consentRefused: false };

    await useUserStore().userMetricsDataAction(true, userData);

    expect(basePostAxios).toHaveBeenCalledWith('/user/institution-data', {
      role: 'teacher',
      institution: 'LPI'
    });
    expect(JSON.parse(localStorage.getItem('userMetricsData') || 'null')).toEqual(userData);
  });

  it('neither sends nor stores the user data when consent is refused', async () => {
    await useUserStore().userMetricsDataAction(true, {
      institution: 'LPI',
      role: 'teacher',
      consentRefused: true
    });

    expect(basePostAxios).not.toHaveBeenCalled();
    expect(localStorage.getItem('userMetricsData')).toBeNull();
  });

  it('logs a failed request without throwing', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(basePostAxios).mockRejectedValue(new Error('Network Error'));

    await expect(
      useUserStore().userMetricsDataAction(true, {
        institution: 'LPI',
        role: 'teacher',
        consentRefused: false
      })
    ).resolves.toBeUndefined();
    expect(console.error).toHaveBeenCalled();
  });

  describe('syncUserId', () => {
    const stored = (key: string) => JSON.parse(localStorage.getItem(key) || 'null');
    const USER_DATA_KEYS = [
      'chat',
      'chatThreadId',
      'searchInput',
      'searchResults',
      'courseMetadaRef',
      'userMetricsData'
    ];

    beforeEach(() => {
      USER_DATA_KEYS.forEach((key) => localStorage.setItem(key, JSON.stringify(`old-${key}`)));
      localStorage.setItem('language', 'fr');
      localStorage.setItem('onboardingState', JSON.stringify({ hasSeenWelcome: true }));
      localStorage.setItem('sessionId', JSON.stringify('session-1'));
    });

    it('saves the first user id without clearing anything', () => {
      useUserStore().syncUserId('user-1', 'session-1');

      expect(stored('userId')).toBe('user-1');
      USER_DATA_KEYS.forEach((key) => expect(stored(key)).toBe(`old-${key}`));
    });

    it('keeps the data of the same user and saves a new session', () => {
      localStorage.setItem('userId', JSON.stringify('user-1'));

      useUserStore().syncUserId('user-1', 'session-2');

      expect(stored('sessionId')).toBe('session-2');
      USER_DATA_KEYS.forEach((key) => expect(stored(key)).toBe(`old-${key}`));
    });

    it("clears the previous user's data but keeps the device preferences", () => {
      localStorage.setItem('userId', JSON.stringify('user-1'));

      useUserStore().syncUserId('user-2', 'session-2');

      expect(stored('userId')).toBe('user-2');
      USER_DATA_KEYS.forEach((key) => expect(localStorage.getItem(key)).toBeNull());
      expect(localStorage.getItem('language')).toBe('fr');
      expect(stored('onboardingState')).toEqual({ hasSeenWelcome: true });
    });

    it('replaces the session of the previous user', () => {
      localStorage.setItem('userId', JSON.stringify('user-1'));

      useUserStore().syncUserId('user-2', 'session-2');

      expect(stored('sessionId')).toBe('session-2');
    });

    it('drops the session of the previous user when none is given (sign-up)', () => {
      localStorage.setItem('userId', JSON.stringify('user-1'));

      useUserStore().syncUserId('user-2');

      expect(localStorage.getItem('sessionId')).toBeNull();
      expect(stored('userId')).toBe('user-2');
    });

    it('keeps the session when the user did not change and none is given', () => {
      localStorage.setItem('userId', JSON.stringify('user-1'));

      useUserStore().syncUserId('user-1');

      expect(stored('sessionId')).toBe('session-1');
    });
  });
});
