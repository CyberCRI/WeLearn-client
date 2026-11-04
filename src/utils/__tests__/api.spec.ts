import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

const keycloakMock = vi.hoisted(() => ({
  authenticated: false as boolean,
  token: undefined as string | undefined,
  updateToken: vi.fn(),
  logout: vi.fn()
}));
const { logout } = vi.hoisted(() => ({ logout: vi.fn() }));

vi.mock('@/utils/keycloak', () => ({ default: keycloakMock }));
vi.mock('@/stores/auth', () => ({ useAuthStore: () => ({ logout }) }));

import http, { getAuthHeaders } from '../api';

describe('getAuthHeaders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('sessionId', JSON.stringify('session-123'));
    keycloakMock.authenticated = false;
    keycloakMock.token = undefined;
  });

  it('sends only the session id when not authenticated', async () => {
    expect(await getAuthHeaders()).toEqual({ 'X-Session-Id': 'session-123' });
    expect(keycloakMock.updateToken).not.toHaveBeenCalled();
  });

  it('refreshes the token and adds the bearer when authenticated', async () => {
    keycloakMock.authenticated = true;
    keycloakMock.updateToken.mockImplementation(async () => {
      keycloakMock.token = 'fresh-token';
      return true;
    });

    expect(await getAuthHeaders()).toEqual({
      'X-Session-Id': 'session-123',
      Authorization: 'Bearer fresh-token'
    });
    expect(keycloakMock.updateToken).toHaveBeenCalledWith(30);
  });

  it('logs out through the store and does not send the request when the refresh fails', async () => {
    keycloakMock.authenticated = true;
    const expired = new Error('expired');
    keycloakMock.updateToken.mockRejectedValue(expired);
    const adapter = vi.fn();

    await expect(getAuthHeaders()).rejects.toBe(expired);
    expect(logout).toHaveBeenCalledTimes(1);
    expect(logout).toHaveBeenCalledWith({ isExpired: true });
    expect(keycloakMock.logout).not.toHaveBeenCalled();

    await expect(http.get('/x', { adapter })).rejects.toBe(expired);
    expect(adapter).not.toHaveBeenCalled();
  });
});

describe('response interceptor', () => {
  // the adapter answers instead of the network, with the error axios would build for a status
  const failWith = (status: number) => (config: InternalAxiosRequestConfig) =>
    Promise.reject(
      new AxiosError('Request failed', 'ERR_BAD_REQUEST', config, null, {
        status,
        statusText: '',
        headers: {},
        config,
        data: { detail: { code: 'SOME_CODE' } }
      } as AxiosResponse)
    );

  beforeEach(() => {
    vi.clearAllMocks();
    keycloakMock.authenticated = false;
    keycloakMock.token = undefined;
  });

  it('rejects with the AxiosError on a 401 when keycloak was never initialised', async () => {
    // what keycloak-js 26 does when logout() runs before init()
    keycloakMock.logout.mockImplementation(() => {
      throw new TypeError("Cannot read properties of undefined (reading 'logout')");
    });

    const error = await http.get('/x', { adapter: failWith(401) }).catch((e) => e);

    expect(error).toBeInstanceOf(AxiosError);
    expect(error.response.status).toBe(401);
    expect(error.response.data.detail.code).toBe('SOME_CODE');
    expect(logout).not.toHaveBeenCalled();
    expect(keycloakMock.logout).not.toHaveBeenCalled();
  });

  it('logs out through the store on a 401 when authenticated, and still rejects', async () => {
    keycloakMock.authenticated = true;
    keycloakMock.updateToken.mockResolvedValue(false);

    const error = await http.get('/x', { adapter: failWith(401) }).catch((e) => e);

    expect(error).toBeInstanceOf(AxiosError);
    expect(error.response.status).toBe(401);
    expect(logout).toHaveBeenCalledTimes(1);
    expect(logout).toHaveBeenCalledWith({ isExpired: true });
  });

  it('keeps the AxiosError when the logout itself throws', async () => {
    keycloakMock.authenticated = true;
    keycloakMock.updateToken.mockResolvedValue(false);
    logout.mockImplementationOnce(() => {
      throw new Error('no pinia');
    });
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const error = await http.get('/x', { adapter: failWith(401) }).catch((e) => e);

    expect(error).toBeInstanceOf(AxiosError);
    expect(error.response.status).toBe(401);
  });

  it('does not log out on other errors', async () => {
    keycloakMock.authenticated = true;
    keycloakMock.updateToken.mockResolvedValue(false);

    const error = await http.get('/x', { adapter: failWith(500) }).catch((e) => e);

    expect(error.response.status).toBe(500);
    expect(logout).not.toHaveBeenCalled();
  });
});
