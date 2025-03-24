import { getAxios, getSearch, getSDGsFromQuery } from '@/utils/fetch';
import { defineStore } from 'pinia';
import { computed, ref, type Ref } from 'vue';
import type { Document, Corpus, ReducedCorpus, ErrorDetails } from '@/types';
import { getQueryParamValue } from '@/utils/urlsUtils';
import { RELEVANCE_FACTOR } from '@/utils/constants';
import i18n from '@/localisation/i18n';

export const useSearchStore = defineStore('search', () => {
  const allCorpus: Ref<Corpus['name'][]> = ref([]);
  const corpora: Ref<ReducedCorpus[]> = ref([]);
  const hasPartialResult = ref(false);
  const hasSourcesError = ref(false);
  const isFetchingSources = ref(false);
  const sdgFilters: Ref<number[]> = ref([]);
  const sdgsQuery: Ref<string[]> = ref([]);
  const searchInput: Ref<string> = ref('');
  const selectedCorpus: Ref<Corpus['name'][]> = ref([]);
  const sourcesList: Ref<Document[] | null> = ref(null);
  const displayNoResult: Ref<boolean> = ref(false);
  const errorCode: Ref<string> = ref('');
  const storedSubject: Ref<string | undefined> = ref();
  const clearSubject = () => {
    storedSubject.value = undefined;
  };

  const hasError = computed(() => hasSourcesError.value);

  const hasFilters = computed(
    () => sdgFilters.value.length > 0 || storedSubject.value || selectedCorpus.value.length > 0
  );

  const selectSubject = (subject: string) => {
    if (subject === storedSubject.value) {
      clearSubject();
      return;
    }

    storedSubject.value = subject;
  };

  const shouldDisplaySubjects = computed(() => i18n.global.locale.value == 'en');
  const shouldDisplayScore = computed(() => getQueryParamValue('score') === 'true');

  const isSearchDisabled = computed(() => searchInput.value.split(/(\s)/).length <= 5);

  async function getCorpus() {
    if (corpora.value.length > 0) {
      return;
    }

    try {
      const fetchedCorpus = await getAxios('/search/collections');

      const mergedCorpusByLang = fetchedCorpus.reduce((acc: ReducedCorpus[], curr: Corpus) => {
        const existingCorpus = acc.findIndex((corpus: ReducedCorpus) => corpus.name === curr.name);
        if (existingCorpus >= 0) {
          acc[existingCorpus].lang.push(curr.lang);
          return acc;
        }
        return [...acc, { ...curr, lang: [curr.lang] }];
      }, [] as ReducedCorpus[]);

      corpora.value = mergedCorpusByLang;
      allCorpus.value = mergedCorpusByLang.map(({ name }: { name: string }) => name);
    } catch (error: unknown) {
      hasSourcesError.value = true;
    }
  }

  const fetchSources = async () => {
    if (isSearchDisabled.value || isFetchingSources.value) {
      return;
    }
    setFetchingSourcesState();

    try {
      const promises = [
        getSDGsFromQuery(searchInput.value),
        getSearch(
          100,
          {
            query: searchInput.value,
            sdg_filter: sdgFilters.value,
            corpora: selectedCorpus.value,
            relevance_factor: RELEVANCE_FACTOR
          },
          storedSubject.value
        )
      ];
      const [sdgsFromQuery, { data, status }] = await Promise.all(promises);

      sdgsQuery.value = sdgsFromQuery;

      isFetchingSources.value = false;
      sourcesList.value = data;

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
    sourcesList.value = null;
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

  function toggleFilter(index: number) {
    const sdg = index + 1;
    if (sdgFilters.value.includes(sdg)) {
      sdgFilters.value = sdgFilters.value.filter((x) => x !== sdg);
      return;
    }

    sdgFilters.value.push(sdg);

    return sdgFilters.value.sort((a, b) => a - b);
  }
  function clearInput() {
    searchInput.value = '';
  }

  function $reset() {
    searchInput.value = '';
    sdgFilters.value = [];
    sourcesList.value = null;
    hasPartialResult.value = false;
    hasSourcesError.value = false;
    isFetchingSources.value = false;
    selectedCorpus.value = [];
    sdgsQuery.value = [];
  }

  return {
    corpora,
    allCorpus,
    hasPartialResult,
    hasSourcesError,
    isFetchingSources,
    displayNoResult,
    errorCode,
    sdgFilters,
    searchInput,
    selectedCorpus,
    sourcesList,
    isSearchDisabled,
    shouldDisplayScore,
    getCorpus,
    fetchSources,
    setFetchingSourcesState,
    setSourcesError,
    toggleFilter,
    storedSubject,
    selectSubject,
    hasError,
    clearSubject,
    shouldDisplaySubjects,
    clearInput,
    hasFilters,
    sdgsQuery,
    $reset
  };
});
