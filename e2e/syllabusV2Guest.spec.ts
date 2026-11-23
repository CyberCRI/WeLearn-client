// Runs with VITE_ENVIRONMENT=dev (chromium-auth project): auth and syllabusV2 are on, and a
// visitor who has not logged in is a guest. the "I have a course" path is mocked in base.ts
import { test, expect } from './base';
import { acceptFirstConnection, confirmCourse, connectionCards } from './coursePath';
import { syllabusFile } from './data';
import { signInOnKeycloak } from './keycloak';

test.describe('Tutor existing course path, as a guest', () => {
  test('downloads the updated syllabus right after logging in', async ({ page }) => {
    await page.goto('/tutor');
    await confirmCourse(page);
    await acceptFirstConnection(page);
    await page.getByTestId('to-updated').click();

    // a guest is asked to sign up first, and gets no file yet
    let downloads = 0;
    page.on('download', () => downloads++);
    await page.getByTestId('updated').getByTestId('download-complete').click();
    await expect(page.getByTestId('signup-prompt')).toContainText('Votre syllabus est prêt');
    expect(downloads).toBe(0);

    // the course in memory is lost on the way to Keycloak; the file kept for the login is not
    const counted = page.waitForRequest('**/metric/syllabus_downloaded');
    const downloading = page.waitForEvent('download');
    await page.getByTestId('signup-prompt-login').click();
    await signInOnKeycloak(page);

    expect((await downloading).suggestedFilename()).toBe('Ecology-complet-mis-a-jour.docx');
    await counted;
    await expect(page).toHaveURL(/\/tutor/);
  });

  test('is asked to sign up past the daily course changes', async ({ page }) => {
    await page.route('**/tutor/course/adaptation', (route) =>
      route.fulfill({
        status: 403,
        json: {
          detail: { code: 'GUEST_QUOTA_EXCEEDED', feature: 'adaptation', retry_after: 3600 }
        }
      })
    );
    await page.goto('/tutor');
    await confirmCourse(page);
    const card = connectionCards(page).first();
    await card.getByTestId('select').click();
    await card.getByTestId('develop').click();

    await expect(page.getByTestId('signup-prompt')).toContainText(
      'modifications de cours gratuites du jour'
    );
    // the card is back as it was before, ready to develop once signed in
    await expect(card.getByTestId('development')).toHaveCount(0);
    await expect(card.getByTestId('develop')).toBeAttached();
  });

  test('is asked to sign up when the free syllabus of the day is used', async ({ page }) => {
    await page.route('**/user/guest_quota', (route) =>
      route.fulfill({
        json: {
          limited: true,
          chat: { limit: 5, remaining: 5, resets_in: 0 },
          syllabus: { limit: 1, remaining: 0, resets_in: 3600 }
        }
      })
    );
    let isRead = false;
    page.on('request', (request) => {
      if (request.url().includes('/tutor/course/read')) isRead = true;
    });
    await page.goto('/tutor');
    await page.getByTestId('option-existing').click();
    await page.getByTestId('course-file-input').setInputFiles(syllabusFile);
    await page.getByTestId('read-course-button').click();

    await expect(page.getByTestId('signup-prompt')).toContainText('syllabus gratuit du jour');
    expect(isRead).toBe(false);
  });
});
