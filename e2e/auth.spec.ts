// Runs with VITE_ENVIRONMENT=dev (chromium-auth project), the only env with auth
import { test, expect } from './base';
import { fakeUser, keycloakSignIn, signInOnKeycloak } from './keycloak';

const fullName = `${fakeUser.firstName} ${fakeUser.lastName}`;

test.describe('auth', () => {
  test.describe('logged out', () => {
    // every other page requires auth and would redirect to Keycloak
    test.use({ startUrl: '/about' });

    test('user menu offers to log in', async ({ page }) => {
      await page.getByTestId('user-menu').hover();
      await expect(page.getByTestId('user-menu-login')).toBeVisible();
      await expect(page.getByTestId('user-menu-logout')).toHaveCount(0);
      await expect(page.getByTestId('user-menu-profile')).toHaveCount(0);
    });

    test('bookmarks are disabled in the user menu', async ({ page }) => {
      await page.getByTestId('user-menu').hover();
      await expect(page.getByTestId('user-menu-bookmarks')).toHaveAttribute(
        'aria-disabled',
        'true'
      );
    });

    test('logs in from the user menu', async ({ page, keycloak }) => {
      await page.getByTestId('user-menu').hover();
      await page.getByTestId('user-menu-login').click();
      await signInOnKeycloak(page);

      await expect(page.getByTestId('user-menu').getByText(fullName)).toBeAttached();
      expect(keycloak.loggedIn).toBe(true);

      await page.getByTestId('user-menu').hover();
      await expect(page.getByTestId('user-menu-logout')).toBeVisible();
    });

    test('a protected page asks to log in, then opens', async ({ page }) => {
      await page.goto('/search');
      await signInOnKeycloak(page);

      await expect(page).toHaveURL(/\/search/);
      await expect(page.getByTestId('user-menu').getByText(fullName)).toBeAttached();
    });
  });

  test.describe('logged in', () => {
    test.use({ loggedIn: true });

    test('restores the session and shows the user name', async ({ page }) => {
      await page.getByTestId('user-menu').hover();
      await expect(page.getByTestId('user-menu').getByText(fullName)).toBeVisible();
      await expect(page.getByTestId('user-menu-login')).toHaveCount(0);
    });

    test('logs out from the user menu', async ({ page, keycloak }) => {
      await page.getByTestId('user-menu').hover();
      await page.getByTestId('user-menu-logout').click();

      // back home, which requires auth again
      await expect(keycloakSignIn(page)).toBeVisible();
      expect(keycloak.logoutCalls).toBe(1);
      expect(keycloak.loggedIn).toBe(false);
    });
  });
});
