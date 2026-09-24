import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { KeycloakProfile, KeycloakTokenParsed } from 'keycloak-js';
import keycloak from '@/utils/keycloak';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false);
  const user = ref<KeycloakProfile | null>(null);
  const token = ref<string | undefined>(undefined);
  const tokenParsed = ref<KeycloakTokenParsed | undefined>(undefined);
  const roles = ref<string[]>([]);
  const isLoading = ref(true);

  const userName = computed(() => {
    if (user.value) {
      return `${user.value.firstName} ${user.value.lastName}`;
    }
    return tokenParsed.value?.preferred_username || 'Unknown';
  });

  async function init(): Promise<boolean> {
    try {
      const authenticated = await keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        checkLoginIframe: false
      });

      isAuthenticated.value = authenticated;

      if (authenticated) {
        token.value = keycloak.token;
        tokenParsed.value = keycloak.tokenParsed;
        roles.value = keycloak.realmAccess?.roles || [];

        try {
          const profile = await keycloak.loadUserProfile();
          user.value = profile;
        } catch (err) {
          console.warn('Could not load user profile:', err);
        }

        startTokenRefresh();
      }

      isLoading.value = false;
      return authenticated;
    } catch (error) {
      console.error('Keycloak init failed:', error);
      isLoading.value = false;
      return false;
    }
  }

  function login(redirectUri?: string): void {
    keycloak.login({
      redirectUri: redirectUri || window.location.origin
    });
  }

  function logout(): void {
    keycloak.logout({
      redirectUri: window.location.origin
    });
  }

  function startTokenRefresh(): void {
    setInterval(async () => {
      try {
        const refreshed = await keycloak.updateToken(60);
        if (refreshed) {
          token.value = keycloak.token;
          tokenParsed.value = keycloak.tokenParsed;
        }
      } catch {
        console.warn('Token refresh failed, logging out');
        logout();
      }
    }, 30000);
  }

  return {
    isAuthenticated,
    user,
    token,
    tokenParsed,
    roles,
    isLoading,
    userName,
    init,
    login,
    logout
  };
});
