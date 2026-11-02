import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import FooterComponent from '../FooterComponent.vue';
import { useUserStore } from '@/stores/user';

const isAuthenticated = ref(false);

vi.mock('@/composables/useAuth', () => ({
  useAuth: () => ({ isAuthenticated })
}));

const mountFooter = () => mount(FooterComponent, { global: { stubs: { 'router-link': true } } });

describe('FooterComponent', () => {
  beforeEach(() => {
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
});
