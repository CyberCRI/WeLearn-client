import { defineStore } from 'pinia';
import axios from 'axios';
import { type Ref, computed, ref } from 'vue';
import { basePostAxios } from '@/utils/fetch';
import { apiErrorCode } from '@/utils/apiErrors';
import { evidenceState } from '@/utils/connections';
import type { CourseLanguage } from '@/stores/course';
import type { ConfirmedCourse, ConnectionEvidence, ConnectionIdea } from '@/types';
import type { ApiResponse } from '@/types/api';

// screen 3a "sustainability additions" (syllabus v2, flag syllabusV2): the API suggests a few
// sustainability connections for the confirmed course, then finds and judges the WeLearn
// resources of each, one call per idea. the store only orchestrates those calls and keeps the
// teacher's decisions; the course itself is never changed here. everything stays in memory

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

export type Connection = ConnectionIdea & {
  decision: ConnectionDecision;
  // null until its resources have been judged
  evidence: ConnectionEvidence | null;
  // its evidence call is running (a first check or a new one)
  isChecking: boolean;
  // the call itself failed: shown as unchecked, with a way to check again
  hasCheckFailed: boolean;
};

// statuses that mean the API was not reached or is busy, rather than an answer it could not use
// (UNUSABLE_LLM_OUTPUT is a 502 too, told apart by its code)
const UNREACHABLE_STATUSES = [404, 429, 502, 503, 504];
const failureStatus = (error: any): 'unavailable' | 'error' => {
  if (apiErrorCode(error) === 'UNUSABLE_LLM_OUTPUT') return 'error';
  const status = error?.response?.status;
  return !error?.response || UNREACHABLE_STATUSES.includes(status) ? 'unavailable' : 'error';
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
        hasCheckFailed: false
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

  // the teacher has worked on the connections
  const hasWork = computed(() =>
    connections.value.some((connection) => connection.decision !== 'open')
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
    findConnections,
    recheck,
    isFor,
    keepFor,
    select: (id: string) => decide(id, 'selected'),
    setAside: (id: string) => decide(id, 'setAside'),
    reopen: (id: string) => decide(id, 'open'),
    $reset
  };
});
