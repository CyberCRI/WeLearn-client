import { defineStore } from 'pinia';
import axios from 'axios';
import { computed, ref, type Ref } from 'vue';
import { basePostAxios, getSearch } from '@/utils/fetch';
import { RELEVANCE_FACTOR } from '@/utils/constants';
import { askUsableAnswer, guessLanguage, type ReadingLanguage } from '@/utils/courseReading';
import {
  buildActivityRequest,
  buildIdeasRequest,
  buildQueriesRequest,
  parseActivity,
  conceptQueries,
  parseIdeas,
  parseQueries,
  parseRejected,
  selectCandidates,
  type RejectedCandidate,
  teacherIdea,
  type ActivityContext,
  type ActivityIdea,
  type ActivityResource,
  type ActivitySuggestion,
  type ApproachId,
  type Infeasibility,
  APPROACHES,
  approachFromText,
  contextInfeasibility
} from '@/utils/activityDesign';
import type { Document } from '@/types';
import i18n from '@/localisation/i18n';
import { useSourcesStore } from '@/stores/sources';
import { buildHandout, type StudentHandout } from '@/utils/studentHandout';

// "design a learning activity", resource-aware: a short context (or the course from Course
// Design), WeLearn resources searched and inventoried first, then 2-3 activities that what was
// found can really support, then the chosen one as a one-page activity the teacher edits as a
// whole and copies. everything stays in this tab

export type IdeasStep =
  | 'idle'
  | 'planning'
  | 'searching'
  | 'thinking'
  | 'ready'
  | 'unavailable'
  | 'error';
export type ActivityStep = 'idle' | 'writing' | 'ready' | 'unavailable' | 'error';

// documents asked of each search question, and the fewest relevant ones before searching again
const RESULTS_PER_QUERY = 10;
const MIN_RELEVANT = 2;

const emptyContext = (): ActivityContext => ({ subject: '', students: '', time: '', goal: '' });

const failureStatus = (error: any): 'unavailable' | 'error' => {
  const code = error?.response?.status;
  return !error?.response || [403, 404, 502, 503, 504].includes(code) ? 'unavailable' : 'error';
};

