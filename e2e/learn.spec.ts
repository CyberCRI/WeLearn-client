import { expect, test } from './base';

// the test env is flipped like prod: the hub lists only the discipline module.
// the dev-only modules are covered by learnModules.spec.ts
test.describe('learn', () => {
  test('the nav opens the module list, and the old micro-learning url still works', async ({
    page
  }) => {
    await page.goto('/q-and-a');
    await page.getByTestId('nav-learn').click();
    await expect(page).toHaveURL(/\/learn$/);
    await expect(page.getByTestId('learn-card-1')).toBeVisible();
    await expect(page.getByTestId('learn-card-2')).toHaveCount(0);

    await page.goto('/microlearning');
    await expect(page).toHaveURL(/\/learn\/discipline/);
  });

  test('lists only the discipline module, numbered 1', async ({ page }) => {
    await page.goto('/learn?lang=en');
    await page.getByTestId('learn-card-1').click();
    await expect(page).toHaveURL(/\/learn\/discipline/);
  });

  test('sends a module that is off back to the hub', async ({ page }) => {
    await page.goto('/learn/foundations');
    await expect(page).toHaveURL(/\/learn$/);
  });
});
