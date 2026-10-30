import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useAuthStore } from '../auth';
import i18n from '@/localisation/i18n';
import { basePostAxios } from '@/utils/fetch';

const { env, keycloak } = vi.hoisted(() => ({
  env: { isDev: true },
  keycloak: {
    init: vi.fn(),
    loadUserProfile: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    updateToken: vi.fn(),
    token: undefined as string | undefined,
    tokenParsed: undefined as Record<string, unknown> | undefined,
    idTokenParsed: undefined as Record<string, unknown> | undefined,
    realmAccess: undefined as { roles: string[] } | undefined,
    authServerUrl: 'https://kc.test',
    realm: 'welearn'
  }
}));

vi.mock('@/utils/env', () => ({
  get IS_DEV_ENVIRONMENT() {
    return env.isDev;
  }
}));

vi.mock('@/utils/keycloak', () => ({ default: keycloak }));

const { syncUserId } = vi.hoisted(() => ({ syncUserId: vi.fn() }));

vi.mock('@/utils/fetch', () => ({ basePostAxios: vi.fn() }));
vi.mock('@/stores/user', () => ({ useUserStore: () => ({ syncUserId }) }));

const profile = { firstName: 'Ada', lastName: 'Lovelace', attributes: { team: ['lpi'] } };

const authenticate = () => {
  keycloak.init.mockResolvedValue(true);
  keycloak.loadUserProfile.mockResolvedValue(profile);
  keycloak.token = 'token-1';
  keycloak.tokenParsed = { preferred_username: 'ada' };
  keycloak.realmAccess = { roles: ['teacher'] };
};

