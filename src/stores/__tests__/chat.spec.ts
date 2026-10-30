import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { CHAT_STATUS, useChatStore } from '../chat';
import { useFiltersStore } from '../filters';
import { baseGetAxios, fetchStream } from '@/utils/fetch';
import i18n from '@/localisation/i18n';
import { track } from '@/utils/analytics';

vi.mock('@/utils/fetch', () => ({
  baseGetAxios: vi.fn(),
  fetchStream: vi.fn()
}));

vi.mock('@/utils/analytics', () => ({ track: vi.fn() }));

type StreamBody = Awaited<ReturnType<typeof fetchStream>>;

// a fake stream body: each read() hands out the next chunk, `onRead` sees the store between reads
const mockStream = (chunks: string[], onRead?: (index: number) => void) => {
  const encoder = new TextEncoder();
  let index = 0;
  const read = vi.fn(async () => {
    onRead?.(index);
    if (index >= chunks.length) return { done: true, value: undefined };
    return { done: false, value: encoder.encode(chunks[index++]) };
  });
  vi.mocked(fetchStream).mockResolvedValue({
    getReader: () => ({ read })
  } as unknown as StreamBody);
  return read;
};

const sse = (payload: unknown) => `data: ${JSON.stringify(payload)}\n\n`;

const lastBody = () => JSON.parse(vi.mocked(fetchStream).mock.calls.at(-1)![1].bodyContent);

