import { defineStore } from 'pinia';
import { computed, ref, type ComputedRef, type Ref } from 'vue';
import type { Document, ChatMessage, ChatProcessingMetadata } from '@/types';
import { baseGetAxios, basePostAxios, fetchStream } from '@/utils/fetch';
import { getQueryParamValue } from '@/utils/urlsUtils';
import { getFromStorage, saveToStorage, clearFromStorage } from '@/utils/storage';
import i18n from '@/localisation/i18n';
import type { AxiosResponse } from 'axios';
import { useFiltersStore } from '@/stores/filters';

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

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const normalizeProcessingStep = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[-\s]+/g, '_');
  if (!normalized) {
    return undefined;
  }

  if (['fetching_resources', 'analyzing_resources', 'generating_answer'].includes(normalized)) {
    return normalized;
  }

  return undefined;
};

const toProcessingMetadata = (value: unknown): ChatProcessingMetadata | null => {
  if (!isRecord(value)) {
    return null;
  }

  const rawStatus =
    typeof value.status === 'string' ? value.status.trim().toLowerCase() : undefined;
  const statusAsStep = normalizeProcessingStep(rawStatus);
  const step =
    normalizeProcessingStep(value.step) ?? (rawStatus === 'processing' ? undefined : statusAsStep);

  const isProcessingEvent = rawStatus === 'processing' || Boolean(step);
  if (!isProcessingEvent) {
    return null;
  }

  if (!step) {
    return null;
  }

  return {
    status: 'processing',
    step,
  };
};

const extractProcessingMetadata = (parsed: unknown): ChatProcessingMetadata | null => {
  if (!isRecord(parsed)) {
    return null;
  }

  return (
    toProcessingMetadata(parsed) ??
    toProcessingMetadata(parsed.data) ??
    toProcessingMetadata(parsed.meta) ??
    toProcessingMetadata(parsed.metadata)
  );
};

