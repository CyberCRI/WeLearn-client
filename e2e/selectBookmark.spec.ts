import { test, expect } from '@playwright/test';
import { docs } from './data.ts';

test.describe('select bookmark', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/**/search/collections', async (route) => {
      const json = [{ name: 'fake-collections', id: 21 }];
      await route.fulfill({ json });
    });
  });
  test('click on select a bookmark', async ({ page }) => {
    await page.route('**/**/search/by_document?nb_results**', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify(docs) });
    });

    await page.goto('/search');
    await page.getByTestId('close').click();

    await page.fill('textarea', 'this is a longer text for testing');
    await page.getByLabel('Search', { exact: true }).click();
    await expect(page.getByText('Document one test').first()).toBeVisible();

    await page
      .locator('header')
      .filter({ hasText: 'Document one testAdd to bookmarks' })
      .getByTestId('toggleBookmark')
      .click();
    await page.goto('/bookmarks');
    await expect(page.getByText('Document one test').first()).toBeVisible();
  });
});
