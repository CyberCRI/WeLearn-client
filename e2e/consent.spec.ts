import { test, expect } from './base';

test.describe('analytics consent', () => {
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

  test('never contacts mixpanel in test mode', async ({ page }) => {
    const mixpanelCalls: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes('mixpanel.com')) mixpanelCalls.push(request.url());
    });

    await page.getByTestId('consent-settings').click();
    await page.getByTestId('consent-accept').click();
    await page.getByTestId('nav-search').click();

    expect(mixpanelCalls).toEqual([]);
  });
});
