import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import LanguageSelector from '../LanguageSelector.vue';
import { setAnalyticsProperties, track } from '@/utils/analytics';

vi.mock('@/utils/analytics', () => ({ setAnalyticsProperties: vi.fn(), track: vi.fn() }));

describe('LanguageSelector', () => {
  beforeEach(() => {
    localStorage.removeItem('language');
  });

  afterEach(() => {
    localStorage.removeItem('language');
  });

  it('stores the chosen language', async () => {
    const i18n = { locale: 'fr', availableLocales: ['en', 'fr'] };
    const wrapper = mount(LanguageSelector, { global: { mocks: { $i18n: i18n } } });

    expect(wrapper.findAll('option').map((option) => option.text())).toEqual(['EN', 'FR']);

    await wrapper.get('select').setValue('en');

    expect(i18n.locale).toBe('en');
    expect(localStorage.getItem('language')).toBe('en');
    expect(track).toHaveBeenCalledWith('Language Changed', { language: 'en' });
    expect(setAnalyticsProperties).toHaveBeenCalledWith({ language: 'en' });
  });
});
