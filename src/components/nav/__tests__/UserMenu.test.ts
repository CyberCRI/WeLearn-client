import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import router from '@/router';
import UserMenu from '../UserMenu.vue';

const login = vi.fn();
const logout = vi.fn();
const isAuthenticated = ref(true);
const userName = ref('Jane Doe');

vi.mock('@/composables/useAuth', () => ({
  useAuth: () => ({ isAuthenticated, userName, login, logout })
}));

const mountOptions = { global: { plugins: [router] } };

describe('UserMenu', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    isAuthenticated.value = true;
  });

  it('links to the profile and bookmarks and logs out when authenticated', async () => {
    const wrapper = mount(UserMenu, mountOptions);
    expect(wrapper.get('[data-testid="user-menu-profile"]').attributes('href')).toBe('/profile');
    expect(wrapper.get('[data-testid="user-menu-bookmarks"]').attributes('href')).toBe(
      '/bookmarks'
    );
    expect(wrapper.find('[data-testid="user-menu-login"]').exists()).toBe(false);
    await wrapper.get('[data-testid="user-menu-logout"]').trigger('click');
    expect(logout).toHaveBeenCalledOnce();
  });

  it('disables bookmarks and offers login when not authenticated', async () => {
    isAuthenticated.value = false;
    const wrapper = mount(UserMenu, mountOptions);
    const bookmarks = wrapper.get('[data-testid="user-menu-bookmarks"]');
    expect(bookmarks.attributes('aria-disabled')).toBe('true');
    expect(bookmarks.attributes('href')).toBeUndefined();
    expect(wrapper.find('[data-testid="user-menu-profile"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="user-menu-logout"]').exists()).toBe(false);
    await wrapper.get('[data-testid="user-menu-login"]').trigger('click');
    expect(login).toHaveBeenCalledOnce();
  });
});
