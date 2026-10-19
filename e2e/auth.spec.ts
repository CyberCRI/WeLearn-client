import { test, expect } from './base';
import { fakeUser } from './keycloak';

const fullName = `${fakeUser.firstName} ${fakeUser.lastName}`;

test.describe('auth', () => {
  test.describe('logged out', () => {
    test('user menu offers to log in', async ({ page }) => {
      await page.getByTestId('user-menu').hover();
      await expect(page.getByTestId('user-menu-login')).toBeVisible();
      await expect(page.getByTestId('user-menu-logout')).toHaveCount(0);
      await expect(page.getByTestId('user-menu-profile')).toHaveCount(0);
    });

    test('logs in from the user menu', async ({ page, keycloak }) => {
      await page.getByTestId('user-menu').hover();
      await page.getByTestId('user-menu-login').click();

      await expect(page.getByTestId('user-menu').getByText(fullName)).toBeAttached();
      expect(keycloak.loggedIn).toBe(true);

      await page.getByTestId('user-menu').hover();
      await expect(page.getByTestId('user-menu-logout')).toBeVisible();
    });

    test('logs in from the profile page', async ({ page }) => {
      await page.goto('/profile');
      await expect(page.getByText("Vous n'êtes pas connecté·e.")).toBeVisible();

      await page.getByTestId('profile-login').click();

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

      await page.getByTestId('user-menu').hover();
      await expect(page.getByTestId('user-menu-login')).toBeVisible();
      expect(keycloak.logoutCalls).toBe(1);
      expect(keycloak.loggedIn).toBe(false);
    });
  });
});
