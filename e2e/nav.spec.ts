import { test, expect } from './base';

test.describe('nav', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/q-and-a');
  });
  test('click on search', async ({ page }) => {
    await page.getByTestId('nav-search').click();
    await expect(page).toHaveURL(/\/search/);
  });

  test('click on chat', async ({ page }) => {
    await page.getByTestId('nav-chat').click();
    await expect(page).toHaveURL(/\/q-and-a/);
  });

  test('click on bookmarks', async ({ page }) => {
    await page.getByTestId('nav-bookmarks').click();
    await expect(page).toHaveURL(/\/bookmarks/);
  });

  // auth is only on in dev, see auth.spec.ts
  test.describe('without auth', () => {
    test('has no user menu nor login/logout buttons', async ({ page }) => {
      await expect(page.getByTestId('user-menu')).toHaveCount(0);
      await expect(page.getByRole('button', { name: /Connexion|Déconnexion/ })).toHaveCount(0);
    });

    test('never contacts Keycloak', async ({ page, keycloak }) => {
      await page.reload();
      await expect(page.getByTestId('nav-chat')).toBeVisible();
      expect(keycloak.requests).toBe(0);
    });

    test('profile page redirects home', async ({ page }) => {
      await page.goto('/profile');
      await expect(page).toHaveURL(/\/q-and-a/);
    });
  });

  test.describe('switch to language', () => {
    test('switch language', async ({ page }) => {
      expect(await page.getByText('Posez une question')).toBeTruthy();
      await page.getByRole('combobox').selectOption('EN');
      expect(await page.getByText('EN')).toBeTruthy();
      expect(await page.getByText('Ask a question')).toBeTruthy();
    });
  });
});
