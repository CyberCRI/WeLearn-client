import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { CHAT_STATUS, useChatStore } from '../chat';
import { useFiltersStore } from '../filters';
import { useGuestQuotaStore } from '../guestQuota';
import { baseGetAxios, deleteChatThread, fetchStream } from '@/utils/fetch';
import i18n from '@/localisation/i18n';
import { track } from '@/utils/analytics';

vi.mock('@/utils/fetch', () => ({
  baseGetAxios: vi.fn(),
  deleteChatThread: vi.fn(),
  fetchStream: vi.fn()
}));

vi.mock('@/utils/analytics', () => ({ track: vi.fn() }));

const auth = vi.hoisted(() => ({ isGuest: false, isAuthenticated: false, askToSignUp: vi.fn() }));
vi.mock('@/stores/auth', () => ({ useAuthStore: () => auth }));

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

// a stream answered by hand: `push` hands out a chunk, `end` closes it
const controlledStream = () => {
  const encoder = new TextEncoder();
  const waiting: ((result: { done: boolean; value?: Uint8Array }) => void)[] = [];
  const read = vi.fn(() => new Promise((resolve) => waiting.push(resolve)));
  vi.mocked(fetchStream).mockResolvedValue({
    getReader: () => ({ read })
  } as unknown as StreamBody);
  // let the store handle the chunk and wait for the next one
  const flush = () => new Promise((resolve) => setTimeout(resolve, 0));
  return {
    push: async (chunk: string) => {
      await flush();
      waiting.shift()!({ done: false, value: encoder.encode(chunk) });
      await flush();
    },
    end: async () => {
      await flush();
      waiting.shift()!({ done: true });
      await flush();
    }
  };
};

const signalOfLastCall = () => vi.mocked(fetchStream).mock.calls.at(-1)![2]!.signal!;

const lastBody = () => JSON.parse(vi.mocked(fetchStream).mock.calls.at(-1)![1].bodyContent);

// what fetchStream and the axios helpers throw for an api error answer
const apiError = (status: number, code: string) =>
  Object.assign(new Error(`status ${status}`), {
    response: { status, data: { detail: { message: 'nope', code } } }
  });

