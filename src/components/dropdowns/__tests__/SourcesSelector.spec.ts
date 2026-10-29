import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import SourcesSelector from '../SourcesSelector.vue';
import { useFiltersStore } from '@/stores/filters';
import type { Corpus } from '@/types';

const corpus = (name: string, category: string): Corpus => ({
  name,
  category,
  is_active: true
});

const AVAILABLE_SOURCES: Record<string, Corpus[]> = {
  papers: [corpus('hal', 'papers'), corpus('plos', 'papers')],
  news: [corpus('conversation', 'news')]
};

const mountSelector = () =>
  mount(SourcesSelector, { props: { availableSources: AVAILABLE_SOURCES } });

describe('SourcesSelector', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('counts the selected sources of each category', () => {
    const filters = useFiltersStore();
    filters.sourcesFilters = ['plos'];
    const wrapper = mountSelector();

    expect(wrapper.findAll('.count').map((count) => count.text())).toEqual(['1/2', '0/1']);
    const papersCheckmark = wrapper.findAll('.category-checkbox')[0].get('.checkmark');
    expect(papersCheckmark.classes()).toContain('indeterminate');
  });

  it('selects, then unselects, every source of a category from its checkbox', async () => {
    const filters = useFiltersStore();
    filters.sourcesFilters = ['plos'];
    const wrapper = mountSelector();
    const papersCheckbox = wrapper.get('#all-papers');

    await papersCheckbox.trigger('change');
    expect([...filters.sourcesFilters].sort()).toEqual(['hal', 'plos']);
    expect(wrapper.findAll('.count')[0].text()).toBe('2/2');

    await papersCheckbox.trigger('change');
    expect(filters.sourcesFilters).toEqual([]);
    expect(wrapper.findAll('.count')[0].text()).toBe('0/2');
  });

  it('selects a single source from its own checkbox', async () => {
    const filters = useFiltersStore();
    const wrapper = mountSelector();

    await wrapper.get('#hal').setValue(true);

    expect(filters.sourcesFilters).toEqual(['hal']);
    expect(wrapper.findAll('.count')[0].text()).toBe('1/2');
  });

  it('folds and unfolds a category from its chevron', async () => {
    const filters = useFiltersStore();
    const wrapper = mountSelector();
    const fold = wrapper.findAll('.fold')[0];

    await fold.trigger('click');
    expect(filters.foldedCategories.papers).toBe(true);
    expect(fold.attributes('aria-expanded')).toBe('false');

    await fold.trigger('click');
    expect(filters.foldedCategories.papers).toBe(false);
  });
});
