import { test as base } from '@playwright/test';

import { docs } from './data';

export const test = base.extend({
  page: async ({ page }, use) => {
    // Mock auth/session calls from App.vue
    await page.route('**/**/user/**', async (route) => {
      const url = route.request().url();
      if (url.includes('user/user')) {
        await route.fulfill({ status: 200, body: JSON.stringify({ user_id: 'fake_user_id' }) });
      } else if (url.includes('session')) {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ session_id: 'fake_session_id' })
        });
      } else if (url.includes('/:user_id/bookmarks?user_id=')) {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ bookmarks: [{ document_id: '2121256453' }] })
        });
      }
    });

    // Mock search-related calls
    await page.route('**/**/search/**', async (route) => {
      const url = route.request().url();
      if (url.includes('collections')) {
        const json = [{ name: 'fake-collections', id: 21 }];
        await route.fulfill({ json });
      } else if (url.includes('nb_docs')) {
        await route.fulfill({ json: { nb_docs: 10 } });
      } else if (url.includes('by_document')) {
        await route.fulfill({ status: 200, body: JSON.stringify(docs) });
      } else if (url.includes('by_ids')) {
        await route.fulfill({ status: 200, body: JSON.stringify(docs) });
      } else {
        await route.continue();
      }
    });

    await page.goto('/');
    // Close the welcome modal
    await page.getByRole('button', { name: 'close' }).click();
    await page.waitForLoadState();

    await use(page);
  }
});

export { expect } from '@playwright/test';
