import type { Page } from '@playwright/test';
import { test, expect } from './base';

test.describe('register', () => {
  // the welcome form waits for the next normal page
  test.use({ startUrl: '/register', hasWelcomeModal: false });

  // fields are found by their accessible name, as screen readers announce them
  // (the label's visual "*" is aria-hidden, so it is not part of the name)
  const field = (page: Page, name: string) => page.getByRole('textbox', { name, exact: true });

  const fillForm = async (page: Page, email: string) => {
    await field(page, 'Prénom').fill('Ada');
    await field(page, 'Nom').fill('Lovelace');
    await field(page, 'Adresse e-mail').fill(email);
  };

  test('does not show the welcome form on the register page', async ({ page }) => {
    await expect(field(page, 'Adresse e-mail')).toBeVisible();
    await expect(page.getByTestId('welcome-action')).toBeHidden();

    await page.goto('/about');

    await expect(page.getByTestId('welcome-action')).toBeVisible();
  });

  test('signs up and asks to check the inbox', async ({ page }) => {
    const signup = page.waitForRequest('**/user/signup');
    await fillForm(page, 'ada@test.org');

    await page.getByRole('button', { name: 'Inscription' }).click();

    expect((await signup).postDataJSON()).toEqual({
      email: 'ada@test.org',
      first_name: 'Ada',
      last_name: 'Lovelace',
      locale: 'fr'
    });
    const status = page.getByRole('status');
    await expect(status.getByRole('heading', { name: 'Vérifiez votre boîte mail' })).toBeVisible();
    await expect(status).toContainText('ada@test.org');
    await expect(field(page, 'Adresse e-mail')).toBeHidden();
  });

  test('signs up in the language of the keycloak sign-up link', async ({ page }) => {
    // the keycloak login page links to /register?lang=<its language>
    await page.goto('/register?lang=en');
    const signup = page.waitForRequest('**/user/signup');
    await field(page, 'First name').fill('Ada');
    await field(page, 'Last name').fill('Lovelace');
    await field(page, 'Email').fill('ada@test.org');

    await page.getByRole('button', { name: 'Sign up' }).click();

    expect((await signup).postDataJSON()).toMatchObject({ locale: 'en' });
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

  test('announces too many attempts', async ({ page }) => {
    await page.route('**/user/signup', (route) =>
      route.fulfill({
        status: 429,
        contentType: 'application/json',
        headers: { 'Retry-After': '3600' },
        body: JSON.stringify({
          detail: { message: 'Too many sign-up attempts', code: 'RATE_LIMITED' }
        })
      })
    );
    await fillForm(page, 'ada@test.org');

    await page.getByRole('button', { name: 'Inscription' }).click();

    await expect(page.getByRole('alert')).toContainText('Trop de tentatives');
    await expect(field(page, 'Adresse e-mail')).toBeVisible();
  });
});
