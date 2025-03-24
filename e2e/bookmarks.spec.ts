import { test, expect } from '@playwright/test';
import { docs } from './data.ts';

test.describe('bookmarks', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/bookmarks');
  });
  // test that page is empty
  test('page is empty', async ({ page }) => {
    await expect(page.getByText('No bookmarks yet')).toBeVisible();
  });

  test('delete-button is not visible', async ({ page }) => {
    await expect(page.getByTestId('delete-button')).not.toBeVisible();
  });

  test.describe('bookmark actions', () => {
    test.beforeEach(async ({ page }) => {
      await page.evaluate(setBookmarks, docs);
      await page.reload();
    });

    // test that it shows bookmark stored in localStorage
    test('shows bookmark stored in localStorage', async ({ page }) => {
      await expect(page.getByText('doc_one_corpus')).toBeVisible();
    });

    // test that it removes bookmark from localStorage
    test('removes bookmark one bookmark', async ({ page }) => {
      await expect(page.getByText('doc_one_corpus')).toBeVisible();
      page
        .locator('header')
        .filter({ hasText: 'Document one testRemove from bookmark' })
        .getByTestId('toggleBookmark')
        .click();
      await expect(page.getByText('doc_two_corpus')).toBeVisible();
      await expect(page.getByText('doc_one_corpus')).not.toBeVisible();
    });

    //remove all bookmarks
    test('removes all bookmarks', async ({ page }) => {
      await page.getByTestId('clear-bookmark').click();
      await expect(page.getByText('No bookmarks yet')).toBeVisible();
    });
  });
});

function setBookmarks(docs_obj) {
  localStorage.setItem('bookmarkedSources', JSON.stringify(docs_obj));
}
