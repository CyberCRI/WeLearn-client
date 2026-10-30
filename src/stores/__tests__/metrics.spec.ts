import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useMetricsStore } from '../metrics';
import { updateClickedDocument } from '@/utils/metrics';
import { track } from '@/utils/analytics';

vi.mock('@/utils/metrics', () => ({
  updateClickedDocument: vi.fn()
}));

vi.mock('@/utils/analytics', () => ({ track: vi.fn() }));

describe('metrics store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  afterEach(() => {
    vi.mocked(updateClickedDocument).mockReset();
    window.history.pushState({}, '', '/');
  });

  it.each([
    ['/q-and-a', 'chatMessageId'],
    ['/tutor', 'tutorMessageId'],
    ['/search', 'searchMessageId']
  ])('on %s sends the message id stored under %s', async (path, storageKey) => {
    window.history.pushState({}, '', path);
    localStorage.setItem(storageKey, 'message-1');

    await useMetricsStore().recordClickedDocumentFromchat('doc-1');

    expect(updateClickedDocument).toHaveBeenCalledWith('doc-1', 'message-1');
  });

  it('does nothing on a page without metrics', async () => {
    window.history.pushState({}, '', '/bookmarks');
    localStorage.setItem('chatMessageId', 'message-1');

    await useMetricsStore().recordClickedDocumentFromchat('doc-1');

    expect(updateClickedDocument).not.toHaveBeenCalled();
  });

  it('does nothing without a stored message id', async () => {
    window.history.pushState({}, '', '/q-and-a');

    await useMetricsStore().recordClickedDocumentFromchat('doc-1');

    expect(updateClickedDocument).not.toHaveBeenCalled();
  });

  it('does nothing without a document id', async () => {
    window.history.pushState({}, '', '/q-and-a');
    localStorage.setItem('chatMessageId', 'message-1');

    await useMetricsStore().recordClickedDocumentFromchat('');

    expect(updateClickedDocument).not.toHaveBeenCalled();
  });

  it.each([
    ['/q-and-a', 'chat'],
    ['/tutor', 'tutor'],
    ['/search', 'search'],
    ['/bookmarks', 'bookmarks'],
    ['/about', 'other']
  ])('tracks a source opened on %s as %s', async (path, origin) => {
    window.history.pushState({}, '', path);

    await useMetricsStore().recordClickedDocumentFromchat('doc-1');

    expect(track).toHaveBeenLastCalledWith('Source Opened', { origin });
  });
});
