import { defineStore } from 'pinia';
import { type Ref, ref, computed } from 'vue';
import { getFromStorage, saveToStorage, clearFromStorage } from '@/utils/storage';
import type { Document } from '@/types';
import { getAxios } from '@/utils/fetch';

export const useSourcesStore = defineStore('sources', () => {
  const sourcesBookmarked: Ref<Document[]> = ref(getFromStorage('bookmarkedSources') || []);
  const idsBookmarked: Ref<string[]> = ref(
    sourcesBookmarked.value.map((source) => source.payload.document_id)
  );

  const totalDocs: Ref<number | undefined> = ref(undefined);

  const getNbDocsInBase = async () => {
    if (totalDocs.value) {
      return;
    }
    const response = await getAxios('/search/nb_docs');
    totalDocs.value = Math.floor(response.nb_docs / 100) * 100;
  };

  const addBookmark = (source: Document) => {
    sourcesBookmarked.value.push(source);
    idsBookmarked.value.push(source.payload.document_id);
    saveToStorage('bookmarkedSources', sourcesBookmarked.value);
  };

  const removeBookmark = (sourceId: string) => {
    sourcesBookmarked.value = sourcesBookmarked.value.filter(
      ({ payload }) => payload.document_id !== sourceId
    );
    idsBookmarked.value = idsBookmarked.value.filter((id) => id !== sourceId);
    saveToStorage('bookmarkedSources', sourcesBookmarked.value);
  };

  const toggleBookmark = (source: Document) => {
    const sourceId = source.payload.document_id;
    if (idsBookmarked.value.includes(sourceId)) {
      removeBookmark(sourceId);
      return;
    }
    addBookmark(source);
  };

  const isBookmarked = (id: string) => idsBookmarked.value.includes(id);

  const resetBookmarks = () => {
    sourcesBookmarked.value = [];
    idsBookmarked.value = [];
    clearFromStorage('bookmarkedSources');
  };

  const bookmarkedLength = computed(() => sourcesBookmarked.value.length);

  return {
    sourcesBookmarked,
    addBookmark,
    removeBookmark,
    resetBookmarks,
    toggleBookmark,
    isBookmarked,
    getNbDocsInBase,
    totalDocs,
    bookmarkedLength
  };
});
