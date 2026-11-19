import { defineStore } from 'pinia';
import axios from 'axios';
import { type Ref, computed, ref } from 'vue';
import { basePostAxios } from '@/utils/fetch';
import { apiErrorCode } from '@/utils/apiErrors';
import { evidenceState } from '@/utils/connections';
import { useGuestQuotaStore } from '@/stores/guestQuota';
import type { CourseLanguage } from '@/stores/course';
import type {
  AdaptationProposal,
  ChosenConnection,
  ConfirmedCourse,
  ConnectionEvidence,
  ConnectionIdea
} from '@/types';
import type { ApiResponse } from '@/types/api';

// screen 3 "sustainability additions" (syllabus v2, flag syllabusV2): the API suggests a few
// sustainability connections for the confirmed course, then finds and judges the WeLearn
// resources of each, one call per idea. the teacher develops the ones they choose into one
// checked change to the course each, then accepts, edits or skips it. the store only
// orchestrates those calls and keeps the teacher's decisions; the course itself is never changed
// here. everything stays in memory

// each evidence call sends the course and judges up to 6 resources: at most 2 at a time for a
// session, as the API allows (Q8 of the syllabus v2 ADR)
export const MAX_PARALLEL_CHECKS = 2;

// thinking: the ideas are asked for; searching: the resources of each idea are found and judged,
// each idea shown as soon as its answer comes
export type ConnectionsStatus =
  | 'idle'
  | 'thinking'
  | 'searching'
  | 'ready'
  | 'unavailable'
  | 'error';
export type ConnectionDecision = 'open' | 'selected' | 'setAside';

// the teacher's decision on a proposed change: none yet, accepted (as proposed or as edited), or
// the original kept
export type ChangeDecision = 'pending' | 'accepted' | 'kept';

// busy: the session already has its LLM requests running, or sent too many; tooLarge: the course
// does not fit the model
export type DevelopmentStatus =
  | 'thinking'
  | 'ready'
  | 'unavailable'
  | 'busy'
  | 'tooLarge'
  | 'error';

export interface Development {
  status: DevelopmentStatus;
  proposal: AdaptationProposal | null;
  decision: ChangeDecision;
  // the teacher's own wording of the suggestion, when edited before accepting
  edited: string | null;
  // where the teacher places the change, when WeLearn could not or they chose another place
  placement: string | null;
}

export type Connection = ConnectionIdea & {
  decision: ConnectionDecision;
  // null until its resources have been judged
  evidence: ConnectionEvidence | null;
  // its evidence call is running (a first check or a new one)
  isChecking: boolean;
  // the call itself failed: shown as unchecked, with a way to check again
  hasCheckFailed: boolean;
  // null until the teacher develops it
  development: Development | null;
};

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
export type CourseChange = NonNullable<ReturnType<typeof changeOf>>;

// statuses that mean the API was not reached or is busy, rather than an answer it could not use
// (UNUSABLE_LLM_OUTPUT is a 502 too, told apart by its code)
const UNREACHABLE_STATUSES = [404, 429, 502, 503, 504];
const failureStatus = (error: any): 'unavailable' | 'error' => {
  if (apiErrorCode(error) === 'UNUSABLE_LLM_OUTPUT') return 'error';
  const status = error?.response?.status;
  return !error?.response || UNREACHABLE_STATUSES.includes(status) ? 'unavailable' : 'error';
};

const developmentFailure = (error: any): DevelopmentStatus => {
  const status = error?.response?.status;
  if (status === 429) return 'busy';
  if (status === 413) return 'tooLarge';
  return failureStatus(error);
};

// the idea as the API gave it, without what the client adds
const ideaOf = ({ id, title, anchor, anchor_label, why, use, queries }: Connection) => ({
  id,
  title,
  anchor,
  anchor_label,
  why,
  use,
  queries
});

// the connection as the teacher chose it, with the resources its evidence call kept, sent back
// as they came
const chosenOf = ({ title, anchor, why, evidence }: Connection): ChosenConnection => ({
  title,
  anchor,
  why: evidence?.why || why,
  resources: evidence?.resources ?? [],
  background: evidence?.background ?? []
});

