import { defineStore } from 'pinia';
import { getAxios } from '@/utils/fetch';
import { type Ref, ref } from 'vue';
import type { Corpus } from '@/types';

export const useSourcesStore = defineStore('sources', () => {
  const categorySourceMap = ref<Record<string, Corpus[]> | null>(null);
  const sourceCategoryMap: Ref<Record<string, string>> = ref({});
  const infoPerCorpus: Ref<[]> = ref([]);
  const totalInQdrant: Ref<number> = ref(0);
  async function getSourcesList() {
    if (categorySourceMap.value && Object.keys(categorySourceMap.value).length > 0) {
      return;
    }

    try {
      const fetchedCorpus = await getAxios('/search/collections');
      fetchedCorpus.sort((a: Corpus, b: Corpus) => a.name.localeCompare(b.name));

      const corpusByCategory: Record<string, Corpus[]> = fetchedCorpus.reduce(
        (acc: Record<string, Corpus[]>, corpus: Corpus) => {
          if (!acc[corpus.category]) {
            acc[corpus.category] = [];
          }
          acc[corpus.category].push(corpus);
          return acc;
        },
        {}
      );

      sourceCategoryMap.value = fetchedCorpus.reduce(
        (acc: Record<string, string>, corpus: Corpus) => {
          acc[corpus.name] = corpus.category;
          return acc;
        },
        {}
      );

      categorySourceMap.value = corpusByCategory;
      return corpusByCategory;
    } catch (error: unknown) {
      // handle error
      console.error('Error fetching sources list:', error);
      throw error;
    }
  }

  const getInfoPerCorpus = async () => {
    if (infoPerCorpus.value.length > 0) {
      return;
    }
    try {
      const response = await getAxios('/metric/nb_docs_info_per_corpus');
      infoPerCorpus.value = response;
      const totalDocsInQdrant = response.reduce((acc, curr) => {
        acc = acc + curr.qty_in_qdrant;
        return acc;
      }, 0);
      totalInQdrant.value = totalDocsInQdrant;
    } catch {
      console.error('unable to get info per corpus');
      infoPerCorpus.value = [];
    }
  };

  return {
    totalInQdrant,
    infoPerCorpus,
    getInfoPerCorpus,
    getSourcesList,
    sourcesList: categorySourceMap,
    sourceCategoryMap
  };
});
