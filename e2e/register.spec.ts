import type { Page } from '@playwright/test';
import { test, expect } from './base';

test.describe('register', () => {
  test.use({ startUrl: '/register' });

  // fields are found by their accessible name, as screen readers announce them
  // (the label's visual "*" is aria-hidden, so it is not part of the name)
  const field = (page: Page, name: string) => page.getByRole('textbox', { name, exact: true });

  const fillForm = async (page: Page, email: string) => {
    await field(page, 'Prénom').fill('Ada');
    await field(page, 'Nom').fill('Lovelace');
    await field(page, 'Adresse e-mail').fill(email);
  };

  test('signs up and asks to check the inbox', async ({ page }) => {
    const signup = page.waitForRequest('**/user/signup');
    await fillForm(page, 'ada@test.org');

    await page.getByRole('button', { name: 'Inscription' }).click();

    expect((await signup).postDataJSON()).toEqual({
      email: 'ada@test.org',
      first_name: 'Ada',
      last_name: 'Lovelace'
    });
    const status = page.getByRole('status');
    await expect(status.getByRole('heading', { name: 'Vérifiez votre boîte mail' })).toBeVisible();
    await expect(status).toContainText('ada@test.org');
    await expect(field(page, 'Adresse e-mail')).toBeHidden();
  });

  test('explains an invalid email without calling the API', async ({ page }) => {
    let hasCalledSignup = false;
    page.on('request', (request) => {
      if (request.url().includes('/user/signup')) hasCalledSignup = true;
    });
    await fillForm(page, 'not-an-email');

    await page.getByRole('button', { name: 'Inscription' }).click();

    const email = field(page, 'Adresse e-mail');
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await expect(email).toBeFocused();
    expect(hasCalledSignup).toBe(false);
  });

  test('announces an email that already has an account', async ({ page }) => {
    await page.route('**/user/signup', (route) =>
      route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({
          detail: { message: 'exists', code: 'EMAIL_ALREADY_EXISTS' }
        })
      })
    );
    await fillForm(page, 'ada@test.org');

    await page.getByRole('button', { name: 'Inscription' }).click();

    await expect(page.getByRole('alert')).toContainText('Un compte existe déjà pour cette adresse');
    await expect(field(page, 'Adresse e-mail')).toBeVisible();
  });
});
