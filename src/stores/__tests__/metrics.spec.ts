import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useMetricsStore } from '../metrics';
import { updateClickedDocument } from '@/utils/metrics';
import { track } from '@/utils/analytics';
import { useChatStore } from '../chat';
import { useSearchStore } from '../search';

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

  it('on the chat sends the id of the last answer', async () => {
    window.history.pushState({}, '', '/q-and-a');
    useChatStore().lastMessageId = 'message-1';
    useSearchStore().lastMessageId = 'message-2';

    await useMetricsStore().recordClickedDocumentFromchat('doc-1');

    expect(updateClickedDocument).toHaveBeenCalledWith('doc-1', 'message-1');
  });

  it('on the search sends the id of the last search', async () => {
    window.history.pushState({}, '', '/search');
    useChatStore().lastMessageId = 'message-1';
    useSearchStore().lastMessageId = 'message-2';

    await useMetricsStore().recordClickedDocumentFromchat('doc-1');

    expect(updateClickedDocument).toHaveBeenCalledWith('doc-1', 'message-2');
  });

  // the syllabus has no message id to send
  it.each(['/bookmarks', '/tutor'])('does nothing on %s', async (path) => {
    window.history.pushState({}, '', path);
    useChatStore().lastMessageId = 'message-1';

    await useMetricsStore().recordClickedDocumentFromchat('doc-1');

    expect(updateClickedDocument).not.toHaveBeenCalled();
  });

  it('does nothing without a message id', async () => {
    window.history.pushState({}, '', '/q-and-a');

    await useMetricsStore().recordClickedDocumentFromchat('doc-1');

    expect(updateClickedDocument).not.toHaveBeenCalled();
  });

  it('does nothing without a document id', async () => {
    window.history.pushState({}, '', '/q-and-a');
    useChatStore().lastMessageId = 'message-1';

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
