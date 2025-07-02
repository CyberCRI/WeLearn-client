import { test, expect } from '@playwright/test';

test.describe('nav', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/q-and-a');

    await page.route('**/**/search/collections', async (route) => {
      const json = [{ name: 'fake-collections', id: 21 }];
      await route.fulfill({ json });
    });
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

  test.describe('switch to french', () => {
    test('switch to French', async ({ page }) => {
      expect(await page.getByText('Posez une question')).toBeTruthy();
      await page.getByText('Anglais').click();
      expect(await page.getByText('English')).toBeTruthy();
      expect(await page.getByText('Ask a question')).toBeTruthy();
    });
  });
});
