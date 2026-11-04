import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { KeycloakProfile, KeycloakTokenParsed } from 'keycloak-js';
import keycloak from '@/utils/keycloak';
import i18n from '@/localisation/i18n';
import { useFeatureFlipStore } from '@/stores/featureFlip';
import { basePostAxios } from '@/utils/fetch';
import { useUserStore } from '@/stores/user';
import { clearFromStorage, getFromStorage, saveToStorage } from '@/utils/storage';
import { resetAnalytics, track } from '@/utils/analytics';
import type { ApiRequestBody, ApiResponse } from '@/types/api';
import type { SignupPromptReason, UserRegisterData } from '@/types';

// set before the keycloak redirect, so init() knows it comes back from a login and not a reload
const LOGIN_PENDING_KEY = 'loginPending';
// set before a forced logout, so the app can say why once it is back from keycloak
const SESSION_EXPIRED_KEY = 'sessionExpired';

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

  const featureFlip = useFeatureFlipStore();
  const shouldAuthenticate = computed(() => featureFlip.isFeatureEnabled('auth'));
  // a guest can use the tools but not keep their work (bookmarks, downloads, exports).
  // gated in the client only, the API does not check the token yet
  const isGuest = computed(() => shouldAuthenticate.value && !isAuthenticated.value);

  // set when a guest hits something that needs an account, SignupPromptModal shows it
  const signupPromptReason = ref<SignupPromptReason | null>(null);

  function askToSignUp(reason: SignupPromptReason): void {
    signupPromptReason.value = reason;
    track('Signup Prompt Shown', { reason });
  }

  function closeSignupPrompt(): void {
    signupPromptReason.value = null;
  }

  // true after the app logged the user out on its own (expired token, 401), SessionExpiredModal shows it
  const isSessionExpired = ref(false);

  function closeSessionExpired(): void {
    isSessionExpired.value = false;
  }

  async function init(): Promise<boolean> {
    // where the auth feature is off, keycloak is never contacted
    if (!shouldAuthenticate.value) {
      isLoading.value = false;
      return false;
    }

    // set before init: keycloak-js schedules onTokenExpired when init stores the token
    keycloak.onAuthRefreshSuccess = syncToken;
    keycloak.onTokenExpired = () => {
      keycloak.updateToken(60).catch(() => {
        console.warn('Token refresh failed, logging out');
        logout({ isExpired: true });
      });
    };

    try {
      const authenticated = await keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        checkLoginIframe: false
      });

      isAuthenticated.value = authenticated;
      const isBackFromLogin = getFromStorage(LOGIN_PENDING_KEY) === true;
      clearFromStorage(LOGIN_PENDING_KEY);
      isSessionExpired.value = !authenticated && getFromStorage(SESSION_EXPIRED_KEY) === true;
      clearFromStorage(SESSION_EXPIRED_KEY);

      if (authenticated) {
        syncToken();
        roles.value = keycloak.realmAccess?.roles || [];
        user.value = profileFromIdToken();
        if (isBackFromLogin) {
          applyKeycloakLocale();
          track('Logged In', {});
        }
      }

      isLoading.value = false;
      return authenticated;
    } catch (error) {
      console.error('Keycloak init failed:', error);
      isLoading.value = false;
      return false;
    }
  }

  // built from the id token claims, loadUserProfile() calls /account which the lp realm
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

  // several 401s can arrive together, only the first one redirects
  let isLoggingOut = false;

  // a guest, or keycloak never initialised (auth off), has no session to end: keycloak-js
  // would throw on an uninitialised adapter
  // isExpired: the app ends the session itself, not the user, so it explains why after the redirect.
  // an options object, so a click event passed by `@click="logout"` can't turn it on
  async function logout({ isExpired = false }: { isExpired?: boolean } = {}): Promise<void> {
    if (isLoggingOut || !keycloak.authenticated) return;

    isLoggingOut = true;
    if (isExpired) saveToStorage(SESSION_EXPIRED_KEY, true);
    track('Logged Out', {});
    resetAnalytics();
    try {
      await keycloak.logout({
        redirectUri: window.location.origin
      });
    } catch (error) {
      isLoggingOut = false;
      clearFromStorage(SESSION_EXPIRED_KEY);
      console.error('Keycloak logout failed:', error);
    }
  }

  // also runs after the refreshes done by getAuthHeaders, so the store never goes stale
  function syncToken(): void {
    token.value = keycloak.token;
    tokenParsed.value = keycloak.tokenParsed;
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
    isGuest,
    signupPromptReason,
    askToSignUp,
    closeSignupPrompt,
    isSessionExpired,
    closeSessionExpired,
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