describe('auth store', () => {
  const initialLocale = i18n.global.locale.value;

  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
    env.isDev = true;
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
    it('skips keycloak outside dev', async () => {
      env.isDev = false;
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
      expect(store.user).toEqual(profile);
      expect(store.userName).toBe('Ada Lovelace');
      expect(store.isLoading).toBe(false);
    });

    it('applies the keycloak locale', async () => {
      authenticate();
      i18n.global.locale.value = 'fr';
      keycloak.idTokenParsed = { locale: 'en' };

      await useAuthStore().init();

      expect(i18n.global.locale.value).toBe('en');
      expect(localStorage.getItem('language')).toBe('en');
    });

    it('ignores an unsupported keycloak locale', async () => {
      authenticate();
      i18n.global.locale.value = 'fr';
      keycloak.idTokenParsed = { locale: 'de' };

      await useAuthStore().init();

      expect(i18n.global.locale.value).toBe('fr');
      expect(localStorage.getItem('language')).toBeNull();
    });

    it('falls back to the username when the profile cannot load', async () => {
      authenticate();
      keycloak.realmAccess = undefined;
      keycloak.loadUserProfile.mockRejectedValue(new Error('no profile'));
      const store = useAuthStore();

      expect(await store.init()).toBe(true);

      expect(store.user).toBeNull();
      expect(store.roles).toEqual([]);
      expect(store.userName).toBe('ada');
      expect(console.warn).toHaveBeenCalled();
    });

    it('stays anonymous when keycloak says not authenticated', async () => {
      keycloak.init.mockResolvedValue(false);
      const store = useAuthStore();

      expect(await store.init()).toBe(false);

      expect(store.isAuthenticated).toBe(false);
      expect(store.userName).toBe('Unknown');
      expect(keycloak.loadUserProfile).not.toHaveBeenCalled();
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

  describe('token refresh', () => {
    it('updates the token every 30 seconds', async () => {
      authenticate();
      const store = useAuthStore();
      await store.init();
      keycloak.updateToken.mockResolvedValue(true);
      keycloak.token = 'token-2';
      keycloak.tokenParsed = { preferred_username: 'ada2' };

      await vi.advanceTimersByTimeAsync(30000);

      expect(keycloak.updateToken).toHaveBeenCalledWith(60);
      expect(store.token).toBe('token-2');
      expect(store.tokenParsed).toEqual({ preferred_username: 'ada2' });
    });

    it('keeps the token when it was not refreshed', async () => {
      authenticate();
      const store = useAuthStore();
      await store.init();
      keycloak.updateToken.mockResolvedValue(false);
      keycloak.token = 'token-2';

      await vi.advanceTimersByTimeAsync(30000);

      expect(store.token).toBe('token-1');
    });

    it('logs out when the refresh fails', async () => {
      authenticate();
      await useAuthStore().init();
      keycloak.updateToken.mockRejectedValue(new Error('expired'));

      await vi.advanceTimersByTimeAsync(30000);

      expect(keycloak.logout).toHaveBeenCalledWith({ redirectUri: window.location.origin });
    });
  });

  describe('updateLocale', () => {
    it('does nothing for an anonymous user', async () => {
      const fetchMock = vi.fn();
      vi.stubGlobal('fetch', fetchMock);

      await useAuthStore().updateLocale('en');

      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('saves the locale on the keycloak user', async () => {
      const fetchMock = vi.fn().mockResolvedValue({ ok: true });
      vi.stubGlobal('fetch', fetchMock);
      authenticate();
      const store = useAuthStore();
      await store.init();

      await store.updateLocale('en');

      const [url, options] = fetchMock.mock.calls[0];
      expect(url).toBe('https://kc.test/realms/welearn/account');
      expect(options.method).toBe('POST');
      expect(options.headers.Authorization).toBe('Bearer token-1');
      expect(JSON.parse(options.body).attributes).toEqual({ team: ['lpi'], locale: ['en'] });
      expect(store.user?.attributes).toEqual({ team: ['lpi'], locale: ['en'] });
    });

    it('keeps the user unchanged when keycloak refuses', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 403 }));
      authenticate();
      const store = useAuthStore();
      await store.init();

      await store.updateLocale('en');

      expect(store.user?.attributes).toEqual({ team: ['lpi'] });
      expect(console.warn).toHaveBeenCalledWith(
        'Could not save the language on the keycloak user:',
        expect.any(Error)
      );
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

      store.login();
      expect(keycloak.login).toHaveBeenLastCalledWith({
        redirectUri: window.location.origin,
        locale: 'en'
      });
    });

    it('logs out back to the app', () => {
      useAuthStore().logout();

      expect(keycloak.logout).toHaveBeenCalledWith({ redirectUri: window.location.origin });
    });
  });

  describe('register', () => {
    const data = { firstName: ' Ada ', lastName: 'Lovelace', email: ' ada@test.org ' };
    type PostResponse = Awaited<ReturnType<typeof basePostAxios>>;
    const apiError = (status: number, code?: string) =>
      Object.assign(new Error('Request failed'), {
        response: { status, data: { detail: code ? { message: 'm', code } : 'd' } }
      });

    it('signs up with trimmed values and syncs the new user id', async () => {
      vi.mocked(basePostAxios).mockResolvedValue({
        data: { message: 'user created', user_id: 'user-1' }
      } as PostResponse);
      const store = useAuthStore();

      await store.register(data);

      expect(basePostAxios).toHaveBeenCalledWith('/user/signup', {
        email: 'ada@test.org',
        first_name: 'Ada',
        last_name: 'Lovelace'
      });
      expect(syncUserId).toHaveBeenCalledWith('user-1');
      expect(store.hasRegistered).toBe(true);
      expect(store.registerErrorCode).toBeNull();
      expect(store.isRegistering).toBe(false);
    });

    it.each([
      [409, 'EMAIL_ALREADY_EXISTS'],
      [503, 'KEYCLOAK_UNAVAILABLE'],
      [500, 'SIGNUP_DISABLED']
    ])('keeps the API error code of a %i', async (status, code) => {
      vi.mocked(basePostAxios).mockRejectedValue(apiError(status, code));
      const store = useAuthStore();

      await store.register(data);

      expect(store.registerErrorCode).toBe(code);
      expect(store.hasRegistered).toBe(false);
      expect(syncUserId).not.toHaveBeenCalled();
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
      resolve({ data: { message: 'ok', user_id: 'user-1' } } as PostResponse);
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
