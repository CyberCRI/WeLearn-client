import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useSearchStore } from '../search';
import { useFiltersStore } from '../filters';
import { getSDGsFromQuery, getSearch } from '@/utils/fetch';
import { RELEVANCE_FACTOR } from '@/utils/constants';

vi.mock('@/utils/fetch', () => ({
  getSearch: vi.fn(),
  getSDGsFromQuery: vi.fn()
}));

// 6 words, under 50 characters
const VALID_QUERY = 'how do forests store carbon dioxide';
const DOCS = [{ id: 'doc-1' }];

const mockSearch = (status: number, data: Record<string, unknown> = { docs: DOCS }) => {
  vi.mocked(getSDGsFromQuery).mockResolvedValue(['13', '15']);
  vi.mocked(getSearch).mockResolvedValue({ status, data } as Awaited<ReturnType<typeof getSearch>>);
};

describe('search store', () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.mocked(getSearch).mockReset();
    vi.mocked(getSDGsFromQuery).mockReset();
  });

  describe('isSearchDisabled', () => {
    it.each([
      ['an empty query', ''],
      ['5 short words', 'one two three four five'],
      ['5 words padded with spaces', '  one   two  three four    five  ']
    ])('is disabled for %s', (_, query) => {
      const store = useSearchStore();
      store.searchInput = query;

      expect(store.isSearchDisabled).toBe(true);
    });

    it.each([
      ['more than 5 words', VALID_QUERY],
      ['more than 50 characters', 'photosynthesis-and-carbon-sequestration-in-tropical-forests'],
      ['both', 'what are the effects of deforestation on the carbon cycle worldwide']
    ])('is enabled for %s', (_, query) => {
      const store = useSearchStore();
      store.searchInput = query;

      expect(store.isSearchDisabled).toBe(false);
    });
  });

  it('restores the last search from storage', () => {
    localStorage.setItem('searchInput', JSON.stringify(VALID_QUERY));
    localStorage.setItem('searchResults', JSON.stringify(DOCS));

    const store = useSearchStore();

    expect(store.searchInput).toBe(VALID_QUERY);
    expect(store.searchResults).toEqual(DOCS);
  });

  describe('fetchSources', () => {
    it('does not search when the query is too short', async () => {
      const store = useSearchStore();
      store.searchInput = 'too short';

      await store.fetchSources();

      expect(getSearch).not.toHaveBeenCalled();
    });

    it('does not search twice at the same time', async () => {
      const store = useSearchStore();
      store.searchInput = VALID_QUERY;
      store.isFetchingSources = true;

      await store.fetchSources();

      expect(getSearch).not.toHaveBeenCalled();
    });

    it('searches with the filters and stores the results', async () => {
      mockSearch(200, { docs: DOCS, search_message_id: 'message-1' });
      const filters = useFiltersStore();
      filters.handleSdgFilterChange(13);
      filters.handleLanguageFilterChange('en');
      filters.handleSourcesFilterChange('openalex');
      const store = useSearchStore();
      store.searchInput = VALID_QUERY;

      await store.fetchSources();

      expect(getSDGsFromQuery).toHaveBeenCalledWith(VALID_QUERY);
      expect(getSearch).toHaveBeenCalledWith(
        100,
        { query: VALID_QUERY, lang: ['en'], sdg_filter: [13], corpora: ['openalex'] },
        { relevanceFactor: RELEVANCE_FACTOR }
      );
      expect(store.isFetchingSources).toBe(false);
      expect(store.searchResults).toEqual(DOCS);
      expect(store.sdgsQuery).toEqual(['13', '15']);
      expect(store.hasPartialResult).toBe(false);
      expect(store.displayNoResult).toBe(false);
      expect(JSON.parse(localStorage.getItem('searchInput') || '')).toBe(VALID_QUERY);
      expect(JSON.parse(localStorage.getItem('searchResults') || '')).toEqual(DOCS);
      expect(localStorage.getItem('searchMessageId')).toBe('message-1');
    });

    it('flags a partial result on 206', async () => {
      mockSearch(206);
      const store = useSearchStore();
      store.searchInput = VALID_QUERY;

      await store.fetchSources();

      expect(store.hasPartialResult).toBe(true);
    });

    it('flags an empty result on 204', async () => {
      mockSearch(204, {});
      const store = useSearchStore();
      store.searchInput = VALID_QUERY;

      await store.fetchSources();

      expect(store.displayNoResult).toBe(true);
      expect(store.searchResults).toEqual([]);
      expect(localStorage.getItem('searchMessageId')).toBeNull();
    });

    it('keeps the api error code', async () => {
      vi.mocked(getSDGsFromQuery).mockResolvedValue([]);
      vi.mocked(getSearch).mockRejectedValue({
        response: { status: 500, data: { detail: { code: 'SEARCH_FAILED' } } }
      });
      const store = useSearchStore();
      store.searchInput = VALID_QUERY;

      await store.fetchSources();

      expect(store.hasSourcesError).toBe(true);
      expect(store.hasError).toBe(true);
      expect(store.isFetchingSources).toBe(false);
      expect(store.errorCode).toBe('SEARCH_FAILED');
    });

    it('falls back to an unknown error code when the error has no response', async () => {
      vi.mocked(getSDGsFromQuery).mockResolvedValue([]);
      vi.mocked(getSearch).mockRejectedValue(new Error('Network Error'));
      const store = useSearchStore();
      store.searchInput = VALID_QUERY;

      await store.fetchSources();

      expect(store.hasSourcesError).toBe(true);
      expect(store.errorCode).toBe('UNKNOWN_ERROR');
    });
  });

  it('clears the input', () => {
    const store = useSearchStore();
    store.searchInput = VALID_QUERY;

    store.clearInput();

    expect(store.searchInput).toBe('');
  });

  it('resets the state and the storage', () => {
    localStorage.setItem('searchInput', JSON.stringify(VALID_QUERY));
    localStorage.setItem('searchResults', JSON.stringify(DOCS));
    const store = useSearchStore();
    store.hasPartialResult = true;
    store.hasSourcesError = true;
    store.sdgsQuery = ['13'];

    store.$reset();

    expect(store.searchInput).toBe('');
    expect(store.searchResults).toBeNull();
    expect(store.hasPartialResult).toBe(false);
    expect(store.hasSourcesError).toBe(false);
    expect(store.sdgsQuery).toEqual([]);
    expect(localStorage.getItem('searchInput')).toBeNull();
    expect(localStorage.getItem('searchResults')).toBeNull();
  });
});
