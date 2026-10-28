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
});
