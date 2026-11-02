// Runs with VITE_ENVIRONMENT=dev (chromium-auth project): analytics is feature-flipped off elsewhere,
// see nav.spec.ts
import { test, expect } from './base';

test.describe('analytics consent', () => {
  // the footer link is for logged-out users, and /about does not require auth
  test.use({ startUrl: '/about' });

  test('remembers the refusal made on the first visit', async ({ page }) => {
    await page.reload();

    await expect(page.getByTestId('consent-banner')).toHaveCount(0);
  });

  test('can be changed from the footer', async ({ page }) => {
    await page.getByTestId('consent-settings').click();
    await expect(page.getByTestId('consent-banner')).toBeVisible();

    await page.getByTestId('consent-accept').click();

    await expect(page.getByTestId('consent-banner')).toHaveCount(0);
    const consent = await page.evaluate(() => localStorage.getItem('analyticsConsent'));
    expect(JSON.parse(consent || '{}').status).toBe('granted');
  });
});
