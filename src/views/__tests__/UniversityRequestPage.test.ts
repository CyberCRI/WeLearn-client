import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import UniversityRequestPage from '../UniversityRequestPage.vue';
import { useAuthStore } from '@/stores/auth';

vi.mock('@/utils/keycloak', () => ({ default: { login: vi.fn() } }));

const mountPage = () =>
  mount(UniversityRequestPage, {
    attachTo: document.body,
    global: { stubs: { RouterLink: { props: ['to'], template: '<a :href="to"><slot /></a>' } } }
  });

const fill = async (
  page: ReturnType<typeof mountPage>,
  values: { university?: string; city?: string; email?: string }
) => {
  await page.get('#university-request-university').setValue(values.university ?? '');
  await page.get('#university-request-city').setValue(values.city ?? '');
  await page.get('#university-request-email').setValue(values.email ?? '');
};

const validValues = { university: ' Université de Nantes ', city: 'Nantes' };

describe('UniversityRequestPage', () => {
  let wrapper: ReturnType<typeof mountPage> | undefined;

  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    wrapper?.unmount();
    wrapper = undefined;
    vi.restoreAllMocks();
  });

  it('shows labelled fields, the email one optional', () => {
    wrapper = mountPage();

    expect(wrapper.find('label[for="university-request-university"]').exists()).toBe(true);
    expect(wrapper.find('label[for="university-request-city"]').exists()).toBe(true);
    expect(wrapper.get('#university-request-university').attributes('required')).toBeDefined();
    expect(wrapper.get('#university-request-email').attributes('required')).toBeUndefined();
    expect(wrapper.get('form').attributes('novalidate')).toBeDefined();
  });

  it('blocks an invalid form and focuses the first invalid field', async () => {
    wrapper = mountPage();
    const request = vi.spyOn(useAuthStore(), 'requestUniversity');
    await fill(wrapper, { university: 'UPEC', city: ' ', email: 'not-an-email' });

    await wrapper.get('form').trigger('submit');

    expect(request).not.toHaveBeenCalled();
    const city = wrapper.get('#university-request-city');
    expect(city.attributes('aria-invalid')).toBe('true');
    expect(wrapper.get('#university-request-city-error').text()).toBe(
      'authentication.universityRequest.cityRequired'
    );
    expect(wrapper.get('#university-request-email').attributes('aria-invalid')).toBe('true');
    expect(document.activeElement).toBe(city.element);
  });

  it('updates field errors on blur once a submit failed', async () => {
    wrapper = mountPage();
    await wrapper.get('form').trigger('submit');

    await wrapper.get('#university-request-university').setValue('UPEC');
    await wrapper.get('#university-request-university').trigger('blur');

    expect(
      wrapper.get('#university-request-university').attributes('aria-invalid')
    ).toBeUndefined();
    expect(wrapper.get('#university-request-city').attributes('aria-invalid')).toBe('true');
  });

  it('sends the request and replaces the form with a focused confirmation', async () => {
    wrapper = mountPage();
    const store = useAuthStore();
    const request = vi.spyOn(store, 'requestUniversity').mockImplementation(async () => {
      store.hasRequestedUniversity = true;
    });
    await fill(wrapper, validValues);

    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(request).toHaveBeenCalledWith({
      university: ' Université de Nantes ',
      city: 'Nantes',
      email: ''
    });
    expect(wrapper.find('form').exists()).toBe(false);
    const status = wrapper.get('[role="status"]');
    expect(status.text()).toContain('authentication.universityRequest.successTitle');
    expect(document.activeElement).toBe(status.get('.toaster').element);
    expect(wrapper.text()).toContain('authentication.universityRequest.backToLogin');
  });

  it.each(['RATE_LIMITED', 'EMAIL_UNAVAILABLE', 'EMAIL_DISABLED'])(
    'announces %s and keeps the form',
    async (code) => {
      wrapper = mountPage();
      const store = useAuthStore();
      vi.spyOn(store, 'requestUniversity').mockImplementation(async () => {
        store.universityRequestErrorCode = code;
      });
      await fill(wrapper, validValues);

      await wrapper.get('form').trigger('submit');
      await flushPromises();

      expect(wrapper.get('[role="alert"]').text()).toContain(`authentication.errors.${code}`);
      expect(wrapper.find('form').exists()).toBe(true);
    }
  );

  it('falls back to a generic message for an unknown error code', async () => {
    wrapper = mountPage();
    const store = useAuthStore();
    vi.spyOn(store, 'requestUniversity').mockImplementation(async () => {
      store.universityRequestErrorCode = 'SOMETHING_NEW';
    });
    await fill(wrapper, validValues);

    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(wrapper.get('[role="alert"]').text()).toContain('authentication.errors.UNKNOWN');
  });

  it('tells assistive technologies the submit is in progress', async () => {
    wrapper = mountPage();
    useAuthStore().isRequestingUniversity = true;
    await flushPromises();

    const submit = wrapper.get('[data-testid="university-request-submit"]');
    expect(submit.attributes('aria-busy')).toBe('true');
    expect(submit.text()).toBe('authentication.universityRequest.submitting');
  });

  it('resets the request state when leaving the page', () => {
    const page = mountPage();
    const reset = vi.spyOn(useAuthStore(), 'resetUniversityRequest');

    page.unmount();

    expect(reset).toHaveBeenCalledOnce();
  });

  it('cancels back to the login page', () => {
    wrapper = mountPage();

    expect(wrapper.get('[data-testid="university-request-cancel"]').attributes('href')).toBe(
      '/login'
    );
  });
});