export const useChatStore = defineStore('chat', () => {
  const chatInput: Ref<string> = ref('');
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
      ['fetching_resources', 'analyzing_resources'].includes(metadata.step || '') &&
      !sourcesList.value.length
    ) {
      chatStatus.value = CHAT_STATUS.SEARCHING;
      return;
    }

    chatStatus.value = CHAT_STATUS.FORMULATING_ANSWER;
  };

  const initializeChat = async () => {
    if (!storedThreadId.value) {
      return;
    }
    const chatThread = await baseGetAxios(`/qna/chat/history?thread_id=${storedThreadId.value}`);

    if (chatThread.length > 0) {
      chatStatus.value = CHAT_STATUS.DONE;
    }

    chatMessagesList.value = chatThread;
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

  const getMessageHistory: ComputedRef<ChatMessage[]> = computed(() => {
    return chatMessagesList.value.slice(0, -1);
  });

  function addToMessageList(message: ChatMessage): void {
    if (!message.content.length) {
      return;
    }

    chatMessagesList.value.push(message);
  }

  const setReformulatedQuery = (query: string): void => {
    reformulatedQuery.value = query;
    saveToStorage('reformulatedQuery', query);
  };

  function setQuestionQueues(messages: string[]): void {
    questionQueues.value = messages;
    saveToStorage('questionQueues', messages);
  }

  function clearInput(): void {
    chatInput.value = '';
  }

  function storeThreadId(threadId: string) {
    if (threadId !== storedThreadId.value) {
      localStorage.setItem('chatThreadId', threadId);
      storedThreadId.value = threadId;
    }
  }

  function storeMessageId(messageId: string) {
    if (messageId !== storedMessageId.value) {
      console.log('Storing message ID:', messageId);
      localStorage.setItem('chatMessageId', messageId);
      storedMessageId.value = messageId;
    }
  }

  async function fetchRephrase() {
    clearProcessingMetadata();
    chatStatus.value = CHAT_STATUS.FORMULATING_ANSWER;
    // get the content of the message which the role is assistant
    const lastAssistantMessage = [...chatMessagesList.value]
      .reverse()
      .find((msg) => msg.role === 'assistant')?.content;

    const bodyContent = {
      sources: sourcesList.value,
      history: getMessageHistory.value,
      query: lastAssistantMessage,
      ...(storedSubject.value && { subject: storedSubject.value })
    };

    const respBody = await basePostAxios('/qna/chat/rephrase', bodyContent);

    chatMessagesList.value.push({ role: 'assistant', content: respBody.data });
    saveToStorage('chat', chatMessagesList.value);

    chatStatus.value = CHAT_STATUS.FORMULATED_ANSWER;
    chatStatus.value = CHAT_STATUS.DONE;
  }

  async function getAgentAnswer(userMsg: string) {
    clearProcessingMetadata();

    const { sdgFilters, sourcesFilters: selectedCorpus } = useFiltersStore();
    const body = {
      query: userMsg,
      ...(storedThreadId.value && { thread_id: storedThreadId.value }),
      corpora: selectedCorpus,
      sdg_filter: sdgFilters
    };

    const stream = await fetchStream('/qna/chat/agent_stream', {
      bodyContent: JSON.stringify(body)
    });
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

    const handleStreamPayload = (payload: string) => {
      if (!payload || payload === '[DONE]') {
        return;
      }

      try {
        const parsed = JSON.parse(payload);
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

        if (Array.isArray(parsed?.docs)) {
          sourcesList.value = parsed.docs;
          saveToStorage('chatSources', sourcesList.value);
          if (parsed.docs.length > 0) {
            chatStatus.value = CHAT_STATUS.SEARCHED;
          }
        }

        if (typeof parsed?.thread_id === 'string') {
          storeThreadId(parsed.thread_id);
        }

        if (typeof parsed?.message_id === 'string') {
          storeMessageId(parsed.message_id);
        }
      } catch {
        if (!payload.startsWith('event:')) {
          appendToAssistantMessage(payload);
        }
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

    let isDone = false;
    while (!isDone) {
      const { done: readerDone, value } = await reader.read();
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

    persistChat(true);

    clearProcessingMetadata();
    chatStatus.value = CHAT_STATUS.FORMULATED_ANSWER;
  }

  async function getNewQuestions(userMsg: string) {
    const newQuestions: AxiosResponse<{ NEW_QUESTIONS: string[] }> = await basePostAxios(
      '/qna/reformulate/questions',
      {
        history: getMessageHistory.value,
        query: userMsg
      }
    );

    setQuestionQueues(newQuestions?.data['NEW_QUESTIONS']);
  }

  async function onSendMessage(message: string): Promise<void> {
    // checks if can be sent
    if (
      !message ||
      [CHAT_STATUS.FORMULATING_ANSWER, CHAT_STATUS.SEARCHING].includes(chatStatus.value)
    ) {
      return;
    }

    addToMessageList({ role: 'user', content: message });

    try {
      chatStatus.value = CHAT_STATUS.FORMULATING_ANSWER;
      await getAgentAnswer(message);
    } catch (error) {
      clearProcessingMetadata();
      chatStatus.value = CHAT_STATUS.ERROR;
      console.error(error);
      return;
    }

    try {
      await getNewQuestions(message);
    } catch (error) {
      console.error('Failed to fetch new questions:', error);
    }

    chatStatus.value = CHAT_STATUS.DONE;
  }

  function $reset() {
    clearProcessingMetadata();
    chatStatus.value = CHAT_STATUS.EMPTY;
    chatInput.value = '';
    chatMessagesList.value = [];
    questionQueues.value = null;
    sourcesList.value = [];
    reformulatedQuery.value = null;
    shouldFetchNewDocuments.value = true;
    storedSubject.value = undefined;
    storedThreadId.value = null;
    storedMessageId.value = null;
    clearFromStorage('chat');
    clearFromStorage('chatSources');
    clearFromStorage('questionQueues');
    clearFromStorage('reformulatedQuery');
    clearFromStorage('chatSubject');
    clearFromStorage('chatThreadId');
    clearFromStorage('chatMessageId');
  }

  return {
    chatStatus,
    processingMetadata,
    processingStatusLabel,
    initializeChat,
    chatInput,
    chatMessagesList,
    questionQueues,
    sourcesList,
    reformulatedQuery,
    onSendMessage,
    fetchRephrase,
    clearInput,
    setReformulatedQuery,
    shouldDisplayScore,
    storedSubject,
    selectSubject,
    clearSubject,
    shouldDisplaySubjects,
    $reset
  };
});
