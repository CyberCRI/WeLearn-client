import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import RegisterPage from '../RegisterPage.vue';
import { useAuthStore } from '@/stores/auth';

vi.mock('@/utils/keycloak', () => ({ default: { login: vi.fn() } }));
// the login button only shows where keycloak is rolled out
vi.mock('@/utils/env', () => ({ IS_DEV_ENVIRONMENT: true }));

const mountPage = () =>
  mount(RegisterPage, {
    attachTo: document.body,
    global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } }
  });

const fill = async (
  page: ReturnType<typeof mountPage>,
  values: { firstName?: string; lastName?: string; email?: string }
) => {
  await page.get('#register-first-name').setValue(values.firstName ?? '');
  await page.get('#register-last-name').setValue(values.lastName ?? '');
  await page.get('#register-email').setValue(values.email ?? '');
};

const validValues = { firstName: 'Ada', lastName: 'Lovelace', email: ' ada@test.org ' };

describe('RegisterPage', () => {
  let wrapper: ReturnType<typeof mountPage> | undefined;

  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
    vi.restoreAllMocks();
  });

  it('shows labelled fields and no password field', () => {
    wrapper = mountPage();

    expect(wrapper.find('input[type="password"]').exists()).toBe(false);
    expect(wrapper.find('label[for="register-email"]').exists()).toBe(true);
    expect(wrapper.get('#register-email').attributes('autocomplete')).toBe('email');
    expect(wrapper.get('form').attributes('novalidate')).toBeDefined();
    expect(wrapper.find('[role="status"]').exists()).toBe(true);
    expect(wrapper.find('[role="alert"]').exists()).toBe(true);
  });

  it('blocks an invalid form, explains why and focuses the first invalid field', async () => {
    wrapper = mountPage();
    const register = vi.spyOn(useAuthStore(), 'register');
    await fill(wrapper, { firstName: 'Ada', lastName: '', email: 'not-an-email' });

    await wrapper.get('form').trigger('submit');

    expect(register).not.toHaveBeenCalled();
    const lastName = wrapper.get('#register-last-name');
    expect(lastName.attributes('aria-invalid')).toBe('true');
    expect(wrapper.get('#register-last-name-error').text()).toBe('authentication.lastNameRequired');
    expect(wrapper.get('#register-email').attributes('aria-invalid')).toBe('true');
    expect(wrapper.get('#register-first-name').attributes('aria-invalid')).toBeUndefined();
    expect(document.activeElement).toBe(lastName.element);
  });

  it('does not flag fields on blur before the first submit', async () => {
    wrapper = mountPage();

    for (const id of ['#register-first-name', '#register-last-name', '#register-email']) {
      await wrapper.get(id).trigger('blur');
      expect(wrapper.get(id).attributes('aria-invalid')).toBeUndefined();
    }
  });

  it('updates field errors on blur once a submit failed', async () => {
    wrapper = mountPage();
    await fill(wrapper, { email: 'bad' });
    await wrapper.get('form').trigger('submit');

    await wrapper.get('#register-first-name').setValue('Ada');
    await wrapper.get('#register-first-name').trigger('blur');
    await wrapper.get('#register-last-name').trigger('blur');
    await wrapper.get('#register-email').setValue('ada@test.org');
    await wrapper.get('#register-email').trigger('blur');

    expect(wrapper.get('#register-first-name').attributes('aria-invalid')).toBeUndefined();
    expect(wrapper.get('#register-last-name').attributes('aria-invalid')).toBe('true');
    expect(wrapper.get('#register-email').attributes('aria-invalid')).toBeUndefined();
  });

  it('registers and replaces the form with a focused confirmation', async () => {
    wrapper = mountPage();
    const store = useAuthStore();
    const register = vi.spyOn(store, 'register').mockImplementation(async () => {
      store.hasRegistered = true;
    });
    await fill(wrapper, validValues);

    await wrapper.get('form').trigger('submit');
    await flushPromises();

    // email inputs strip surrounding spaces themselves
    expect(register).toHaveBeenCalledWith({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@test.org'
    });
    expect(wrapper.find('form').exists()).toBe(false);
    const status = wrapper.get('[role="status"]');
    expect(status.text()).toContain('authentication.successTitle');
    expect(status.find('h2').exists()).toBe(true);
    expect(document.activeElement).toBe(status.get('.toaster').element);
  });

  it('announces an existing account and offers to log in', async () => {
    wrapper = mountPage();
    const store = useAuthStore();
    vi.spyOn(store, 'register').mockImplementation(async () => {
      store.registerErrorCode = 'EMAIL_ALREADY_EXISTS';
    });
    const login = vi.spyOn(store, 'login').mockImplementation(() => {});
    await fill(wrapper, validValues);

    await wrapper.get('form').trigger('submit');
    await flushPromises();

    const alert = wrapper.get('[role="alert"]');
    expect(alert.text()).toContain('authentication.errors.EMAIL_ALREADY_EXISTS');
    expect(wrapper.find('form').exists()).toBe(true);
    await wrapper.get('[data-testid="register-login"]').trigger('click');
    expect(login).toHaveBeenCalled();
  });

  it('falls back to a generic message for an unknown error code', async () => {
    wrapper = mountPage();
    const store = useAuthStore();
    vi.spyOn(store, 'register').mockImplementation(async () => {
      store.registerErrorCode = 'SOMETHING_NEW';
    });
    await fill(wrapper, validValues);

    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(wrapper.get('[role="alert"]').text()).toContain('authentication.errors.UNKNOWN');
  });

  it('puts an email refused by the API on the email field', async () => {
    wrapper = mountPage();
    const store = useAuthStore();
    vi.spyOn(store, 'register').mockImplementation(async () => {
      store.registerErrorCode = 'INVALID_EMAIL';
    });
    await fill(wrapper, validValues);

    await wrapper.get('form').trigger('submit');
    await flushPromises();

    const email = wrapper.get('#register-email');
    expect(email.attributes('aria-invalid')).toBe('true');
    expect(wrapper.get('[role="alert"]').text()).toBe('');
    expect(document.activeElement).toBe(email.element);
  });

  it('tells assistive technologies the submit is in progress', async () => {
    wrapper = mountPage();
    useAuthStore().isRegistering = true;
    await flushPromises();

    const submit = wrapper.get('[data-testid="register-submit"]');
    expect(submit.attributes('aria-busy')).toBe('true');
    expect(submit.attributes('disabled')).toBeUndefined();
    expect(submit.text()).toBe('authentication.submitting');
  });

  it('resets the register state when leaving the page', () => {
    const page = mountPage();
    const reset = vi.spyOn(useAuthStore(), 'resetRegister');

    page.unmount();

    expect(reset).toHaveBeenCalled();
  });
});
