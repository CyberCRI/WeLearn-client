import { test, expect } from './base';
import { fakeUser } from './keycloak';

test.describe('profile', () => {
  test.describe('logged in', () => {
    test.use({ loggedIn: true });

    test('opens from the user menu', async ({ page }) => {
      await page.getByTestId('user-menu').hover();
      await page.getByTestId('user-menu-profile').click();

      await expect(page).toHaveURL(/\/profile/);
      await expect(page.getByRole('heading', { name: 'Mon profil' })).toBeVisible();
    });

    test('shows the user information', async ({ page }) => {
      await page.goto('/profile');

      await expect(page.getByTestId('profile-name')).toHaveText(
        `${fakeUser.firstName} ${fakeUser.lastName}`
      );
      await expect(page.getByTestId('profile-email')).toHaveText(fakeUser.email);
    });

    test('switches the language', async ({ page }) => {
      await page.goto('/profile');

      await page.locator('.profile').getByRole('combobox').selectOption('en');

      await expect(page.getByRole('heading', { name: 'My profile' })).toBeVisible();
    });

    test('logs out', async ({ page, keycloak }) => {
      await page.goto('/profile');

      await page.getByTestId('profile-logout').click();

      await expect(page.getByTestId('profile-name')).toHaveCount(0);
      expect(keycloak.logoutCalls).toBe(1);
    });
  });

  test.describe('logged out', () => {
    test('asks the user to log in', async ({ page }) => {
      await page.goto('/profile');

      await expect(page.getByText("Vous n'êtes pas connecté·e.")).toBeVisible();
      await expect(page.getByTestId('profile-login')).toBeVisible();
      await expect(page.getByTestId('profile-name')).toHaveCount(0);
    });
  });
});
