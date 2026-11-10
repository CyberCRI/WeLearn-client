import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createMemoryHistory, createRouter } from 'vue-router';
import WelcomeModal from '../WelcomeModal.vue';
import appRouter from '@/router';
import { useUserStore } from '@/stores/user';

vi.mock('@/utils/keycloak', () => ({
  default: { login: vi.fn(), logout: vi.fn(), updateToken: vi.fn() }
}));

// the app's own routes, so the test follows the meta set in router/index.ts
const mountOn = async (path: string) => {
  const router = createRouter({ history: createMemoryHistory(), routes: appRouter.options.routes });
  const wrapper = mount(WelcomeModal, {
    global: { plugins: [router], stubs: { LanguageSelector: true } }
  });
  await router.push(path);
  await flushPromises();
  return wrapper;
};

describe('WelcomeModal', () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  it('shows the form on a normal page with a fresh onboarding state', async () => {
    const wrapper = await mountOn('/q-and-a');

    expect(wrapper.find('[data-testid="welcome-action"]').exists()).toBe(true);
  });

  it('hides the form on the register page, without touching the onboarding flags', async () => {
    const wrapper = await mountOn('/register');

    expect(wrapper.find('[data-testid="welcome-action"]').exists()).toBe(false);
    expect(useUserStore().onboardingState).toEqual({
      hasSeenWelcome: false,
      hasSeenMetricsData: false
    });
  });

  it('shows the form once the user leaves the register page', async () => {
    const wrapper = await mountOn('/register');
    const router = wrapper.vm.$router;

    await router.push('/q-and-a');
    await flushPromises();

    expect(wrapper.find('[data-testid="welcome-action"]').exists()).toBe(true);
  });

  it('waits for the first navigation before showing the form', () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: appRouter.options.routes
    });
    const wrapper = mount(WelcomeModal, {
      global: { plugins: [router], stubs: { LanguageSelector: true } }
    });

    expect(wrapper.find('[data-testid="welcome-action"]').exists()).toBe(false);
  });

  it('stays hidden once the user has filled it in', async () => {
    const user = useUserStore();
    user.setHasSeenWelcome(true);
    user.onboardingState.hasSeenMetricsData = true;

    const wrapper = await mountOn('/q-and-a');

    expect(wrapper.find('[data-testid="welcome-action"]').exists()).toBe(false);
  });
});
