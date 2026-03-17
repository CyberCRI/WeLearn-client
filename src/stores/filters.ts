import { defineStore } from 'pinia';
import type { Corpus } from '@/types';
import { ref, computed } from 'vue';

const SDG_LIST = Array.from({ length: 17 }, (_, i) => i + 1);

export const useFiltersStore = defineStore('filters', () => {
  const sdgList = ref<number[]>(SDG_LIST);
  const sdgFilters = ref<number[]>([]);
  const languageFilters = ref<string[]>([]);
  const sourcesFilters = ref<Corpus['name'][]>([]);
  const hasFilters = computed(
    () =>
      sdgFilters.value.length > 0 ||
      sourcesFilters.value.length > 0 ||
      languageFilters.value.length > 0
  );

  const languageList = ref<Record<string, string>[]>([
    { value: 'en', label: 'english' },
    { value: 'fr', label: 'french' }
  ]);

  const handleSdgFilterChange = (sdg: number) => {
    if (sdgFilters.value.includes(sdg)) {
      sdgFilters.value = sdgFilters.value.filter((item) => item !== sdg);
    } else {
      sdgFilters.value.push(sdg);
    }
  };

  const handleLanguageFilterChange = (language: string) => {
    if (languageFilters.value.includes(language)) {
      languageFilters.value = languageFilters.value.filter((item) => item !== language);
    } else {
      languageFilters.value.push(language);
    }
  };

  const handleSourcesFilterChange = (source: Corpus['name']) => {
    if (sourcesFilters.value.includes(source)) {
      sourcesFilters.value = sourcesFilters.value.filter((item) => item !== source);
    } else {
      sourcesFilters.value.push(source);
    }
  };

  const handleResetFilters = () => {
    sdgFilters.value = [];
    sourcesFilters.value = [];
    languageFilters.value = [];
  };

  return {
    sdgList,
    hasFilters,
    sdgFilters,
    sourcesFilters,
    handleSdgFilterChange,
    handleSourcesFilterChange,
    handleLanguageFilterChange,
    languageList,
    languageFilters,
    handleResetFilters
  };
});
