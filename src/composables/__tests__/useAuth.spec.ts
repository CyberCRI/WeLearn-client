import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useAuth } from '../useAuth';
import { useAuthStore } from '@/stores/auth';
import keycloak from '@/utils/keycloak';

vi.mock('@/utils/keycloak', () => ({
  default: {
    token: undefined as string | undefined,
    updateToken: vi.fn(),
    login: vi.fn(),
    logout: vi.fn()
  }
}));

describe('useAuth', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    keycloak.token = 'token-1';
    vi.mocked(keycloak.updateToken).mockResolvedValue(true);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it('exposes the auth store state as refs', () => {
    const store = useAuthStore();
    const { isAuthenticated, isLoading, userName } = useAuth();

    store.isAuthenticated = true;
    store.isLoading = false;
    store.user = { firstName: 'Ada', lastName: 'Lovelace' };

    expect(isAuthenticated.value).toBe(true);
    expect(isLoading.value).toBe(false);
    expect(userName.value).toBe('Ada Lovelace');
  });

  it('delegates login and logout to keycloak', () => {
    const { login, logout } = useAuth();

    login('http://localhost/back');
    logout();

    expect(keycloak.login).toHaveBeenCalledWith(
      expect.objectContaining({ redirectUri: 'http://localhost/back' })
    );
    expect(keycloak.logout).toHaveBeenCalledTimes(1);
  });

  it('returns the current keycloak token', () => {
    expect(useAuth().getToken()).toBe('token-1');
  });

  describe('getValidToken', () => {
    it('refreshes the token before returning it', async () => {
      const token = await useAuth().getValidToken();

      expect(keycloak.updateToken).toHaveBeenCalledWith(30);
      expect(token).toBe('token-1');
    });

    it('logs out when the refresh fails', async () => {
      vi.mocked(keycloak.updateToken).mockRejectedValue(new Error('expired'));

      const token = await useAuth().getValidToken();

      expect(token).toBeUndefined();
      expect(keycloak.logout).toHaveBeenCalledTimes(1);
    });
  });

  describe('authenticatedFetch', () => {
    it('adds the bearer token to the request', async () => {
      const response = new Response('ok');
      const fetchMock = vi.fn().mockResolvedValue(response);
      vi.stubGlobal('fetch', fetchMock);

      const result = await useAuth().authenticatedFetch('/url', {
        method: 'POST',
        headers: { 'X-Custom': '1' }
      });

      expect(result).toBe(response);
      expect(fetchMock).toHaveBeenCalledWith('/url', {
        method: 'POST',
        headers: {
          'X-Custom': '1',
          Authorization: 'Bearer token-1',
          'Content-Type': 'application/json'
        }
      });
    });

    it('throws without a valid token', async () => {
      const fetchMock = vi.fn();
      vi.stubGlobal('fetch', fetchMock);
      keycloak.token = undefined;

      await expect(useAuth().authenticatedFetch('/url')).rejects.toThrow('Not authenticated');
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });
});
