import { defineStore } from 'pinia';
import { type Ref, ref, computed } from 'vue';
import type { Document } from '@/types';
import {
  postBookmark,
  deleteBookmark,
  getBookmarks as getAllBookmarks,
  deleteAllBookmarks
} from '@/utils/fetch';
import { track } from '@/utils/analytics';

export const useBookmarksStore = defineStore('bookmarks', () => {
  const sourcesBookmarked: Ref<Document[]> = ref([]);
  const hasChanged: Ref<boolean> = ref(false);
  const idsBookmarked: Ref<string[]> = ref(
    sourcesBookmarked.value.map((source) => source.payload.document_id)
  );

  const addBookmark = async (source: Document) => {
    try {
      await postBookmark(source.payload.document_id);
      idsBookmarked.value.push(source.payload.document_id);
      hasChanged.value = true;
      track('Bookmark Added', {
        corpus: source.payload.document_corpus,
        bookmarksCount: idsBookmarked.value.length
      });
    } catch (error) {
      console.error('Failed to add bookmark:', error);
      return;
    }
  };

  const removeBookmark = async (sourceId: string) => {
    sourcesBookmarked.value = sourcesBookmarked.value.filter(
      ({ payload }) => payload.document_id !== sourceId
    );
    idsBookmarked.value = idsBookmarked.value.filter((id) => id !== sourceId);
    await deleteBookmark(sourceId);
    hasChanged.value = true;
    track('Bookmark Removed', { bookmarksCount: idsBookmarked.value.length });
  };

  const getBookmarks = async () => {
    if (!hasChanged.value && sourcesBookmarked.value.length) return;

    try {
      const bookmarks = await getAllBookmarks();
      sourcesBookmarked.value = bookmarks.data as Document[];
      idsBookmarked.value = sourcesBookmarked.value.map((bookmark) => bookmark.payload.document_id);
      hasChanged.value = false;
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error);
    }
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

  const resetBookmarks = async () => {
    sourcesBookmarked.value = [];
    idsBookmarked.value = [];
    await deleteAllBookmarks();
    hasChanged.value = true;
  };

  const bookmarkedLength = computed(() => sourcesBookmarked.value.length);

  return {
    sourcesBookmarked,
    addBookmark,
    removeBookmark,
    getBookmarks,
    resetBookmarks,
    toggleBookmark,
    isBookmarked,
    bookmarkedLength
  };
});
