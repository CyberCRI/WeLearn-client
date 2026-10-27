import { defineStore } from 'pinia';
import { baseGetAxios } from '@/utils/fetch';
import { type Ref, ref } from 'vue';
import type { Corpus, Document } from '@/types';
import type { ApiResponse } from '@/types/api';
import { exportBibliography } from '@/utils/fetch';

export const useSourcesStore = defineStore('sources', () => {
  const categorySourceMap = ref<Record<string, Corpus[]> | null>(null);
  const sourceCategoryMap: Ref<Record<string, string>> = ref({});
  const infoPerCorpus: Ref<ApiResponse<'/metric/nb_docs_info_per_corpus'>> = ref([]);
  const totalInQdrant: Ref<number> = ref(0);
  const isExportingBibliography = ref(false);

  async function getSourcesList() {
    if (categorySourceMap.value && Object.keys(categorySourceMap.value).length > 0) {
      return;
    }

    try {
      const fetchedCorpus = await baseGetAxios<Corpus[]>('/search/collections');
      fetchedCorpus.sort((a, b) => a.name.localeCompare(b.name));

      // ponytail: a corpus without category lands under "null", as it always has
      const categoryOf = (corpus: Corpus) => String(corpus.category);

      const corpusByCategory: Record<string, Corpus[]> = fetchedCorpus.reduce(
        (acc: Record<string, Corpus[]>, corpus) => {
          if (!acc[categoryOf(corpus)]) {
            acc[categoryOf(corpus)] = [];
          }
          acc[categoryOf(corpus)].push(corpus);
          return acc;
        },
        {}
      );

      sourceCategoryMap.value = fetchedCorpus.reduce((acc: Record<string, string>, corpus) => {
        acc[corpus.name] = categoryOf(corpus);
        return acc;
      }, {});

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
      const response = await baseGetAxios<ApiResponse<'/metric/nb_docs_info_per_corpus'>>(
        '/metric/nb_docs_info_per_corpus'
      );
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
