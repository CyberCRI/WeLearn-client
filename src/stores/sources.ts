import { defineStore } from 'pinia';
import { getAxios } from '@/utils/fetch';
import { type Ref, ref } from 'vue';
import type { Corpus, ReducedCorpus } from '@/types';
import i18n from '@/localisation/i18n';

export const useSourcesStore = defineStore('sources', () => {
  const sourcesList = ref<ReducedCorpus[]>([]);
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
        return [...acc, curr];
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

  const totalDocs: Ref<number> = ref(0);

  const getNbDocsInBase = async () => {
    if (totalDocs.value > 0) {
      return;
    }
    const response = await getAxios('/search/nb_docs');
    const flooredNb = Math.floor(response.nb_docs / 100) * 100;
    totalDocs.value = new Intl.NumberFormat(i18n.global.locale.value).format(flooredNb);
  };
  return { totalDocs, getNbDocsInBase, getSourcesList, sourcesList };
});
