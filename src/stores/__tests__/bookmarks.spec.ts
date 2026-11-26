import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { flushPromises } from '@vue/test-utils';
import { useBookmarksStore } from '../bookmarks';
import { deleteAllBookmarks, deleteBookmark, getBookmarks, postBookmark } from '@/utils/fetch';
import type { Document } from '@/types';
import { track } from '@/utils/analytics';

vi.mock('@/utils/fetch', () => ({
  postBookmark: vi.fn(),
  deleteBookmark: vi.fn(),
  deleteAllBookmarks: vi.fn(),
  getBookmarks: vi.fn()
}));

vi.mock('@/utils/analytics', () => ({ track: vi.fn() }));

const auth = vi.hoisted(() => ({ isGuest: false, askToSignUp: vi.fn() }));
vi.mock('@/stores/auth', () => ({ useAuthStore: () => auth }));

const doc = (id: string) => ({ payload: { document_id: id } }) as Document;

const accountRequired = {
  response: {
    status: 401,
    data: { detail: { code: 'ACCOUNT_REQUIRED', message: 'An account is required' } }
  }
};

const mockGetBookmarks = (docs: Document[]) =>
  vi
    .mocked(getBookmarks)
    .mockResolvedValue({ data: docs } as unknown as Awaited<ReturnType<typeof getBookmarks>>);

describe('bookmarks store', () => {
  beforeEach(() => {
    auth.isGuest = false;
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
    expect(store.hasBookmarkError).toBe(true);
    expect(store.errorCode).toBe('UNKNOWN_ERROR');
  });

  it('shows no error when a guest has no bookmarks to load', async () => {
    vi.mocked(getBookmarks).mockRejectedValue(accountRequired);
    const store = useBookmarksStore();

    await store.getBookmarks();

    expect(store.hasBookmarkError).toBe(false);
    expect(auth.askToSignUp).not.toHaveBeenCalled();
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

  // the API refuses guests too, e.g. when the client did not know the user was one
  it('asks to sign up when the API requires an account', async () => {
    vi.mocked(postBookmark).mockRejectedValue(accountRequired);
    const store = useBookmarksStore();

    await store.addBookmark(doc('doc-1'));

    expect(auth.askToSignUp).toHaveBeenCalledWith('bookmark');
    expect(store.isBookmarked('doc-1')).toBe(false);
    expect(store.hasBookmarkError).toBe(false);
  });

  it('shows an error when adding a bookmark fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(postBookmark).mockRejectedValue({
      response: { status: 500, data: { detail: { code: 'DB_ERROR' } } }
    });
    const store = useBookmarksStore();

    await store.addBookmark(doc('doc-1'));

    expect(store.hasBookmarkError).toBe(true);
    expect(store.errorCode).toBe('DB_ERROR');
  });

  it('clears the error once a bookmark goes through', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(postBookmark).mockRejectedValueOnce(new Error('Network Error'));
    const store = useBookmarksStore();
    await store.addBookmark(doc('doc-1'));

    await store.addBookmark(doc('doc-1'));

    expect(store.hasBookmarkError).toBe(false);
    expect(store.errorCode).toBe('');
    expect(store.isBookmarked('doc-1')).toBe(true);
  });

  it('sends one request on a double click', async () => {
    const store = useBookmarksStore();

    store.toggleBookmark(doc('doc-1'));
    store.toggleBookmark(doc('doc-1'));
    await flushPromises();

    expect(postBookmark).toHaveBeenCalledOnce();
    expect(deleteBookmark).not.toHaveBeenCalled();
    expect(store.isBookmarked('doc-1')).toBe(true);
  });

  it('sends one delete on a double click on a bookmarked document', async () => {
    mockGetBookmarks([doc('doc-1')]);
    const store = useBookmarksStore();
    await store.getBookmarks();

    store.toggleBookmark(doc('doc-1'));
    store.toggleBookmark(doc('doc-1'));
    await flushPromises();

    expect(deleteBookmark).toHaveBeenCalledOnce();
    expect(postBookmark).not.toHaveBeenCalled();
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

  it('puts a bookmark back in its place when removing it fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mockGetBookmarks([doc('doc-1'), doc('doc-2'), doc('doc-3')]);
    vi.mocked(deleteBookmark).mockRejectedValue(new Error('Network Error'));
    const store = useBookmarksStore();
    await store.getBookmarks();

    await store.removeBookmark('doc-2');

    expect(store.sourcesBookmarked).toEqual([doc('doc-1'), doc('doc-2'), doc('doc-3')]);
    expect(store.isBookmarked('doc-2')).toBe(true);
    expect(store.hasBookmarkError).toBe(true);
    expect(track).not.toHaveBeenCalled();
  });

  it('asks to sign up when removing a bookmark needs an account', async () => {
    mockGetBookmarks([doc('doc-1')]);
    vi.mocked(deleteBookmark).mockRejectedValue(accountRequired);
    const store = useBookmarksStore();
    await store.getBookmarks();

    await store.removeBookmark('doc-1');

    expect(auth.askToSignUp).toHaveBeenCalledWith('bookmark');
    expect(store.hasBookmarkError).toBe(false);
    expect(store.isBookmarked('doc-1')).toBe(true);
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

  it('asks a guest to sign up instead of bookmarking', async () => {
    auth.isGuest = true;
    const store = useBookmarksStore();

    store.toggleBookmark(doc('doc-1'));
    await flushPromises();

    expect(auth.askToSignUp).toHaveBeenCalledWith('bookmark');
    expect(postBookmark).not.toHaveBeenCalled();
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

  it('restores every bookmark when clearing them fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mockGetBookmarks([doc('doc-1'), doc('doc-2')]);
    vi.mocked(deleteAllBookmarks).mockRejectedValue(new Error('Network Error'));
    const store = useBookmarksStore();
    await store.getBookmarks();

    await store.resetBookmarks();

    expect(store.sourcesBookmarked).toEqual([doc('doc-1'), doc('doc-2')]);
    expect(store.isBookmarked('doc-1')).toBe(true);
    expect(store.hasBookmarkError).toBe(true);
  });

  it('tracks added and removed bookmarks', async () => {
    const store = useBookmarksStore();
    const source = { payload: { document_id: 'doc-1', document_corpus: 'ted' } } as Document;

    await store.addBookmark(source);
    await store.removeBookmark('doc-1');

    expect(track).toHaveBeenCalledWith('Bookmark Added', { corpus: 'ted', bookmarksCount: 1 });
    expect(track).toHaveBeenCalledWith('Bookmark Removed', { bookmarksCount: 0 });
  });

  it('does not track a bookmark that failed', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(postBookmark).mockRejectedValue(new Error('boom'));

    await useBookmarksStore().addBookmark(doc('doc-1'));

    expect(track).not.toHaveBeenCalled();
  });
});
