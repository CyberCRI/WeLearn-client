// Runs with VITE_ENVIRONMENT=dev (chromium-auth project), where the hidden features page is on
import { test, expect } from './base';

test.describe('features page', () => {
  test('lists the feature flags and how each is on here', async ({ page }) => {
    await page.goto('/features');

    await expect(page.getByRole('heading', { name: 'Fonctionnalités' })).toBeVisible();
    await expect(page.getByTestId('feature-syllabusV2').getByTestId('status')).toHaveText(
      'Allumée'
    );
    // every feature is on in dev: nothing to preview
    await expect(page.getByTestId('start-preview')).toHaveCount(0);
    await page.getByTestId('feature-tutor').getByTestId('open-page').click();
    await expect(page).toHaveURL(/\/tutor/);
  });
});
