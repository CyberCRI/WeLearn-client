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
          body: JSON.stringify({ session_id: 'fake_session_id', referer: 'toto' })
        });
      } else if (url.includes('/bookmarks')) {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ bookmarks: [{ document_id: '2121256453' }] })
        });
      }
    });

    // Mock search-related calls

    await page.route('**/**/search/**', async (route) => {
      await page.evaluate(() =>
        localStorage.setItem('sessionId', JSON.stringify('fake_session_id'))
      );
      const url = route.request().url();
      if (url.includes('collections')) {
        const json = [{ name: 'fake-collection', category: 'fake-category' }];
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

    // Mock external SDG classifier to keep tests deterministic and fast in CI.
    await page.route('https://aurora-sdg.labs.vu.nl/**', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          predictions: [
            {
              prediction: 0.9,
              sdg: { code: '1' }
            },
            {
              prediction: 0.6,
              sdg: { code: '4' }
            }
          ]
        })
      });
    });

    // Mock metrics-related calls
    await page.route('**/**/metrics/**', async (route) => {
      const url = route.request().url();
      if (url.includes('nb_docs_info_per_corpus')) {
        const json = [
          {
            corpus: 'hal',
            url: 'https://hal.science/',
            qty_total: 558728,
            qty_in_qdrant: 36408
          },
          {
            corpus: 'ipbes',
            url: 'https://www.ipbes.net/',
            qty_total: 33,
            qty_in_qdrant: 33
          }
        ];
        await route.fulfill({ json });
      }
    });

    await page.goto('/');
    // Close the welcome modal
    await page.getByTestId('consent-checkbox').check();
    await page.getByTestId('welcome-action').click();
    await page.waitForLoadState();

    await use(page);
  }
});

export { expect } from '@playwright/test';
