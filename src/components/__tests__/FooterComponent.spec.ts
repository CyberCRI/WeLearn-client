import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import FooterComponent from '../FooterComponent.vue';
import { useUserStore } from '@/stores/user';
import type { Environment } from '@/types';

const isAuthenticated = ref(false);

vi.mock('@/composables/useAuth', () => ({
  useAuth: () => ({ isAuthenticated })
}));

const env = vi.hoisted(() => ({ name: 'dev' as Environment }));

// the analytics feature flag is on in dev only
vi.mock('@/utils/env', () => ({
  ENVIRONMENTS: ['dev', 'staging', 'test', 'prod'],
  get ENVIRONMENT_NAME() {
    return env.name;
  }
}));

const mountFooter = () => mount(FooterComponent, { global: { stubs: { 'router-link': true } } });

describe('FooterComponent', () => {
  beforeEach(() => {
    env.name = 'dev';
    setActivePinia(createPinia());
    isAuthenticated.value = false;
  });

  it('reopens the cookie consent banner when logged out', async () => {
    const userStore = useUserStore();
    userStore.analyticsConsent = { status: 'denied', date: '2026-01-01' };
    const wrapper = mountFooter();
    await wrapper.get('[data-testid="consent-settings"]').trigger('click');
    expect(userStore.analyticsConsent).toBeNull();
  });

  it('hides the cookie settings when logged in, they live in the profile', () => {
    isAuthenticated.value = true;
    const wrapper = mountFooter();
    expect(wrapper.find('[data-testid="consent-settings"]').exists()).toBe(false);
  });

  it('hides the cookie settings when the analytics feature is off', () => {
    env.name = 'prod';
    const wrapper = mountFooter();
    expect(wrapper.find('[data-testid="consent-settings"]').exists()).toBe(false);
  });
});
