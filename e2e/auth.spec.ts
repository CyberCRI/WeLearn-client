// Runs with VITE_ENVIRONMENT=dev (chromium-auth project), like staging (auth is on in dev and staging)
import { test, expect } from './base';
import { fakeUser, keycloakSignIn, signInOnKeycloak } from './keycloak';

const fullName = `${fakeUser.firstName} ${fakeUser.lastName}`;

test.describe('auth', () => {
  test.describe('logged out', () => {
    test.use({ startUrl: '/about' });

    test('user menu offers to log in', async ({ page }) => {
      await page.getByTestId('user-menu-trigger').click();
      await expect(page.getByTestId('user-menu-login')).toBeVisible();
      await expect(page.getByTestId('user-menu-logout')).toHaveCount(0);
      await expect(page.getByTestId('user-menu-profile')).toHaveCount(0);
    });

    test('bookmarks in the user menu ask to sign up', async ({ page }) => {
      await page.getByTestId('user-menu-trigger').click();
      await page.getByTestId('user-menu-bookmarks').click();

      await expect(page.getByTestId('signup-prompt-register')).toBeVisible();
      await page.getByTestId('signup-prompt-register').click();
      await expect(page).toHaveURL(/\/register/);
    });

    test('logs in from the user menu', async ({ page, keycloak }) => {
      await page.getByTestId('user-menu-trigger').click();
      await page.getByTestId('user-menu-login').click();
      await signInOnKeycloak(page);

      await expect(page.getByTestId('user-menu').getByText(fullName)).toBeAttached();
      expect(keycloak.loggedIn).toBe(true);

      await page.getByTestId('user-menu-trigger').click();
      await expect(page.getByTestId('user-menu-logout')).toBeVisible();
    });

    test('a protected page asks to log in, then opens', async ({ page }) => {
      await page.goto('/profile');
      await signInOnKeycloak(page);

      await expect(page).toHaveURL(/\/profile/);
      await expect(page.getByTestId('user-menu').getByText(fullName)).toBeAttached();
    });
  });

  test.describe('guest', () => {
    test.use({ startUrl: '/about' });

    test.beforeEach(async ({ page }) => {
      // let the first search run as a guest
      await page.goto('/search');
    });

    test('can search, and is asked to sign up to bookmark', async ({ page }) => {
      await expect(keycloakSignIn(page)).toHaveCount(0);
      await page.fill('textarea', 'this is a longer text for testing');
      await page.getByLabel('Recherche', { exact: true }).click();
      await expect(page.getByText('Document one test')).toBeVisible();

      await page
        .getByTestId('result-row')
        .filter({ hasText: 'Document one test' })
        .getByTestId('toggleBookmark')
        .click();

      await expect(page.getByTestId('signup-prompt-login')).toBeVisible();
    });

    test('opening the bookmarks page asks to sign up', async ({ page }) => {
      await page.goto('/bookmarks');

      await expect(page.getByTestId('signup-prompt-register')).toBeVisible();
      await expect(page).not.toHaveURL(/\/bookmarks/);
    });

    test('sees how many free questions and syllabi are left', async ({ page }) => {
      await page.goto('/q-and-a');
      await expect(page.getByTestId('guest-quota-text')).toContainText('5');

      await page.goto('/tutor');
      await expect(page.getByTestId('guest-quota-text')).toContainText('1 syllabus');
    });

    test('is asked to sign up after the last free question', async ({ page }) => {
      await page.evaluate(() =>
        localStorage.setItem('guestUsage', JSON.stringify({ chat: 5, syllabus: 0 }))
      );
      await page.goto('/q-and-a');

      await page.fill('textarea', 'one more question');
      await page.keyboard.press('Enter');

      await expect(page.getByTestId('signup-prompt-register')).toBeVisible();
    });

    test('logs in from the signup prompt and comes back to the page', async ({ page }) => {
      await page.getByTestId('user-menu-trigger').click();
      await page.getByTestId('user-menu-bookmarks').click();
      await page.getByTestId('signup-prompt-login').click();
      await signInOnKeycloak(page);

      await expect(page).toHaveURL(/\/search/);
      await expect(page.getByTestId('user-menu').getByText(fullName)).toBeAttached();
    });
  });

  test.describe('logged in', () => {
    test.use({ loggedIn: true });

    test('restores the session and shows the user name', async ({ page }) => {
      await page.getByTestId('user-menu-trigger').click();
      await expect(page.getByTestId('user-menu').getByText(fullName)).toBeVisible();
      await expect(page.getByTestId('user-menu-login')).toHaveCount(0);
    });

    test('the user menu opens from the keyboard and closes after a choice', async ({ page }) => {
      const trigger = page.getByTestId('user-menu-trigger');
      const profile = page.getByTestId('user-menu-profile');

      await trigger.focus();
      await page.keyboard.press('Enter');
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      await expect(profile).toBeVisible();

      await page.keyboard.press('Escape');
      await expect(profile).toBeHidden();
      await expect(trigger).toBeFocused();

      await page.keyboard.press('Enter');
      await profile.click();
      await expect(page).toHaveURL(/\/profile/);
      // still hovered and focused, but closed
      await expect(profile).toBeHidden();
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    test.describe('with a chat on the account', () => {
      test.beforeEach(async ({ page }) => {
        await page.route('**/qna/chat/threads/latest', (route) =>
          route.fulfill({ json: { thread_id: 'account-thread' } })
        );
        await page.route('**/qna/chat/history**', (route) =>
          route.fulfill({
            json: [
              { role: 'user', content: 'A question asked on another device' },
              { role: 'assistant', content: 'Its answer' }
            ]
          })
        );
        // the first boot of the fixture already looked up the latest chat (none) for this login:
        // forget it, as on a device this account never logged in on
        await page.evaluate(() => localStorage.removeItem('chatRestoredFor'));
        await page.reload();
      });

      test('gets it back', async ({ page }) => {
        await expect(page.getByText('A question asked on another device')).toBeVisible();
        await expect(page.getByText('Its answer')).toBeVisible();
      });

      test('erases it in the api too', async ({ page }) => {
        await page.locator('.chat-toolbar button').click();
        const deletion = page.waitForRequest(
          (request) =>
            request.method() === 'DELETE' &&
            request.url().endsWith('/qna/chat/threads/account-thread')
        );
        await page.locator('.modal .is-danger').click();

        await deletion;
        await expect(page.getByText('A question asked on another device')).toHaveCount(0);

        // restored once per login: a reload does not look the latest chat up again
        const latestCalls: string[] = [];
        page.on('request', (request) => {
          if (request.url().includes('/qna/chat/threads/latest')) latestCalls.push(request.url());
        });
        await page.reload();
        await page.waitForLoadState('networkidle');
        expect(latestCalls).toHaveLength(0);
        await expect(page.getByText('A question asked on another device')).toHaveCount(0);
      });
    });

    test('logs out from the user menu', async ({ page, keycloak }) => {
      await page.evaluate(() =>
        localStorage.setItem('chat', JSON.stringify([{ role: 'user', content: 'q' }]))
      );
      const apiLogout = page.waitForRequest(
        (request) => request.url().includes('/user/logout') && request.method() === 'POST'
      );
      await page.getByTestId('user-menu-trigger').click();
      await page.getByTestId('user-menu-logout').click();
      await apiLogout;

      // back home as a guest, with an empty chat
      await page.getByTestId('user-menu-trigger').click();
      await expect(page.getByTestId('user-menu-login')).toBeVisible();
      expect(keycloak.logoutCalls).toBe(1);
      expect(keycloak.loggedIn).toBe(false);
      expect(await page.evaluate(() => JSON.parse(localStorage.getItem('chat') || '[]'))).toEqual(
        []
      );
      // the user asked for it, so no "session expired" message
      await expect(page.getByTestId('session-expired')).toHaveCount(0);
    });

    test('explains a forced logout after a 401, and offers to log in again', async ({
      page,
      keycloak
    }) => {
      // the API refuses the session: the bookmarks loaded at boot get a 401
      await page.route('**/user/bookmarks**', (route) => route.fulfill({ status: 401 }));
      await page.reload();

      await expect(page.getByTestId('session-expired')).toBeVisible();
      expect(keycloak.logoutCalls).toBe(1);
      expect(keycloak.loggedIn).toBe(false);

      // the API accepts the new session, otherwise the boot 401 would log out again
      await page.unroute('**/user/bookmarks**');
      await page.getByTestId('session-expired-login').click();
      await signInOnKeycloak(page);

      await page.getByTestId('user-menu-trigger').click();
      await expect(page.getByTestId('user-menu').getByText(fullName)).toBeVisible();
      await expect(page.getByTestId('session-expired')).toHaveCount(0);
    });
  });
});
