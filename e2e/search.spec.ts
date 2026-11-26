import { test, expect } from './base';

test.describe('search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/search');
  });

  // See here how to get started:
  // https://playwright.dev/docs/intro
  test('visits the app root url', async ({ page }) => {
    await expect(page).toHaveTitle(/WeLearn/);
  });

  test.describe('search input in textarea', () => {
    test('show error if text length is less than 5', async ({ page }) => {
      await page.fill('textarea', 'abcd');
      // expect message to show
      await expect(page.getByTestId('lengthErrorFeedback')).toBeVisible();
      // expect search button to be disabled
      await expect(page.getByLabel('Recherche', { exact: true })).toBeDisabled();
    });

    test('search button should be enabled if text length is greater than 5', async ({ page }) => {
      await page.fill('textarea', 'this is a longer text for testing');
      // expect message to not show
      await expect(
        page.getByText('Veuillez fournir un texte plus long pour la recherche')
      ).not.toBeVisible();
      // expect search button to be enabled
      await expect(page.getByRole('button').nth(1)).toBeEnabled();
    });
  });

  test.describe('sources', () => {
    test('should display list of sources in filtrer on click', async ({ page }) => {
      await expect(page.getByText('fake collection')).toBeVisible();
    });

    test('should select a source', async ({ page }) => {
      await page.getByText('fake collection').click();
      // selected pill + its remove (×) button, labelled "Effacer"
      await expect(page.locator('.selection').getByText('fake collection')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Effacer', exact: true })).toBeVisible();
      await expect(page.locator('#fake-collection')).toBeChecked();
    });
  });

  test.describe('SDGs', () => {
    test('should display SDGs in filtrer', async ({ page }) => {
      await expect(page.getByText('ODD', { exact: true })).toBeVisible();
    });
    test('should display list of SDGs in filtrer on click', async ({ page }) => {
      await expect(page.getByText('1 - Pas de pauvreté')).toBeVisible();
    });
    test('should select a SDG', async ({ page }) => {
      await page.getByText('1 - Pas de pauvreté').click();
      await expect(page.getByLabel('1 - Pas de pauvreté')).toBeChecked();
    });

    test('shows the SDGs of the query, found through the API', async ({ page }) => {
      const sdgRequest = page.waitForRequest('**/search/sdg_classify');
      await page.fill('textarea', 'this is a longer text for testing');
      await page.getByLabel('Recherche', { exact: true }).click();

      expect((await sdgRequest).postDataJSON()).toEqual({
        query: 'this is a longer text for testing'
      });
      const sdgs = page.locator('.sdgs-list');
      await expect(sdgs.getByText('ODD dans la requête')).toBeVisible();
      await expect(sdgs.getByText('6', { exact: true })).toBeVisible();
      await expect(sdgs.getByText('13', { exact: true })).toBeVisible();
    });

    test('searches without SDGs when the classifier is unavailable', async ({ page }) => {
      await page.route('**/search/sdg_classify', (route) =>
        route.fulfill({
          status: 503,
          json: { detail: { message: 'unavailable', code: 'SDG_CLASSIFIER_UNAVAILABLE' } }
        })
      );
      await page.fill('textarea', 'this is a longer text for testing');
      await page.getByLabel('Recherche', { exact: true }).click();

      await expect(page.getByText('Document one test')).toBeVisible();
      await expect(page.locator('.sdgs-list')).toHaveCount(0);
    });
  });
});
