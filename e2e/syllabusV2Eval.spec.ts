// the self-evaluation of syllabus v2 (flag off in this project, so opened with ?preview), asked
// only the first time in a browser. answers go to /metric/form_data, mocked in base.ts
import type { Page } from '@playwright/test';
import { test, expect } from './base';
import { acceptFirstConnection, confirmCourse } from './coursePath';

test.use({ hasDoneSyllabusEval: false });

// the form_name and question of each answer sent
const formAnswers = (page: Page) => {
  const sent: { form_name: string; question: string; answer: string }[] = [];
  page.on('request', (request) => {
    if (request.url().includes('/metric/form_data')) sent.push(request.postDataJSON());
  });
  return sent;
};

test.describe('Tutor self-evaluation (syllabusV2)', () => {
  test('asks "before" first, sends the answers, then never again', async ({ page }) => {
    const sent = formAnswers(page);
    await page.goto('/tutor?preview=syllabusV2');
    const form = page.getByTestId('syllabus-eval-start');
    await expect(form).toContainText('lien entre mon cours et la transition écologique');
    await expect(page.getByTestId('option-existing')).toHaveCount(0);

    for (const scale of await form.locator('.questionAndScale').all()) {
      await scale.locator('button.scaleValue').first().click();
    }
    await form.locator('.btn-primary').click();

    await expect(page.getByTestId('option-existing')).toBeVisible();
    await expect
      .poll(() => sent.map(({ form_name, question }) => `${form_name}/${question}`))
      .toEqual(['syllabus_v2_pre/link', 'syllabus_v2_pre/confidence']);

    await page.reload();
    await expect(page.getByTestId('option-existing')).toBeVisible();
    await expect(page.getByTestId('syllabus-eval-start')).toHaveCount(0);
  });

  test('a skipped form is not asked again, nothing sent', async ({ page }) => {
    const sent = formAnswers(page);
    await page.goto('/tutor?preview=syllabusV2');
    await page.getByTestId('syllabus-eval-start').locator('.skip-link').click();
    await expect(page.getByTestId('option-existing')).toBeVisible();

    await page.reload();
    await expect(page.getByTestId('option-existing')).toBeVisible();
    expect(sent).toEqual([]);
  });

  test('asks "after" under the updated syllabus once it is downloaded, with the path', async ({
    page
  }) => {
    const sent = formAnswers(page);
    await page.goto('/tutor?preview=syllabusV2');
    await page.getByTestId('syllabus-eval-start').locator('.skip-link').click();
    await confirmCourse(page);
    await acceptFirstConnection(page);
    await page.getByTestId('to-updated').click();

    // the updated syllabus first, no form until it is downloaded
    const updated = page.getByTestId('updated');
    await expect(updated.getByTestId('complete-document')).toBeVisible();
    await expect(page.getByTestId('syllabus-eval-end')).toHaveCount(0);
    const downloading = page.waitForEvent('download');
    await updated.getByTestId('download-complete').click();
    await downloading;

    const form = page.getByTestId('syllabus-eval-end');
    await expect(form).toContainText('Comptez-vous utiliser ce syllabus dans un prochain cours');
    await form.locator('.questionAndScale button.scaleValue').first().click();
    await form.locator('.btn-primary').click();

    await expect(form).toHaveCount(0);
    await expect(updated.getByTestId('complete-document')).toBeVisible();
    await expect
      .poll(() => sent.map(({ question, answer }) => `${question}=${answer}`))
      .toEqual(['link=1', 'path=existing']);
  });
});