describe('chat store', () => {
  beforeEach(() => {
    auth.isGuest = false;
    auth.isAuthenticated = false;
    auth.askToSignUp.mockReset();
    localStorage.clear();
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.mocked(fetchStream).mockReset();
    vi.mocked(baseGetAxios).mockReset();
    vi.mocked(deleteChatThread).mockReset();
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

    it('encodes the thread id in the url', async () => {
      localStorage.setItem('chatThreadId', 'a b&c=d');
      vi.mocked(baseGetAxios).mockResolvedValue([]);

      await useChatStore().initializeChat();

      expect(baseGetAxios).toHaveBeenCalledWith('/qna/chat/history?thread_id=a%20b%26c%3Dd');
    });

    it('keeps the stored chat when the history cannot be loaded', async () => {
      const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.setItem('chatThreadId', 'thread-1');
      localStorage.setItem('chat', JSON.stringify([{ role: 'user', content: 'hi' }]));
      vi.mocked(baseGetAxios).mockRejectedValue(new Error('network'));
      const store = useChatStore();

      await expect(store.initializeChat()).resolves.toBeUndefined();

      expect(store.chatMessagesList).toEqual([{ role: 'user', content: 'hi' }]);
      expect(store.chatStatus).toBe(CHAT_STATUS.DONE);
      expect(errorLog).toHaveBeenCalled();
    });

    it('starts a new conversation when the stored thread is not found', async () => {
      localStorage.setItem('chatThreadId', 'thread-1');
      localStorage.setItem('chatMessageId', 'msg-1');
      localStorage.setItem('chat', JSON.stringify([{ role: 'user', content: 'hi' }]));
      vi.mocked(baseGetAxios).mockRejectedValue(apiError(404, 'THREAD_NOT_FOUND'));
      const store = useChatStore();

      await store.initializeChat();

      expect(store.chatMessagesList).toEqual([]);
      expect(store.chatStatus).toBe(CHAT_STATUS.EMPTY);
      expect(localStorage.getItem('chatThreadId')).toBeNull();
      expect(localStorage.getItem('chatMessageId')).toBeNull();
      expect(localStorage.getItem('chat')).toBeNull();
    });

    it('keeps the stored chat for another 404', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.setItem('chatThreadId', 'thread-1');
      localStorage.setItem('chat', JSON.stringify([{ role: 'user', content: 'hi' }]));
      vi.mocked(baseGetAxios).mockRejectedValue(apiError(404, 'SOMETHING_ELSE'));
      const store = useChatStore();

      await store.initializeChat();

      expect(store.chatMessagesList).toEqual([{ role: 'user', content: 'hi' }]);
      expect(localStorage.getItem('chatThreadId')).toBe('thread-1');
    });

    it('leaves a newer conversation alone when an old thread is not found', async () => {
      localStorage.setItem('chatThreadId', 'thread-1');
      let failHistory!: (error: unknown) => void;
      vi.mocked(baseGetAxios).mockReturnValue(new Promise((_, reject) => (failHistory = reject)));
      mockStream([sse({ content: 'Answer', thread_id: 'thread-2' })]);
      const store = useChatStore();

      const loading = store.initializeChat();
      await store.onSendMessage('a question');
      failHistory(apiError(404, 'THREAD_NOT_FOUND'));
      await loading;

      expect(store.chatMessagesList).toEqual([
        { role: 'user', content: 'a question' },
        { role: 'assistant', content: 'Answer' }
      ]);
      expect(localStorage.getItem('chatThreadId')).toBe('thread-2');
    });

    it('ignores a history that is not a list', async () => {
      localStorage.setItem('chatThreadId', 'thread-1');
      localStorage.setItem('chat', JSON.stringify([{ role: 'user', content: 'hi' }]));
      vi.mocked(baseGetAxios).mockResolvedValue({ detail: 'nope' });
      const store = useChatStore();

      await store.initializeChat();

      expect(store.chatMessagesList).toEqual([{ role: 'user', content: 'hi' }]);
    });

    it('leaves an answer that is still streaming alone', async () => {
      localStorage.setItem('chatThreadId', 'thread-1');
      const stream = controlledStream();
      const store = useChatStore();
      const sending = store.onSendMessage('a question');
      await stream.push(sse({ content: 'Hel' }));

      await store.initializeChat();
      await stream.push(sse({ content: 'lo' }));
      await stream.end();
      await sending;

      expect(baseGetAxios).not.toHaveBeenCalled();
      expect(store.chatMessagesList).toEqual([
        { role: 'user', content: 'a question' },
        { role: 'assistant', content: 'Hello' }
      ]);
    });

    it('drops a history that arrives after a reset', async () => {
      localStorage.setItem('chatThreadId', 'thread-1');
      let answerHistory!: (history: unknown) => void;
      vi.mocked(baseGetAxios).mockReturnValue(new Promise((resolve) => (answerHistory = resolve)));
      const store = useChatStore();

      const loading = store.initializeChat();
      store.$reset();
      answerHistory([{ role: 'user', content: 'old' }]);
      await loading;

      expect(store.chatMessagesList).toEqual([]);
      expect(store.chatStatus).toBe(CHAT_STATUS.EMPTY);
    });

    it('drops a history that arrives after a new question was sent', async () => {
      localStorage.setItem('chatThreadId', 'thread-1');
      let answerHistory!: (history: unknown) => void;
      vi.mocked(baseGetAxios).mockReturnValue(new Promise((resolve) => (answerHistory = resolve)));
      mockStream([sse({ content: 'Answer' })]);
      const store = useChatStore();

      const loading = store.initializeChat();
      await store.onSendMessage('a question');
      answerHistory([{ role: 'user', content: 'old' }]);
      await loading;

      expect(store.chatMessagesList).toEqual([
        { role: 'user', content: 'a question' },
        { role: 'assistant', content: 'Answer' }
      ]);
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

    it.each([
      CHAT_STATUS.REFORMULATING,
      CHAT_STATUS.REFORMULATED,
      CHAT_STATUS.SEARCHING,
      CHAT_STATUS.SEARCHED,
      CHAT_STATUS.FORMULATING_ANSWER,
      CHAT_STATUS.FORMULATED_ANSWER
    ])('does nothing while the status is %s', async (status) => {
      const store = useChatStore();
      store.chatStatus = status;

      await store.onSendMessage('a question');

      expect(store.isAnswering).toBe(true);
      expect(fetchStream).not.toHaveBeenCalled();
      expect(store.chatMessagesList).toEqual([]);
    });

    it.each([CHAT_STATUS.EMPTY, CHAT_STATUS.DONE, CHAT_STATUS.ERROR, CHAT_STATUS.NO_RESULTS])(
      'accepts a question when the status is %s',
      async (status) => {
        mockStream([sse({ content: 'Answer' })]);
        const store = useChatStore();
        store.chatStatus = status;

        expect(store.isAnswering).toBe(false);
        await store.onSendMessage('a question');

        expect(fetchStream).toHaveBeenCalledTimes(1);
      }
    );

    it('ignores a second question while the first answer streams', async () => {
      auth.isGuest = true;
      const stream = controlledStream();
      const store = useChatStore();

      const first = store.onSendMessage('first');
      // the sources are there, the answer is not: the status is SEARCHED
      await stream.push(sse({ docs: [{ id: 'doc-1' }] }));
      expect(store.chatStatus).toBe(CHAT_STATUS.SEARCHED);
      await store.onSendMessage('second');
      await stream.push(sse({ content: 'Answer' }));
      await stream.end();
      await first;

      expect(fetchStream).toHaveBeenCalledTimes(1);
      expect(store.chatMessagesList).toEqual([
        { role: 'user', content: 'first' },
        { role: 'assistant', content: 'Answer' }
      ]);
      expect(useGuestQuotaStore().usage.chat).toBe(1);
      expect(store.chatStatus).toBe(CHAT_STATUS.DONE);
    });

    it('counts the question in the guest quota as soon as it is accepted', async () => {
      auth.isGuest = true;
      const stream = controlledStream();
      const store = useChatStore();

      const sending = store.onSendMessage('a question');
      await stream.push(sse({ content: 'Hel' }));

      expect(useGuestQuotaStore().usage.chat).toBe(1);
      await stream.end();
      await sending;
      expect(useGuestQuotaStore().usage.chat).toBe(1);
    });

    it('gives the quota back when the stream breaks midway', async () => {
      auth.isGuest = true;
      vi.spyOn(console, 'error').mockImplementation(() => {});
      const read = vi
        .fn()
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode(sse({ content: 'a' }))
        })
        .mockRejectedValueOnce(new Error('connection lost'));
      vi.mocked(fetchStream).mockResolvedValue({
        getReader: () => ({ read })
      } as unknown as StreamBody);
      const store = useChatStore();

      await store.onSendMessage('a question');

      expect(store.chatStatus).toBe(CHAT_STATUS.ERROR);
      expect(useGuestQuotaStore().usage.chat).toBe(0);
    });

    it('does not give back a use for a signed-in user', async () => {
      localStorage.setItem('guestUsage', JSON.stringify({ chat: 3, syllabus: 0 }));
      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(fetchStream).mockRejectedValue(new Error('boom'));

      await useChatStore().onSendMessage('a question');

      expect(useGuestQuotaStore().usage.chat).toBe(3);
    });

    it('counts an answered question in the guest quota', async () => {
      auth.isGuest = true;
      mockStream([sse({ content: 'Hello' })]);
      const store = useChatStore();

      await store.onSendMessage('a question');

      expect(useGuestQuotaStore().usage.chat).toBe(1);
    });

    it('does not count a failed question in the guest quota', async () => {
      auth.isGuest = true;
      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(fetchStream).mockRejectedValue(new Error('boom'));
      const store = useChatStore();

      await store.onSendMessage('a question');

      expect(useGuestQuotaStore().usage.chat).toBe(0);
    });

    it('asks a guest who used every free question to sign up', async () => {
      auth.isGuest = true;
      localStorage.setItem('guestUsage', JSON.stringify({ chat: 5, syllabus: 0 }));
      const store = useChatStore();

      await store.onSendMessage('a question');

      expect(auth.askToSignUp).toHaveBeenCalledWith('chatLimit');
      expect(fetchStream).not.toHaveBeenCalled();
      expect(store.chatMessagesList).toEqual([]);
    });

    // the input keeps a refused question and clears an accepted one
    it('tells whether the question was accepted', async () => {
      const store = useChatStore();
      expect(await store.onSendMessage('')).toBe(false);

      store.chatStatus = CHAT_STATUS.SEARCHED;
      expect(await store.onSendMessage('a question')).toBe(false);

      store.chatStatus = CHAT_STATUS.DONE;
      auth.isGuest = true;
      localStorage.setItem('guestUsage', JSON.stringify({ chat: 5, syllabus: 0 }));
      setActivePinia(createPinia());
      expect(await useChatStore().onSendMessage('a question')).toBe(false);

      auth.isGuest = false;
      mockStream([sse({ content: 'Hello' })]);
      expect(await useChatStore().onSendMessage('a question')).toBe(true);

      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(fetchStream).mockRejectedValue(new Error('boom'));
      expect(await useChatStore().onSendMessage('another question')).toBe(true);
    });

    it('streams the answer into an assistant message and persists the chat', async () => {
      mockStream([sse({ content: 'Hello' }), sse({ delta: ' world' })]);
      const store = useChatStore();

      await store.onSendMessage('a question');

      expect(fetchStream).toHaveBeenCalledWith(
        '/qna/chat/agent_stream',
        { bodyContent: expect.any(String) },
        { signal: expect.any(AbortSignal) }
      );
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
      mockStream([sse({ content: 'Answer' })]);
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
      mockStream([sse({ content: 'Answer' })]);
      const store = useChatStore();

      await store.onSendMessage('a question');

      expect(lastBody()).not.toHaveProperty('thread_id');
    });

    it('stores the thread and message ids sent by the stream', async () => {
      mockStream([sse({ content: 'Answer', thread_id: 'thread-1', message_id: 'msg-1' })]);
      const store = useChatStore();

      await store.onSendMessage('first');

      expect(localStorage.getItem('chatThreadId')).toBe('thread-1');
      expect(localStorage.getItem('chatMessageId')).toBe('msg-1');

      // the next question continues the same thread
      mockStream([sse({ content: 'Answer' })]);
      await store.onSendMessage('second');

      expect(lastBody().thread_id).toBe('thread-1');
    });

    it('stores the sources sent by the stream', async () => {
      const docs = [{ id: 'doc-1' }];
      mockStream([sse({ data: { docs } }), sse({ content: 'Answer' })]);
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

    it('fails the answer when handling a parsed payload throws, without appending raw json', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      const setItem = Storage.prototype.setItem;
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (
        this: Storage,
        key: string,
        value: string
      ) {
        if (key === 'chatSources') throw new Error('quota exceeded');
        setItem.call(this, key, value);
      });
      mockStream([sse({ content: 'Hello' }), sse({ docs: [{ id: 'doc-1' }] })]);
      const store = useChatStore();

      await store.onSendMessage('a question');

      expect(store.chatStatus).toBe(CHAT_STATUS.ERROR);
      expect(store.hasChatAnswerError).toBe(true);
      expect(store.chatMessagesList.at(-1)).toEqual({ role: 'assistant', content: 'Hello' });
    });

    it.each([
      ['payloads without content', [sse({ choices: [{}] }), sse(42)]],
      ['no events', []],
      ['a blank answer', [sse({ content: '  ' })]],
      ['an empty final content', [sse({ content: 'Hello' }), sse({ final_content: '' })]]
    ])('fails the answer and leaves no empty bubble for %s', async (_, chunks) => {
      auth.isGuest = true;
      vi.spyOn(console, 'error').mockImplementation(() => {});
      mockStream(chunks);
      const store = useChatStore();

      await store.onSendMessage('a question');

      const question = [{ role: 'user', content: 'a question' }];
      expect(store.chatMessagesList).toEqual(question);
      expect(JSON.parse(localStorage.getItem('chat')!)).toEqual(question);
      expect(store.chatStatus).toBe(CHAT_STATUS.ERROR);
      expect(store.hasChatAnswerError).toBe(true);
      expect(useGuestQuotaStore().usage.chat).toBe(0);
    });

    it('removes the empty assistant bubble when the stream breaks before any content', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      const read = vi.fn().mockRejectedValue(new Error('connection lost'));
      vi.mocked(fetchStream).mockResolvedValue({
        getReader: () => ({ read })
      } as unknown as StreamBody);
      const store = useChatStore();

      await store.onSendMessage('a question');

      const question = [{ role: 'user', content: 'a question' }];
      expect(store.chatMessagesList).toEqual(question);
      expect(JSON.parse(localStorage.getItem('chat')!)).toEqual(question);
      expect(store.chatStatus).toBe(CHAT_STATUS.ERROR);
      expect(store.hasChatAnswerError).toBe(true);
    });

    it('keeps and persists a partial answer when the stream breaks midway', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      const read = vi
        .fn()
        .mockResolvedValueOnce({
          done: false,
          value: new TextEncoder().encode(sse({ content: 'Hel' }))
        })
        .mockRejectedValueOnce(new Error('connection lost'));
      vi.mocked(fetchStream).mockResolvedValue({
        getReader: () => ({ read })
      } as unknown as StreamBody);
      const store = useChatStore();

      await store.onSendMessage('a question');

      const partial = [
        { role: 'user', content: 'a question' },
        { role: 'assistant', content: 'Hel' }
      ];
      expect(store.chatMessagesList).toEqual(partial);
      expect(JSON.parse(localStorage.getItem('chat')!)).toEqual(partial);
      expect(store.chatStatus).toBe(CHAT_STATUS.ERROR);
      expect(store.hasChatAnswerError).toBe(true);
    });

    it('persists the question before the answer arrives', async () => {
      const stream = controlledStream();
      const store = useChatStore();

      const sending = store.onSendMessage('a question');

      expect(JSON.parse(localStorage.getItem('chat')!)).toEqual([
        { role: 'user', content: 'a question' }
      ]);
      await stream.push(sse({ content: 'Answer' }));
      await stream.end();
      await sending;
    });

    it('keeps the persisted question when the request fails', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.setItem('chat', JSON.stringify([{ role: 'user', content: 'earlier' }]));
      vi.mocked(fetchStream).mockRejectedValue(new Error('network'));
      const store = useChatStore();

      await store.onSendMessage('a question');

      expect(JSON.parse(localStorage.getItem('chat')!)).toEqual([
        { role: 'user', content: 'earlier' },
        { role: 'user', content: 'a question' }
      ]);
      // a reloaded store shows the question
      setActivePinia(createPinia());
      expect(useChatStore().chatMessagesList.at(-1)).toEqual({
        role: 'user',
        content: 'a question'
      });
    });

    it('clears the error of the previous answer as soon as the next question is sent', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(fetchStream).mockRejectedValueOnce(new Error('network'));
      const store = useChatStore();
      await store.onSendMessage('first');
      expect(store.hasChatAnswerError).toBe(true);

      const stream = controlledStream();
      const sending = store.onSendMessage('second');

      expect(store.hasChatAnswerError).toBe(false);
      await stream.push(sse({ content: 'Answer' }));
      await stream.end();
      await sending;

      expect(store.hasChatAnswerError).toBe(false);
      expect(store.chatStatus).toBe(CHAT_STATUS.DONE);
      expect(store.chatMessagesList).toEqual([
        { role: 'user', content: 'first' },
        { role: 'user', content: 'second' },
        { role: 'assistant', content: 'Answer' }
      ]);
    });

    it('asks again on a new thread when the stored one is not found', async () => {
      localStorage.setItem('chatThreadId', 'thread-0');
      localStorage.setItem('chatMessageId', 'msg-0');
      const store = useChatStore();
      mockStream([sse({ content: 'Answer', thread_id: 'thread-1' })]);
      vi.mocked(fetchStream).mockRejectedValueOnce(apiError(404, 'THREAD_NOT_FOUND'));

      await store.onSendMessage('a question');

      const bodies = vi
        .mocked(fetchStream)
        .mock.calls.map(([, body]) => JSON.parse(body.bodyContent));
      expect(bodies).toHaveLength(2);
      expect(bodies[0].thread_id).toBe('thread-0');
      expect(bodies[1]).not.toHaveProperty('thread_id');
      expect(store.chatMessagesList).toEqual([
        { role: 'user', content: 'a question' },
        { role: 'assistant', content: 'Answer' }
      ]);
      expect(store.chatStatus).toBe(CHAT_STATUS.DONE);
      expect(localStorage.getItem('chatThreadId')).toBe('thread-1');
      expect(localStorage.getItem('chatMessageId')).toBeNull();
    });

    it('asks again only once', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.setItem('chatThreadId', 'thread-0');
      vi.mocked(fetchStream).mockRejectedValue(apiError(404, 'THREAD_NOT_FOUND'));
      const store = useChatStore();

      await store.onSendMessage('a question');

      expect(fetchStream).toHaveBeenCalledTimes(2);
      expect(store.chatStatus).toBe(CHAT_STATUS.ERROR);
    });

    it('does not ask again for another error', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.setItem('chatThreadId', 'thread-0');
      vi.mocked(fetchStream).mockRejectedValue(apiError(400, 'EMPTY_QUERY'));
      const store = useChatStore();

      await store.onSendMessage('a question');

      expect(fetchStream).toHaveBeenCalledTimes(1);
      expect(localStorage.getItem('chatThreadId')).toBe('thread-0');
      expect(store.chatStatus).toBe(CHAT_STATUS.ERROR);
    });

    it('does not ask again once a reset happened', async () => {
      localStorage.setItem('chatThreadId', 'thread-0');
      const store = useChatStore();
      vi.mocked(fetchStream).mockImplementationOnce(async () => {
        store.$reset();
        throw apiError(404, 'THREAD_NOT_FOUND');
      });

      await store.onSendMessage('a question');

      expect(fetchStream).toHaveBeenCalledTimes(1);
      expect(store.chatStatus).toBe(CHAT_STATUS.EMPTY);
    });

    it('replaces the streamed answer with the final content', async () => {
      mockStream([
        sse({ status: 'streaming', content: 'See [1]' }),
        sse({ status: 'stop', content: '', final_content: 'See [[1]](https://doc)' })
      ]);
      const store = useChatStore();

      await store.onSendMessage('a question');

      expect(store.chatMessagesList.at(-1)).toEqual({
        role: 'assistant',
        content: 'See [[1]](https://doc)'
      });
      expect(JSON.parse(localStorage.getItem('chat')!)).toEqual(store.chatMessagesList);
    });

    it('keeps the streamed answer when the final event has no final content', async () => {
      mockStream([
        sse({ status: 'streaming', content: 'Hello' }),
        sse({ status: 'stop', content: '' })
      ]);
      const store = useChatStore();

      await store.onSendMessage('a question');

      expect(store.chatMessagesList.at(-1)).toEqual({ role: 'assistant', content: 'Hello' });
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

  describe('startNewChat', () => {
    it('empties the conversation, like $reset', async () => {
      mockStream([
        sse({ content: 'Hi', docs: [{ id: 'doc-1' }], thread_id: 't', message_id: 'm' })
      ]);
      const store = useChatStore();
      store.setReformulatedQuery('reformulated');
      await store.onSendMessage('a question');

      store.startNewChat();

      expect(store.chatStatus).toBe(CHAT_STATUS.EMPTY);
      expect(store.chatMessagesList).toEqual([]);
      expect(store.sourcesList).toEqual([]);
      expect(store.reformulatedQuery).toBeNull();
      for (const key of ['chat', 'chatSources', 'reformulatedQuery', 'chatThreadId']) {
        expect(localStorage.getItem(key)).toBeNull();
      }
    });
  });

  describe('openThread', () => {
    it('loads the history of the thread and persists it', async () => {
      const history = [
        { role: 'user', content: 'hi' },
        { role: 'assistant', content: 'hello' }
      ];
      vi.mocked(baseGetAxios).mockResolvedValue(history);
      const store = useChatStore();

      await store.openThread('thread-1');

      expect(baseGetAxios).toHaveBeenCalledWith('/qna/chat/history?thread_id=thread-1');
      expect(store.chatMessagesList).toEqual(history);
      expect(store.chatStatus).toBe(CHAT_STATUS.DONE);
      expect(localStorage.getItem('chatThreadId')).toBe('thread-1');
      expect(JSON.parse(localStorage.getItem('chat')!)).toEqual(history);
    });

    it('drops the previous conversation, its sources and its reformulated query', async () => {
      mockStream([
        sse({ content: 'Old', docs: [{ id: 'doc-1' }], thread_id: 'old', message_id: 'm' })
      ]);
      const store = useChatStore();
      store.setReformulatedQuery('reformulated');
      await store.onSendMessage('old question');
      let answerHistory!: (history: unknown) => void;
      vi.mocked(baseGetAxios).mockReturnValue(new Promise((resolve) => (answerHistory = resolve)));

      const opening = store.openThread('thread-1');

      expect(store.chatMessagesList).toEqual([]);
      expect(store.sourcesList).toEqual([]);
      expect(store.reformulatedQuery).toBeNull();
      expect(store.chatStatus).toBe(CHAT_STATUS.EMPTY);
      expect(localStorage.getItem('chatSources')).toBeNull();
      expect(localStorage.getItem('chatMessageId')).toBeNull();
      answerHistory([{ role: 'user', content: 'hi' }]);
      await opening;
      expect(store.chatMessagesList).toEqual([{ role: 'user', content: 'hi' }]);

      // the next question continues the opened thread
      mockStream([sse({ content: 'Answer' })]);
      await store.onSendMessage('follow-up');
      expect(lastBody().thread_id).toBe('thread-1');
    });

    it('stops the answer in flight and ignores what it sends late', async () => {
      localStorage.setItem('chatThreadId', 'old-thread');
      const stream = controlledStream();
      const store = useChatStore();
      const sending = store.onSendMessage('old question');
      await stream.push(sse({ content: 'Old ' }));
      const signal = signalOfLastCall();
      vi.mocked(baseGetAxios).mockResolvedValue([{ role: 'user', content: 'hi' }]);

      const opening = store.openThread('thread-1');
      expect(signal.aborted).toBe(true);
      await stream.push(sse({ content: 'late', docs: [{ id: 'doc-1' }], thread_id: 'old-thread' }));
      await sending;
      await opening;

      expect(store.chatMessagesList).toEqual([{ role: 'user', content: 'hi' }]);
      expect(store.sourcesList).toEqual([]);
      expect(store.hasChatAnswerError).toBe(false);
      expect(store.chatStatus).toBe(CHAT_STATUS.DONE);
      expect(localStorage.getItem('chatThreadId')).toBe('thread-1');
      expect(JSON.parse(localStorage.getItem('chat')!)).toEqual([{ role: 'user', content: 'hi' }]);
    });

    it('drops a history that arrives after another thread was opened', async () => {
      const answers: ((history: unknown) => void)[] = [];
      vi.mocked(baseGetAxios).mockImplementation(
        () => new Promise((resolve) => answers.push(resolve))
      );
      const store = useChatStore();

      const first = store.openThread('thread-1');
      const second = store.openThread('thread-2');
      answers[1]([{ role: 'user', content: 'second' }]);
      await second;
      answers[0]([{ role: 'user', content: 'first' }]);
      await first;

      expect(store.chatMessagesList).toEqual([{ role: 'user', content: 'second' }]);
      expect(localStorage.getItem('chatThreadId')).toBe('thread-2');
    });

    it('starts a new chat when the thread is not found', async () => {
      vi.mocked(baseGetAxios).mockRejectedValue(apiError(404, 'THREAD_NOT_FOUND'));
      const store = useChatStore();

      await store.openThread('thread-1');

      expect(store.chatMessagesList).toEqual([]);
      expect(localStorage.getItem('chatThreadId')).toBeNull();
    });
  });

  describe('restoreLatestThread', () => {
    const LATEST = '/qna/chat/threads/latest';
    const HISTORY = [
      { role: 'user', content: 'hi' },
      { role: 'assistant', content: 'hello' }
    ];

    // the user id is stored by user_and_session before the restore runs
    const ACCOUNT = 'account-user';
    const restoredFor = () => JSON.parse(localStorage.getItem('chatRestoredFor') ?? 'null');

    beforeEach(() => {
      auth.isAuthenticated = true;
      localStorage.setItem('userId', JSON.stringify(ACCOUNT));
    });

    // answers the latest thread call with `latest`, and the history call with HISTORY
    const mockApi = (latest: unknown) =>
      vi
        .mocked(baseGetAxios)
        .mockImplementation(async (url: string) => (url === LATEST ? latest : HISTORY));

    it('does nothing for a guest, and forgets the previous login', async () => {
      auth.isAuthenticated = false;
      localStorage.setItem('chatRestoredFor', JSON.stringify(ACCOUNT));
      const store = useChatStore();

      await store.restoreLatestThread();

      expect(baseGetAxios).not.toHaveBeenCalled();
      expect(localStorage.getItem('chatRestoredFor')).toBeNull();
    });

    it('does nothing when a thread is stored, for the rest of the login', async () => {
      localStorage.setItem('chatThreadId', 'guest-thread');
      const store = useChatStore();

      await store.restoreLatestThread();

      expect(baseGetAxios).not.toHaveBeenCalled();
      expect(restoredFor()).toBe(ACCOUNT);

      // erased, then reloaded: stays empty
      store.startNewChat();
      await store.restoreLatestThread();
      expect(baseGetAxios).not.toHaveBeenCalled();
    });

    it('does nothing when the chat has messages', async () => {
      localStorage.setItem('chat', JSON.stringify([{ role: 'user', content: 'unanswered' }]));
      const store = useChatStore();

      await store.restoreLatestThread();

      expect(baseGetAxios).not.toHaveBeenCalled();
      expect(restoredFor()).toBe(ACCOUNT);
    });

    it('runs once per login: an erased chat stays empty after a reload', async () => {
      localStorage.setItem('chatRestoredFor', JSON.stringify(ACCOUNT));
      const store = useChatStore();

      await store.restoreLatestThread();

      expect(baseGetAxios).not.toHaveBeenCalled();
    });

    it('restores again for another user (a guest logged into an existing account)', async () => {
      localStorage.setItem('chatRestoredFor', JSON.stringify('previous-user'));
      mockApi({ thread_id: 'thread-1' });
      const store = useChatStore();

      await store.restoreLatestThread();

      expect(store.chatMessagesList).toEqual(HISTORY);
      expect(restoredFor()).toBe(ACCOUNT);
    });

    it('restores again after a guest boot cleared the previous login', async () => {
      localStorage.setItem('chatRestoredFor', JSON.stringify(ACCOUNT));
      auth.isAuthenticated = false;
      await useChatStore().restoreLatestThread();
      auth.isAuthenticated = true;
      mockApi({ thread_id: 'thread-1' });
      const store = useChatStore();

      await store.restoreLatestThread();

      expect(store.chatMessagesList).toEqual(HISTORY);
    });

    it('stays on the empty chat when the account has no thread', async () => {
      mockApi({ thread_id: null });
      const store = useChatStore();

      await store.restoreLatestThread();

      expect(baseGetAxios).toHaveBeenCalledTimes(1);
      expect(baseGetAxios).toHaveBeenCalledWith(LATEST);
      expect(store.chatMessagesList).toEqual([]);
      expect(localStorage.getItem('chatThreadId')).toBeNull();
      // looked up once for this login
      expect(restoredFor()).toBe(ACCOUNT);
      await store.restoreLatestThread();
      expect(baseGetAxios).toHaveBeenCalledTimes(1);
    });

    it('opens the latest thread of the account', async () => {
      mockApi({ thread_id: 'thread-1' });
      const store = useChatStore();

      await store.restoreLatestThread();

      expect(baseGetAxios).toHaveBeenCalledWith('/qna/chat/history?thread_id=thread-1');
      expect(store.chatMessagesList).toEqual(HISTORY);
      expect(store.chatStatus).toBe(CHAT_STATUS.DONE);
      expect(localStorage.getItem('chatThreadId')).toBe('thread-1');
    });

    it('leaves a question sent while the latest thread was looked up', async () => {
      let answerLatest!: (latest: unknown) => void;
      vi.mocked(baseGetAxios).mockReturnValue(new Promise((resolve) => (answerLatest = resolve)));
      mockStream([sse({ content: 'Answer', thread_id: 'new-thread' })]);
      const store = useChatStore();

      const restoring = store.restoreLatestThread();
      await store.onSendMessage('a question');
      answerLatest({ thread_id: 'thread-1' });
      await restoring;

      expect(baseGetAxios).toHaveBeenCalledTimes(1);
      expect(store.chatMessagesList).toEqual([
        { role: 'user', content: 'a question' },
        { role: 'assistant', content: 'Answer' }
      ]);
      expect(localStorage.getItem('chatThreadId')).toBe('new-thread');
    });

    it('leaves a question that is still being answered', async () => {
      let answerLatest!: (latest: unknown) => void;
      vi.mocked(baseGetAxios).mockReturnValue(new Promise((resolve) => (answerLatest = resolve)));
      const stream = controlledStream();
      const store = useChatStore();

      const restoring = store.restoreLatestThread();
      const sending = store.onSendMessage('a question');
      answerLatest({ thread_id: 'thread-1' });
      await restoring;
      await stream.push(sse({ content: 'Answer' }));
      await stream.end();
      await sending;

      expect(store.chatMessagesList).toEqual([
        { role: 'user', content: 'a question' },
        { role: 'assistant', content: 'Answer' }
      ]);
    });

    it('only logs an error', async () => {
      const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(baseGetAxios).mockRejectedValue(new Error('network'));
      const store = useChatStore();

      await expect(store.restoreLatestThread()).resolves.toBeUndefined();

      expect(errorLog).toHaveBeenCalled();
      expect(store.chatStatus).toBe(CHAT_STATUS.EMPTY);
      expect(store.hasChatAnswerError).toBe(false);
      // the next boot tries again
      expect(localStorage.getItem('chatRestoredFor')).toBeNull();
    });
  });

  describe('deleteCurrentChat', () => {
    // a conversation on thread-1, answered and persisted
    const chatOnThread = async () => {
      mockStream([sse({ content: 'Hi', docs: [{ id: 'doc-1' }], thread_id: 'thread-1' })]);
      const store = useChatStore();
      await store.onSendMessage('a question');
      return store;
    };

    const expectEmptyChat = (store: ReturnType<typeof useChatStore>) => {
      expect(store.chatMessagesList).toEqual([]);
      expect(store.sourcesList).toEqual([]);
      expect(store.chatStatus).toBe(CHAT_STATUS.EMPTY);
      for (const key of ['chat', 'chatSources', 'chatThreadId']) {
        expect(localStorage.getItem(key)).toBeNull();
      }
    };

    it('deletes the thread in the api and empties the chat', async () => {
      vi.mocked(deleteChatThread).mockResolvedValue({} as never);
      const store = await chatOnThread();

      await store.deleteCurrentChat();

      expect(deleteChatThread).toHaveBeenCalledWith('thread-1');
      expectEmptyChat(store);
    });

    it('empties the chat when the thread is already gone', async () => {
      const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(deleteChatThread).mockRejectedValue(apiError(404, 'THREAD_NOT_FOUND'));
      const store = await chatOnThread();

      await expect(store.deleteCurrentChat()).resolves.toBeUndefined();

      expectEmptyChat(store);
      expect(errorLog).not.toHaveBeenCalled();
    });

    it('logs another error and still empties the chat', async () => {
      const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(deleteChatThread).mockRejectedValue(new Error('network'));
      const store = await chatOnThread();

      await expect(store.deleteCurrentChat()).resolves.toBeUndefined();

      expectEmptyChat(store);
      expect(errorLog).toHaveBeenCalled();
    });

    it('calls nothing without a thread', async () => {
      localStorage.setItem('chat', JSON.stringify([{ role: 'user', content: 'unanswered' }]));
      const store = useChatStore();

      await store.deleteCurrentChat();

      expect(deleteChatThread).not.toHaveBeenCalled();
      expectEmptyChat(store);
    });

    it('does nothing while an answer streams', async () => {
      localStorage.setItem('chatThreadId', 'thread-1');
      const stream = controlledStream();
      const store = useChatStore();
      const sending = store.onSendMessage('a question');
      await stream.push(sse({ content: 'Hel' }));

      await store.deleteCurrentChat();
      await stream.push(sse({ content: 'lo' }));
      await stream.end();
      await sending;

      expect(deleteChatThread).not.toHaveBeenCalled();
      expect(store.chatMessagesList).toEqual([
        { role: 'user', content: 'a question' },
        { role: 'assistant', content: 'Hello' }
      ]);
    });

    it('keeps a question asked while the api deletes the thread', async () => {
      let endDeletion!: () => void;
      vi.mocked(deleteChatThread).mockReturnValue(
        new Promise((resolve) => (endDeletion = () => resolve({} as never)))
      );
      const store = await chatOnThread();

      const deleting = store.deleteCurrentChat();
      mockStream([sse({ content: 'New answer', thread_id: 'thread-2' })]);
      await store.onSendMessage('new question');
      endDeletion();
      await deleting;

      expect(lastBody()).not.toHaveProperty('thread_id');
      expect(store.chatMessagesList).toEqual([
        { role: 'user', content: 'new question' },
        { role: 'assistant', content: 'New answer' }
      ]);
      expect(localStorage.getItem('chatThreadId')).toBe('thread-2');
    });
  });

  describe('$reset', () => {
    it('stops the answer in flight and lets nothing from it reach the new conversation', async () => {
      auth.isGuest = true;
      localStorage.setItem('chatThreadId', 'old-thread');
      const stream = controlledStream();
      const store = useChatStore();

      const sending = store.onSendMessage('old question');
      await stream.push(sse({ content: 'Old ' }));
      const signal = signalOfLastCall();
      expect(signal.aborted).toBe(false);

      store.$reset();
      expect(signal.aborted).toBe(true);
      // a mocked reader does not see the abort: the store must drop what it reads, then stop
      await stream.push(
        sse({
          content: 'answer',
          docs: [{ id: 'doc-1' }],
          thread_id: 'old-thread',
          message_id: 'm'
        })
      );
      await sending;

      expect(store.chatMessagesList).toEqual([]);
      expect(store.sourcesList).toEqual([]);
      expect(store.chatStatus).toBe(CHAT_STATUS.EMPTY);
      expect(store.hasChatAnswerError).toBe(false);
      expect(store.processingMetadata).toBeNull();
      for (const key of ['chat', 'chatSources', 'chatThreadId', 'chatMessageId']) {
        expect(localStorage.getItem(key)).toBeNull();
      }
      // the stopped answer does not use the guest quota
      expect(useGuestQuotaStore().usage.chat).toBe(0);
      expect(track).not.toHaveBeenCalledWith('Chat Answer Received', expect.anything());

      // the next question starts a new thread, and can be sent right away
      mockStream([sse({ content: 'New answer' })]);
      await store.onSendMessage('new question');
      expect(lastBody()).not.toHaveProperty('thread_id');
      expect(store.chatMessagesList).toEqual([
        { role: 'user', content: 'new question' },
        { role: 'assistant', content: 'New answer' }
      ]);
    });

    it('drops a stream that opens after the reset', async () => {
      let openStream!: (body: StreamBody) => void;
      vi.mocked(fetchStream).mockReturnValue(new Promise((resolve) => (openStream = resolve)));
      const read = vi.fn();
      const store = useChatStore();

      const sending = store.onSendMessage('a question');
      store.$reset();
      openStream({ getReader: () => ({ read }) } as unknown as StreamBody);
      await sending;

      expect(read).not.toHaveBeenCalled();
      expect(store.chatMessagesList).toEqual([]);
      expect(store.chatStatus).toBe(CHAT_STATUS.EMPTY);
    });

    it('does not show an error for the request it aborted', async () => {
      const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(fetchStream).mockImplementation(
        (_endpoint, _body, { signal } = {}) =>
          new Promise((_, reject) =>
            signal!.addEventListener('abort', () =>
              reject(new DOMException('aborted', 'AbortError'))
            )
          )
      );
      const store = useChatStore();

      const sending = store.onSendMessage('a question');
      store.$reset();
      await sending;

      expect(store.chatStatus).toBe(CHAT_STATUS.EMPTY);
      expect(store.hasChatAnswerError).toBe(false);
      expect(errorLog).not.toHaveBeenCalled();
      expect(track).not.toHaveBeenCalledWith('Chat Answer Failed', expect.anything());
    });

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
      mockStream([sse({ content: 'Answer' })]);
      await store.onSendMessage('new question');
      expect(lastBody()).not.toHaveProperty('thread_id');
    });
  });
});
