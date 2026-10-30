import { defineStore } from 'pinia';
import axios from 'axios';
import { ref, type Ref } from 'vue';
import { basePostAxios, getSearch } from '@/utils/fetch';
import { RELEVANCE_FACTOR } from '@/utils/constants';
import { askUsableAnswer, guessLanguage, type ReadingLanguage } from '@/utils/courseReading';
import {
  MAX_CANDIDATES,
  MAX_CONNECTIONS,
  buildAdaptationRequest,
  buildIdeasRequest,
  buildSelectionRequest,
  isPartOfCourse,
  parseAdaptation,
  parseIdeas,
  parseSelection,
  type AdaptationSuggestion,
  type ConfirmedCourse,
  type ConnectionIdea,
  type ConnectionSuggestion
} from '@/utils/connections';
import type { Document } from '@/types';

// after the teacher confirms their course: WeLearn suggests a few strong sustainability
// connections, each backed by WeLearn resources found and judged for it, and the teacher develops
// one into a short adaptation they can edit and copy, or sets it aside. the original teaching
// material is never changed; everything stays in memory, in this tab

export type ConnectionsStatus =
  | 'idle'
  | 'thinking'
  | 'searching'
  | 'selecting'
  | 'ready'
  | 'unavailable'
  | 'error';
export type ConnectionDecision = 'open' | 'chosen' | 'setAside';
export type AdaptationStatus = 'thinking' | 'ready' | 'unavailable' | 'error';

export interface Adaptation {
  status: AdaptationStatus;
  suggestion: AdaptationSuggestion | null;
  // the teacher's own version of the whole adaptation, once they edit it; the suggestion is
  // kept so it can be restored
  editedText: string | null;
}

export interface Connection extends ConnectionSuggestion {
  id: number;
  decision: ConnectionDecision;
  adaptation: Adaptation | null;
}

const failureStatus = (error: any): 'unavailable' | 'error' => {
  const code = error?.response?.status;
  return !error?.response || [403, 404, 502, 503, 504].includes(code) ? 'unavailable' : 'error';
};

