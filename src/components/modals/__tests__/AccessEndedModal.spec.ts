import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import AccessEndedModal from '../AccessEndedModal.vue';
import { useAuthStore } from '@/stores/auth';
import keycloak from '@/utils/keycloak';

vi.mock('@/utils/keycloak', () => ({ default: { login: vi.fn() } }));
vi.mock('@/utils/analytics', () => ({ track: vi.fn(), resetAnalytics: vi.fn() }));

describe('AccessEndedModal', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('is hidden until the access has ended', async () => {
    const wrapper = mount(AccessEndedModal);
    expect(wrapper.find('[data-testid="access-ended"]').exists()).toBe(false);

    useAuthStore().isAccessEnded = true;
    await flushPromises();

    expect(wrapper.text()).toContain('authentication.accessEnded.title');
    expect(wrapper.text()).toContain('authentication.accessEnded.message');
  });

  it('sends the user to the login page and brings them back to the same page', async () => {
    const authStore = useAuthStore();
    authStore.isAccessEnded = true;
    const wrapper = mount(AccessEndedModal);

    await wrapper.get('[data-testid="access-ended-login"]').trigger('click');

    expect(keycloak.login).toHaveBeenCalledWith(
      expect.objectContaining({ redirectUri: window.location.href })
    );
    expect(authStore.isAccessEnded).toBe(false);
  });

  it('closes and lets the user go on without an account', async () => {
    const authStore = useAuthStore();
    authStore.isAccessEnded = true;
    const wrapper = mount(AccessEndedModal);

    await wrapper.get('[data-testid="access-ended-close"]').trigger('click');

    expect(authStore.isAccessEnded).toBe(false);
    expect(keycloak.login).not.toHaveBeenCalled();
    expect(wrapper.find('[data-testid="access-ended"]').exists()).toBe(false);
  });
});
