import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import i18n from '@/localisation/i18n';
import ProfilePage from '../ProfilePage.vue';
import { useUserStore } from '@/stores/user';
import { useAccountAccessStore } from '@/stores/accountAccess';
import type { Environment } from '@/types';

const login = vi.fn();
const logout = vi.fn();
const isAuthenticated = ref(true);
const user = ref<{ email?: string } | null>({ email: 'jane.doe@example.org' });
const userName = ref('Jane Doe');

vi.mock('@/composables/useAuth', () => ({
  useAuth: () => ({ isAuthenticated, user, userName, login, logout })
}));

const env = vi.hoisted(() => ({ name: 'dev' as Environment }));

// the analytics feature flag is on in dev only
vi.mock('@/utils/env', () => ({
  ENVIRONMENTS: ['dev', 'staging', 'test', 'prod'],
  get ENVIRONMENT_NAME() {
    return env.name;
  }
}));

describe('ProfilePage', () => {
  beforeEach(() => {
    env.name = 'dev';
    setActivePinia(createPinia());
    vi.clearAllMocks();
    isAuthenticated.value = true;
    user.value = { email: 'jane.doe@example.org' };
  });

  it('shows the user name and email', () => {
    const wrapper = mount(ProfilePage, { global: { plugins: [i18n] } });
    expect(wrapper.get('[data-testid="profile-name"]').text()).toBe('Jane Doe');
    expect(wrapper.get('[data-testid="profile-email"]').text()).toBe('jane.doe@example.org');
  });

  it('shows how long a limited access lasts', () => {
    useAccountAccessStore().access = {
      limited: true,
      access_until: '2027-05-20',
      days_left: 184
    };
    const wrapper = mount(ProfilePage, { global: { plugins: [i18n] } });
    const access = wrapper.get('[data-testid="profile-access"]').text();
    expect(access).toContain('profile.accessUntil');
    expect(access).toContain('profile.accessHint');
  });

  it('words the days left in both languages', () => {
    const { t } = i18n.global;
    i18n.global.locale.value = 'en';
    expect(t('profile.accessUntil', { date: 'May 20, 2027', n: 184 }, 184)).toBe(
      'Until May 20, 2027 (184 days left)'
    );
    expect(t('profile.accessUntil', { date: 'Nov 18, 2026', n: 1 }, 1)).toBe(
      'Until Nov 18, 2026 (1 day left)'
    );
    i18n.global.locale.value = 'fr';
    expect(t('profile.accessUntil', { date: '20 mai 2027', n: 184 }, 184)).toBe(
      "Jusqu'au 20 mai 2027 (184 jours restants)"
    );
    expect(t('profile.accessUntil', { date: '18 nov. 2026', n: 1 }, 1)).toBe(
      "Jusqu'au 18 nov. 2026 (1 jour restant)"
    );
  });

  it('says the access is temporary when its end is not known yet', () => {
    useAccountAccessStore().access = { limited: true };
    const wrapper = mount(ProfilePage, { global: { plugins: [i18n] } });
    expect(wrapper.get('[data-testid="profile-access"]').text()).toContain(
      'profile.accessTemporary'
    );
  });

  it('shows no access line for an institution account', () => {
    useAccountAccessStore().access = { limited: false };
    const wrapper = mount(ProfilePage, { global: { plugins: [i18n] } });
    expect(wrapper.find('[data-testid="profile-access"]').exists()).toBe(false);
  });

  it('falls back when the email is missing', () => {
    user.value = null;
    const wrapper = mount(ProfilePage, { global: { plugins: [i18n] } });
    expect(wrapper.get('[data-testid="profile-email"]').text()).toBe('profile.notAvailable');
  });

  it('logs out on click', async () => {
    const wrapper = mount(ProfilePage, { global: { plugins: [i18n] } });
    await wrapper.get('[data-testid="profile-logout"]').trigger('click');
    expect(logout).toHaveBeenCalledOnce();
  });

  it('reopens the cookie consent banner', async () => {
    const userStore = useUserStore();
    userStore.analyticsConsent = { status: 'denied', date: '2026-01-01' };
    const wrapper = mount(ProfilePage, { global: { plugins: [i18n] } });
    await wrapper.get('[data-testid="profile-consent-settings"]').trigger('click');
    expect(userStore.analyticsConsent).toBeNull();
  });

  it('hides the cookie settings when the analytics feature is off', () => {
    env.name = 'prod';
    const wrapper = mount(ProfilePage, { global: { plugins: [i18n] } });
    expect(wrapper.find('[data-testid="profile-consent-settings"]').exists()).toBe(false);
  });

  it('offers a login button when not authenticated', async () => {
    isAuthenticated.value = false;
    const wrapper = mount(ProfilePage, { global: { plugins: [i18n] } });
    expect(wrapper.find('[data-testid="profile-logout"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="profile-consent-settings"]').exists()).toBe(false);
    await wrapper.get('[data-testid="profile-login"]').trigger('click');
    expect(login).toHaveBeenCalledOnce();
  });
});
