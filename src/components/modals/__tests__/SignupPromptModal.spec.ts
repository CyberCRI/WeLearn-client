import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import SignupPromptModal from '../SignupPromptModal.vue';
import { useAuthStore } from '@/stores/auth';
import keycloak from '@/utils/keycloak';
import { track } from '@/utils/analytics';

const push = vi.fn();
vi.mock('vue-router', () => ({ useRouter: () => ({ push }) }));
vi.mock('@/utils/keycloak', () => ({ default: { login: vi.fn() } }));
vi.mock('@/utils/analytics', () => ({ track: vi.fn(), resetAnalytics: vi.fn() }));

describe('SignupPromptModal', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('is hidden until a guest needs an account', async () => {
    const wrapper = mount(SignupPromptModal);
    expect(wrapper.find('[data-testid="signup-prompt-register"]').exists()).toBe(false);

    useAuthStore().askToSignUp('bookmark');
    await flushPromises();

    expect(wrapper.text()).toContain('authentication.signupPrompt.title');
    expect(wrapper.text()).toContain('authentication.signupPrompt.reasons.bookmark');
  });

  it('sends the guest to the register page', async () => {
    const authStore = useAuthStore();
    authStore.askToSignUp('download');
    const wrapper = mount(SignupPromptModal);

    await wrapper.get('[data-testid="signup-prompt-register"]').trigger('click');

    expect(push).toHaveBeenCalledWith('/register');
    expect(track).toHaveBeenCalledWith('Signup Prompt Clicked', {
      reason: 'download',
      action: 'register'
    });
    expect(authStore.signupPromptReason).toBeNull();
  });

  it('logs the guest in and brings them back to the same page', async () => {
    const authStore = useAuthStore();
    authStore.askToSignUp('bookmarks');
    const wrapper = mount(SignupPromptModal);

    await wrapper.get('[data-testid="signup-prompt-login"]').trigger('click');

    expect(keycloak.login).toHaveBeenCalledWith(
      expect.objectContaining({ redirectUri: window.location.href })
    );
    expect(track).toHaveBeenCalledWith('Signup Prompt Clicked', {
      reason: 'bookmarks',
      action: 'login'
    });
    expect(authStore.signupPromptReason).toBeNull();
  });

  it('closes without doing anything else', async () => {
    const authStore = useAuthStore();
    authStore.askToSignUp('bibliography');
    const wrapper = mount(SignupPromptModal);

    await wrapper.get('[data-testid="close"]').trigger('click');

    expect(authStore.signupPromptReason).toBeNull();
    expect(push).not.toHaveBeenCalled();
    expect(keycloak.login).not.toHaveBeenCalled();
  });
});
