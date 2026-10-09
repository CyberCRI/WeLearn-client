import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import keycloak from '@/utils/keycloak';

export function useAuth() {
  const authStore = useAuthStore();
  const { isAuthenticated, user, token, roles, isLoading, userName } = storeToRefs(authStore);

  function getToken(): string | undefined {
    return keycloak.token;
  }

  async function getValidToken(): Promise<string | undefined> {
    try {
      await keycloak.updateToken(30);
      return keycloak.token;
    } catch {
      authStore.logout();
      return undefined;
    }
  }

  async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const validToken = await getValidToken();
    if (!validToken) {
      throw new Error('Not authenticated');
    }

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${validToken}`,
        'Content-Type': 'application/json'
      }
    });
  }

  return {
    isAuthenticated,
    user,
    token,
    roles,
    isLoading,
    userName,
    login: authStore.login,
    logout: authStore.logout,
    getToken,
    getValidToken,
    authenticatedFetch
  };
}
