import { expect, test } from './base';

// foundations and frameworks are only flipped on in dev and staging
test.describe('learn modules (dev)', () => {
  test('lists the three modules in order', async ({ page }) => {
    await page.goto('/learn');
    await expect(page.getByTestId('learn-card-1')).toHaveAttribute('href', /\/learn\/foundations/);
    await expect(page.getByTestId('learn-card-2')).toHaveAttribute('href', /\/learn\/frameworks/);
    await expect(page.getByTestId('learn-card-3')).toHaveAttribute('href', /\/learn\/discipline/);
  });

  test('opens a module from its card', async ({ page }) => {
    await page.goto('/learn?lang=en');
    await page.getByTestId('learn-card-1').click();
    await expect(page).toHaveURL(/\/learn\/foundations/);
    await expect(page.getByRole('heading', { name: 'Sustainability foundations' })).toBeVisible();
  });
});