export const useCourseConnectionsStore = defineStore('courseConnections', () => {
  const status: Ref<ConnectionsStatus> = ref('idle');
  const documents: Ref<Document[]> = ref([]);
  const connections: Ref<Connection[]> = ref([]);
  // the course the suggestions were made for, kept for the adaptations
  let course: ConfirmedCourse | null = null;
  // the suggestions belong to one confirmed course: coming back to it keeps them
  let courseKey = '';
  let lang: ReadingLanguage = 'fr';
  let controller: AbortController | undefined;

  const courseText = (confirmed: ConfirmedCourse) =>
    [
      confirmed.title,
      confirmed.description,
      ...confirmed.topics,
      ...confirmed.sessions,
      ...confirmed.objectives
    ]
      .filter(Boolean)
      .join(' ');

  // the parts a connection may point to: copied from the confirmed course
  const courseParts = (confirmed: ConfirmedCourse) =>
    [confirmed.title, ...confirmed.topics, ...confirmed.sessions, ...confirmed.objectives].filter(
      (part): part is string => !!part
    );

  // the WeLearn resources for one idea: each of its search questions, merged, best first
  const searchIdea = async (idea: ConnectionIdea) => {
    const found = new Map<string, Document>();
    for (const query of idea.queries) {
      const { data } = await getSearch(MAX_CANDIDATES, {
        query,
        relevance_factor: RELEVANCE_FACTOR
      });
      const docs: Document[] = (Array.isArray(data) ? data : data?.docs) || [];
      docs.forEach((doc) => {
        const known = found.get(doc.payload.document_id);
        if (!known || known.score < doc.score) found.set(doc.payload.document_id, doc);
      });
    }
    return [...found.values()].sort((a, b) => b.score - a.score).slice(0, MAX_CANDIDATES);
  };

  // ideas from the course first, then targeted searches for each, then a judged selection of
  // each idea's resources; an idea without suitable resources is dropped, never padded
  // ideas already proposed (a course created from scratch) skip the first step
  const findConnections = async (
    confirmed: ConfirmedCourse,
    fallback: ReadingLanguage,
    givenIdeas: ConnectionIdea[] = []
  ) => {
    controller?.abort();
    controller = new AbortController();
    const { signal } = controller;
    course = confirmed;
    courseKey = JSON.stringify({ confirmed, givenIdeas });
    lang = guessLanguage(courseText(confirmed), fallback);
    connections.value = [];
    documents.value = [];
    status.value = 'thinking';
    try {
      const ideas = givenIdeas.length
        ? givenIdeas.map((idea) => ({
            ...idea,
            // the teacher may have changed the course since: keep the place only if it still is one
            anchor: isPartOfCourse(idea.anchor, courseParts(confirmed)) ? idea.anchor : null
          }))
        : await askUsableAnswer(
            () => basePostAxios('/qna/chat/answer', buildIdeasRequest(confirmed, lang), { signal }),
            (answer) => parseIdeas(answer, courseParts(confirmed))
          );
      if (signal.aborted) return;
      if (!ideas) {
        status.value = 'error';
        return;
      }
      status.value = 'searching';
      const candidates = await Promise.all(ideas.map(searchIdea));
      if (signal.aborted) return;
      documents.value = [
        ...new Map(candidates.flat().map((doc) => [doc.payload.document_id, doc])).values()
      ];
      status.value = 'selecting';
      const selections = await Promise.all(
        ideas.map((idea, index) =>
          candidates[index].length
            ? askUsableAnswer(
                () =>
                  basePostAxios(
                    '/qna/chat/answer',
                    buildSelectionRequest(confirmed, idea, candidates[index], lang),
                    { signal }
                  ),
                (answer) => parseSelection(answer, idea, candidates[index])
              )
            : null
        )
      );
      if (signal.aborted) return;
      connections.value = selections
        .filter(
          (selection): selection is ConnectionSuggestion => !!selection && 'resources' in selection
        )
        .slice(0, MAX_CONNECTIONS)
        .map((item, id) => ({ ...item, id, decision: 'open', adaptation: null }));
      status.value = 'ready';
    } catch (error: any) {
      if (axios.isCancel(error) || signal.aborted) return;
      status.value = failureStatus(error);
    }
  };

  const isFor = (confirmed: ConfirmedCourse, givenIdeas: ConnectionIdea[] = []) =>
    status.value !== 'idle' && courseKey === JSON.stringify({ confirmed, givenIdeas });

  const find = (id: number) => connections.value.find((connection) => connection.id === id);

  const setAside = (id: number) => {
    const connection = find(id);
    if (connection) connection.decision = 'setAside';
  };

  const bringBack = (id: number) => {
    const connection = find(id);
    if (connection) connection.decision = connection.adaptation ? 'chosen' : 'open';
  };

  // choosing a connection develops it into a short adaptation, from its own resources
  const develop = async (id: number) => {
    const connection = find(id);
    if (!connection || !course) return;
    connection.decision = 'chosen';
    connection.adaptation = { status: 'thinking', suggestion: null, editedText: null };
    try {
      const documents = connection.resources.map((resource) => resource.document);
      const request = buildAdaptationRequest(course, connection, documents, lang);
      const suggestion = await askUsableAnswer(
        () => basePostAxios('/qna/chat/answer', request),
        (answer) => parseAdaptation(answer, documents)
      );
      connection.adaptation = suggestion
        ? { status: 'ready', suggestion, editedText: null }
        : { status: 'error', suggestion: null, editedText: null };
    } catch (error: any) {
      connection.adaptation = { status: failureStatus(error), suggestion: null, editedText: null };
    }
  };

  const editAdaptation = (id: number, text: string) => {
    const adaptation = find(id)?.adaptation;
    if (adaptation && text.trim()) adaptation.editedText = text.trim();
  };

  const restoreAdaptation = (id: number) => {
    const adaptation = find(id)?.adaptation;
    if (adaptation) adaptation.editedText = null;
  };

  const $reset = () => {
    controller?.abort();
    status.value = 'idle';
    documents.value = [];
    connections.value = [];
    course = null;
    courseKey = '';
  };

  return {
    status,
    documents,
    connections,
    findConnections,
    isFor,
    setAside,
    bringBack,
    develop,
    editAdaptation,
    restoreAdaptation,
    $reset
  };
});
