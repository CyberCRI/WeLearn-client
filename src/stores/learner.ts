import { defineStore } from 'pinia';
import { computed, ref, watch, type Ref } from 'vue';
import { basePostAxios, getSearch } from '@/utils/fetch';
import { RELEVANCE_FACTOR } from '@/utils/constants';
import { MAX_SOURCES } from '@/utils/connections';
import { askUsableAnswer, guessLanguage, type ReadingLanguage } from '@/utils/courseReading';
import { parseQueries, selectCandidates } from '@/utils/activityDesign';
import {
  DISCOVERY_WORDS,
  messageKind,
  nonAnswerStreak,
  askedTwice,
  currentFocus,
  isOnlyQuestions,
  learnerLanguage,
  MUST_CONTRIBUTE,
  relevantDocuments,
  STUCK_AFTER,
  buildDiscoveryRequest,
  buildEvidenceRequest,
  buildPlanRequest,
  buildScenariosRequest,
  buildTutorRequest,
  emptyThread,
  parseDiscovery,
  parseEvidence,
  parseScenarios,
  parseTutorAnswer,
  type EvidenceResult,
  type LearnerSpace,
  type LearnerStart,
  type LearningThread,
  type Scenario,
  type Turn,
  type TutorMode
} from '@/utils/learnerTutor';
import { clearFromSession, getFromSession, saveToSession } from '@/utils/storage';
import type { Document } from '@/types';
import i18n from '@/localisation/i18n';

// the learner space: one learning thread (topic, confirmed purpose, kept sources, notes) shared by
// the starting conversation and the four spaces, and one conversation per place with the same
// tutor. kept in this browser tab only (sessionStorage), never sent anywhere but to the tutor's
// requests, and cleared by "start over"

export type Place = LearnerSpace | 'start';
export type Status = 'idle' | 'thinking' | 'searching' | 'ready' | 'unavailable' | 'error';

const SESSION_KEY = 'learnerThread';
const MAX_KEPT = 5;
// references for UNDERSTAND, results per search question for INVESTIGATE
const REFERENCES = 4;
const RESULTS_PER_QUERY = 8;

const failureStatus = (error: any): 'unavailable' | 'error' => {
  const code = error?.response?.status;
  return !error?.response || [403, 404, 502, 503, 504].includes(code) ? 'unavailable' : 'error';
};

const documentsOf = (data: any): Document[] => (Array.isArray(data) ? data : data?.docs) || [];

