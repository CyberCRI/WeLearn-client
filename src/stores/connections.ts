import { defineStore } from 'pinia';
import axios from 'axios';
import { computed, ref, type Ref } from 'vue';
import { basePostAxios, getSearch } from '@/utils/fetch';
import { RELEVANCE_FACTOR } from '@/utils/constants';
import { askUsableAnswer, guessLanguage, type ReadingLanguage } from '@/utils/courseReading';
import {
  type CourseTopicParts,
  MAX_CANDIDATES,
  buildAdaptationRequest,
  buildIdeasRequest,
  buildSelectionRequest,
  buildVerificationRequest,
  noneReasonOf,
  parseAdaptation,
  parseIdeas,
  parseSelection,
  parseVerification,
  withChecks,
  type AdaptationProposal,
  type ConfirmedCourse,
  type ConnectionIdea,
  type ConnectionSuggestion
} from '@/utils/connections';
import type { ChatAnswerResponse, Document } from '@/types';
import { courseIdentity, type ConnectionsDraft } from '@/utils/draft';

// step 3 "sustainability additions", reused from the "design your course" prototype: after the
// teacher confirms their course, WeLearn suggests a few sustainability connections, each searched
// for and judged against WeLearn resources. the teacher develops the ones worth it (3b): WeLearn
// proposes one concrete change to the course, which the teacher accepts (as is or edited) or
// refuses, keeping the original; or sets a connection aside. the course itself is never changed
// here: accepted changes wait for "your updated syllabus". everything stays in memory, in this tab

export type ConnectionsStatus =
  | 'idle'
  | 'thinking'
  | 'searching'
  | 'selecting'
  | 'ready'
  | 'unavailable'
  | 'error';
export type ConnectionDecision = 'open' | 'selected' | 'setAside';

// the teacher's decision on a proposed change: none yet, accepted (as proposed or as edited), or
// the original kept
export type ChangeDecision = 'pending' | 'accepted' | 'kept';

export interface Development {
  status: 'thinking' | 'ready' | 'unavailable' | 'error';
  proposal: AdaptationProposal | null;
  decision: ChangeDecision;
  // the teacher's own wording of the suggestion, when edited before accepting
  edited: string | null;
  // where the teacher places a change WeLearn could not place in the course
  placement: string | null;
}

export interface Connection extends ConnectionSuggestion {
  id: number;
  decision: ConnectionDecision;
  development: Development | null;
  // its resources are being searched and judged again
  isRechecking?: boolean;
}

// a developed connection as a change to the syllabus: the teacher's wording and place first,
// then the proposal's. a revised objective always stays with the objective it revises
export const changeOf = ({ id, title, development }: Connection) =>
  development?.proposal
    ? {
        connectionId: id,
        connection: title,
        ...development.proposal,
        placement:
          (development.proposal.kind !== 'objective' && development.placement) ||
          development.proposal.original ||
          development.placement,
        text: development.edited || development.proposal.suggested
      }
    : null;

// an AI call lost on the way (no answer at all, seen now and then on the long selection
// requests) is sent once more before the step reports a failure
const askAgainIfLost = async <T>(send: () => Promise<T>): Promise<T> => {
  try {
    return await send();
  } catch (error: any) {
    if (error?.response || axios.isCancel(error)) throw error;
    return send();
  }
};

const failureStatus = (error: any): 'unavailable' | 'error' => {
  const code = error?.response?.status;
  return !error?.response || [403, 404, 502, 503, 504].includes(code) ? 'unavailable' : 'error';
};

