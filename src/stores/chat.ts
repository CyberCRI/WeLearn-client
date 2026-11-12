import { defineStore } from 'pinia';
import { computed, ref, type ComputedRef, type Ref } from 'vue';
import type { Document, ChatMessage, ChatProcessingMetadata } from '@/types';
import { baseGetAxios, fetchStream } from '@/utils/fetch';
import { getQueryParamValue } from '@/utils/urlsUtils';
import { getFromStorage, saveToStorage, clearFromStorage } from '@/utils/storage';
import { extractProcessingMetadata } from '@/utils/chatProcessing';
import i18n from '@/localisation/i18n';
import { useFiltersStore } from '@/stores/filters';
import { track } from '@/utils/analytics';
import { useGuestQuotaStore } from '@/stores/guestQuota';
import { useAuthStore } from '@/stores/auth';
import type { ApiResponse } from '@/types/api';

// CHAT STATUSES
export const CHAT_STATUS = {
  ERROR: 'ERROR',
  EMPTY: 'EMPTY',
  REFORMULATED: 'REFORMULATED',
  REFORMULATING: 'REFORMULATING',
  SEARCHING: 'SEARCHING',
  SEARCHED: 'SEARCHED',
  NO_RESULTS: 'NO_RESULTS',
  FORMULATING_ANSWER: 'FORMULATING_ANSWER',
  FORMULATED_ANSWER: 'FORMULATED_ANSWER',
  DONE: 'DONE'
};

type CHAT_STATUSES_TYPE = keyof typeof CHAT_STATUS;

// the api answers 404 THREAD_NOT_FOUND for a thread that is gone or belongs to someone else,
// for example a guest whose session expired: the stored thread can't be continued
const isThreadNotFound = (error: unknown): boolean => {
  const response = (error as { response?: { status?: number; data?: any } })?.response;
  return response?.status === 404 && response.data?.detail?.code === 'THREAD_NOT_FOUND';
};

// every other status means an answer is on its way (SEARCHED and FORMULATED_ANSWER included)
const SETTLED_STATUSES = [
  CHAT_STATUS.EMPTY,
  CHAT_STATUS.DONE,
  CHAT_STATUS.ERROR,
  CHAT_STATUS.NO_RESULTS
];

