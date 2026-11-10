import { expect, test } from './base';

test.describe('learn', () => {
  test('the nav opens the module list, and the old micro-learning url still works', async ({
    page
  }) => {
    await page.goto('/q-and-a');
    await page.getByTestId('nav-learn').click();
    await expect(page).toHaveURL(/\/learn$/);
    await expect(page.getByTestId('learn-card-1')).toBeVisible();
    await expect(page.getByTestId('learn-card-3')).toBeVisible();

    await page.goto('/microlearning');
    await expect(page).toHaveURL(/\/learn\/discipline/);
  });

  test('opens a module from its card', async ({ page }) => {
    await page.goto('/learn?lang=en');
    await page.getByTestId('learn-card-1').click();
    await expect(page).toHaveURL(/\/learn\/foundations/);
    await expect(page.getByRole('heading', { name: 'Sustainability foundations' })).toBeVisible();
  });
});