export const useActivityDesignStore = defineStore('activityDesign', () => {
  const context: Ref<ActivityContext> = ref(emptyContext());
  // the course the context was taken from (Course Design), if any
  const fromCourse: Ref<string | null> = ref(null);
  const ideasStatus: Ref<IdeasStep> = ref('idle');
  // the WeLearn documents found for the context, inventoried once and reused for other ideas
  const candidates: Ref<Document[]> = ref([]);
  const ideas: Ref<ActivityIdea[]> = ref([]);
  // how the documents were found and chosen: the search questions, the key concepts, what was
  // kept and what was set aside, by the concept check or by the ideas answer
  const retrieval: Ref<{
    queries: string[];
    concepts: string[][];
    rejected: RejectedCandidate[];
    offTopic: RejectedCandidate[];
  } | null> = ref(null);
  const preferredType = ref('');
  // ideas already shown, so "other ideas" really are other ones
  const shownTitles: Ref<string[]> = ref([]);
  // methods the teacher already tried and wants to move away from
  const triedApproaches: Ref<ApproachId[]> = ref([]);
  // the method the teacher asked for, when it cannot be offered, and why
  const methodNotice: Ref<{ approach: ApproachId; reason: Infeasibility | 'notSupported' } | null> =
    ref(null);

  const chosen: Ref<ActivityIdea | null> = ref(null);
  const activityStatus: Ref<ActivityStep> = ref('idle');
  const activity: Ref<ActivitySuggestion | null> = ref(null);
  // the teacher's own version of the whole activity; the suggestion is kept to restore it
  const editedText: Ref<string | null> = ref(null);
  const formatRequest = ref('');
  // the student handout made from the approved activity, as the teacher edits it
  const handout: Ref<StudentHandout | null> = ref(null);

  let lang: ReadingLanguage = 'fr';
  let controller: AbortController | undefined;

  const hasContext = computed(() => context.value.subject.trim().length > 0);
  // the resources the activity really uses: the ones it cites and its table's source; the
  // others found for the idea are not shown
  const resources = computed(() => {
    const all = chosen.value?.resources || [];
    const used = new Set(
      [...(activity.value?.documents || []), activity.value?.dataTable?.document]
        .filter(Boolean)
        .map((doc) => doc!.payload.document_id)
    );
    return used.size
      ? all.filter((resource) => used.has(resource.document.payload.document_id))
      : all;
  });
  // every verified resource of the ideas shown (for the teacher's own idea)
  const verifiedResources = computed(() => {
    const byId = new Map<string, ActivityResource>();
    ideas.value
      .flatMap((idea) => idea.resources)
      .forEach((resource) => byId.set(resource.document.payload.document_id, resource));
    return [...byId.values()];
  });

  // coming from Course Design: the course is the context, nothing to type again
  const useCourse = (course: {
    title: string | null;
    discipline: string | null;
    level: string | null;
  }) => {
    if (!course.title || context.value.subject.trim()) return;
    context.value.subject = course.title;
    context.value.students = [course.discipline, course.level].filter(Boolean).join(', ');
    fromCourse.value = course.title;
  };

  const resetActivity = () => {
    chosen.value = null;
    activityStatus.value = 'idle';
    activity.value = null;
    editedText.value = null;
    formatRequest.value = '';
    handout.value = null;
  };

  // the documents each search question finds (selected afterwards, see selectCandidates)
  const search = async (queries: string[], corpora?: string[]) => {
    const results: Document[][] = [];
    for (const query of queries) {
      const { data } = await getSearch(RESULTS_PER_QUERY, {
        query,
        relevance_factor: RELEVANCE_FACTOR,
        ...(corpora?.length ? { corpora } : {})
      });
      results.push((Array.isArray(data) ? data : data?.docs) || []);
    }
    return results;
  };

  const approachLabel = (approach: ApproachId, locale: ReadingLanguage = lang) =>
    i18n.global.t(`journey.teach.activity.approaches.${approach}`, {}, { locale });

  const askIdeas = (signal: AbortSignal, leftOut: Map<ApproachId, Infeasibility>, type: string) =>
    askUsableAnswer(
      () =>
        basePostAxios(
          '/qna/chat/answer',
          buildIdeasRequest(context.value, candidates.value, lang, {
            type,
            avoid: shownTitles.value,
            otherThan: triedApproaches.value.map((approach) => approachLabel(approach))
          }),
          { signal }
        ),
      (answer) => {
        const found = parseIdeas(answer, candidates.value, context.value, (approach, reason) =>
          leftOut.set(approach, reason)
        );
        if (found && retrieval.value) {
          retrieval.value.offTopic = parseRejected(answer, candidates.value);
        }
        return found;
      }
    );

  // resources first: search questions, the search, then the inventory and the ideas it allows.
  // "other ideas" reuse the same resources
  const suggestIdeas = async (isOther = false) => {
    if (!hasContext.value) return;
    controller?.abort();
    controller = new AbortController();
    const { signal } = controller;
    resetActivity();
    try {
      if (!isOther || !candidates.value.length) {
        lang = guessLanguage(
          Object.values(context.value).join(' '),
          i18n.global.locale.value === 'en' ? 'en' : 'fr'
        );
        shownTitles.value = [];
        triedApproaches.value = [];
        ideasStatus.value = 'planning';
        const plan = await askUsableAnswer(
          () =>
            basePostAxios('/qna/chat/answer', buildQueriesRequest(context.value, lang), { signal }),
          parseQueries
        );
        if (signal.aborted) return;
        ideasStatus.value = 'searching';
        // without usable questions, the teacher's own words are searched, unchecked
        const queries = plan?.queries || [
          context.value.subject,
          `${context.value.subject} ${context.value.goal}`.trim()
        ];
        const concepts = plan?.concepts || [];
        // the collections suited to the discipline, from the list loaded at start (if it was)
        const byCategory = useSourcesStore().sourcesList || {};
        const categories = new Map(
          Object.entries(byCategory).flatMap(([category, corpora]) =>
            corpora.map((corpus) => [corpus.name, category] as [string, string])
          )
        );
        const preferred = (plan?.sourceTypes || []).flatMap(
          (type) => byCategory[type]?.map((corpus) => corpus.name) || []
        );
        const options = {
          core: plan?.core,
          period: plan?.period,
          sourceTypes: plan?.sourceTypes,
          categoryOf: (corpus: string) => categories.get(corpus)
        };
        const results = await search(queries);
        // one search among the collections suited to the discipline (historians' work, public
        // reports, teaching material...), in the language of the course
        if (preferred.length) {
          results.push(...(await search(queries.slice(-1), preferred)));
        }
        let selection = selectCandidates(results, concepts, options);
        // too few documents on the subject: one more search with the key concepts themselves
        if (selection.accepted.length < MIN_RELEVANT && concepts.length) {
          const more = conceptQueries(concepts);
          queries.push(...more);
          selection = selectCandidates([...results, ...(await search(more))], concepts, options);
        }
        if (signal.aborted) return;
        candidates.value = selection.accepted;
        retrieval.value = { queries, concepts, rejected: selection.rejected, offTopic: [] };
      }
      ideasStatus.value = 'thinking';
      // the method the teacher names: one the context rules out is not asked for, and said so
      const labels = Object.fromEntries(
        APPROACHES.map((approach) => [
          approach,
          [approachLabel(approach, 'fr'), approachLabel(approach, 'en')]
        ])
      );
      const preferred = approachFromText(preferredType.value, labels);
      const ruledOut = preferred ? contextInfeasibility(preferred, context.value) : null;
      methodNotice.value = preferred && ruledOut ? { approach: preferred, reason: ruledOut } : null;
      const leftOut = new Map<ApproachId, Infeasibility>();
      const found = await askIdeas(signal, leftOut, ruledOut ? '' : preferredType.value);
      if (signal.aborted) return;
      if (!found) {
        ideasStatus.value = 'error';
        return;
      }
      // asked for but not among the ideas: why, when the resources ruled it out
      if (preferred && !ruledOut && !found.some((idea) => idea.approach === preferred)) {
        methodNotice.value = {
          approach: preferred,
          reason: leftOut.get(preferred) || 'notSupported'
        };
      }
      ideas.value = found;
      shownTitles.value = [...shownTitles.value, ...found.map((idea) => idea.title)];
      ideasStatus.value = 'ready';
    } catch (error: any) {
      if (axios.isCancel(error) || signal.aborted) return;
      ideasStatus.value = failureStatus(error);
    }
  };

  const writeActivity = async (signal: AbortSignal) => {
    const idea = chosen.value;
    if (!idea) return;
    activityStatus.value = 'writing';
    const documents = idea.resources.map((resource) => resource.document);
    const hasData = idea.resources.some((resource) => resource.isQuantitative);
    let attempt = 0;
    const suggestion = await askUsableAnswer(
      () =>
        basePostAxios(
          '/qna/chat/answer',
          buildActivityRequest(context.value, idea, lang, formatRequest.value),
          { signal }
        ),
      (answer) =>
        // the first answer must not ask the teacher for data the activity does not have; the
        // retry may, flagged
        parseActivity(answer, documents, context.value, {
          hasData,
          isStrict: attempt++ === 0,
          approach: idea.approach,
          resources: idea.resources
        })
    );
    if (signal.aborted) return;
    if (!suggestion) {
      activityStatus.value = 'error';
      return;
    }
    activity.value = suggestion;
    editedText.value = null;
    activityStatus.value = 'ready';
  };

  const run = async (task: (signal: AbortSignal) => Promise<void>) => {
    controller?.abort();
    controller = new AbortController();
    try {
      await task(controller.signal);
    } catch (error: any) {
      if (axios.isCancel(error)) return;
      activityStatus.value = failureStatus(error);
    }
  };

  // the chosen idea already has its verified resources: only the activity is written
  const choose = (idea: ActivityIdea) =>
    run(async (signal) => {
      resetActivity();
      chosen.value = idea;
      await writeActivity(signal);
    });

  const chooseOwnIdea = (text: string) =>
    text.trim() ? choose(teacherIdea(text, verifiedResources.value)) : Promise.resolve();

  // the handout in the activity's own language, from what the activity already contains
  const createHandout = () => {
    if (!activity.value) return;
    const { approach } = activity.value;
    handout.value = buildHandout(
      activity.value,
      resources.value,
      lang,
      approach
        ? i18n.global.t(`journey.teach.activity.approaches.${approach}`, {}, { locale: lang })
        : '',
      !!editedText.value
    );
  };
  const setHandoutText = (text: string) => {
    if (handout.value) handout.value = { ...handout.value, text };
  };

  // another approach: new ideas with other methods, feasible with the resources already found
  // (searched again if there are none); the chosen one is then written as a new activity
  const tryAnotherApproach = () => {
    const current = activity.value?.approach || chosen.value?.approach;
    if (current && !triedApproaches.value.includes(current)) {
      triedApproaches.value = [...triedApproaches.value, current];
    }
    backToIdeas();
    return suggestIdeas(true);
  };

  // another version of the same activity, in the format the teacher asks for
  const rewrite = (request: string) =>
    run(async (signal) => {
      formatRequest.value = request;
      await writeActivity(signal);
    });

  const backToIdeas = () => {
    controller?.abort();
    resetActivity();
  };

  const setEditedText = (text: string | null) => {
    editedText.value = text?.trim() || null;
  };

  const $reset = () => {
    controller?.abort();
    context.value = emptyContext();
    fromCourse.value = null;
    ideasStatus.value = 'idle';
    candidates.value = [];
    retrieval.value = null;
    ideas.value = [];
    preferredType.value = '';
    shownTitles.value = [];
    triedApproaches.value = [];
    methodNotice.value = null;
    resetActivity();
  };

  return {
    context,
    fromCourse,
    hasContext,
    ideasStatus,
    candidates,
    retrieval,
    ideas,
    preferredType,
    chosen,
    activityStatus,
    resources,
    activity,
    editedText,
    formatRequest,
    handout,
    createHandout,
    setHandoutText,
    useCourse,
    suggestIdeas,
    choose,
    chooseOwnIdea,
    tryAnotherApproach,
    methodNotice,
    rewrite,
    backToIdeas,
    setEditedText,
    $reset
  };
});
