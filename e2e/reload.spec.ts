import { test, expect } from './base';

// what a page keeps in the browser: the chat comes back from the API, the search from the tab
const storedKeys = (page: import('@playwright/test').Page) =>
  page.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage) }));

test.describe('after a reload', () => {
  test('the chat comes back from the API, with its sources while the tab is open', async ({
    page
  }) => {
    await page.goto('/q-and-a');
    await page.fill('textarea', 'How do forests store carbon?');
    await page.keyboard.press('Enter');
    await expect(page.getByText('An answer from the API')).toBeVisible();
    await expect(page.getByText('Document one test')).toBeVisible();

    const history = page.waitForRequest((request) =>
      request.url().includes('/qna/chat/history?thread_id=e2e-thread')
    );
    await page.reload();
    await history;

    await expect(page.getByText('How do forests store carbon?')).toBeVisible();
    await expect(page.getByText('An answer from the API')).toBeVisible();
    await expect(page.getByText('Document one test')).toBeVisible();
    const { local, session } = await storedKeys(page);
    expect(local).toContain('chatThreadId');
    for (const key of ['chat', 'chatSources', 'reformulatedQuery', 'chatMessageId']) {
      expect(local).not.toContain(key);
    }
    expect(session).toContain('chatSources');

    // the tab closed: the history still comes back, its sources do not
    await page.evaluate(() => sessionStorage.clear());
    await page.reload();
    await expect(page.getByText('An answer from the API')).toBeVisible();
    await expect(page.getByText('Document one test')).toHaveCount(0);
  });

  test('the search stays while the tab is open, not after', async ({ page }) => {
    const query = 'how do forests store carbon dioxide in their soils';
    await page.goto('/search');
    await page.fill('textarea', query);
    await page.getByLabel('Recherche', { exact: true }).click();
    await expect(page.getByText('Document one test')).toBeVisible();

    await page.reload();
    await expect(page.locator('textarea')).toHaveValue(query);
    await expect(page.getByText('Document one test')).toBeVisible();
    const { local, session } = await storedKeys(page);
    for (const key of ['searchInput', 'searchResults', 'searchMessageId']) {
      expect(local).not.toContain(key);
    }
    expect(session).toEqual(expect.arrayContaining(['searchInput', 'searchResults']));

    await page.evaluate(() => sessionStorage.clear());
    await page.reload();
    await expect(page.locator('textarea')).toHaveValue('');
    await expect(page.getByText('Document one test')).toHaveCount(0);
  });

  test('what older versions kept is removed at boot', async ({ page }) => {
    await page.evaluate(() => {
      for (const key of [
        'chat',
        'chatSources',
        'searchInput',
        'searchResults',
        'userMetricsData'
      ]) {
        localStorage.setItem(key, JSON.stringify('old'));
      }
    });
    await page.reload();

    const { local } = await storedKeys(page);
    for (const key of ['chat', 'chatSources', 'searchInput', 'searchResults', 'userMetricsData']) {
      expect(local).not.toContain(key);
    }
  });
});
