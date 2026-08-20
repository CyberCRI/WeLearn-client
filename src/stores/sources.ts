import { defineStore } from 'pinia';
import { baseGetAxios } from '@/utils/fetch';
import { type Ref, ref } from 'vue';
import type { Corpus, Document } from '@/types';
import { exportBibliography } from '@/utils/fetch';

export const useSourcesStore = defineStore('sources', () => {
  const categorySourceMap = ref<Record<string, Corpus[]> | null>(null);
  const sourceCategoryMap: Ref<Record<string, string>> = ref({});
  const infoPerCorpus: Ref<[]> = ref([]);
  const totalInQdrant: Ref<number> = ref(0);
  const isExportingBibliography = ref(false);

  async function getSourcesList() {
    if (categorySourceMap.value && Object.keys(categorySourceMap.value).length > 0) {
      return;
    }

    try {
      const fetchedCorpus = await baseGetAxios('/search/collections');
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
      const response = await baseGetAxios('/metric/nb_docs_info_per_corpus');
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

  const documentIds = (sourcesList: Document[]) => {
    const ids = sourcesList
      .map((doc) => doc.payload.document_id)
      .filter((id): id is string => Boolean(id));

    return [...new Set(ids)];
  };

  const downloadBlob = (blob: Blob, fileName: string) => {
    const objectUrl = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(objectUrl);
  };

  const handleBibliographyExport = async (sourcesList: Document[]) => {
    const ids = documentIds(sourcesList);
    if (!ids.length || isExportingBibliography.value) return;

    isExportingBibliography.value = true;

    try {
      const response = await exportBibliography(ids);
      const fileName = 'welearn_bibliography_export.ris';
      const fileBlob =
        response.data instanceof Blob
          ? response.data
          : new Blob([response.data], { type: response.headers['content-type'] });

      downloadBlob(fileBlob, fileName);
    } catch (error) {
      console.error('Unable to export bibliography:', error);
    } finally {
      isExportingBibliography.value = false;
    }
  };

  return {
    totalInQdrant,
    infoPerCorpus,
    getInfoPerCorpus,
    getSourcesList,
    sourcesList: categorySourceMap,
    sourceCategoryMap,
    handleBibliographyExport,
    isExportingBibliography
  };
});
