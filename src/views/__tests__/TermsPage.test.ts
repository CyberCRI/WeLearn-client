import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { nextTick } from 'vue';
import TermsPage from '../TermsPage.vue';
import i18n from '@/localisation/i18n';
import { PRIVACY_POLICY_UPDATED_AT, PRIVACY_POLICY_VERSION } from '@/utils/privacyPolicy';
import { formatDay } from '@/utils/time';

// the params are part of the output, so the date and version can be checked
const mountPage = () =>
  mount(TermsPage, {
    global: {
      mocks: { $t: (key: string, params?: object) => `${key} ${JSON.stringify(params ?? {})}` }
    }
  });

describe('TermsPage', () => {
  const initialLocale = i18n.global.locale.value;

  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    i18n.global.locale.value = initialLocale;
    vi.restoreAllMocks();
  });

  it.each([
    ['fr', 'Qui sommes-nous ?'],
    ['en', 'Who are we?']
  ])('shows the policy bundled with the app in %s, without any request', (locale, heading) => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    i18n.global.locale.value = locale as 'fr' | 'en';

    const wrapper = mountPage();

    expect(wrapper.get('h3').text()).toContain(heading);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('shows the date of the last update and the version', () => {
    i18n.global.locale.value = 'fr';

    const wrapper = mountPage();

    expect(wrapper.get('h1').text()).toContain('privacyPolicy.title');
    const meta = wrapper.get('[data-testid="privacy-policy-version"]').text();
    expect(meta).toContain('privacyPolicy.lastUpdated');
    expect(meta).toContain(`"version":"${PRIVACY_POLICY_VERSION}"`);
    expect(meta).toContain(`"date":"${formatDay(PRIVACY_POLICY_UPDATED_AT, 'fr')}"`);
  });

  it('follows a language change', async () => {
    i18n.global.locale.value = 'fr';
    const wrapper = mountPage();

    i18n.global.locale.value = 'en';
    await nextTick();

    expect(wrapper.get('h3').text()).toContain('Who are we?');
    expect(wrapper.get('[data-testid="privacy-policy-version"]').text()).toContain(
      formatDay(PRIVACY_POLICY_UPDATED_AT, 'en')
    );
  });

  it('falls back to the english text for another language', () => {
    i18n.global.locale.value = 'de' as 'en';

    const wrapper = mountPage();

    expect(wrapper.get('h3').text()).toContain('Who are we?');
  });
});
