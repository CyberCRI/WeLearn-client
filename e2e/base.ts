import { test as base } from '@playwright/test';

import { connectionEvidence, connectionIdeas, courseAdaptation, courseReading, docs } from './data';
import { mockKeycloak, type KeycloakMock } from './keycloak';

// set per project in playwright.config.ts
export type ProjectOptions = {
  // analytics (and its consent banner) is feature-flipped on in dev only
  isDevEnvironment: boolean;
};

type Fixtures = ProjectOptions & {
  // start the test with an existing Keycloak session, use `test.use({ loggedIn: true })`
  loggedIn: boolean;
  keycloak: KeycloakMock;
  // first page loaded, must not require auth when the test starts logged out with auth on
  startUrl: string;
  // false when the start page hides the welcome modal (meta.hideWelcome, e.g. /register)
  hasWelcomeModal: boolean;
};

export const test = base.extend<Fixtures>({
  isDevEnvironment: [false, { option: true }],
  loggedIn: [false, { option: true }],
  startUrl: ['/', { option: true }],
  hasWelcomeModal: [true, { option: true }],
  keycloak: async ({ context, loggedIn }, use) => {
    await use(await mockKeycloak(context, loggedIn));
  },
  // depends on `keycloak` so Keycloak is mocked before the first navigation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  page: async ({ page, keycloak, startUrl, hasWelcomeModal, isDevEnvironment }, use) => {
    // Mock auth/session calls from App.vue
    await page.route('**/**/user/**', async (route) => {
      const url = route.request().url();
      if (url.includes('user/signup')) {
        await route.fulfill({
          status: 202,
          body: JSON.stringify({ message: 'accepted' })
        });
      } else if (url.includes('user/guest_quota')) {
        // a guest who has not used anything today; a test overrides it with page.route
        await route.fulfill({
          json: {
            limited: true,
            chat: { limit: 5, remaining: 5, resets_in: 0 },
            syllabus: { limit: 1, remaining: 1, resets_in: 0 }
          }
        });
      } else if (url.includes('user/access')) {
        // an institution account: no time limit
        await route.fulfill({ json: { limited: false } });
      } else if (url.includes('user/logout')) {
        await route.fulfill({ status: 200, json: { message: 'logged out' } });
      } else if (url.includes('user/user')) {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ user_id: 'fake_user_id', session_id: 'fake_session_id' })
        });
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
        await route.fulfill({ status: 200, body: JSON.stringify({ docs }) });
      } else if (url.includes('by_ids')) {
        await route.fulfill({ status: 200, body: JSON.stringify(docs) });
      } else {
        await route.continue();
      }
    });

    // chat threads: by default the account has no chat to restore at boot, and a deletion works.
    // a test overrides a route with page.route, then reloads
    await page.route('**/qna/chat/threads/**', async (route) => {
      const request = route.request();
      if (request.method() === 'DELETE') {
        const threadId = decodeURIComponent(new URL(request.url()).pathname.split('/').pop()!);
        await route.fulfill({ json: { thread_id: threadId } });
      } else if (request.url().includes('/threads/latest')) {
        await route.fulfill({ json: { thread_id: null } });
      } else {
        await route.continue();
      }
    });

    // external sdg classifier called alongside every search, it must not hang the tests when down
    await page.route('**/aurora-sdg.labs.vu.nl/**', async (route) => {
      await route.fulfill({ json: { predictions: [] } });
    });

    // the "I have a course" path, one run that goes well; a test changes a step with its own
    // page.route, which Playwright tries first
    await page.route('**/tutor/course/**', async (route) => {
      const step = new URL(route.request().url()).pathname.split('/').pop();
      if (step === 'read') return route.fulfill({ json: courseReading });
      if (step === 'connection_ideas') return route.fulfill({ json: connectionIdeas });
      if (step === 'connection_evidence') {
        return route.fulfill({ json: connectionEvidence(route.request().postDataJSON().idea) });
      }
      if (step === 'adaptation') return route.fulfill({ json: courseAdaptation });
      return route.fulfill({ status: 404, json: { detail: 'Not mocked' } });
    });

    // Mock the /metric/* calls (corpus counts at boot, download counts); none may reach the
    // network, or a page never goes idle
    await page.route('**/metric/**', async (route) => {
      const url = route.request().url();
      if (!url.includes('nb_docs_info_per_corpus')) {
        await route.fulfill({ json: {} });
      } else {
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

    // analytics is off in test mode; never let a stray call reach mixpanel
    await page.route('**/*.mixpanel.com/**', async (route) => {
      await route.fulfill({ status: 200, body: '1' });
    });

    await page.goto(startUrl);
    // Refuse analytics first: the banner sits above the welcome modal
    if (isDevEnvironment) await page.getByTestId('consent-refuse').click();
    // Close the welcome modal
    if (hasWelcomeModal) {
      await page.getByTestId('consent-checkbox').check();
      await page.getByTestId('welcome-action').click();
    }
    await page.waitForLoadState();

    await use(page);
  }
});

export { expect } from '@playwright/test';
