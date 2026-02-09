import { getSearch, getSDGsFromQuery } from '@/utils/fetch';
import { defineStore } from 'pinia';
import { computed, ref, type Ref } from 'vue';
import type { Document, Corpus, ErrorDetails } from '@/types';
import { getQueryParamValue } from '@/utils/urlsUtils';
import { RELEVANCE_FACTOR } from '@/utils/constants';
import i18n from '@/localisation/i18n';
import { useFiltersStore } from '@/stores/filters';

export const useSearchStore = defineStore('search', () => {
  const allCorpus: Ref<Corpus['name'][]> = ref([]);
  const hasPartialResult = ref(false);
  const hasSourcesError = ref(false);
  const isFetchingSources = ref(false);
  const sdgsQuery: Ref<string[]> = ref([]);
  const searchInput: Ref<string> = ref('');
  const displayNoResult: Ref<boolean> = ref(false);
  const errorCode: Ref<string> = ref('');
  const searchResults: Ref<Document[] | null> = ref(null);

  const hasError = computed(() => hasSourcesError.value);

  const shouldDisplaySubjects = computed(() => i18n.global.locale.value == 'en');
  const shouldDisplayScore = computed(() => getQueryParamValue('score') === 'true');

  const isSearchDisabled =
    computed(() => searchInput.value.split(/(\s)/).length <= 5) ||
    searchInput.value.split('').length <= 50;

  const fetchSources = async () => {
    if (isSearchDisabled.value || isFetchingSources.value) {
      return;
    }
    const { sdgFilters, sourcesFilters } = useFiltersStore();
    setFetchingSourcesState();

    try {
      const promises = [
        getSDGsFromQuery(searchInput.value),
        getSearch(100, {
          query: searchInput.value,
          sdg_filter: sdgFilters,
          corpora: sourcesFilters,
          relevance_factor: RELEVANCE_FACTOR
        })
      ];
      const [sdgsFromQuery, { data, status }] = await Promise.all(promises);

      sdgsQuery.value = sdgsFromQuery;

      isFetchingSources.value = false;
      searchResults.value = data;

      if (status === 206) {
        hasPartialResult.value = true;
      }
      if (status === 204) {
        displayNoResult.value = true;
      }
    } catch (error: unknown) {
      setSourcesError();
      const currError = error as ErrorDetails;
      errorCode.value = currError.response.data.detail.code || 'UNKNOWN_ERROR';
    }
  };

  const setFetchingSourcesState = () => {
    hasPartialResult.value = false;
    hasSourcesError.value = false;
    searchResults.value = null;
    displayNoResult.value = false;
    sdgsQuery.value = [];

    isFetchingSources.value = true;
  };

  const setSourcesError = () => {
    isFetchingSources.value = false;
    hasPartialResult.value = false;
    displayNoResult.value = false;

    hasSourcesError.value = true;
  };

  function clearInput() {
    searchInput.value = '';
  }

  function $reset() {
    searchInput.value = '';
    searchResults.value = null;
    hasPartialResult.value = false;
    hasSourcesError.value = false;
    isFetchingSources.value = false;
    sdgsQuery.value = [];
  }

  return {
    allCorpus,
    hasPartialResult,
    hasSourcesError,
    isFetchingSources,
    displayNoResult,
    errorCode,
    searchInput,
    isSearchDisabled,
    shouldDisplayScore,
    fetchSources,
    setFetchingSourcesState,
    setSourcesError,
    hasError,
    shouldDisplaySubjects,
    clearInput,
    sdgsQuery,
    searchResults,
    $reset
  };
});
