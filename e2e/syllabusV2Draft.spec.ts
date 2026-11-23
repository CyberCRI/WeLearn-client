// Runs with VITE_ENVIRONMENT=dev (chromium-auth project): auth and syllabusV2 are on. a draft is
// kept only for a logged-in teacher. the "I have a course" path is mocked in base.ts
import { test, expect } from './base';
import { acceptFirstConnection, confirmCourse } from './coursePath';

test.describe('Tutor existing course path, draft', () => {
  test.use({ loggedIn: true });

  test('keeps a draft on request, and resumes it on the next visit', async ({ page }) => {
    await page.goto('/tutor');
    await confirmCourse(page);
    await acceptFirstConnection(page);
    await expect(page.getByTestId('accepted-count')).toContainText('1 modification acceptée');

    await page.getByTestId('save-draft').click();
    await expect(page.getByTestId('draft-saved')).toBeVisible();

    await page.reload();
    await expect(page.getByTestId('draft-summary')).toContainText('syllabus.txt');
    await page.getByTestId('draft-restore').click();

    // back on the connections, the accepted change with them, the draft still kept
    await expect(page.getByTestId('accepted-count')).toContainText('1 modification acceptée');
    await expect(page.getByTestId('draft-saved')).toBeVisible();
    await page.getByTestId('to-updated').click();
    await expect(page.getByTestId('updated').getByTestId('complete-document')).toBeVisible();
  });

  test('removes the draft on request', async ({ page }) => {
    await page.goto('/tutor');
    await confirmCourse(page);
    await page.getByTestId('save-draft').click();
    await page.getByTestId('remove-draft').click();
    await expect(page.getByTestId('save-draft')).toBeVisible();

    await page.reload();
    await expect(page.getByTestId('option-existing')).toBeVisible();
    await expect(page.getByTestId('draft-resume')).toHaveCount(0);
  });
});

test.describe('Tutor existing course path, draft as a guest', () => {
  test('offers no draft', async ({ page }) => {
    await page.goto('/tutor');
    await confirmCourse(page);

    await expect(page.getByTestId('selected-count')).toBeVisible();
    await expect(page.getByTestId('save-draft')).toHaveCount(0);
  });
});
