import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { flushPromises } from '@vue/test-utils';
import router from '../index';
import keycloak from '@/utils/keycloak';
import { useAuthStore } from '@/stores/auth';

const env = vi.hoisted(() => ({ isDev: false }));

vi.mock('@/utils/env', () => ({
  get IS_DEV_ENVIRONMENT() {
    return env.isDev;
  }
}));

vi.mock('@/utils/keycloak', () => ({
  default: { login: vi.fn(), logout: vi.fn(), updateToken: vi.fn() }
}));

describe('router', () => {
  // the router is a singleton: start each test from a neutral page, so that navigating to the
  // tested route really runs the guards
  beforeEach(async () => {
    env.isDev = false;
    setActivePinia(createPinia());
    await router.push('/about');
    // fresh auth store, so shouldAuthenticate is computed with the env of the test
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('redirects / to the chat', async () => {
    await router.push('/');

    expect(router.currentRoute.value.name).toBe('q-and-a');
  });

  it('shows the not found page for an unknown path', async () => {
    await router.push('/nowhere');

    expect(router.currentRoute.value.name).toBe('NotFound');
  });

  it.each(['terms', 'profile', 'about'])('lazy loads the %s page', async (name) => {
    // the original record: vue-router swaps the loader for the component once it is resolved
    const route = router.options.routes.find((r) => r.name === name)!;
    const load = route.component as () => Promise<{ default: unknown }>;

    const module = await load();

    expect(module.default).toBeTruthy();
  });

  describe('outside dev (no auth)', () => {
    it('lets protected routes through without login', async () => {
      await router.push('/bookmarks');

      expect(router.currentRoute.value.name).toBe('bookmarks');
      expect(keycloak.login).not.toHaveBeenCalled();
    });

    it('sends the profile page back to the home page', async () => {
      await router.push('/profile');

      expect(router.currentRoute.value.name).toBe('q-and-a');
    });
  });

  describe('in dev (auth)', () => {
    beforeEach(() => {
      env.isDev = true;
    });

    it('asks a logged out user to log in on a protected route', async () => {
      const authStore = useAuthStore();
      authStore.isLoading = false;

      await router.push('/bookmarks');

      expect(router.currentRoute.value.name).not.toBe('bookmarks');
      expect(keycloak.login).toHaveBeenCalledWith(
        expect.objectContaining({ redirectUri: `${window.location.origin}/bookmarks` })
      );
    });

    it('lets a logged out user open a public route', async () => {
      useAuthStore().isLoading = false;

      await router.push('/register');

      expect(router.currentRoute.value.name).toBe('register');
      expect(keycloak.login).not.toHaveBeenCalled();
    });

    it('lets a logged in user through and opens the profile page', async () => {
      const authStore = useAuthStore();
      authStore.isLoading = false;
      authStore.isAuthenticated = true;

      await router.push('/profile');

      expect(router.currentRoute.value.name).toBe('profile');
      expect(keycloak.login).not.toHaveBeenCalled();
    });

    it('waits for keycloak to finish loading before deciding', async () => {
      const authStore = useAuthStore();
      authStore.isLoading = true;

      const navigation = router.push('/bookmarks');
      // let the guard start and subscribe to the store
      await flushPromises();
      expect(router.currentRoute.value.name).toBe('about');
      expect(keycloak.login).not.toHaveBeenCalled();

      authStore.isAuthenticated = true;
      authStore.isLoading = false;
      await navigation;

      expect(router.currentRoute.value.name).toBe('bookmarks');
    });
  });

  // last: the carried-over query sticks to every later navigation
  describe('query params', () => {
    it('carries the previous query over when the next route has none', async () => {
      await router.push('/search?lang=en');
      await router.push('/bookmarks');

      expect(router.currentRoute.value.name).toBe('bookmarks');
      expect(router.currentRoute.value.query).toEqual({ lang: 'en' });
    });

    it('keeps the query of the next route when it has one', async () => {
      await router.push('/search?lang=en');
      await router.push('/bookmarks?lang=fr');

      expect(router.currentRoute.value.query).toEqual({ lang: 'fr' });
    });
  });
});
