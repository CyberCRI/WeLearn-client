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
import { useAuthStore } from '@/stores/auth';
import { apiErrorCode, isAccountRequired } from '@/utils/apiErrors';

export const useBookmarksStore = defineStore('bookmarks', () => {
  const sourcesBookmarked: Ref<Document[]> = ref([]);
  const hasChanged: Ref<boolean> = ref(false);
  const idsBookmarked: Ref<string[]> = ref(
    sourcesBookmarked.value.map((source) => source.payload.document_id)
  );
  const hasBookmarkError = ref(false);
  const errorCode = ref('');
  // documents with an add or a remove in flight: a double click must not send a second request
  const pendingIds = new Set<string>();

  const clearBookmarkError = () => {
    hasBookmarkError.value = false;
    errorCode.value = '';
  };

  const showError = (message: string, error: unknown) => {
    console.error(message, error);
    hasBookmarkError.value = true;
    errorCode.value = apiErrorCode(error) ?? 'UNKNOWN_ERROR';
  };

  // the API keeps bookmarks for accounts, even when the client took the user for one
  const handleFailure = (message: string, error: unknown) => {
    if (isAccountRequired(error)) {
      useAuthStore().askToSignUp('bookmark');
      return;
    }
    showError(message, error);
  };

  const addBookmark = async (source: Document) => {
    const sourceId = source.payload.document_id;
    if (pendingIds.has(sourceId)) return;
    pendingIds.add(sourceId);
    clearBookmarkError();
    try {
      await postBookmark(sourceId);
      idsBookmarked.value.push(sourceId);
      hasChanged.value = true;
      track('Bookmark Added', {
        corpus: source.payload.document_corpus,
        bookmarksCount: idsBookmarked.value.length
      });
    } catch (error) {
      handleFailure('Failed to add bookmark:', error);
    } finally {
      pendingIds.delete(sourceId);
    }
  };

  // removed from the list at once, put back at the same place if the API refuses
  const removeBookmark = async (sourceId: string) => {
    if (pendingIds.has(sourceId)) return;
    pendingIds.add(sourceId);
    clearBookmarkError();
    const sourceIndex = sourcesBookmarked.value.findIndex(
      ({ payload }) => payload.document_id === sourceId
    );
    const removedSource = sourcesBookmarked.value[sourceIndex];
    const idIndex = idsBookmarked.value.indexOf(sourceId);
    sourcesBookmarked.value = sourcesBookmarked.value.filter(
      ({ payload }) => payload.document_id !== sourceId
    );
    idsBookmarked.value = idsBookmarked.value.filter((id) => id !== sourceId);
    try {
      await deleteBookmark(sourceId);
      hasChanged.value = true;
      track('Bookmark Removed', { bookmarksCount: idsBookmarked.value.length });
    } catch (error) {
      if (removedSource) sourcesBookmarked.value.splice(sourceIndex, 0, removedSource);
      if (idIndex !== -1) idsBookmarked.value.splice(idIndex, 0, sourceId);
      handleFailure('Failed to remove bookmark:', error);
    } finally {
      pendingIds.delete(sourceId);
    }
  };

  const getBookmarks = async () => {
    if (!hasChanged.value && sourcesBookmarked.value.length) return;

    try {
      const bookmarks = await getAllBookmarks();
      sourcesBookmarked.value = bookmarks.data as Document[];
      idsBookmarked.value = sourcesBookmarked.value.map((bookmark) => bookmark.payload.document_id);
      hasChanged.value = false;
    } catch (error) {
      // a guest has no bookmarks to load: nothing to tell them
      if (!isAccountRequired(error)) showError('Failed to fetch bookmarks:', error);
    }
  };

  const toggleBookmark = (source: Document) => {
    const authStore = useAuthStore();
    if (authStore.isGuest) {
      authStore.askToSignUp('bookmark');
      return;
    }

    const sourceId = source.payload.document_id;
    if (idsBookmarked.value.includes(sourceId)) {
      removeBookmark(sourceId);
      return;
    }
    addBookmark(source);
  };

  const isBookmarked = (id: string) => idsBookmarked.value.includes(id);

  // emptied at once, restored if the API refuses
  const resetBookmarks = async () => {
    const previousSources = sourcesBookmarked.value;
    const previousIds = idsBookmarked.value;
    clearBookmarkError();
    sourcesBookmarked.value = [];
    idsBookmarked.value = [];
    try {
      await deleteAllBookmarks();
      hasChanged.value = true;
    } catch (error) {
      sourcesBookmarked.value = previousSources;
      idsBookmarked.value = previousIds;
      handleFailure('Failed to clear bookmarks:', error);
    }
  };

  const bookmarkedLength = computed(() => sourcesBookmarked.value.length);

  return {
    sourcesBookmarked,
    hasBookmarkError,
    errorCode,
    addBookmark,
    removeBookmark,
    getBookmarks,
    resetBookmarks,
    toggleBookmark,
    isBookmarked,
    bookmarkedLength,
    clearBookmarkError
  };
});