export const useChatStore = defineStore('chat', () => {
  const questionNumbers: Ref<number[] | undefined> = ref(undefined);
  const chatInput: Ref<string> = ref('');
  const hasChatAnswerError: Ref<boolean> = ref(false);
  const chatMessagesList: Ref<ChatMessage[]> = ref(getFromStorage('chat') || []);
  const questionQueues: Ref<string[] | null> = ref(getFromStorage('questionQueues'));
  const sourcesList: Ref<Document[] | []> = ref(getFromStorage('chatSources') || []);
  const reformulatedQuery: Ref<string | null> = ref(getFromStorage('reformulatedQuery'));
  const storedThreadId: Ref<string | null> = ref(localStorage.getItem('chatThreadId'));
  const storedMessageId: Ref<string | null> = ref(localStorage.getItem('chatMessageId'));

  const isChatEmpty: ComputedRef<Boolean> = computed(() => chatMessagesList.value.length === 0);
  const chatStatus: Ref<(typeof CHAT_STATUS)[CHAT_STATUSES_TYPE]> = ref(
    isChatEmpty.value ? CHAT_STATUS.EMPTY : CHAT_STATUS.DONE
  );
  const processingMetadata: Ref<ChatProcessingMetadata | null> = ref(null);
  const isAnswering: ComputedRef<boolean> = computed(
    () => !SETTLED_STATUSES.includes(chatStatus.value)
  );

  // bumped by every send, every reset and every thread opened: an answer or a history from an older generation
  // must not write into the current conversation
  let generation = 0;
  let streamController: AbortController | null = null;

  const processingStatusLabel: ComputedRef<string> = computed(() => {
    const metadata = processingMetadata.value;

    const stepTranslationMap: Record<string, string> = {
      fetching_resources: 'chatProcessingSteps.fetching_resources',
      analyzing_resources: 'chatProcessingSteps.analyzing_resources',
      generating_answer: 'chatProcessingSteps.generating_answer'
    };

    if (metadata?.step && stepTranslationMap[metadata.step]) {
      return i18n.global.t(stepTranslationMap[metadata.step]);
    }

    return i18n.global.t('sourcesList.formulatingAnswer');
  });

  const clearProcessingMetadata = () => {
    processingMetadata.value = null;
  };

  const setProcessingMetadata = (metadata: ChatProcessingMetadata) => {
    processingMetadata.value = metadata;

    if (
      metadata.step &&
      ['fetching_resources', 'analyzing_resources'].includes(metadata.step) &&
      !sourcesList.value.length
    ) {
      chatStatus.value = CHAT_STATUS.SEARCHING;
      return;
    }

    chatStatus.value = CHAT_STATUS.FORMULATING_ANSWER;
  };

  // loads a thread's history into the chat. a reset, a new question or another thread opened
  // meanwhile starts a new generation, and the history is then dropped
  const loadHistory = async (threadId: string) => {
    const startedGeneration = generation;

    try {
      const chatThread = await baseGetAxios<ChatMessage[]>(
        `/qna/chat/history?thread_id=${encodeURIComponent(threadId)}`
      );
      if (startedGeneration !== generation || !Array.isArray(chatThread)) {
        return;
      }

      if (chatThread.length > 0) {
        chatStatus.value = CHAT_STATUS.DONE;
      }

      chatMessagesList.value = chatThread;
      saveToStorage('chat', chatThread);
    } catch (error) {
      if (isThreadNotFound(error)) {
        // the conversation can't be continued, so a follow-up would be answered without it
        if (startedGeneration === generation) {
          startNewChat();
        }
        return;
      }
      // keep the chat restored from storage
      console.error(error);
    }
  };

  const initializeChat = async () => {
    // an answer still streaming (the user left the page and came back) is newer than the history
    if (!storedThreadId.value || isAnswering.value) {
      return;
    }
    await loadHistory(storedThreadId.value);
  };

  const shouldFetchNewDocuments: Ref<boolean> = ref(true);
  const subjectHasChanged: Ref<boolean> = ref(true);

  const storedSubject: Ref<string | undefined> = ref(getFromStorage('chatSubject') || undefined);

  const clearSubject = (): void => {
    storedSubject.value = undefined;
    clearFromStorage('chatSubject');
  };

  const selectSubject = (subject: string) => {
    subjectHasChanged.value = true;
    if (subject === storedSubject.value) {
      clearSubject();
      return;
    }

    storedSubject.value = subject;
    saveToStorage('chatSubject', subject);
  };
  const shouldDisplaySubjects = computed(() => i18n.global.locale.value == 'en');
  const shouldDisplayScore: ComputedRef<Boolean> = computed(
    () => getQueryParamValue('score') === 'true'
  );

  function addToMessageList(message: ChatMessage): void {
    if (!message.content.length) {
      return;
    }

    chatMessagesList.value.push(message);
    // saved now, so the question survives a reload even when no answer comes
    saveToStorage('chat', chatMessagesList.value);
  }

  const setReformulatedQuery = (query: string): void => {
    reformulatedQuery.value = query;
    saveToStorage('reformulatedQuery', query);
  };

  function clearInput(): void {
    chatInput.value = '';
  }

  function storeThreadId(threadId: string) {
    if (threadId !== storedThreadId.value) {
      localStorage.setItem('chatThreadId', threadId);
      storedThreadId.value = threadId;
    }
  }

  function forgetThread() {
    storedThreadId.value = null;
    storedMessageId.value = null;
    clearFromStorage('chatThreadId');
    clearFromStorage('chatMessageId');
  }

  function storeMessageId(messageId: string) {
    if (messageId !== storedMessageId.value) {
      localStorage.setItem('chatMessageId', messageId);
      storedMessageId.value = messageId;
    }
  }

  // resolves false when the answer was dropped because a reset started a new generation
  async function getAgentAnswer(
    userMsg: string,
    answerGeneration: number,
    signal: AbortSignal
  ): Promise<boolean> {
    const isStale = () => answerGeneration !== generation;
    clearProcessingMetadata();

    const { sdgFilters, sourcesFilters: selectedCorpus } = useFiltersStore();
    const openStream = () =>
      fetchStream(
        '/qna/chat/agent_stream',
        {
          bodyContent: JSON.stringify({
            query: userMsg,
            ...(storedThreadId.value && { thread_id: storedThreadId.value }),
            corpora: selectedCorpus,
            sdg_filter: sdgFilters
          })
        },
        { signal }
      );

    let stream: Awaited<ReturnType<typeof fetchStream>>;
    try {
      stream = await openStream();
    } catch (error) {
      if (!isThreadNotFound(error) || isStale()) {
        throw error;
      }
      // the stored thread can't be continued: ask again on a new one
      forgetThread();
      stream = await openStream();
    }
    if (isStale()) {
      return false;
    }
    if (!stream) {
      throw new Error('Unable to create stream reader');
    }
    const reader = stream.getReader();
    const decoder = new TextDecoder();

    const assistantMessage: ChatMessage = { role: 'assistant', content: '' };
    chatMessagesList.value.push(assistantMessage);
    const assistantMessageIndex = chatMessagesList.value.length - 1;

    let streamBuffer = '';
    let lastPersistTimestamp = 0;

    const persistChat = (force = false) => {
      const now = Date.now();
      if (force || now - lastPersistTimestamp >= 250) {
        saveToStorage('chat', chatMessagesList.value);
        lastPersistTimestamp = now;
      }
    };

    const appendToAssistantMessage = (chunk: string) => {
      const currentMessage = chatMessagesList.value[assistantMessageIndex];
      if (!currentMessage) {
        return;
      }

      chatMessagesList.value[assistantMessageIndex] = {
        ...currentMessage,
        content: `${currentMessage.content}${chunk}`
      };
      persistChat();
    };

    // an answer that failed or came back empty leaves no blank bubble behind
    const dropEmptyAssistantMessage = () => {
      const currentMessage = chatMessagesList.value[assistantMessageIndex];
      if (currentMessage?.role === 'assistant' && !currentMessage.content.trim()) {
        chatMessagesList.value.splice(assistantMessageIndex, 1);
      }
    };

    const replaceAssistantMessage = (content: string) => {
      const currentMessage = chatMessagesList.value[assistantMessageIndex];
      if (!currentMessage) {
        return;
      }

      chatMessagesList.value[assistantMessageIndex] = { ...currentMessage, content };
      persistChat();
    };

    const extractContentChunk = (parsed: any): string => {
      if (!parsed || typeof parsed !== 'object') {
        return '';
      }

      const directContent = parsed?.content ?? parsed?.delta ?? parsed?.chunk ?? parsed?.token;
      if (typeof directContent === 'string') {
        return directContent;
      }

      if (typeof parsed?.data === 'string') {
        return parsed.data;
      }

      if (typeof parsed?.data?.content === 'string') {
        return parsed.data.content;
      }

      if (typeof parsed?.delta?.content === 'string') {
        return parsed.delta.content;
      }

      if (typeof parsed?.message?.content === 'string') {
        return parsed.message.content;
      }

      if (typeof parsed?.answer === 'string') {
        return parsed.answer;
      }

      if (Array.isArray(parsed?.choices)) {
        for (const choice of parsed.choices) {
          if (typeof choice?.delta?.content === 'string') {
            return choice.delta.content;
          }
          if (typeof choice?.text === 'string') {
            return choice.text;
          }
        }
      }

      return '';
    };

    const extractDocs = (parsed: any): Document[] | null => {
      if (!parsed || typeof parsed !== 'object') {
        return null;
      }

      if (Array.isArray(parsed?.docs)) {
        return parsed.docs;
      }

      if (Array.isArray(parsed?.data?.docs)) {
        return parsed.data.docs;
      }

      return null;
    };

    const handleStreamPayload = (payload: string) => {
      if (!payload || payload === '[DONE]') {
        return;
      }

      // only a payload that is not json is plain text: an error thrown while handling a parsed
      // payload must fail the answer, not end up as raw json in it
      let parsed: any;
      try {
        parsed = JSON.parse(payload);
      } catch {
        if (!payload.startsWith('event:')) {
          appendToAssistantMessage(payload);
        }
        return;
      }

      const parsedProcessingMetadata = extractProcessingMetadata(parsed);

      if (parsedProcessingMetadata) {
        setProcessingMetadata(parsedProcessingMetadata);
      }

      const contentChunk = extractContentChunk(parsed);

      if (contentChunk) {
        if (processingMetadata.value?.step !== 'generating_answer') {
          setProcessingMetadata({
            status: 'processing',
            step: 'generating_answer'
          });
        }
        chatStatus.value = CHAT_STATUS.FORMULATING_ANSWER;
        appendToAssistantMessage(contentChunk);
      }

      // the last event carries the whole answer when the api rewrote it (citation links added)
      if (typeof parsed?.final_content === 'string') {
        replaceAssistantMessage(parsed.final_content);
      }

      const docs = extractDocs(parsed);
      if (docs) {
        sourcesList.value = docs;
        saveToStorage('chatSources', docs);
        if (docs.length > 0) {
          chatStatus.value = CHAT_STATUS.SEARCHED;
        }
      }

      if (typeof parsed?.thread_id === 'string') {
        storeThreadId(parsed.thread_id);
      }

      if (typeof parsed?.message_id === 'string') {
        storeMessageId(parsed.message_id);
      }
    };

    const handleStreamEvent = (rawEvent: string) => {
      const event = rawEvent.trim();
      if (!event) {
        return;
      }

      if (!event.includes('\n') && !event.startsWith('data:')) {
        handleStreamPayload(event);
        return;
      }

      const dataLines = event
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.startsWith('data:'))
        .map((line) => line.slice(5).trim());

      if (!dataLines.length) {
        return;
      }

      for (const payload of dataLines) {
        handleStreamPayload(payload);
      }
    };

    try {
      let isDone = false;
      while (!isDone) {
        const { done: readerDone, value } = await reader.read();
        // the events of a chunk are handled synchronously, so checking after each read is enough
        if (isStale()) {
          return false;
        }
        if (readerDone) {
          isDone = true;
          break;
        }

        streamBuffer += decoder.decode(value, { stream: true });
        const events = streamBuffer.split('\n\n');
        streamBuffer = events.pop() || '';

        for (const event of events) {
          handleStreamEvent(event);
        }
      }

      const remaining = streamBuffer.trim();
      if (remaining) {
        handleStreamEvent(remaining);
      }

      if (!chatMessagesList.value[assistantMessageIndex]?.content.trim()) {
        throw new Error('The answer stream ended without any content');
      }
    } catch (error) {
      // a reset already emptied the chat. a partial answer is kept, as it is still worth reading,
      // and the error shown under it tells the answer is not complete
      if (!isStale()) {
        dropEmptyAssistantMessage();
        persistChat(true);
      }
      throw error;
    }

    persistChat(true);

    clearProcessingMetadata();
    chatStatus.value = CHAT_STATUS.FORMULATED_ANSWER;
    return true;
  }

  // false when the question is refused (empty, an answer streams, guest quota used up), so the
  // input keeps the text. true once accepted, even if the answer then fails
  async function onSendMessage(message: string, isSuggestedQuestion = false): Promise<boolean> {
    // one answer at a time
    if (!message || isAnswering.value) {
      return false;
    }

    const guestQuota = useGuestQuotaStore();
    if (!guestQuota.checkQuota('chat')) return false;
    // counted as soon as the question is accepted, so parallel sends cannot pass the check,
    // and given back when no answer comes
    const isQuotaCounted = guestQuota.consume('chat');
    const refundQuota = () => {
      if (isQuotaCounted) guestQuota.refund('chat');
    };

    const answerGeneration = ++generation;
    const controller = new AbortController();
    streamController = controller;
    chatStatus.value = CHAT_STATUS.FORMULATING_ANSWER;
    // the error of the previous answer is not about this one
    hasChatAnswerError.value = false;

    const { sdgFilters, sourcesFilters } = useFiltersStore();
    track('Chat Question Sent', {
      queryLength: message.length,
      isFollowUp: !!storedThreadId.value,
      isSuggestedQuestion,
      sdgFilterCount: sdgFilters.length,
      corpusFilterCount: sourcesFilters.length
    });
    const startedAt = Date.now();

    addToMessageList({ role: 'user', content: message });

    let isAnswered: boolean;
    try {
      isAnswered = await getAgentAnswer(message, answerGeneration, controller.signal);
    } catch (error) {
      refundQuota();
      // aborted by a reset: the conversation it belonged to is gone
      if (answerGeneration !== generation) {
        return true;
      }
      clearProcessingMetadata();
      chatStatus.value = CHAT_STATUS.ERROR;
      hasChatAnswerError.value = true;
      console.error(error);
      track('Chat Answer Failed', { durationMs: Date.now() - startedAt });
      return true;
    } finally {
      if (streamController === controller) {
        streamController = null;
      }
    }

    if (!isAnswered) {
      refundQuota();
      return true;
    }

    chatStatus.value = CHAT_STATUS.DONE;
    track('Chat Answer Received', {
      durationMs: Date.now() - startedAt,
      sourcesCount: sourcesList.value.length
    });
    return true;
  }

  const getRandomQuestionNumber = () => {
    const a = Math.floor(Math.random() * 10);
    let b;
    do {
      b = Math.floor(Math.random() * 10);
    } while (b === a);
    questionNumbers.value = [a, b];
  };

  // stop the answer in flight, and drop whatever it was about to write
  function stopAnswer() {
    generation++;
    streamController?.abort();
    streamController = null;
    clearProcessingMetadata();
    chatStatus.value = CHAT_STATUS.EMPTY;
    hasChatAnswerError.value = false;
  }

  function clearConversation() {
    chatMessagesList.value = [];
    sourcesList.value = [];
    reformulatedQuery.value = null;
    forgetThread();
    clearFromStorage('chat');
    clearFromStorage('chatSources');
    clearFromStorage('reformulatedQuery');
  }

  function startNewChat() {
    stopAnswer();
    clearConversation();
    getRandomQuestionNumber();
    chatInput.value = '';
    shouldFetchNewDocuments.value = true;
    storedSubject.value = undefined;
    clearFromStorage('questionQueues');
    clearFromStorage('chatSubject');
  }

  // the input draft and the subject stay: they are not part of the conversation
  async function openThread(threadId: string) {
    stopAnswer();
    clearConversation();
    storeThreadId(threadId);
    await loadHistory(threadId);
  }

  // nothing on screen to overwrite: no thread, no message, no answer coming
  const canRestoreThread = () =>
    useAuthStore().isAuthenticated &&
    !storedThreadId.value &&
    isChatEmpty.value &&
    !isAnswering.value;

  // brings back the account's latest chat, on any device. a guest who signs up keeps their chat
  // (its thread is stored, so nothing is restored); a guest who logs into another account already
  // lost theirs in user.ts syncUserId
  async function restoreLatestThread() {
    if (!canRestoreThread()) {
      return;
    }
    const startedGeneration = generation;

    try {
      const { thread_id: threadId } = await baseGetAxios<ApiResponse<'/qna/chat/threads/latest'>>(
        '/qna/chat/threads/latest'
      );
      // the user may have asked something meanwhile
      if (!threadId || startedGeneration !== generation || !canRestoreThread()) {
        return;
      }
      await openThread(threadId);
    } catch (error) {
      // a convenience: without it the user just starts on an empty chat
      console.error(error);
    }
  }

  // kept for the stores that reset every user's data (user.ts)
  const $reset = startNewChat;

  return {
    getRandomQuestionNumber,
    questionNumbers,
    chatStatus,
    isAnswering,
    processingMetadata,
    processingStatusLabel,
    initializeChat,
    chatInput,
    chatMessagesList,
    questionQueues,
    sourcesList,
    reformulatedQuery,
    onSendMessage,
    clearInput,
    setReformulatedQuery,
    shouldDisplayScore,
    storedSubject,
    selectSubject,
    clearSubject,
    shouldDisplaySubjects,
    hasChatAnswerError,
    startNewChat,
    openThread,
    restoreLatestThread,
    $reset
  };
});
