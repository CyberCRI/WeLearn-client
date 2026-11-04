import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useAuthStore } from '../auth';
import i18n from '@/localisation/i18n';
import { basePostAxios } from '@/utils/fetch';
import { resetAnalytics, track } from '@/utils/analytics';
import type { Environment } from '@/types';

const { env, keycloak } = vi.hoisted(() => ({
  env: { name: 'dev' as Environment },
  keycloak: {
    init: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    updateToken: vi.fn(),
    authenticated: false as boolean,
    onAuthRefreshSuccess: undefined as (() => void) | undefined,
    onTokenExpired: undefined as (() => void) | undefined,
    token: undefined as string | undefined,
    tokenParsed: undefined as Record<string, unknown> | undefined,
    idTokenParsed: undefined as Record<string, unknown> | undefined,
    realmAccess: undefined as { roles: string[] } | undefined,
    authServerUrl: 'https://kc.test',
    realm: 'welearn'
  }
}));

vi.mock('@/utils/env', () => ({
  ENVIRONMENTS: ['dev', 'staging', 'test', 'prod'],
  get ENVIRONMENT_NAME() {
    return env.name;
  }
}));

vi.mock('@/utils/keycloak', () => ({ default: keycloak }));

vi.mock('@/utils/fetch', () => ({ basePostAxios: vi.fn() }));
vi.mock('@/utils/analytics', () => ({ resetAnalytics: vi.fn(), track: vi.fn() }));

const authenticate = () => {
  keycloak.init.mockResolvedValue(true);
  keycloak.authenticated = true;
  keycloak.token = 'token-1';
  keycloak.tokenParsed = { preferred_username: 'ada' };
  keycloak.idTokenParsed = {
    preferred_username: 'ada',
    given_name: 'Ada',
    family_name: 'Lovelace',
    email: 'ada@test.org'
  };
  keycloak.realmAccess = { roles: ['teacher'] };
};

