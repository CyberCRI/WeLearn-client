import { test, expect } from '@playwright/test';

test.describe('nav', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    await page.route('**/**/search/collections', async (route) => {
      const json = [{ name: 'fake-collections', id: 21 }];
      await route.fulfill({ json });
    });

    await page.getByRole('button', { name: 'Search' }).click();
    if (await page.getByRole('button', { name: 'Next' })) {
      await page.getByRole('button', { name: 'Next' }).click();
    }
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
      expect(await page.getByText('Ask a question')).toBeTruthy();
      await page.getByText('French').click();
      expect(await page.getByText('Français')).toBeTruthy();
      expect(await page.getByText('Posez une question')).toBeTruthy();
    });
  });
});