export const useLearnerStore = defineStore('learner', () => {
  const saved = getFromSession(SESSION_KEY);
  const thread: Ref<LearningThread> = ref({ ...emptyThread(), ...(saved?.thread || {}) });
  const conversations: Ref<Partial<Record<Place, Turn[]>>> = ref(saved?.conversations || {});
  const status: Ref<Partial<Record<Place, Status>>> = ref({});
  // documents found for a place (the homepage question, UNDERSTAND's references, INVESTIGATE's
  // candidates)
  const spaceDocuments: Ref<Partial<Record<Place, Document[]>>> = ref({});
  const evidence: Ref<EvidenceResult | null> = ref(null);
  const scenarios: Ref<Scenario[]> = ref([]);

  watch(
    [thread, conversations],
    () => saveToSession(SESSION_KEY, { thread: thread.value, conversations: conversations.value }),
    { deep: true }
  );

  const hasThread = computed(() => !!(thread.value.topic || thread.value.purpose));

  const languageOf = (text: string): ReadingLanguage =>
    guessLanguage(text, i18n.global.locale.value === 'en' ? 'en' : 'fr');

  const turnsOf = (place: Place) => conversations.value[place] || [];
  const addTurn = (place: Place, turn: Turn) => {
    conversations.value = { ...conversations.value, [place]: [...turnsOf(place), turn] };
  };
  const setStatus = (place: Place, value: Status) => {
    status.value = { ...status.value, [place]: value };
  };

  // the homepage conversation opens with WeLearn's greeting (a fixed text: nothing to generate
  // before the learner has said anything); an existing conversation in this tab is kept
  const greet = (greeting: string) => {
    if (!turnsOf('start').length) {
      conversations.value = { ...conversations.value, start: [{ role: 'tutor', text: greeting }] };
    }
  };

  // what the learner wrote themselves (not the starting choice they clicked)
  const ownMessages = () =>
    turnsOf('start').filter((turn) => turn.role === 'learner' && !turn.isChoice);

  // a clear question gets real WeLearn documents first, so the answer can rest on them
  const isQuestion = (text: string, start: LearnerStart | null) =>
    /\?\s*$/.test(text) || (start === 'question' && ownMessages().length === 1);

  // what the conversation is about, as WeLearn last named it: what a search looks for, and what
  // a space the learner opens starts from
  const conversationTopic = () =>
    [...turnsOf('start')].reverse().find((turn) => turn.role === 'tutor' && turn.topic)?.topic ||
    '';
  const MIN_SEARCH_WORDS = 6;
  // the WeLearn documents for this message: for a real question, or for a statement with enough
  // substance once the conversation has a subject; never for "is this the topic?" or "idk"
  const searchFor = (text: string, start: LearnerStart | null) => {
    const kind = messageKind(text, isQuestion(text, start));
    const topic = conversationTopic();
    if (kind === 'question' || kind === 'direct') return topic ? `${text} (${topic})` : text;
    const isSubstantive = kind === 'other' && text.trim().split(/\s+/).length >= MIN_SEARCH_WORDS;
    return isSubstantive && topic ? `${topic}: ${text}` : null;
  };

  const reply = async (text: string) => {
    const start = thread.value.start;
    const lang = learnerLanguage(text, i18n.global.locale.value === 'en' ? 'en' : 'fr');
    // a doubt about why sustainability matters gets no search: the tutor asks about their situation
    // a clicked starter is a choice: a short invitation to say more is the right reply to it
    const kind = turnsOf('start').at(-1)?.isChoice
      ? 'choice'
      : messageKind(text, isQuestion(text, start));
    const asks = kind === 'question' || kind === 'direct';
    const query = searchFor(text, start);
    try {
      if (query) {
        setStatus('start', 'searching');
        try {
          const { data } = await getSearch(REFERENCES, {
            query,
            relevance_factor: RELEVANCE_FACTOR
          });
          spaceDocuments.value = { ...spaceDocuments.value, start: documentsOf(data) };
        } catch {
          // no documents: the tutor answers from what is established, and says so
        }
      }
      setStatus('start', 'thinking');
      // only the documents that bear on the subject as it stands now (the search always returns
      // something, and an earlier search's results may be about something else by now)
      const documents = relevantDocuments(
        spaceDocuments.value.start || [],
        currentFocus(turnsOf('start'))
      );
      spaceDocuments.value = { ...spaceDocuments.value, start: documents };
      // the first attempt is held to the tone (short, one question) and, when it is time, to a
      // proposed purpose; the retry has no such limits, so a usable reply never becomes an error
      const words = asks ? DISCOVERY_WORDS.answering : DISCOVERY_WORDS.listening;
      const streak = nonAnswerStreak(turnsOf('start'));
      const isStuck = streak >= STUCK_AFTER;
      // the greeting is not a question asked by WeLearn in this conversation; a learner who asks
      // for a direct answer, is tired of questions or turns down an offer gets none
      const mayAsk =
        !askedTwice(turnsOf('start').slice(1)) &&
        !['direct', 'frustrated', 'declines'].includes(kind);
      const previous = turnsOf('start')
        .filter((turn) => turn.role === 'tutor')
        .map((turn) => turn.text);
      // up to three attempts, each less demanding: the tone and repetition checks, then only
      // near-copies (and still no third question in a row), then only what must hold (a usable
      // answer, no unsourced figure). a usable reply always reaches the learner instead of an error
      // a learner who said something of substance gets more than a question back (the first two
      // attempts; the last one only checks what must hold)
      const contributes = (answer: ReturnType<typeof parseDiscovery>) =>
        answer && MUST_CONTRIBUTE.includes(kind) && isOnlyQuestions(answer.reply) ? null : answer;
      const checks = [
        (raw: string) =>
          contributes(parseDiscovery(raw, lang, documents, words, previous, isStuck, text, mayAsk)),
        (raw: string) =>
          contributes(
            parseDiscovery(raw, lang, documents, undefined, previous, false, text, mayAsk)
          ),
        (raw: string) =>
          parseDiscovery(raw, lang, documents, undefined, [], false, text, mayAsk, true)
      ];
      let answer: ReturnType<typeof parseDiscovery> = null;
      for (const check of checks) {
        const { data } = await basePostAxios(
          '/qna/chat/answer',
          buildDiscoveryRequest(start, thread.value, turnsOf('start'), lang, documents, asks)
        );
        answer = typeof data?.answer === 'string' ? check(data.answer) : null;
        if (answer) break;
      }
      if (!answer) return setStatus('start', 'error');
      // a suggested space stays a link under the reply, with the topic it would carry there; the
      // move, concepts and key terms are the conversation's memory for the next replies
      addTurn('start', {
        role: 'tutor',
        text: answer.reply,
        ...(answer.topic ? { topic: answer.topic } : {}),
        ...(answer.space ? { space: answer.space } : {}),
        ...(answer.move ? { move: answer.move } : {}),
        ...(answer.concepts.length ? { concepts: answer.concepts } : {}),
        ...(answer.focus.length ? { focus: answer.focus } : {})
      });
      setStatus('start', 'ready');
    } catch (error) {
      setStatus('start', failureStatus(error));
    }
  };

  // one of the three starting choices, clicked inside the conversation: it becomes the learner's
  // first message, and WeLearn answers it
  const choose = (start: LearnerStart, label: string) => {
    thread.value = { ...thread.value, start };
    addTurn('start', { role: 'learner', text: label, isChoice: true });
    return reply(label);
  };

  const discover = (text: string) => {
    if (!text.trim() || ['thinking', 'searching'].includes(status.value.start || '')) return;
    addTurn('start', { role: 'learner', text: text.trim() });
    return reply(text.trim());
  };

  // the learner follows a space WeLearn suggested: the conversation's topic goes with them
  const openSuggestedSpace = (turn: Turn) => {
    if (turn.topic) thread.value = { ...thread.value, topic: turn.topic };
  };

  const setTopic = (topic: string) => {
    if (topic.trim() !== thread.value.topic) {
      thread.value = { ...thread.value, topic: topic.trim() };
    }
  };

  // what a space shows the learner, so the tutor talks about the same things
  const materialOf = (space: LearnerSpace) => {
    if (space === 'envision') {
      return scenarios.value
        .map(
          (scenario) => `${scenario.name} : ${scenario.story} (${scenario.assumptions.join(' ; ')})`
        )
        .join('\n');
    }
    if (space === 'investigate') {
      return (evidence.value?.items || [])
        .map((item) => `« ${item.document.payload.document_title} » : ${item.says}`)
        .join('\n');
    }
    return '';
  };

  // one tutor for every space: the thread, the space's conversation and its documents
  const ask = async (space: LearnerSpace, mode: TutorMode, message: string, shown?: string) => {
    if (status.value[space] === 'thinking') return;
    addTurn(space, { role: 'learner', text: shown || message });
    setStatus(space, 'thinking');
    const documents = [
      ...(spaceDocuments.value[space] || []),
      ...thread.value.resources.filter(
        (kept) =>
          !(spaceDocuments.value[space] || []).some(
            (doc) => doc.payload.document_id === kept.payload.document_id
          )
      )
    ].slice(0, MAX_SOURCES - 1);
    const lang = languageOf(`${message} ${thread.value.topic}`);
    try {
      const answer = await askUsableAnswer(
        () =>
          basePostAxios(
            '/qna/chat/answer',
            buildTutorRequest(
              space,
              mode,
              message,
              thread.value,
              turnsOf(space).slice(0, -1),
              documents,
              lang,
              materialOf(space)
            )
          ),
        (raw) => parseTutorAnswer(raw, documents, lang)
      );
      if (!answer) return setStatus(space, 'error');
      addTurn(space, { role: 'tutor', text: answer });
      setStatus(space, 'ready');
    } catch (error) {
      setStatus(space, failureStatus(error));
    }
  };

  // UNDERSTAND: a few WeLearn documents on the concept, for the tutor to ground its explanations
  const findReferences = async (concept: string) => {
    try {
      const { data } = await getSearch(REFERENCES, {
        query: concept,
        relevance_factor: RELEVANCE_FACTOR
      });
      spaceDocuments.value = { ...spaceDocuments.value, understand: documentsOf(data) };
    } catch {
      // the tutor explains without references; it says so if it needs them
      spaceDocuments.value = { ...spaceDocuments.value, understand: [] };
    }
  };

  // INVESTIGATE: the search plan, the searches, the relevance checks, then what each document
  // really says about the question (quotes checked against its text)
  const investigate = async (question: string) => {
    if (!question.trim()) return;
    setTopic(thread.value.topic || question);
    evidence.value = null;
    setStatus('investigate', 'searching');
    const lang = languageOf(question);
    try {
      const plan = await askUsableAnswer(
        () => basePostAxios('/qna/chat/answer', buildPlanRequest(question, lang)),
        parseQueries
      );
      // the plan's descriptions, and the learner's own words
      const queries = [...(plan?.queries || []), question];
      const results: Document[][] = [];
      for (const query of queries) {
        const { data } = await getSearch(RESULTS_PER_QUERY, {
          query,
          relevance_factor: RELEVANCE_FACTOR
        });
        results.push(documentsOf(data));
      }
      const { accepted } = selectCandidates(results, plan?.concepts || [], {
        core: plan?.core,
        period: plan?.period
      });
      spaceDocuments.value = { ...spaceDocuments.value, investigate: accepted };
      if (!accepted.length) {
        evidence.value = { items: [], setAside: [] };
        return setStatus('investigate', 'ready');
      }
      setStatus('investigate', 'thinking');
      const found = await askUsableAnswer(
        () => basePostAxios('/qna/chat/answer', buildEvidenceRequest(question, accepted, lang)),
        (raw) => parseEvidence(raw, accepted)
      );
      if (!found) return setStatus('investigate', 'error');
      evidence.value = found;
      // the tutor then reasons on the documents that really bear on the question
      spaceDocuments.value = {
        ...spaceDocuments.value,
        investigate: found.items.map((item) => item.document)
      };
      setStatus('investigate', 'ready');
    } catch (error) {
      setStatus('investigate', failureStatus(error));
    }
  };

  // ENVISION: a few imagined scenarios, grounded in the sources the learner kept
  const envision = async (question: string) => {
    if (!question.trim()) return;
    setTopic(thread.value.topic || question);
    scenarios.value = [];
    setStatus('envision', 'thinking');
    const lang = languageOf(question);
    const documents = thread.value.resources.slice(0, MAX_SOURCES - 1);
    try {
      const found = await askUsableAnswer(
        () =>
          basePostAxios(
            '/qna/chat/answer',
            buildScenariosRequest(question, thread.value, documents, lang)
          ),
        (raw) => parseScenarios(raw, documents)
      );
      if (!found) return setStatus('envision', 'error');
      scenarios.value = found;
      setStatus('envision', 'ready');
    } catch (error) {
      setStatus('envision', failureStatus(error));
    }
  };

  const isKept = (doc: Document) =>
    thread.value.resources.some((kept) => kept.payload.document_id === doc.payload.document_id);
  const toggleResource = (doc: Document) => {
    const resources = isKept(doc)
      ? thread.value.resources.filter(
          (kept) => kept.payload.document_id !== doc.payload.document_id
        )
      : [...thread.value.resources, doc].slice(-MAX_KEPT);
    thread.value = { ...thread.value, resources };
  };

  const addNote = (space: LearnerSpace, text: string) => {
    if (!text.trim()) return;
    thread.value = {
      ...thread.value,
      notes: [...thread.value.notes, { space, text: text.trim() }]
    };
  };
  const removeNote = (index: number) => {
    thread.value = { ...thread.value, notes: thread.value.notes.filter((_, i) => i !== index) };
  };

  // "start over": nothing kept, here or in the tab
  const startOver = () => {
    thread.value = emptyThread();
    conversations.value = {};
    status.value = {};
    spaceDocuments.value = {};
    evidence.value = null;
    scenarios.value = [];
    clearFromSession(SESSION_KEY);
  };

  return {
    thread,
    conversations,
    status,
    spaceDocuments,
    evidence,
    scenarios,
    hasThread,
    turnsOf,
    greet,
    choose,
    discover,
    openSuggestedSpace,
    setTopic,
    ask,
    findReferences,
    investigate,
    envision,
    isKept,
    toggleResource,
    addNote,
    removeNote,
    startOver,
    $reset: startOver
  };
});
