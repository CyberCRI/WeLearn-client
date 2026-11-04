import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import SessionExpiredModal from '../SessionExpiredModal.vue';
import { useAuthStore } from '@/stores/auth';
import keycloak from '@/utils/keycloak';

vi.mock('@/utils/keycloak', () => ({ default: { login: vi.fn() } }));
vi.mock('@/utils/analytics', () => ({ track: vi.fn(), resetAnalytics: vi.fn() }));

describe('SessionExpiredModal', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('is hidden until the session has expired', async () => {
    const wrapper = mount(SessionExpiredModal);
    expect(wrapper.find('[data-testid="session-expired"]').exists()).toBe(false);

    useAuthStore().isSessionExpired = true;
    await flushPromises();

    expect(wrapper.text()).toContain('authentication.sessionExpired.title');
    expect(wrapper.text()).toContain('authentication.sessionExpired.message');
  });

  it('logs the user in again and brings them back to the same page', async () => {
    const authStore = useAuthStore();
    authStore.isSessionExpired = true;
    const wrapper = mount(SessionExpiredModal);

    await wrapper.get('[data-testid="session-expired-login"]').trigger('click');

    expect(keycloak.login).toHaveBeenCalledWith(
      expect.objectContaining({ redirectUri: window.location.href })
    );
    expect(authStore.isSessionExpired).toBe(false);
  });

  it('closes and lets the user go on without an account', async () => {
    const authStore = useAuthStore();
    authStore.isSessionExpired = true;
    const wrapper = mount(SessionExpiredModal);

    await wrapper.get('[data-testid="session-expired-close"]').trigger('click');

    expect(authStore.isSessionExpired).toBe(false);
    expect(keycloak.login).not.toHaveBeenCalled();
    expect(wrapper.find('[data-testid="session-expired"]').exists()).toBe(false);
  });
});
