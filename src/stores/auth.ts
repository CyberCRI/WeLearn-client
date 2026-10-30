import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { KeycloakProfile, KeycloakTokenParsed } from 'keycloak-js';
import keycloak from '@/utils/keycloak';
import i18n from '@/localisation/i18n';
import { IS_AUTH_ENVIRONMENT } from '@/utils/env';
import { basePostAxios } from '@/utils/fetch';
import { useUserStore } from '@/stores/user';
import { clearFromStorage, getFromStorage, saveToStorage } from '@/utils/storage';
import { resetAnalytics, track } from '@/utils/analytics';
import type { ApiRequestBody, ApiResponse } from '@/types/api';
import type { UserRegisterData } from '@/types';

// set before the keycloak redirect, so init() knows it comes back from a login and not a reload
const LOGIN_PENDING_KEY = 'loginPending';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false);
  const user = ref<KeycloakProfile | null>(null);
  const token = ref<string | undefined>(undefined);
  const tokenParsed = ref<KeycloakTokenParsed | undefined>(undefined);
  const roles = ref<string[]>([]);
  const isLoading = ref(true);

  const userName = computed(() => {
    const fullName = [user.value?.firstName, user.value?.lastName].filter(Boolean).join(' ');
    return fullName || tokenParsed.value?.preferred_username || 'Unknown';
  });

  const shouldAuthenticate = computed(() => IS_AUTH_ENVIRONMENT);

  async function init(): Promise<boolean> {
    // auth is only rolled out on dev and staging: elsewhere Keycloak is never contacted
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
      const isBackFromLogin = getFromStorage(LOGIN_PENDING_KEY) === true;
      clearFromStorage(LOGIN_PENDING_KEY);

      if (authenticated) {
        token.value = keycloak.token;
        tokenParsed.value = keycloak.tokenParsed;
        roles.value = keycloak.realmAccess?.roles || [];
        user.value = profileFromIdToken();
        if (isBackFromLogin) {
          applyKeycloakLocale();
          track('Logged In', {});
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

  // ponytail: built from the id token claims, loadUserProfile() calls /account which the lp realm
  // refuses (no account audience in the token), and nothing here needs more than these fields
  function profileFromIdToken(): KeycloakProfile {
    const claims = keycloak.idTokenParsed;
    return {
      username: claims?.preferred_username,
      firstName: claims?.given_name,
      lastName: claims?.family_name,
      email: claims?.email
    };
  }

  // the locale claim is the language last picked on a keycloak page (login, account). only applied
  // after a login: the app language is not saved on the keycloak user, so on a reload the claim
  // would bring back an older language than the one picked in the app
  function applyKeycloakLocale(): void {
    const kcLocale = keycloak.idTokenParsed?.locale;
    if (kcLocale === 'en' || kcLocale === 'fr') {
      i18n.global.locale.value = kcLocale;
      localStorage.setItem('language', kcLocale);
    }
  }

  function login(redirectUri?: string): void {
    track('Login Clicked', {});
    saveToStorage(LOGIN_PENDING_KEY, true);
    keycloak.login({
      redirectUri: redirectUri || window.location.origin,
      locale: i18n.global.locale.value
    });
  }

  function logout(): void {
    track('Logged Out', {});
    resetAnalytics();
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
    isRegistering,
    hasRegistered,
    registerErrorCode,
    register,
    resetRegister
  };
});
