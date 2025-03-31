import { defineStore } from 'pinia';
import { getAxios } from '@/utils/fetch';
import { computed, ref, type ComputedRef, type Ref } from 'vue';
import type { Document, ErrorDetails, ChatMessage, ReformulateResponse } from '@/types';
import { fetchStream, postAxios } from '@/utils/fetch';
import { getQueryParamValue } from '@/utils/urlsUtils';
import { RELEVANCE_FACTOR } from '@/utils/constants';
import { getFromStorage, saveToStorage, clearFromStorage } from '@/utils/storage';
import i18n from '@/localisation/i18n';
import type { AxiosResponse } from 'axios';

// CHAT STATUSES
export const CHAT_STATUS = {
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

const other_language_mapping = {
  EN: 'FR',
  FR: 'EN'
};

type CHAT_STATUSES_TYPE = keyof typeof CHAT_STATUS;

export const useChatStore = defineStore('chat', () => {
  const chatInput: Ref<string> = ref('');
  const chatMessagesList: Ref<ChatMessage[]> = ref(getFromStorage('chat') || []);
  const questionQueues: Ref<string[] | null> = ref(getFromStorage('questionQueues'));
  const sourcesList: Ref<Document[] | null> = ref(getFromStorage('chatSources') || []);
  const reformulatedQuery: Ref<string | null> = ref(getFromStorage('reformulatedQuery'));
  const queriesToSearch: Ref<string[]> = ref([]);

  const isChatEmpty: ComputedRef<Boolean> = computed(() => chatMessagesList.value.length === 0);
  const chatStatus: Ref<CHAT_STATUSES_TYPE> = ref(
    isChatEmpty.value ? CHAT_STATUS.EMPTY : CHAT_STATUS.DONE
  );

  const shouldFetchNewDocuments: Ref<boolean> = ref(true);
  const subjectHasChanged: Ref<boolean> = ref(true);

  const sdgFilters: Ref<number[]> = ref([]);
  const selectedCorpus: Ref<Corpus['name'][]> = ref([]);
  const storedSubject: Ref<string | undefined> = ref(getFromStorage('chatSubject') || undefined);

  const allCorpus: Ref<Corpus['name'][]> = ref([]);
  const corpora: Ref<ReducedCorpus[]> = ref([]);

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

  const setQueriesToSearch = (queries: string[]): void => {
    queriesToSearch.value = queries;
  };

  function setQuestionQueues(messages: string[]): void {
    questionQueues.value = messages;
    saveToStorage('questionQueues', messages);
  }

  function clearInput(): void {
    chatInput.value = '';
  }

  async function reformulateQuestion(query: string) {
    try {
      chatStatus.value = CHAT_STATUS.REFORMULATING;
      const bodyContent = {
        history: getMessageHistory.value,
        query: query
      };

      const reformulate: AxiosResponse<ReformulateResponse> = await postAxios(
        '/qna/reformulate/query',
        bodyContent
      );

      if (!reformulate || !reformulate.data) {
        chatStatus.value = CHAT_STATUS.ERROR;
        return;
      }

      const { data } = reformulate;

      if (data.QUERY_STATUS === 'REF_TO_PAST') {
        shouldFetchNewDocuments.value = false;
        chatStatus.value = CHAT_STATUS.SEARCHED;
        return;
      }

      if (data.QUERY_STATUS === 'INVALID') {
        chatStatus.value = CHAT_STATUS.ERROR;
        return;
      }

      shouldFetchNewDocuments.value = true;

      const userLang = data['USER_LANGUAGE'].toUpperCase();
      const reformulatedQuery = reformulate.data[`STANDALONE_QUESTION_${userLang}`];
      const otherLang = data[`STANDALONE_QUESTION_${other_language_mapping[userLang]}`];

      if (!reformulatedQuery) {
        // add error message
        return;
      }

      setReformulatedQuery(reformulatedQuery);
      setQueriesToSearch([reformulatedQuery, otherLang]);
      chatStatus.value = CHAT_STATUS.REFORMULATED;
    } catch (error: unknown) {
      chatStatus.value = CHAT_STATUS.ERROR;
      const { message, code } = (error as ErrorDetails).response.data.detail;

      if (code === 'LANG_NOT_SUPPORTED') {
        chatMessagesList.value.push({
          role: 'assistant',
          content: `${i18n.global.t('error.LANG_NOT_SUPPORTED.title')} ${i18n.global.t(
            'error.LANG_NOT_SUPPORTED.description'
          )}`
        });
      }

      if (code === 'INVALID_QUESTION') {
        chatMessagesList.value.push({
          role: 'assistant',
          content: message
        });
      }
    }
  }

  async function fetchSources(): Promise<void> {
    if (
      (storedSubject.value && !subjectHasChanged.value) ||
      !reformulatedQuery.value ||
      !shouldFetchNewDocuments.value
    ) {
      return;
    }

    try {
      chatStatus.value = CHAT_STATUS.SEARCHING;
      const sourcesResp: AxiosResponse<Document[]> = await postAxios(
        `/search/multiple_by_slices?nb_results=10${
          storedSubject.value ? `&subject=${storedSubject.value}` : ''
        }`,
        {
          query: queriesToSearch.value,
          relevance_factor: RELEVANCE_FACTOR,
          sdg_filter: sdgFilters.value,
          corpora: selectedCorpus.value
        }
      );

      subjectHasChanged.value = false;

      const { data: sources, status: sourcesStatus } = sourcesResp;

      if (sourcesStatus === 204) {
        chatStatus.value = CHAT_STATUS.NO_RESULTS;
        // no result
        return;
      }

      if (sourcesStatus === 200 && sources === null) {
        chatStatus.value = CHAT_STATUS.NO_RESULTS;
        // no result
        return;
      }
      chatStatus.value = CHAT_STATUS.SEARCHED;

      sourcesList.value = sources;
      saveToStorage('chatSources', sources);
    } catch (error) {
      chatStatus.value = CHAT_STATUS.ERROR;
    }
  }

  async function fetchChatAnswer(userMsg: string) {
    if (chatStatus.value !== CHAT_STATUS.SEARCHED) return;

    try {
      const bodyContent = JSON.stringify({
        sources: sourcesList.value || [],
        history: getMessageHistory.value,
        query: userMsg,
        ...(storedSubject.value && { subject: storedSubject.value })
      });

      const respBody = await fetchStream('/qna/stream', {
        bodyContent
      });

      if (!respBody) {
        return;
      }

      const reader = respBody.pipeThrough(new TextDecoderStream()).getReader();

      chatMessagesList.value.push({ role: 'assistant', content: '' });
      const assistantsAns = chatMessagesList.value.length - 1;

      // eslint-disable-next-line no-constant-condition
      while (true) {
        chatStatus.value = CHAT_STATUS.FORMULATING_ANSWER;
        const { value, done } = await reader.read();

        if (done) {
          const newQuestions: AxiosResponse<{ NEW_QUESTIONS: string[] }> = await postAxios(
            '/qna/reformulate/questions',
            {
              history: getMessageHistory.value,
              query: reformulatedQuery.value
            }
          );
          chatStatus.value = CHAT_STATUS.FORMULATED_ANSWER;

          setQuestionQueues(newQuestions?.data['NEW_QUESTIONS']);

          saveToStorage('chat', chatMessagesList.value);
          break;
        }
        chatMessagesList.value[assistantsAns].content += value;
      }
    } catch (error) {
      console.error(error);
      chatStatus.value = CHAT_STATUS.ERROR;
    }
  }

  async function fetchRephraseStream(message: string) {
    if (!chatStatus.value === CHAT_STATUS.DONE) return;
    chatStatus.value = CHAT_STATUS.FORMULATING_ANSWER;
    try {
      const lastAssistantsMessage =
        message || chatMessagesList.value[chatMessagesList.value.length - 1].content;

      const bodyContent = JSON.stringify({
        sources: sourcesList.value,
        history: getMessageHistory.value,
        query: lastAssistantsMessage,
        ...(storedSubject.value && { subject: storedSubject.value })
      });

      let respBody;
      try {
        respBody = await fetchStream('/qna/chat/rephrase_stream', { bodyContent });
      } catch (error) {
        console.error(error);
      }

      if (!respBody) {
        return;
      }

      const reader = respBody.pipeThrough(new TextDecoderStream()).getReader();

      chatMessagesList.value.push({ role: 'assistant', content: '' });
      const assistantsAns = chatMessagesList.value.length - 1;

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          chatStatus.value = CHAT_STATUS.FORMULATED_ANSWER;
          isAnswerStreamed.value = true;

          break;
        }
        chatMessagesList.value[assistantsAns].content += value;
      }
    } catch (error) {
      chatStatus.value = CHAT_STATUS.ERROR;
    } finally {
      chatStatus.value = CHAT_STATUS.FORMULATED_ANSWER;
      chatStatus.value = CHAT_STATUS.DONE;
    }
  }

  const noResultsAnswer = () => {
    chatMessagesList.value.push({
      role: 'assistant',
      content: i18n.global.t('chatNoResults')
    });
  };

  async function onSendMessage(message: string): Promise<void> {
    // checks if can be sent
    if (
      !message ||
      [CHAT_STATUS.FORMULATING_ANSWER, CHAT_STATUS.SEARCHING].includes(chatStatus.value)
    ) {
      return;
    }

    // adds message to history
    addToMessageList({ role: 'user', content: message });

    try {
      // rephrases question
      await reformulateQuestion(message);
      if (chatStatus.value === CHAT_STATUS.ERROR) {
        chatMessagesList.value.push({
          role: 'assistant',
          content: i18n.global.t('chatProvideValidQuestion')
        });
      }

      // gets documents
      await fetchSources();
    } catch (error) {
      console.error(error);
      chatStatus.value = CHAT_STATUS.ERROR;
    }
    if (chatStatus.value === CHAT_STATUS.NO_RESULTS) {
      noResultsAnswer();
      return;
    }

    if (sourcesList.value?.length) {
      try {
        // gets new questions & answer
        await fetchChatAnswer(message);
      } catch (error) {
        chatStatus.value = CHAT_STATUS.ERROR;
        console.error(error);
        return;
      }
    }
    chatStatus.value = CHAT_STATUS.DONE;
  }

  function toggleFilter(index: number) {
    const sdg = index + 1;
    if (sdgFilters.value.includes(sdg)) {
      sdgFilters.value = sdgFilters.value.filter((x) => x !== sdg);
      return;
    }

    sdgFilters.value.push(sdg);

    return sdgFilters.value.sort((a, b) => a - b);
  }

  async function getCorpus() {
    if (corpora.value.length > 0) {
      return;
    }

    try {
      const fetchedCorpus = await getAxios('/search/collections');

      const mergedCorpusByLang = fetchedCorpus.reduce((acc: ReducedCorpus[], curr: Corpus) => {
        const existingCorpus = acc.findIndex((corpus: ReducedCorpus) => corpus.name === curr.name);
        if (existingCorpus >= 0) {
          acc[existingCorpus].lang.push(curr.lang);
          return acc;
        }
        return [...acc, { ...curr, lang: [curr.lang] }];
      }, [] as ReducedCorpus[]);

      corpora.value = mergedCorpusByLang;
      allCorpus.value = mergedCorpusByLang.map(({ name }: { name: string }) => name);
    } catch (error: unknown) {
      chatStatus.value = CHAT_STATUS.ERROR;
    }
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
    selectedCorpus.value = [];
    sdgFilters.value = [];
    clearFromStorage('chat');
    clearFromStorage('chatSources');
    clearFromStorage('questionQueues');
    clearFromStorage('reformulatedQuery');
    clearFromStorage('chatSubject');
  }

  return {
    chatStatus,
    chatInput,
    chatMessagesList,
    questionQueues,
    sourcesList,
    selectedCorpus,
    getCorpus,
    corpora,
    allCorpus,
    sdgFilters,
    toggleFilter,
    reformulatedQuery,
    onSendMessage,
    fetchRephraseStream,
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
