import { test as base } from '@playwright/test';

import { docs } from './data';
import { mockKeycloak, type KeycloakMock } from './keycloak';

type Fixtures = {
  // start the test with an existing Keycloak session, use `test.use({ loggedIn: true })`
  loggedIn: boolean;
  keycloak: KeycloakMock;
  // first page loaded, must not require auth when the test starts logged out with auth on
  startUrl: string;
};

export const test = base.extend<Fixtures>({
  loggedIn: [false, { option: true }],
  startUrl: ['/', { option: true }],
  keycloak: async ({ context, loggedIn }, use) => {
    await use(await mockKeycloak(context, loggedIn));
  },
  // depends on `keycloak` so Keycloak is mocked before the first navigation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  page: async ({ page, keycloak, startUrl }, use) => {
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
      // the page may be navigating away, then there is no storage to set
      await page
        .evaluate(() => localStorage.setItem('sessionId', JSON.stringify('fake_session_id')))
        .catch(() => {});
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

    await page.goto(startUrl);
    // Close the welcome modal
    await page.getByTestId('consent-checkbox').check();
    await page.getByTestId('welcome-action').click();
    await page.waitForLoadState();

    await use(page);
  }
});

export { expect } from '@playwright/test';
