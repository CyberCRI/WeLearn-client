import { beforeEach, describe, expect, it, vi } from 'vitest';

const keycloakMock = vi.hoisted(() => ({
  authenticated: false as boolean,
  token: undefined as string | undefined,
  updateToken: vi.fn(),
  logout: vi.fn()
}));

vi.mock('@/utils/keycloak', () => ({ default: keycloakMock }));

import { getAuthHeaders } from '../api';

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

  it('logs out and omits the bearer when the refresh fails', async () => {
    keycloakMock.authenticated = true;
    keycloakMock.updateToken.mockRejectedValue(new Error('expired'));

    expect(await getAuthHeaders()).toEqual({ 'X-Session-Id': 'session-123' });
    expect(keycloakMock.logout).toHaveBeenCalled();
  });
});
