import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { KeycloakProfile, KeycloakTokenParsed } from 'keycloak-js';
import keycloak from '@/utils/keycloak';
import i18n from '@/localisation/i18n';
import { IS_DEV_ENVIRONMENT } from '@/utils/env';
import { basePostAxios } from '@/utils/fetch';
import { useUserStore } from '@/stores/user';
import type { ApiRequestBody, ApiResponse } from '@/types/api';
import type { UserRegisterData } from '@/types';

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

  const shouldAuthenticate = computed(() => IS_DEV_ENVIRONMENT);

  async function init(): Promise<boolean> {
    // auth is only rolled out on dev: elsewhere Keycloak is never contacted
    if (!shouldAuthenticate.value) {
      isLoading.value = false;
      return false;
    }

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
        applyKeycloakLocale();

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

  // the locale claim is the language last picked on a keycloak page (login, account)
  function applyKeycloakLocale(): void {
    const kcLocale = keycloak.idTokenParsed?.locale;
    if (kcLocale === 'en' || kcLocale === 'fr') {
      i18n.global.locale.value = kcLocale;
      localStorage.setItem('language', kcLocale);
    }
  }

  // keep the keycloak user locale in sync with the app selector, otherwise the next login
  // would bring back the language last picked on a keycloak page
  async function updateLocale(lang: string): Promise<void> {
    if (!isAuthenticated.value || !user.value) return;
    const attributes = { ...user.value.attributes, locale: [lang] };
    try {
      const response = await fetch(`${keycloak.authServerUrl}/realms/${keycloak.realm}/account`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${keycloak.token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user.value, attributes })
      });
      if (!response.ok) throw new Error(`status ${response.status}`);
      user.value = { ...user.value, attributes };
    } catch (err) {
      console.warn('Could not save the language on the keycloak user:', err);
    }
  }

  function login(redirectUri?: string): void {
    keycloak.login({
      redirectUri: redirectUri || window.location.origin,
      locale: i18n.global.locale.value
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

  const isRegistering = ref(false);
  const hasRegistered = ref(false);
  const registerErrorCode = ref<string | null>(null);

  // keycloak emails a link to verify the address and set the password
  async function register(data: UserRegisterData): Promise<void> {
    if (isRegistering.value) return;

    isRegistering.value = true;
    registerErrorCode.value = null;
    const body: ApiRequestBody<'/user/signup'> = {
      email: data.email.trim(),
      first_name: data.firstName.trim(),
      last_name: data.lastName.trim()
    };

    try {
      const response = await basePostAxios<ApiResponse<'/user/signup', 'post'>>(
        '/user/signup',
        body
      );
      useUserStore().syncUserId(response.data.user_id);
      hasRegistered.value = true;
    } catch (error: any) {
      const code = error?.response?.data?.detail?.code;
      if (code) registerErrorCode.value = code;
      else if (error?.response?.status === 422) registerErrorCode.value = 'INVALID_EMAIL';
      else registerErrorCode.value = 'UNKNOWN';
    } finally {
      isRegistering.value = false;
    }
  }

  function resetRegister(): void {
    isRegistering.value = false;
    hasRegistered.value = false;
    registerErrorCode.value = null;
  }

  return {
    isAuthenticated,
    shouldAuthenticate,
    user,
    token,
    tokenParsed,
    roles,
    isLoading,
    userName,
    init,
    login,
    logout,
    updateLocale,
    isRegistering,
    hasRegistered,
    registerErrorCode,
    register,
    resetRegister
  };
});
