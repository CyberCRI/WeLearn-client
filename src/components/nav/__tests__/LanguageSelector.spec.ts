import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import LanguageSelector from '../LanguageSelector.vue';

const updateLocale = vi.fn();

vi.mock('@/composables/useAuth', () => ({
  useAuth: () => ({ updateLocale })
}));

describe('LanguageSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.removeItem('language');
  });

  afterEach(() => {
    localStorage.removeItem('language');
  });

  it('stores the chosen language and sends it to the user profile', async () => {
    const i18n = { locale: 'fr', availableLocales: ['en', 'fr'] };
    const wrapper = mount(LanguageSelector, { global: { mocks: { $i18n: i18n } } });

    expect(wrapper.findAll('option').map((option) => option.text())).toEqual(['EN', 'FR']);

    await wrapper.get('select').setValue('en');

    expect(i18n.locale).toBe('en');
    expect(localStorage.getItem('language')).toBe('en');
    expect(updateLocale).toHaveBeenCalledWith('en');
  });
});
