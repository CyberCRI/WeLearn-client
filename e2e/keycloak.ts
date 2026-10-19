import type { BrowserContext, Page, Route } from '@playwright/test';

// Must match VITE_KEYCLOAK_* in .env.test
export const KEYCLOAK_URL = 'http://keycloak.test';
export const KEYCLOAK_REALM = 'welearn-test';
const REALM_URL = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}`;

export const fakeUser = {
  username: 'jane.doe',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@example.org'
};

export interface KeycloakMock {
  loggedIn: boolean;
  logoutCalls: number;
  requests: number;
}

// keycloak-js sends credentials, so the origin has to be echoed back instead of '*'
function corsHeaders(origin: string | undefined) {
  return {
    'Access-Control-Allow-Origin': origin ?? '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };
}

// keycloak-js only base64-decodes tokens, it never checks the signature
function fakeJwt(payload: Record<string, unknown>): string {
  const encode = (obj: object) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  return `${encode({ alg: 'none', typ: 'JWT' })}.${encode(payload)}.signature`;
}

function redirect(route: Route, location: string) {
  return route.fulfill({ status: 302, headers: { Location: location } });
}

// back to the app, as Keycloak does after a successful login
function redirectWithCode(route: Route, authUrl: URL) {
  const redirectUri = authUrl.searchParams.get('redirect_uri');
  const oauthState = authUrl.searchParams.get('state');
  // the code carries the nonce so the token endpoint can put it back in the id token
  const code = authUrl.searchParams.get('nonce');
  return redirect(route, `${redirectUri}#state=${oauthState}&session_state=fake&code=${code}`);
}

/**
 * Fakes the Keycloak server so the real keycloak-js adapter can run its
 * check-sso / login / logout flows against it.
 */
export async function mockKeycloak(
  context: BrowserContext,
  initiallyLoggedIn = false
): Promise<KeycloakMock> {
  const state: KeycloakMock = { loggedIn: initiallyLoggedIn, logoutCalls: 0, requests: 0 };

  await context.route(`${KEYCLOAK_URL}/**`, async (route) => {
    state.requests += 1;
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.replace(new URL(REALM_URL).pathname, '');
    const CORS_HEADERS = corsHeaders(request.headers()['origin']);

    if (request.method() === 'OPTIONS') {
      return route.fulfill({ status: 204, headers: CORS_HEADERS });
    }

    // third-party cookies check done before the silent check-sso
    if (path === '/protocol/openid-connect/3p-cookies/step1.html') {
      return route.fulfill({
        contentType: 'text/html',
        body: "<script>parent.postMessage('supported', '*')</script>"
      });
    }

    if (path === '/protocol/openid-connect/auth') {
      const redirectUri = url.searchParams.get('redirect_uri') as string;
      const oauthState = url.searchParams.get('state');
      const isSilent = url.searchParams.get('prompt') === 'none';

      if (!state.loggedIn && isSilent) {
        return redirect(route, `${redirectUri}#error=login_required&state=${oauthState}`);
      }
      if (!state.loggedIn) {
        // stand-in for the Keycloak login form, see signInOnKeycloak()
        url.pathname = `${new URL(REALM_URL).pathname}/login-actions/authenticate`;
        return route.fulfill({
          contentType: 'text/html',
          body: `<a data-testid="kc-sign-in" href="${url}">Sign in</a>`
        });
      }
      return redirectWithCode(route, url);
    }

    if (path === '/login-actions/authenticate') {
      state.loggedIn = true;
      return redirectWithCode(route, url);
    }

    if (path === '/protocol/openid-connect/token') {
      const nonce = new URLSearchParams(request.postData() ?? '').get('code');
      const now = Math.floor(Date.now() / 1000);
      const claims = {
        iat: now,
        exp: now + 3600,
        sub: 'fake-user-id',
        sid: 'fake-session',
        preferred_username: fakeUser.username,
        email: fakeUser.email,
        realm_access: { roles: ['user'] }
      };
      return route.fulfill({
        headers: CORS_HEADERS,
        json: {
          access_token: fakeJwt({ ...claims, typ: 'Bearer' }),
          refresh_token: fakeJwt({ ...claims, typ: 'Refresh' }),
          id_token: fakeJwt({ ...claims, typ: 'ID', nonce }),
          token_type: 'Bearer',
          expires_in: 3600
        }
      });
    }

    if (path === '/account') {
      return route.fulfill({ headers: CORS_HEADERS, json: fakeUser });
    }

    if (path === '/protocol/openid-connect/logout') {
      state.loggedIn = false;
      state.logoutCalls += 1;
      return redirect(route, url.searchParams.get('post_logout_redirect_uri') as string);
    }

    return route.fulfill({ status: 404, headers: CORS_HEADERS });
  });

  return state;
}

export function keycloakSignIn(page: Page) {
  return page.getByTestId('kc-sign-in');
}

/** Fills the fake Keycloak login form, as a user would */
export async function signInOnKeycloak(page: Page) {
  await keycloakSignIn(page).click();
}
