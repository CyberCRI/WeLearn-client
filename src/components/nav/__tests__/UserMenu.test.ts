import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import router from '@/router';
import UserMenu from '../UserMenu.vue';
import { useAuthStore } from '@/stores/auth';

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
    expect(wrapper.find('[data-testid="user-menu-signup"]').exists()).toBe(false);
    await wrapper.get('[data-testid="user-menu-logout"]').trigger('click');
    expect(logout).toHaveBeenCalledOnce();
  });

  it('prompts a signup for bookmarks and offers signup and login when not authenticated', async () => {
    isAuthenticated.value = false;
    const wrapper = mount(UserMenu, mountOptions);
    const bookmarks = wrapper.get('[data-testid="user-menu-bookmarks"]');
    expect(bookmarks.attributes('href')).toBeUndefined();
    await bookmarks.trigger('click');
    expect(useAuthStore().signupPromptReason).toBe('bookmarks');
    expect(wrapper.find('[data-testid="user-menu-profile"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="user-menu-logout"]').exists()).toBe(false);
    expect(wrapper.get('[data-testid="user-menu-signup"]').attributes('href')).toBe('/register');
    await wrapper.get('[data-testid="user-menu-login"]').trigger('click');
    expect(login).toHaveBeenCalledOnce();
  });
});

describe('UserMenu open state', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    isAuthenticated.value = true;
  });

  // attached to the document so the document listeners and focus work
  const mountAttached = () => mount(UserMenu, { ...mountOptions, attachTo: document.body });
  const isOpen = (wrapper: ReturnType<typeof mountAttached>) =>
    wrapper.get('[data-testid="user-menu"]').classes().includes('is-active');

  it('opens and closes from the trigger, and aria-expanded follows', async () => {
    const wrapper = mountAttached();
    const trigger = wrapper.get('[data-testid="user-menu-trigger"]');
    expect(wrapper.get('[data-testid="user-menu"]').classes()).not.toContain('is-hoverable');
    expect(isOpen(wrapper)).toBe(false);
    expect(trigger.attributes('aria-expanded')).toBe('false');

    await trigger.trigger('click');
    expect(isOpen(wrapper)).toBe(true);
    expect(trigger.attributes('aria-expanded')).toBe('true');

    await trigger.trigger('click');
    expect(isOpen(wrapper)).toBe(false);
    expect(trigger.attributes('aria-expanded')).toBe('false');
    wrapper.unmount();
  });

  it('opens from a focused native button, so the keyboard can open it', async () => {
    const wrapper = mountAttached();
    const trigger = wrapper.get<HTMLButtonElement>('[data-testid="user-menu-trigger"]');
    expect(trigger.element.tagName).toBe('BUTTON');
    expect(trigger.attributes('type')).toBe('button');
    // jsdom has no keyboard activation (a focused button turns Enter into a click), e2e covers it
    trigger.element.focus();
    expect(document.activeElement).toBe(trigger.element);
    trigger.element.click();
    await wrapper.vm.$nextTick();
    expect(isOpen(wrapper)).toBe(true);
    wrapper.unmount();
  });

  it.each(['user-menu-profile', 'user-menu-bookmarks', 'user-menu-logout'])(
    'closes after choosing %s',
    async (testId) => {
      const wrapper = mountAttached();
      await wrapper.get('[data-testid="user-menu-trigger"]').trigger('click');
      await wrapper.get(`[data-testid="${testId}"]`).trigger('click');
      expect(isOpen(wrapper)).toBe(false);
      wrapper.unmount();
    }
  );

  it.each(['user-menu-bookmarks', 'user-menu-signup', 'user-menu-login'])(
    'closes after choosing %s as a guest',
    async (testId) => {
      isAuthenticated.value = false;
      const wrapper = mountAttached();
      await wrapper.get('[data-testid="user-menu-trigger"]').trigger('click');
      await wrapper.get(`[data-testid="${testId}"]`).trigger('click');
      expect(isOpen(wrapper)).toBe(false);
      wrapper.unmount();
    }
  );

  it('closes on Escape and gives focus back to the trigger', async () => {
    const wrapper = mountAttached();
    const trigger = wrapper.get('[data-testid="user-menu-trigger"]');
    await trigger.trigger('click');
    (wrapper.get('[data-testid="user-menu-profile"]').element as HTMLElement).focus();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await wrapper.vm.$nextTick();

    expect(isOpen(wrapper)).toBe(false);
    expect(document.activeElement).toBe(trigger.element);
    wrapper.unmount();
  });

  it('ignores Escape when closed and other keys when open', async () => {
    const wrapper = mountAttached();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await wrapper.get('[data-testid="user-menu-trigger"]').trigger('click');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    await wrapper.vm.$nextTick();
    expect(isOpen(wrapper)).toBe(true);
    wrapper.unmount();
  });

  it('closes on a click outside, not on a click inside', async () => {
    const wrapper = mountAttached();
    await wrapper.get('[data-testid="user-menu-trigger"]').trigger('click');

    wrapper.get<HTMLElement>('.dropdown-content p').element.click();
    await wrapper.vm.$nextTick();
    expect(isOpen(wrapper)).toBe(true);

    document.body.click();
    await wrapper.vm.$nextTick();
    expect(isOpen(wrapper)).toBe(false);
    wrapper.unmount();
  });

  it('closes when focus leaves the menu, not when it moves inside', async () => {
    const outside = document.createElement('button');
    document.body.appendChild(outside);
    const wrapper = mountAttached();
    const trigger = wrapper.get('[data-testid="user-menu-trigger"]');
    await trigger.trigger('click');

    await trigger.trigger('focusout', {
      relatedTarget: wrapper.get('[data-testid="user-menu-profile"]').element
    });
    expect(isOpen(wrapper)).toBe(true);

    await trigger.trigger('focusout', { relatedTarget: outside });
    expect(isOpen(wrapper)).toBe(false);
    wrapper.unmount();
    outside.remove();
  });
});
