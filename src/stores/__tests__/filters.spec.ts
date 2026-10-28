import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useFiltersStore } from '../filters';

describe('filters store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('lists the 17 sdgs and starts without filters', () => {
    const store = useFiltersStore();

    expect(store.sdgList).toEqual(Array.from({ length: 17 }, (_, i) => i + 1));
    expect(store.hasFilters).toBe(false);
  });

  it('toggles an sdg filter', () => {
    const store = useFiltersStore();

    store.handleSdgFilterChange(3);
    expect(store.sdgFilters).toEqual([3]);
    expect(store.hasFilters).toBe(true);

    store.handleSdgFilterChange(3);
    expect(store.sdgFilters).toEqual([]);
    expect(store.hasFilters).toBe(false);
  });

  it('toggles a language filter', () => {
    const store = useFiltersStore();

    store.handleLanguageFilterChange('fr');
    expect(store.languageFilters).toEqual(['fr']);
    expect(store.hasFilters).toBe(true);

    store.handleLanguageFilterChange('fr');
    expect(store.languageFilters).toEqual([]);
  });

  it('toggles a source filter', () => {
    const store = useFiltersStore();

    store.handleSourcesFilterChange('openalex');
    expect(store.sourcesFilters).toEqual(['openalex']);
    expect(store.hasFilters).toBe(true);

    store.handleSourcesFilterChange('openalex');
    expect(store.sourcesFilters).toEqual([]);
  });

  it('ticks the missing sources of a category without duplicates', () => {
    const store = useFiltersStore();
    store.handleSourcesFilterChange('openalex');

    store.toggleCategorySources(['openalex', 'hal']);

    expect(store.sourcesFilters).toEqual(['openalex', 'hal']);
  });

  it('unticks a category when all its sources are ticked', () => {
    const store = useFiltersStore();
    store.handleSourcesFilterChange('other');
    store.toggleCategorySources(['openalex', 'hal']);

    store.toggleCategorySources(['openalex', 'hal']);

    expect(store.sourcesFilters).toEqual(['other']);
  });

  it('resets every filter', () => {
    const store = useFiltersStore();
    store.handleSdgFilterChange(1);
    store.handleLanguageFilterChange('en');
    store.handleSourcesFilterChange('hal');

    store.handleResetFilters();

    expect(store.sdgFilters).toEqual([]);
    expect(store.languageFilters).toEqual([]);
    expect(store.sourcesFilters).toEqual([]);
    expect(store.hasFilters).toBe(false);
  });
});
