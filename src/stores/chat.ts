import { defineStore } from 'pinia';
import { computed, ref, type ComputedRef, type Ref } from 'vue';
import type { Document, ChatMessage } from '@/types';
import { postAxios } from '@/utils/fetch';
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

export const useChatStore = defineStore('chat', () => {
  const chatInput: Ref<string> = ref('');
  const chatMessagesList: Ref<ChatMessage[]> = ref(getFromStorage('chat') || []);
  const questionQueues: Ref<string[] | null> = ref(getFromStorage('questionQueues'));
  const sourcesList: Ref<Document[]> = ref(getFromStorage('chatSources') || []);
  const reformulatedQuery: Ref<string | null> = ref(getFromStorage('reformulatedQuery'));
  const storedConversationId: Ref<string | null> = ref(localStorage.getItem('chatConversationId'));
  const storedMessageId: Ref<string | null> = ref(localStorage.getItem('chatMessageId'));

  const isChatEmpty: ComputedRef<Boolean> = computed(() => chatMessagesList.value.length === 0);
  const chatStatus: Ref<(typeof CHAT_STATUS)[CHAT_STATUSES_TYPE]> = ref(
    isChatEmpty.value ? CHAT_STATUS.EMPTY : CHAT_STATUS.DONE
  );

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

  function storeConversationId(conversationId: string) {
    if (conversationId !== storedConversationId.value) {
      localStorage.setItem('chatConversationId', conversationId);
      storedConversationId.value = conversationId;
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

    const respBody = await postAxios('/qna/chat/rephrase', bodyContent);

    chatMessagesList.value.push({ role: 'assistant', content: respBody.data });
    saveToStorage('chat', chatMessagesList.value);

    chatStatus.value = CHAT_STATUS.FORMULATED_ANSWER;
    chatStatus.value = CHAT_STATUS.DONE;
  }

  async function getAgentAnswer(userMsg: string) {
    const { sdgFilters, sourcesFilters: selectedCorpus } = useFiltersStore();
    const body = {
      query: userMsg,
      threadId: storedConversationId.value,
      corpora: selectedCorpus,
      sdg_filter: sdgFilters
    };

    const { data } = await postAxios('/qna/chat/agent', body);

    chatMessagesList.value.push({ role: 'assistant', content: data.content });
    if (data.docs) {
      sourcesList.value = data.docs;
    }

    storeConversationId(data.conversation_id);
    storeMessageId(data.message_id);

    chatStatus.value = CHAT_STATUS.FORMULATED_ANSWER;
  }

  async function getNewQuestions(userMsg: string) {
    const newQuestions: AxiosResponse<{ NEW_QUESTIONS: string[] }> = await postAxios(
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
      await getNewQuestions(message);
    } catch (error) {
      chatStatus.value = CHAT_STATUS.ERROR;
      console.error(error);
      return;
    }

    chatStatus.value = CHAT_STATUS.DONE;
  }

  function $reset() {
    chatStatus.value = CHAT_STATUS.EMPTY;
    chatInput.value = '';
    chatMessagesList.value = [];
    questionQueues.value = null;
    sourcesList.value = [];
    reformulatedQuery.value = null;
    shouldFetchNewDocuments.value = true;
    storedSubject.value = undefined;
    storedConversationId.value = null;
    storedMessageId.value = null;
    clearFromStorage('chat');
    clearFromStorage('chatSources');
    clearFromStorage('questionQueues');
    clearFromStorage('reformulatedQuery');
    clearFromStorage('chatSubject');
    clearFromStorage('chatConversationId');
    clearFromStorage('chatMessageId');
  }

  return {
    chatStatus,
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