export const useConnectionsStore = defineStore('connections', () => {
  const status: Ref<ConnectionsStatus> = ref('idle');
  // why the API found no connection at all, in its words
  const noneReason: Ref<string | null> = ref(null);
  const connections: Ref<Connection[]> = ref([]);
  // the course the connections were found for: coming back to it keeps them
  const confirmedFor: Ref<ConfirmedCourse | null> = ref(null);
  let courseKey = '';
  let language: CourseLanguage = 'fr';
  // the course was corrected on screen 2 after work was done here: the work is kept and the
  // teacher is told, nothing is looked for again unless they ask
  const isCourseChanged = ref(false);

  let controller: AbortController | undefined;

  // a slot among the MAX_PARALLEL_CHECKS evidence calls; a freed slot goes straight to the next
  // call waiting, so the limit holds
  let running = 0;
  const waiting: (() => void)[] = [];
  const takeSlot = async () => {
    if (running < MAX_PARALLEL_CHECKS) {
      running += 1;
      return;
    }
    await new Promise<void>((resolve) => waiting.push(resolve));
  };
  const releaseSlot = () => {
    const next = waiting.shift();
    if (next) next();
    else running -= 1;
  };

  // the resources of one idea, found and judged by the API
  const checkIdea = async (connection: Connection, signal: AbortSignal) => {
    await takeSlot();
    try {
      if (signal.aborted || !confirmedFor.value) return;
      connection.isChecking = true;
      connection.hasCheckFailed = false;
      const { data } = await basePostAxios<
        ApiResponse<'/tutor/course/connection_evidence', 'post'>
      >(
        '/tutor/course/connection_evidence',
        { course: confirmedFor.value, idea: ideaOf(connection), lang: language },
        { signal }
      );
      if (signal.aborted) return;
      connection.evidence = data as ConnectionEvidence;
    } catch (error) {
      if (axios.isCancel(error) || signal.aborted) return;
      console.error('Error while checking a connection:', error);
      connection.hasCheckFailed = true;
    } finally {
      connection.isChecking = false;
      releaseSlot();
    }
  };

  // the ideas first, then the resources of each, at most MAX_PARALLEL_CHECKS at a time
  const findConnections = async (course: ConfirmedCourse, lang: CourseLanguage) => {
    controller?.abort();
    controller = new AbortController();
    const { signal } = controller;
    confirmedFor.value = course;
    courseKey = JSON.stringify(course);
    language = lang;
    isCourseChanged.value = false;
    connections.value = [];
    noneReason.value = null;
    status.value = 'thinking';
    try {
      const { data } = await basePostAxios<ApiResponse<'/tutor/course/connection_ideas', 'post'>>(
        '/tutor/course/connection_ideas',
        { course, lang },
        { signal }
      );
      if (signal.aborted) return;
      noneReason.value = data.none_reason;
      connections.value = data.ideas.map((idea) => ({
        ...idea,
        decision: 'open',
        evidence: null,
        isChecking: false,
        hasCheckFailed: false,
        development: null
      }));
      status.value = 'searching';
      await Promise.all(connections.value.map((connection) => checkIdea(connection, signal)));
      if (!signal.aborted) status.value = 'ready';
    } catch (error) {
      if (axios.isCancel(error) || signal.aborted) return;
      console.error('Error while finding connections:', error);
      status.value = failureStatus(error);
    }
  };

  const find = (id: string) => connections.value.find((connection) => connection.id === id);

  // an idea whose resources could not be judged: asked again, alone. judged forced this time, it
  // is left out
  const recheck = async (id: string) => {
    const connection = find(id);
    if (!connection || connection.isChecking || !controller) return;
    await checkIdea(connection, controller.signal);
  };

  const decide = (id: string, decision: ConnectionDecision) => {
    const connection = find(id);
    if (connection) connection.decision = decision;
  };

  // one concrete change for the connection, from its own resources, checked by the API. it
  // shares the evidence calls' slots, so a session never has more LLM requests running than the
  // API allows. a failure is said on the card and can be retried; every decision stays as it is.
  // a guest past their daily changes gets the signup prompt and the card goes back to before
  const develop = async (id: string) => {
    const connection = find(id);
    const course = confirmedFor.value;
    if (!connection || !course || !controller) return;
    if (connection.development?.status === 'thinking') return;
    const { signal } = controller;
    connection.decision = 'selected';
    connection.development = {
      status: 'thinking',
      proposal: null,
      decision: 'pending',
      edited: null,
      placement: null
    };
    // the reactive copy, so the changes below show on the card
    const development = connection.development;
    await takeSlot();
    try {
      if (signal.aborted) return;
      const { data } = await basePostAxios<ApiResponse<'/tutor/course/adaptation', 'post'>>(
        '/tutor/course/adaptation',
        { course, connection: chosenOf(connection), lang: language },
        { signal }
      );
      if (signal.aborted) return;
      development.proposal = data as AdaptationProposal;
      development.status = 'ready';
    } catch (error) {
      if (axios.isCancel(error) || signal.aborted) return;
      if (useGuestQuotaStore().handleQuotaError(error)) {
        connection.development = null;
        return;
      }
      console.error('Error while developing a connection:', error);
      development.status = developmentFailure(error);
    } finally {
      releaseSlot();
    }
  };

  const developmentOf = (id: string) => find(id)?.development;

  // accepted as proposed, or with the teacher's own wording
  const acceptChange = (id: string, text?: string) => {
    const development = developmentOf(id);
    if (!development?.proposal) return;
    const wording = text?.trim();
    development.edited = wording && wording !== development.proposal.suggested ? wording : null;
    development.decision = 'accepted';
  };

  const placeChange = (id: string, part: string | null) => {
    const development = developmentOf(id);
    if (development) development.placement = part || null;
  };

  const keepOriginal = (id: string) => {
    const development = developmentOf(id);
    if (development?.proposal) development.decision = 'kept';
  };

  const reconsider = (id: string) => {
    const development = developmentOf(id);
    if (development) development.decision = 'pending';
  };

  // the changes the teacher accepted, for the updated syllabus. a connection no longer chosen
  // keeps its change, left out until it is chosen again
  const acceptedChanges = computed(() =>
    connections.value
      .filter(
        ({ decision, development }) =>
          decision === 'selected' && development?.decision === 'accepted'
      )
      .map(changeOf)
      .filter((change): change is CourseChange => !!change)
  );

  // the teacher has worked on the connections: a decision taken or a change developed
  const hasWork = computed(() =>
    connections.value.some(
      (connection) => connection.decision !== 'open' || !!connection.development
    )
  );
  const isFor = (course: ConfirmedCourse) =>
    status.value !== 'idle' && courseKey === JSON.stringify(course);

  // the corrected course is the one later screens build on; the connections stay
  const keepFor = (course: ConfirmedCourse) => {
    confirmedFor.value = course;
    courseKey = JSON.stringify(course);
    isCourseChanged.value = true;
  };

  // ideas the judgement found forced for this discipline (an analogy, a word with another
  // meaning): only counted, so the teacher knows fewer were kept on purpose
  const leftOut = computed(
    () => connections.value.filter((connection) => evidenceState(connection) === 'forced').length
  );
  const checkedCount = computed(
    () => connections.value.filter((connection) => evidenceState(connection) !== 'pending').length
  );
  const selectedConnections = computed(() =>
    connections.value.filter((connection) => connection.decision === 'selected')
  );

  const $reset = () => {
    controller?.abort();
    controller = undefined;
    status.value = 'idle';
    noneReason.value = null;
    connections.value = [];
    confirmedFor.value = null;
    courseKey = '';
    isCourseChanged.value = false;
  };

  return {
    status,
    noneReason,
    connections,
    confirmedFor,
    isCourseChanged,
    hasWork,
    leftOut,
    checkedCount,
    selectedConnections,
    acceptedChanges,
    findConnections,
    recheck,
    develop,
    acceptChange,
    placeChange,
    keepOriginal,
    reconsider,
    isFor,
    keepFor,
    select: (id: string) => decide(id, 'selected'),
    setAside: (id: string) => decide(id, 'setAside'),
    reopen: (id: string) => decide(id, 'open'),
    $reset
  };
});
