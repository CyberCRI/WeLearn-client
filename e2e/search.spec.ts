import { test, expect } from '@playwright/test';

test.describe('search', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/**/search/collections', async (route) => {
      const json = [{ name: 'fake-collections', id: 21 }];
      await route.fulfill({ json });
    });

    await page.goto('/search');
    // close welcome modal
    await page.getByTestId('close').click();
  });

  // See here how to get started:
  // https://playwright.dev/docs/intro
  test('visits the app root url', async ({ page }) => {
    await expect(page).toHaveTitle(/WeLearn/);
  });

  test.describe('select a subject', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByText('Anglais').click();
    });
    test('click on select a subject', async ({ page }) => {
      await page.getByRole('button', { name: 'Adapt to subject' }).click();
      await expect(page.getByText('Biology')).toBeVisible();
    });

    test('select a subject', async ({ page }) => {
      await page.getByRole('button', { name: 'Adapt to subject' }).click();
      await page.click('text=Biology');
      await expect(page.getByRole('button', { name: 'Biology' })).toBeVisible();
    });

    test('unselect a subject', async ({ page }) => {
      await page.getByRole('button', { name: 'Adapt to subject' }).click();
      // select biology
      await page.click('text=Biology');
      await expect(page.getByRole('button', { name: 'Biology' })).toBeVisible();
      await page.click('text=Biology');
      // unselect biologu
      await page.locator(':nth-match(:text("Biology"), 2)').click();
      await expect(page.getByRole('button', { name: 'Biology' })).not.toBeVisible();
    });

    test('subjects should not be visible when in french', async ({ page }) => {
      await page.getByText('French').click();

      await expect(page.getByText('Select a subject')).not.toBeVisible();
    });
  });

  test.describe('search input in textarea', () => {
    test('show error if text length is less than 5', async ({ page }) => {
      await page.fill('textarea', 'abcd');
      // expect message to show
      await expect(
        page.getByText('Veuillez fournir un texte plus long pour la recherche')
      ).toBeVisible();
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
    test('should display sources in filtrer', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'Filtrer par source' })).toBeVisible();
    });

    test('should display list of sources in filtrer on click', async ({ page }) => {
      await page.getByRole('button', { name: 'Filtrer par source' }).click();
      await expect(page.getByText('Fake Collections')).toBeVisible();
    });

    test('should select a source', async ({ page }) => {
      await page.getByRole('button', { name: 'Filtrer par source' }).click();
      await page.getByText('Fake Collections').click();
      await expect(page.getByRole('button', { name: /^filtré/i })).toBeVisible();
      await expect(page.getByRole('checkbox')).toBeChecked();
    });

    test('should deselect all sourcess', async ({ page }) => {
      await page.getByRole('button', { name: /source/i }).click();
      await page.getByText('Fake Collections').click();
      await page.getByRole('menu').getByText('Effacer').click();
      await expect(page.getByRole('checkbox')).not.toBeChecked();
    });
  });

  test.describe('SDGs', () => {
    test('should display SDGs in filtrer', async ({ page }) => {
      await expect(page.getByRole('button', { name: /ODD/ })).toBeVisible();
    });
    test('should display list of SDGs in filtrer on click', async ({ page }) => {
      await page.getByRole('button', { name: /ODD/ }).click();
      await expect(page.getByText('1 - Pas de pauvreté')).toBeVisible();
    });
    test('last SDG should be disabled', async ({ page }) => {
      await page.getByRole('button', { name: 'Filtrer par ODD' }).click();
      await expect(
        page.getByText('17 - Partenariats pour la réalisation des objectifs')
      ).toBeDisabled();
    });
    test('should select a SDG', async ({ page }) => {
      await page.getByRole('button', { name: /ODD/i }).click();
      await page.getByText('1 - Pas de pauvreté').click();
      await expect(page.getByRole('button', { name: /filtré/i })).toBeVisible();
      await expect(page.getByLabel('1 - Pas de pauvreté')).toBeChecked();
    });
  });
});