describe('chat store', () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.mocked(fetchStream).mockReset();
    vi.mocked(baseGetAxios).mockReset();
    vi.mocked(track).mockReset();
    vi.restoreAllMocks();
  });

  describe('initial state', () => {
    it('starts empty without a stored chat', () => {
      const store = useChatStore();

      expect(store.chatStatus).toBe(CHAT_STATUS.EMPTY);
      expect(store.chatMessagesList).toEqual([]);
    });

    it('starts done when a chat is stored', () => {
      localStorage.setItem('chat', JSON.stringify([{ role: 'user', content: 'hi' }]));
      const store = useChatStore();

      expect(store.chatStatus).toBe(CHAT_STATUS.DONE);
      expect(store.chatMessagesList).toHaveLength(1);
    });
  });

  describe('initializeChat', () => {
    it('does not fetch the history without a thread id', async () => {
      const store = useChatStore();

      await store.initializeChat();

      expect(baseGetAxios).not.toHaveBeenCalled();
    });

    it('loads the history of the stored thread', async () => {
      localStorage.setItem('chatThreadId', 'thread-1');
      const history = [{ role: 'user', content: 'hi' }];
      vi.mocked(baseGetAxios).mockResolvedValue(history);
      const store = useChatStore();

      await store.initializeChat();

      expect(baseGetAxios).toHaveBeenCalledWith('/qna/chat/history?thread_id=thread-1');
      expect(store.chatMessagesList).toEqual(history);
      expect(store.chatStatus).toBe(CHAT_STATUS.DONE);
    });

    it('keeps the empty status for an empty history', async () => {
      localStorage.setItem('chatThreadId', 'thread-1');
      vi.mocked(baseGetAxios).mockResolvedValue([]);
      const store = useChatStore();

      await store.initializeChat();

      expect(store.chatStatus).toBe(CHAT_STATUS.EMPTY);
    });
  });

  describe('subjects', () => {
    it('selects and stores a subject', () => {
      const store = useChatStore();

      store.selectSubject('biology');

      expect(store.storedSubject).toBe('biology');
      expect(localStorage.getItem('chatSubject')).toBe('"biology"');
    });

    it('unselects the subject when it is picked again', () => {
      const store = useChatStore();
      store.selectSubject('biology');

      store.selectSubject('biology');

      expect(store.storedSubject).toBeUndefined();
      expect(localStorage.getItem('chatSubject')).toBeNull();
    });

    it('clears the subject', () => {
      const store = useChatStore();
      store.selectSubject('biology');

      store.clearSubject();

      expect(store.storedSubject).toBeUndefined();
      expect(localStorage.getItem('chatSubject')).toBeNull();
    });
  });

  it('clears the input', () => {
    const store = useChatStore();
    store.chatInput = 'some question';

    store.clearInput();

    expect(store.chatInput).toBe('');
  });

  describe('onSendMessage', () => {
    it('does nothing for an empty message', async () => {
      const store = useChatStore();

      await store.onSendMessage('');

      expect(fetchStream).not.toHaveBeenCalled();
      expect(store.chatMessagesList).toEqual([]);
    });

    it.each([CHAT_STATUS.FORMULATING_ANSWER, CHAT_STATUS.SEARCHING])(
      'does nothing while the status is %s',
      async (status) => {
        const store = useChatStore();
        store.chatStatus = status;

        await store.onSendMessage('a question');

        expect(fetchStream).not.toHaveBeenCalled();
        expect(store.chatMessagesList).toEqual([]);
      }
    );

    it('streams the answer into an assistant message and persists the chat', async () => {
      mockStream([sse({ content: 'Hello' }), sse({ delta: ' world' })]);
      const store = useChatStore();

      await store.onSendMessage('a question');

      expect(fetchStream).toHaveBeenCalledWith('/qna/chat/agent_stream', {
        bodyContent: expect.any(String)
      });
      expect(store.chatMessagesList).toEqual([
        { role: 'user', content: 'a question' },
        { role: 'assistant', content: 'Hello world' }
      ]);
      expect(JSON.parse(localStorage.getItem('chat')!)).toEqual(store.chatMessagesList);
      expect(store.chatStatus).toBe(CHAT_STATUS.DONE);
      expect(store.processingMetadata).toBeNull();
      expect(store.hasChatAnswerError).toBe(false);
    });

    it('sends the query with the selected filters and the stored thread id', async () => {
      localStorage.setItem('chatThreadId', 'thread-0');
      mockStream([]);
      const filters = useFiltersStore();
      filters.sdgFilters = [13];
      filters.sourcesFilters = ['corpus-a'];
      const store = useChatStore();

      await store.onSendMessage('a question');

      expect(lastBody()).toEqual({
        query: 'a question',
        thread_id: 'thread-0',
        corpora: ['corpus-a'],
        sdg_filter: [13]
      });
    });

    it('omits the thread id when none is stored', async () => {
      mockStream([]);
      const store = useChatStore();

      await store.onSendMessage('a question');

      expect(lastBody()).not.toHaveProperty('thread_id');
    });

    it('stores the thread and message ids sent by the stream', async () => {
      mockStream([sse({ thread_id: 'thread-1', message_id: 'msg-1' })]);
      const store = useChatStore();

      await store.onSendMessage('first');

      expect(localStorage.getItem('chatThreadId')).toBe('thread-1');
      expect(localStorage.getItem('chatMessageId')).toBe('msg-1');

      // the next question continues the same thread
      mockStream([]);
      await store.onSendMessage('second');

      expect(lastBody().thread_id).toBe('thread-1');
    });

    it('stores the sources sent by the stream', async () => {
      const docs = [{ id: 'doc-1' }];
      mockStream([sse({ data: { docs } })]);
      const store = useChatStore();

      await store.onSendMessage('a question');

      expect(store.sourcesList).toEqual(docs);
      expect(JSON.parse(localStorage.getItem('chatSources')!)).toEqual(docs);
    });

    it('moves through the processing statuses while streaming', async () => {
      const store = useChatStore();
      const seen: { status: string; step?: string }[] = [];
      mockStream(
        [
          sse({ status: 'processing', step: 'fetching_resources' }),
          sse({ docs: [{ id: 'doc-1' }] }),
          sse({ status: 'processing', step: 'analyzing_resources' }),
          sse({ content: 'Answer' })
        ],
        (index) => {
          if (index > 0) {
            seen.push({ status: store.chatStatus, step: store.processingMetadata?.step });
          }
        }
      );

      await store.onSendMessage('a question');

      expect(seen).toEqual([
        { status: CHAT_STATUS.SEARCHING, step: 'fetching_resources' },
        { status: CHAT_STATUS.SEARCHED, step: 'fetching_resources' },
        // sources are already there, so analyzing counts as formulating
        { status: CHAT_STATUS.FORMULATING_ANSWER, step: 'analyzing_resources' },
        { status: CHAT_STATUS.FORMULATING_ANSWER, step: 'generating_answer' }
      ]);
      expect(store.chatStatus).toBe(CHAT_STATUS.DONE);
      expect(store.processingMetadata).toBeNull();
    });

    it('reads payloads split across chunks and a trailing event without separator', async () => {
      mockStream(['data: {"content":"He', 'llo"}\n\n', 'data: {"content":"!"}']);
      const store = useChatStore();

      await store.onSendMessage('a question');

      expect(store.chatMessagesList.at(-1)).toEqual({ role: 'assistant', content: 'Hello!' });
    });

    it('appends plain text payloads and skips [DONE] and event lines', async () => {
      mockStream(['plain text\n\n', 'event: end\ndata: [DONE]\n\n', 'event: ping\n\n']);
      const store = useChatStore();

      await store.onSendMessage('a question');

      expect(store.chatMessagesList.at(-1)).toEqual({ role: 'assistant', content: 'plain text' });
    });

    it.each([
      ['chunk', { chunk: 'a' }],
      ['token', { token: 'a' }],
      ['data string', { data: 'a' }],
      ['data.content', { data: { content: 'a' } }],
      ['message.content', { message: { content: 'a' } }],
      ['answer', { answer: 'a' }],
      ['choices delta', { choices: [{ delta: { content: 'a' } }] }],
      ['choices text', { choices: [{ text: 'a' }] }]
    ])('reads the content from %s', async (_, payload) => {
      mockStream([sse(payload)]);
      const store = useChatStore();

      await store.onSendMessage('a question');

      expect(store.chatMessagesList.at(-1)).toEqual({ role: 'assistant', content: 'a' });
    });

    it('ignores payloads without content', async () => {
      mockStream([sse({ choices: [{}] }), sse(42)]);
      const store = useChatStore();

      await store.onSendMessage('a question');

      expect(store.chatMessagesList.at(-1)).toEqual({ role: 'assistant', content: '' });
    });

    it('sets the error state when the stream cannot be opened', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(fetchStream).mockResolvedValue(null);
      const store = useChatStore();

      await store.onSendMessage('a question');

      expect(store.chatStatus).toBe(CHAT_STATUS.ERROR);
      expect(store.hasChatAnswerError).toBe(true);
      expect(store.processingMetadata).toBeNull();
      expect(store.chatMessagesList).toEqual([{ role: 'user', content: 'a question' }]);
    });

    it('sets the error state when the request fails', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(fetchStream).mockRejectedValue(new Error('network'));
      const store = useChatStore();

      await store.onSendMessage('a question');

      expect(store.chatStatus).toBe(CHAT_STATUS.ERROR);
      expect(store.hasChatAnswerError).toBe(true);
    });

    it('tracks the question without its text, then the answer', async () => {
      localStorage.setItem('chatThreadId', 'thread-0');
      mockStream([sse({ content: 'Hello' })]);
      useFiltersStore().sdgFilters = [13, 14];
      const store = useChatStore();

      await store.onSendMessage('a question', true);

      expect(track).toHaveBeenCalledWith('Chat Question Sent', {
        queryLength: 10,
        isFollowUp: true,
        isSuggestedQuestion: true,
        sdgFilterCount: 2,
        corpusFilterCount: 0
      });
      expect(track).toHaveBeenCalledWith('Chat Answer Received', {
        durationMs: expect.any(Number),
        sourcesCount: 0
      });
      expect(JSON.stringify(vi.mocked(track).mock.calls)).not.toContain('a question');
    });

    it('tracks a failed answer', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(fetchStream).mockRejectedValue(new Error('network'));

      await useChatStore().onSendMessage('a question');

      expect(track).toHaveBeenCalledWith('Chat Answer Failed', { durationMs: expect.any(Number) });
      expect(track).not.toHaveBeenCalledWith('Chat Answer Received', expect.anything());
    });
  });

  describe('processingStatusLabel', () => {
    it('falls back to the formulating label', () => {
      const store = useChatStore();

      expect(store.processingStatusLabel).toBe(i18n.global.t('sourcesList.formulatingAnswer'));
    });

    it('translates the current step', () => {
      const store = useChatStore();
      store.processingMetadata = { status: 'processing', step: 'fetching_resources' };

      expect(store.processingStatusLabel).toBe(
        i18n.global.t('chatProcessingSteps.fetching_resources')
      );
    });
  });

  describe('$reset', () => {
    it('empties the chat state and its storage', async () => {
      mockStream([
        sse({ content: 'Hi', docs: [{ id: 'doc-1' }], thread_id: 't', message_id: 'm' })
      ]);
      const store = useChatStore();
      store.selectSubject('biology');
      store.setReformulatedQuery('reformulated');
      await store.onSendMessage('a question');
      store.chatInput = 'draft';
      store.hasChatAnswerError = true;

      store.$reset();

      expect(store.chatStatus).toBe(CHAT_STATUS.EMPTY);
      expect(store.chatMessagesList).toEqual([]);
      expect(store.sourcesList).toEqual([]);
      expect(store.chatInput).toBe('');
      expect(store.hasChatAnswerError).toBe(false);
      expect(store.reformulatedQuery).toBeNull();
      expect(store.storedSubject).toBeUndefined();
      expect(store.questionNumbers).toHaveLength(2);
      expect(store.questionNumbers![0]).not.toBe(store.questionNumbers![1]);
      for (const key of [
        'chat',
        'chatSources',
        'reformulatedQuery',
        'chatSubject',
        'chatThreadId',
        'chatMessageId'
      ]) {
        expect(localStorage.getItem(key)).toBeNull();
      }

      // the thread id is forgotten for the next question
      mockStream([]);
      await store.onSendMessage('new question');
      expect(lastBody()).not.toHaveProperty('thread_id');
    });
  });
});
