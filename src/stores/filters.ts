import { defineStore } from 'pinia';
import type { Corpus } from '@/types';
import { ref, computed } from 'vue';

export const useFiltersStore = defineStore('filters', () => {
  const sdgList = ref<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]);
  const sdgFilters = ref<number[]>([]);
  const sourcesFilters = ref<Corpus['name'][]>([]);
  const hasFilters = computed(() => sdgFilters.value.length > 0 || sourcesFilters.value.length > 0);

  const handleSdgFilterChange = (sdg: number) => {
    if (sdgFilters.value.includes(sdg)) {
      sdgFilters.value = sdgFilters.value.filter((item) => item !== sdg);
    } else {
      sdgFilters.value.push(sdg);
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
  };

  return {
    sdgList,
    hasFilters,
    sdgFilters,
    sourcesFilters,
    handleSdgFilterChange,
    handleSourcesFilterChange,
    handleResetFilters
  };
});