describe('auth store', () => {
  const initialLocale = i18n.global.locale.value;

  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
    env.name = 'dev';
    keycloak.authenticated = false;
    keycloak.onAuthRefreshSuccess = undefined;
    keycloak.onTokenExpired = undefined;
    keycloak.token = undefined;
    keycloak.tokenParsed = undefined;
    keycloak.idTokenParsed = undefined;
    keycloak.realmAccess = undefined;
    vi.useFakeTimers();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.resetAllMocks();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    i18n.global.locale.value = initialLocale;
  });

  describe('init', () => {
    it('skips keycloak outside dev and staging', async () => {
      env.name = 'prod';
      const store = useAuthStore();

      expect(store.shouldAuthenticate).toBe(false);
      expect(await store.init()).toBe(false);
      expect(keycloak.init).not.toHaveBeenCalled();
      expect(store.isLoading).toBe(false);
    });

    it('stores the session of an authenticated user', async () => {
      authenticate();
      const store = useAuthStore();

      expect(store.shouldAuthenticate).toBe(true);
      expect(await store.init()).toBe(true);

      expect(keycloak.init).toHaveBeenCalledWith({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        checkLoginIframe: false
      });
      expect(store.isAuthenticated).toBe(true);
      expect(store.token).toBe('token-1');
      expect(store.roles).toEqual(['teacher']);
      expect(store.user).toEqual({
        username: 'ada',
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@test.org'
      });
      expect(store.userName).toBe('Ada Lovelace');
      expect(store.isLoading).toBe(false);
    });

    it('applies the keycloak locale when coming back from a login', async () => {
      authenticate();
      i18n.global.locale.value = 'fr';
      keycloak.idTokenParsed = { locale: 'en' };
      localStorage.setItem('loginPending', 'true');

      await useAuthStore().init();

      expect(i18n.global.locale.value).toBe('en');
      expect(localStorage.getItem('language')).toBe('en');
      expect(localStorage.getItem('loginPending')).toBeNull();
      expect(track).toHaveBeenCalledWith('Logged In', {});
    });

    it('keeps the app language on a reload', async () => {
      authenticate();
      i18n.global.locale.value = 'fr';
      keycloak.idTokenParsed = { locale: 'en' };

      await useAuthStore().init();

      expect(i18n.global.locale.value).toBe('fr');
      expect(localStorage.getItem('language')).toBeNull();
    });

    it('ignores an unsupported keycloak locale', async () => {
      authenticate();
      i18n.global.locale.value = 'fr';
      localStorage.setItem('loginPending', 'true');
      keycloak.idTokenParsed = { locale: 'de' };

      await useAuthStore().init();

      expect(i18n.global.locale.value).toBe('fr');
      expect(localStorage.getItem('language')).toBeNull();
    });

    it('falls back to the username when the token has no name', async () => {
      authenticate();
      keycloak.realmAccess = undefined;
      keycloak.idTokenParsed = { preferred_username: 'ada' };
      const store = useAuthStore();

      expect(await store.init()).toBe(true);

      expect(store.roles).toEqual([]);
      expect(store.userName).toBe('ada');
    });

    it('shows the first name alone when there is no last name', async () => {
      authenticate();
      keycloak.idTokenParsed = { given_name: 'Ada' };
      const store = useAuthStore();

      await store.init();

      expect(store.userName).toBe('Ada');
    });

    it('stays anonymous when keycloak says not authenticated', async () => {
      keycloak.init.mockResolvedValue(false);
      const store = useAuthStore();

      expect(await store.init()).toBe(false);

      expect(store.isAuthenticated).toBe(false);
      expect(store.userName).toBe('Unknown');
      expect(store.user).toBeNull();
      expect(store.isLoading).toBe(false);
    });

    it('returns false when keycloak fails', async () => {
      keycloak.init.mockRejectedValue(new Error('down'));
      const store = useAuthStore();

      expect(await store.init()).toBe(false);

      expect(store.isAuthenticated).toBe(false);
      expect(store.isLoading).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('guest', () => {
    it('is a guest when auth is on and the user is not logged in', () => {
      const store = useAuthStore();

      expect(store.isGuest).toBe(true);

      store.isAuthenticated = true;
      expect(store.isGuest).toBe(false);
    });

    it('is never a guest where auth is off', () => {
      env.name = 'prod';

      expect(useAuthStore().isGuest).toBe(false);
    });

    it('opens and closes the signup prompt, and tracks it', () => {
      const store = useAuthStore();

      store.askToSignUp('download');

      expect(store.signupPromptReason).toBe('download');
      expect(track).toHaveBeenCalledWith('Signup Prompt Shown', { reason: 'download' });

      store.closeSignupPrompt();
      expect(store.signupPromptReason).toBeNull();
    });
  });

  describe('session expired', () => {
    it('tells the user once they are back from a forced logout', async () => {
      localStorage.setItem('sessionExpired', 'true');
      keycloak.init.mockResolvedValue(false);
      const store = useAuthStore();

      await store.init();

      expect(store.isSessionExpired).toBe(true);
      expect(localStorage.getItem('sessionExpired')).toBeNull();

      store.closeSessionExpired();
      expect(store.isSessionExpired).toBe(false);
    });

    it('says nothing when the user is logged in again', async () => {
      localStorage.setItem('sessionExpired', 'true');
      authenticate();
      const store = useAuthStore();

      await store.init();

      expect(store.isSessionExpired).toBe(false);
      expect(localStorage.getItem('sessionExpired')).toBeNull();
    });

    it('says nothing on a normal visit', async () => {
      keycloak.init.mockResolvedValue(false);
      const store = useAuthStore();

      await store.init();

      expect(store.isSessionExpired).toBe(false);
    });

    it('flags the logout when an expired token cannot be refreshed', async () => {
      authenticate();
      await useAuthStore().init();
      keycloak.updateToken.mockRejectedValue(new Error('expired'));

      keycloak.onTokenExpired?.();
      await vi.runAllTimersAsync();

      expect(localStorage.getItem('sessionExpired')).toBe('true');
    });
  });

  describe('token refresh', () => {
    it('sets the keycloak handlers before init, and starts no timer', async () => {
      authenticate();
      keycloak.init.mockImplementation(async () => {
        expect(keycloak.onAuthRefreshSuccess).toBeTypeOf('function');
        expect(keycloak.onTokenExpired).toBeTypeOf('function');
        return true;
      });

      await useAuthStore().init();

      expect(vi.getTimerCount()).toBe(0);
    });

    it('syncs the token after any keycloak refresh', async () => {
      authenticate();
      const store = useAuthStore();
      await store.init();
      keycloak.token = 'token-2';
      keycloak.tokenParsed = { preferred_username: 'ada2' };

      keycloak.onAuthRefreshSuccess?.();

      expect(store.token).toBe('token-2');
      expect(store.tokenParsed).toEqual({ preferred_username: 'ada2' });
    });

    it('refreshes the token when it expires', async () => {
      authenticate();
      await useAuthStore().init();
      keycloak.updateToken.mockResolvedValue(true);

      keycloak.onTokenExpired?.();
      await vi.runAllTimersAsync();

      expect(keycloak.updateToken).toHaveBeenCalledWith(60);
      expect(keycloak.logout).not.toHaveBeenCalled();
    });

    it('logs out when the refresh of an expired token fails', async () => {
      authenticate();
      await useAuthStore().init();
      keycloak.updateToken.mockRejectedValue(new Error('expired'));

      keycloak.onTokenExpired?.();
      await vi.runAllTimersAsync();

      expect(keycloak.logout).toHaveBeenCalledWith({ redirectUri: window.location.origin });
    });
  });

  describe('login and logout', () => {
    it('logs in with the app locale and the given redirect', () => {
      i18n.global.locale.value = 'en';
      const store = useAuthStore();

      store.login('https://app.test/tutor');
      expect(keycloak.login).toHaveBeenLastCalledWith({
        redirectUri: 'https://app.test/tutor',
        locale: 'en'
      });
      expect(localStorage.getItem('loginPending')).toBe('true');
      expect(track).toHaveBeenCalledWith('Login Clicked', {});

      store.login();
      expect(keycloak.login).toHaveBeenLastCalledWith({
        redirectUri: window.location.origin,
        locale: 'en'
      });
    });

    it('logs out back to the app', () => {
      keycloak.authenticated = true;
      useAuthStore().logout();

      expect(keycloak.logout).toHaveBeenCalledWith({ redirectUri: window.location.origin });
      expect(track).toHaveBeenCalledWith('Logged Out', {});
      expect(resetAnalytics).toHaveBeenCalled();
    });

    it('logs out only once when called several times', async () => {
      keycloak.authenticated = true;
      const store = useAuthStore();

      await Promise.all([store.logout(), store.logout(), store.logout()]);

      expect(keycloak.logout).toHaveBeenCalledTimes(1);
      expect(track).toHaveBeenCalledTimes(1);
    });

    it('does nothing for a guest or when keycloak was never initialised', async () => {
      await useAuthStore().logout();

      expect(keycloak.logout).not.toHaveBeenCalled();
      expect(track).not.toHaveBeenCalled();
      expect(resetAnalytics).not.toHaveBeenCalled();
    });

    it('remembers a forced logout across the keycloak redirect', async () => {
      keycloak.authenticated = true;

      await useAuthStore().logout({ isExpired: true });

      expect(localStorage.getItem('sessionExpired')).toBe('true');
    });

    it('does not flag a logout asked by the user', async () => {
      keycloak.authenticated = true;

      await useAuthStore().logout();

      expect(localStorage.getItem('sessionExpired')).toBeNull();
    });

    it('drops the flag when the forced logout fails', async () => {
      keycloak.authenticated = true;
      keycloak.logout.mockRejectedValueOnce(new Error('network'));

      await useAuthStore().logout({ isExpired: true });

      expect(localStorage.getItem('sessionExpired')).toBeNull();
    });

    it('allows a new attempt when the keycloak logout fails', async () => {
      keycloak.authenticated = true;
      keycloak.logout.mockRejectedValueOnce(new Error('network'));
      const store = useAuthStore();

      await store.logout();
      await store.logout();

      expect(keycloak.logout).toHaveBeenCalledTimes(2);
      expect(console.error).toHaveBeenCalledWith('Keycloak logout failed:', expect.any(Error));
    });
  });

  describe('register', () => {
    const data = { firstName: ' Ada ', lastName: 'Lovelace', email: ' ada@test.org ' };
    type PostResponse = Awaited<ReturnType<typeof basePostAxios>>;
    const apiError = (status: number, code?: string) =>
      Object.assign(new Error('Request failed'), {
        response: { status, data: { detail: code ? { message: 'm', code } : 'd' } }
      });

    it('signs up with trimmed values', async () => {
      // same neutral answer whether or not the email already has an account
      vi.mocked(basePostAxios).mockResolvedValue({
        data: { message: 'If no account exists yet for this email, ...' }
      } as PostResponse);
      const store = useAuthStore();

      await store.register(data);

      expect(basePostAxios).toHaveBeenCalledWith('/user/signup', {
        email: 'ada@test.org',
        first_name: 'Ada',
        last_name: 'Lovelace'
      });
      expect(store.hasRegistered).toBe(true);
      expect(store.registerErrorCode).toBeNull();
      expect(store.isRegistering).toBe(false);
    });

    it.each([
      [429, 'RATE_LIMITED'],
      [503, 'KEYCLOAK_UNAVAILABLE'],
      [500, 'SIGNUP_DISABLED']
    ])('keeps the API error code of a %i', async (status, code) => {
      vi.mocked(basePostAxios).mockRejectedValue(apiError(status, code));
      const store = useAuthStore();

      await store.register(data);

      expect(store.registerErrorCode).toBe(code);
      expect(store.hasRegistered).toBe(false);
    });

    it('maps a validation error to INVALID_EMAIL', async () => {
      vi.mocked(basePostAxios).mockRejectedValue(apiError(422));
      const store = useAuthStore();

      await store.register(data);

      expect(store.registerErrorCode).toBe('INVALID_EMAIL');
    });

    it('maps a network error to UNKNOWN', async () => {
      vi.mocked(basePostAxios).mockRejectedValue(new Error('Network Error'));
      const store = useAuthStore();

      await store.register(data);

      expect(store.registerErrorCode).toBe('UNKNOWN');
    });

    it('ignores a second submit while the first is running', async () => {
      let resolve!: (value: PostResponse) => void;
      vi.mocked(basePostAxios).mockReturnValue(new Promise((r) => (resolve = r)));
      const store = useAuthStore();

      const first = store.register(data);
      await store.register(data);
      expect(store.isRegistering).toBe(true);
      resolve({ data: { message: 'ok' } } as PostResponse);
      await first;

      expect(basePostAxios).toHaveBeenCalledOnce();
    });

    it('resets the register state', async () => {
      vi.mocked(basePostAxios).mockRejectedValue(new Error('Network Error'));
      const store = useAuthStore();
      await store.register(data);

      store.resetRegister();

      expect(store.registerErrorCode).toBeNull();
      expect(store.hasRegistered).toBe(false);
    });
  });
});
