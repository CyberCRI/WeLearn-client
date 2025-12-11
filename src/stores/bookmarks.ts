import { defineStore } from 'pinia';
import { type Ref, ref, computed } from 'vue';
import type { Document } from '@/types';
import { useUserStore } from '@/stores/user';
import {
  postBookmark,
  deleteBookmark,
  getBookmarks as getAllBookmarks,
  deleteAllBookmarks
} from '@/utils/fetch';

export const useBookmarksStore = defineStore('bookmarks', () => {
  const sourcesBookmarked: Ref<Document[]> = ref([]);
  const hasChanged: Ref<boolean> = ref(false);
  const idsBookmarked: Ref<string[]> = ref(
    sourcesBookmarked.value.map((source) => source.payload.document_id)
  );

  const addBookmark = async (source: Document) => {
    try {
      await postBookmark(useUserStore().userId, source.payload.document_id);
      idsBookmarked.value.push(source.payload.document_id);
      hasChanged.value = true;
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
    await deleteBookmark(useUserStore().userId, sourceId);
    hasChanged.value = true;
  };

  const getBookmarks = async () => {
    if (!hasChanged.value && sourcesBookmarked.value.length) return;
    const userId = useUserStore().userId;

    const bookmarks = await getAllBookmarks(userId);
    sourcesBookmarked.value = bookmarks.data;
    idsBookmarked.value = sourcesBookmarked.value.map((bookmark) => bookmark.payload.document_id);
    hasChanged.value = false;
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
    await deleteAllBookmarks(useUserStore().userId);
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
