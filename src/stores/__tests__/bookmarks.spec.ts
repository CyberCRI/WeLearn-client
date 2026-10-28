import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { flushPromises } from '@vue/test-utils';
import { useBookmarksStore } from '../bookmarks';
import { deleteAllBookmarks, deleteBookmark, getBookmarks, postBookmark } from '@/utils/fetch';
import type { Document } from '@/types';

vi.mock('@/utils/fetch', () => ({
  postBookmark: vi.fn(),
  deleteBookmark: vi.fn(),
  deleteAllBookmarks: vi.fn(),
  getBookmarks: vi.fn()
}));

const doc = (id: string) => ({ payload: { document_id: id } }) as Document;

const mockGetBookmarks = (docs: Document[]) =>
  vi
    .mocked(getBookmarks)
    .mockResolvedValue({ data: docs } as unknown as Awaited<ReturnType<typeof getBookmarks>>);

describe('bookmarks store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.restoreAllMocks();
  });

  it('starts empty', () => {
    const store = useBookmarksStore();

    expect(store.sourcesBookmarked).toEqual([]);
    expect(store.bookmarkedLength).toBe(0);
    expect(store.isBookmarked('doc-1')).toBe(false);
  });

  it('loads the bookmarks', async () => {
    mockGetBookmarks([doc('doc-1'), doc('doc-2')]);
    const store = useBookmarksStore();

    await store.getBookmarks();

    expect(store.sourcesBookmarked).toEqual([doc('doc-1'), doc('doc-2')]);
    expect(store.bookmarkedLength).toBe(2);
    expect(store.isBookmarked('doc-2')).toBe(true);
  });

  it('does not reload bookmarks that have not changed', async () => {
    mockGetBookmarks([doc('doc-1')]);
    const store = useBookmarksStore();

    await store.getBookmarks();
    await store.getBookmarks();

    expect(getBookmarks).toHaveBeenCalledOnce();
  });

  it('reloads the bookmarks after a change', async () => {
    mockGetBookmarks([doc('doc-1')]);
    const store = useBookmarksStore();
    await store.getBookmarks();

    await store.addBookmark(doc('doc-2'));
    await store.getBookmarks();

    expect(getBookmarks).toHaveBeenCalledTimes(2);
  });

  it('keeps the bookmarks when loading them fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(getBookmarks).mockRejectedValue(new Error('Network Error'));
    const store = useBookmarksStore();

    await store.getBookmarks();

    expect(store.sourcesBookmarked).toEqual([]);
    expect(console.error).toHaveBeenCalled();
  });

  it('adds a bookmark', async () => {
    const store = useBookmarksStore();

    await store.addBookmark(doc('doc-1'));

    expect(postBookmark).toHaveBeenCalledWith('doc-1');
    expect(store.isBookmarked('doc-1')).toBe(true);
  });

  it('does not mark a document as bookmarked when the api fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(postBookmark).mockRejectedValue(new Error('Network Error'));
    const store = useBookmarksStore();

    await store.addBookmark(doc('doc-1'));

    expect(store.isBookmarked('doc-1')).toBe(false);
  });

  it('removes a bookmark', async () => {
    mockGetBookmarks([doc('doc-1'), doc('doc-2')]);
    const store = useBookmarksStore();
    await store.getBookmarks();

    await store.removeBookmark('doc-1');

    expect(deleteBookmark).toHaveBeenCalledWith('doc-1');
    expect(store.sourcesBookmarked).toEqual([doc('doc-2')]);
    expect(store.isBookmarked('doc-1')).toBe(false);
  });

  it('toggles a bookmark on and off', async () => {
    const store = useBookmarksStore();

    store.toggleBookmark(doc('doc-1'));
    await flushPromises();
    expect(postBookmark).toHaveBeenCalledWith('doc-1');
    expect(store.isBookmarked('doc-1')).toBe(true);

    store.toggleBookmark(doc('doc-1'));
    await flushPromises();
    expect(deleteBookmark).toHaveBeenCalledWith('doc-1');
    expect(store.isBookmarked('doc-1')).toBe(false);
  });

  it('removes every bookmark', async () => {
    mockGetBookmarks([doc('doc-1'), doc('doc-2')]);
    const store = useBookmarksStore();
    await store.getBookmarks();

    await store.resetBookmarks();

    expect(deleteAllBookmarks).toHaveBeenCalledOnce();
    expect(store.bookmarkedLength).toBe(0);
    expect(store.isBookmarked('doc-1')).toBe(false);
  });
});
