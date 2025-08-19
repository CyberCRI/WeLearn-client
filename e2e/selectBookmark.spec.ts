import { test, expect } from './base';

test.describe('select bookmark', () => {
  test('click on select a bookmark', async ({ page }) => {
    await page.goto('/search');

    await page.fill('textarea', 'this is a longer text for testing');
    await page.getByLabel('Recherche', { exact: true }).click();

    await expect(page.getByText('Document one test')).toBeVisible();

    await page
      .locator('header')
      .filter({ hasText: 'Document one test' })
      .getByTestId('toggleBookmark')
      .click();
    await page.goto('/bookmarks');
    await expect(page.getByText('Document one test').first()).toBeVisible();
  });
});