export const useConnectionsStore = defineStore('connections', () => {
  const status: Ref<ConnectionsStatus> = ref('idle');
  // the distinct WeLearn resources found by the searches, before the selection
  const candidateCount = ref(0);
  // ideas the judgement found forced for this discipline (an analogy, a word with another
  // meaning): left out, only counted, so the teacher knows fewer were kept on purpose
  const leftOut = ref(0);
  // why the AI found no connection at all, in its words, when it found none
  const noneReason: Ref<string | null> = ref(null);
  const connections: Ref<Connection[]> = ref([]);
  // the suggestions belong to one confirmed course: coming back to it keeps them. the course is
  // kept as it was confirmed, for the changes the selected connections will propose
  let courseKey = '';
  const confirmedFor: Ref<ConfirmedCourse | null> = ref(null);
  // the course parts a change may touch, and the course's language, for the developments
  let parts: string[] = [];
  let topics: CourseTopicParts[] = [];
  let language: ReadingLanguage = 'fr';
  let controller: AbortController | undefined;

  // the WeLearn resources for one idea: each of its search questions, merged, best first
  const searchIdea = async (idea: ConnectionIdea, signal: AbortSignal) => {
    const found = new Map<string, Document>();
    for (const query of idea.queries) {
      const { data } = await getSearch(
        MAX_CANDIDATES,
        { query },
        { relevanceFactor: RELEVANCE_FACTOR }
      );
      if (signal.aborted) return [];
      const docs = ((Array.isArray(data) ? data : (data as any)?.docs) || []) as Document[];
      docs.forEach((doc) => {
        const known = found.get(doc.payload.document_id);
        if (!known || known.score < doc.score) found.set(doc.payload.document_id, doc);
      });
    }
    return [...found.values()].sort((a, b) => b.score - a.score).slice(0, MAX_CANDIDATES);
  };

  // the judged resources of one idea. an idea with no candidate is unsupported; one whose
  // judgement could not be made (an unusable or lost answer) is marked unchecked, not unsupported
  const judgeIdea = async (
    course: ConfirmedCourse,
    idea: ConnectionIdea,
    candidates: Document[],
    lang: ReadingLanguage,
    signal?: AbortSignal
  ): Promise<ConnectionSuggestion> => {
    const empty = {
      ...idea,
      use: idea.use ?? null,
      resources: [],
      background: []
    };
    if (!candidates.length) return empty;
    try {
      const selection = await askUsableAnswer(
        () =>
          askAgainIfLost(() =>
            basePostAxios<ChatAnswerResponse>(
              '/qna/chat/answer',
              buildSelectionRequest(course, idea, candidates, lang),
              { signal }
            )
          ),
        (answer) => parseSelection(answer, idea, candidates)
      );
      return selection || { ...empty, isUnchecked: true };
    } catch (error: any) {
      if (axios.isCancel(error) || signal?.aborted) throw error;
      return { ...empty, isUnchecked: true };
    }
  };

  // ideas from the course first, then targeted searches for each, then a judged selection of
  // each idea's resources. an idea without a resource that passes the checks is kept, unsupported
  const findConnections = async (
    course: ConfirmedCourse,
    courseParts: string[],
    fallback: ReadingLanguage,
    courseTopics: CourseTopicParts[] = []
  ) => {
    controller?.abort();
    controller = new AbortController();
    const { signal } = controller;
    courseKey = JSON.stringify(course);
    confirmedFor.value = course;
    parts = courseParts;
    topics = courseTopics;
    isCourseChanged.value = false;
    // the changes the teacher approved stay, whatever is found this time
    const kept = connections.value.filter(
      (connection) => connection.development?.decision === 'accepted'
    );
    const firstId = Math.max(-1, ...kept.map(({ id }) => id)) + 1;
    const lang = guessLanguage(
      [course.title, course.overview, ...course.topics, ...course.objectives].join(' '),
      fallback
    );
    language = lang;
    connections.value = kept;
    candidateCount.value = 0;
    leftOut.value = 0;
    noneReason.value = null;
    status.value = 'thinking';
    try {
      const ideas = await askUsableAnswer(
        () =>
          askAgainIfLost(() =>
            basePostAxios<ChatAnswerResponse>('/qna/chat/answer', buildIdeasRequest(course, lang), {
              signal
            })
          ),
        (answer) => {
          const found = parseIdeas(answer, courseParts);
          if (found && !found.length) noneReason.value = noneReasonOf(answer);
          return found;
        }
      );
      if (signal.aborted) return;
      if (!ideas) {
        status.value = 'error';
        return;
      }
      status.value = 'searching';
      const candidates = await Promise.all(ideas.map((idea) => searchIdea(idea, signal)));
      if (signal.aborted) return;
      candidateCount.value = new Set(candidates.flat().map((doc) => doc.payload.document_id)).size;
      status.value = 'selecting';
      // one idea at a time: the API answers a session's questions one after another, and calls
      // left waiting in its queue are sometimes dropped
      const selections: ConnectionSuggestion[] = [];
      for (const [index, idea] of ideas.entries()) {
        selections.push(await judgeIdea(course, idea, candidates[index], lang, signal));
        if (signal.aborted) return;
      }
      // a connection judged forced for this discipline is not suggested at all
      leftOut.value = selections.filter((selection) => selection.isForced).length;
      // the best supported first; an idea whose judgement failed is shown as unchecked
      connections.value = [
        ...kept,
        ...selections
          .filter((selection) => !selection.isForced)
          .map((selection) => ({ ...selection, background: selection.background || [] }))
          .sort((a, b) => b.resources.length - a.resources.length)
          .map((item, index) => ({
            ...item,
            id: firstId + index,
            decision: 'open' as const,
            development: null
          }))
      ];
      status.value = 'ready';
    } catch (error: any) {
      if (axios.isCancel(error) || signal.aborted) return;
      status.value = failureStatus(error);
    }
  };

  // the teacher has worked on the connections: a decision taken or a change developed
  const hasWork = computed(() =>
    connections.value.some((connection) => connection.decision !== 'open' || connection.development)
  );
  // the course was corrected in step 2 after work was done here: the connections and changes are
  // kept for the corrected course (nothing is looked for again unless the teacher asks), and a
  // change whose place is no longer in the course is shown as such
  const isCourseChanged = ref(false);
  const keepFor = (
    course: ConfirmedCourse,
    courseParts: string[],
    courseTopics: CourseTopicParts[]
  ) => {
    courseKey = JSON.stringify(course);
    confirmedFor.value = course;
    parts = courseParts;
    topics = courseTopics;
    isCourseChanged.value = true;
  };

  // the connections for a draft kept in the browser (utils/draft.ts). a search or a change still
  // being made is not saved half-done: it can be asked again after a restore
  const isWaiting = () => ['thinking', 'searching', 'selecting'].includes(status.value);
  const toDraft = (): ConnectionsDraft =>
    JSON.parse(
      JSON.stringify({
        status: isWaiting() ? 'error' : status.value,
        candidateCount: candidateCount.value,
        leftOut: leftOut.value,
        noneReason: noneReason.value,
        connections: isWaiting()
          ? connections.value.filter(({ development }) => development?.decision === 'accepted')
          : connections.value,
        confirmedFor: confirmedFor.value,
        parts,
        topics,
        language,
        isCourseChanged: isCourseChanged.value
      })
    );
  // restored for the course as it is now when it is the one they were made for (its level label
  // follows the interface's language); otherwise for the course they were made for, so step 3
  // shows the course as changed
  const fromDraft = (draft: ConnectionsDraft, current: ConfirmedCourse) => {
    controller?.abort();
    status.value = draft.status;
    candidateCount.value = draft.candidateCount || 0;
    leftOut.value = draft.leftOut || 0;
    noneReason.value = draft.noneReason || null;
    connections.value = draft.connections.map(({ isRechecking, ...connection }) => ({
      ...(connection.development?.status === 'thinking'
        ? { ...connection, development: { ...connection.development, status: 'error' as const } }
        : connection),
      // a check cut short by the reload can be asked again
      ...(isRechecking ? { isUnchecked: true } : {})
    }));
    const course =
      draft.confirmedFor && courseIdentity(draft.confirmedFor) === courseIdentity(current)
        ? current
        : draft.confirmedFor;
    confirmedFor.value = course;
    courseKey = course ? JSON.stringify(course) : '';
    parts = draft.parts;
    topics = draft.topics;
    language = draft.language === 'en' ? 'en' : 'fr';
    isCourseChanged.value = !!draft.isCourseChanged;
  };

  const isFor = (course: ConfirmedCourse) =>
    status.value !== 'idle' && courseKey === JSON.stringify(course);

  const find = (id: number) => connections.value.find((connection) => connection.id === id);
  const decide = (id: number, decision: ConnectionDecision) => {
    const connection = find(id);
    if (connection) connection.decision = decision;
  };

  // what the teacher selected to develop, each with its course part and its own resources
  const selectedConnections = computed(() =>
    connections.value.filter((connection) => connection.decision === 'selected')
  );

  // 3b: one concrete change for the connection, from its own resources. a failure is said on the
  // card and can be retried; the selection and every other decision stay as they are
  const develop = async (id: number) => {
    const connection = find(id);
    const course = confirmedFor.value;
    if (!connection || !course) return;
    connection.decision = 'selected';
    connection.development = {
      status: 'thinking',
      proposal: null,
      decision: 'pending',
      edited: null,
      placement: null
    };
    const development = connection.development;
    // its direct resources first, then those that only give context, each marked as such
    const documents = [...connection.resources, ...(connection.background || [])];
    const propose = (problems: string[] = []) =>
      askUsableAnswer(
        () =>
          askAgainIfLost(() =>
            basePostAxios<ChatAnswerResponse>(
              '/qna/chat/answer',
              buildAdaptationRequest(course, connection, documents, language, problems)
            )
          ),
        (answer) => parseAdaptation(answer, parts, documents, connection.anchor, topics)
      );
    // the claims of a proposal read again against its resources; null when the check could not
    // be made (the proposal is then never strongly supported)
    const check = async (proposal: AdaptationProposal) => {
      try {
        return await askUsableAnswer(
          () =>
            askAgainIfLost(() =>
              basePostAxios<ChatAnswerResponse>(
                '/qna/chat/answer',
                buildVerificationRequest(course, proposal, documents, language)
              )
            ),
          (answer) => parseVerification(answer, documents, `${proposal.suggested} ${proposal.why}`)
        );
      } catch {
        return null;
      }
    };
    try {
      let proposal = await propose();
      // a change without resources is already "not supported": nothing to check it against
      if (proposal && documents.length) {
        let verification = await check(proposal);
        // claims found wrong or not established: asked again once without them; the second
        // proposal replaces the first only once it has been checked too
        if (verification?.problems.length) {
          const second = await propose(verification.problems);
          const secondCheck = second && (await check(second));
          if (second && secondCheck) {
            proposal = second;
            verification = secondCheck;
          }
        }
        proposal = withChecks(proposal, verification, documents, course);
      }
      development.status = proposal ? 'ready' : 'error';
      development.proposal = proposal;
    } catch (error: any) {
      development.status = failureStatus(error);
    }
  };

  // an idea whose resources could not be judged: searched and judged again, alone. its place in
  // the list and the teacher's decision stay; judged forced this time, it is left out
  const recheck = async (id: number) => {
    const connection = find(id);
    const course = confirmedFor.value;
    if (!connection || !course || !connection.queries?.length) return;
    connection.isRechecking = true;
    const idea = {
      title: connection.title,
      anchor: connection.anchor,
      anchorLabel: connection.anchorLabel,
      why: connection.why,
      queries: connection.queries,
      use: connection.use ?? null
    };
    try {
      const candidates = await searchIdea(idea, new AbortController().signal);
      const judged = await judgeIdea(course, idea, candidates, language);
      if (judged.isForced) {
        connections.value = connections.value.filter((item) => item.id !== id);
        leftOut.value += 1;
        return;
      }
      Object.assign(connection, {
        why: judged.why,
        resources: judged.resources,
        background: judged.background || [],
        isUnchecked: !!judged.isUnchecked
      });
    } catch {
      connection.isUnchecked = true;
    } finally {
      connection.isRechecking = false;
    }
  };

  const developmentOf = (id: number) => find(id)?.development;

  // accepted as proposed, or with the teacher's own wording
  const acceptChange = (id: number, text?: string) => {
    const development = developmentOf(id);
    if (!development?.proposal) return;
    const wording = text?.trim();
    development.edited = wording && wording !== development.proposal.suggested ? wording : null;
    development.decision = 'accepted';
  };

  const placeChange = (id: number, part: string | null) => {
    const development = developmentOf(id);
    if (development) development.placement = part || null;
  };

  const keepOriginal = (id: number) => {
    const development = developmentOf(id);
    if (development?.proposal) development.decision = 'kept';
  };

  const reconsider = (id: number) => {
    const development = developmentOf(id);
    if (development) development.decision = 'pending';
  };

  // the changes the teacher approved, with what they change and the resources behind them, for
  // "your updated syllabus"
  const acceptedChanges = computed(() =>
    connections.value.flatMap((connection) => {
      const change = changeOf(connection);
      return change && connection.development?.decision === 'accepted' ? [change] : [];
    })
  );

  const $reset = () => {
    controller?.abort();
    status.value = 'idle';
    candidateCount.value = 0;
    leftOut.value = 0;
    noneReason.value = null;
    connections.value = [];
    courseKey = '';
    confirmedFor.value = null;
    isCourseChanged.value = false;
  };

  return {
    status,
    candidateCount,
    leftOut,
    noneReason,
    connections,
    selectedConnections,
    acceptedChanges,
    confirmedFor,
    findConnections,
    toDraft,
    fromDraft,
    hasWork,
    isCourseChanged,
    keepFor,
    isFor,
    select: (id: number) => decide(id, 'selected'),
    setAside: (id: number) => decide(id, 'setAside'),
    reopen: (id: number) => decide(id, 'open'),
    develop,
    recheck,
    acceptChange,
    keepOriginal,
    placeChange,
    reconsider,
    $reset
  };
});
