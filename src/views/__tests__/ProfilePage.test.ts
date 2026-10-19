import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import { mount } from '@vue/test-utils';
import i18n from '@/localisation/i18n';
import ProfilePage from '../ProfilePage.vue';

const login = vi.fn();
const logout = vi.fn();
const isAuthenticated = ref(true);
const user = ref<{ email?: string } | null>({ email: 'jane.doe@example.org' });
const userName = ref('Jane Doe');

vi.mock('@/composables/useAuth', () => ({
  useAuth: () => ({ isAuthenticated, user, userName, login, logout })
}));

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isAuthenticated.value = true;
    user.value = { email: 'jane.doe@example.org' };
  });

  it('shows the user name and email', () => {
    const wrapper = mount(ProfilePage, { global: { plugins: [i18n] } });
    expect(wrapper.get('[data-testid="profile-name"]').text()).toBe('Jane Doe');
    expect(wrapper.get('[data-testid="profile-email"]').text()).toBe('jane.doe@example.org');
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

  it('offers a login button when not authenticated', async () => {
    isAuthenticated.value = false;
    const wrapper = mount(ProfilePage, { global: { plugins: [i18n] } });
    expect(wrapper.find('[data-testid="profile-logout"]').exists()).toBe(false);
    await wrapper.get('[data-testid="profile-login"]').trigger('click');
    expect(login).toHaveBeenCalledOnce();
  });
});
