// the hidden features page is only on dev and staging, and a preview never turns it on
import { test, expect } from './base';

test('the features page is not there, even with a preview', async ({ page }) => {
  await page.goto('/features?preview=featuresPage');

  await expect(page).toHaveURL(/\/q-and-a/);
  await expect(page.getByTestId('feature-chat')).toHaveCount(0);
});
