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

  test.describe('switch to language', () => {
    test('switch language', async ({ page }) => {
      expect(await page.getByText('Posez une question')).toBeTruthy();
      await page.getByRole('combobox').selectOption('EN');
      expect(await page.getByText('EN')).toBeTruthy();
      expect(await page.getByText('Ask a question')).toBeTruthy();
    });
  });
});
