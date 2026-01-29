import { defineStore } from 'pinia';
import { getAxios } from '@/utils/fetch';
import { type Ref, ref } from 'vue';
import type { Corpus, ReducedCorpus } from '@/types';
import i18n from '@/localisation/i18n';

export const useSourcesStore = defineStore('sources', () => {
  const sourcesList = ref<ReducedCorpus[]>([]);
  const infoPerCorpus: Ref<[]> = ref([]);
  const totalInQdrant: Ref<number> = ref(0);
  async function getSourcesList() {
    if (sourcesList.value.length > 0) {
      return;
    }

    try {
      const fetchedCorpus = await getAxios('/search/collections');

      const mergedCorpusByLang = fetchedCorpus.reduce((acc: ReducedCorpus[], curr: Corpus) => {
        const existingCorpus = acc.findIndex((corpus: ReducedCorpus) => corpus.name === curr.name);
        if (existingCorpus >= 0) {
          return acc;
        }
        const translated = {
          ...curr,
          translated: i18n.global.t(`corpus.${curr.name}`, `${curr.name.replace('-', ' ')}`)
        };
        return [...acc, translated];
      }, [] as ReducedCorpus[]);

      mergedCorpusByLang.sort((a, b) => a.name.localeCompare(b.name));

      sourcesList.value = mergedCorpusByLang;
      return mergedCorpusByLang;
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
    sourcesList
  };
});
