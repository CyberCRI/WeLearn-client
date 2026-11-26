import { defineStore } from 'pinia';
import { type Ref, computed, ref } from 'vue';
import i18n from '@/localisation/i18n';
import { basePostAxios } from '@/utils/fetch';
import { track } from '@/utils/analytics';
import { apiErrorCode, isAborted, isUnreachable } from '@/utils/apiErrors';
import { editField, restoreField } from '@/utils/courseCheck';
import { isLongEnough } from '@/utils/completeSyllabus';
import { courseFileError } from '@/utils/courseFiles';
import {
  type TopicDraft,
  applyTopicDrafts,
  confirmCourse,
  contextFromReading,
  coursePartsOf,
  overviewOf,
  reviewFromReading,
  toConfirmedCourse,
  topicNames
} from '@/utils/courseReview';
import { emptyTeachingContext, readTeachingContext } from '@/utils/teachingContext';
import { useGuestQuotaStore } from '@/stores/guestQuota';
import { useConnectionsStore } from '@/stores/connections';
import type {
  CourseField,
  CourseReadResponse,
  CourseToUpdate,
  FileErrorReason,
  ObjectiveGroup,
  TeachingContext
} from '@/types';
import type { ApiResponse } from '@/types/api';

export type CourseLanguage = 'fr' | 'en';
export type ReadingPhase = 'idle' | 'sending' | 'reading';
// unavailable: WeLearn could not be reached; emptyText: no text in the file (a scanned pdf)
export type ReadError = 'unavailable' | 'error' | 'emptyText';
type ContextKey = keyof TeachingContext;

// the course as a draft keeps it (see toDraft)
export interface CourseDraft {
  step: number;
  language: CourseLanguage;
  fileName: string | null;
  reading: CourseReadResponse | null;
  focus: string | null;
  detectedType: string | null;
  courseDescription: CourseField | null;
  courseSummary: CourseField | null;
  courseObjectives: CourseField[];
  courseTopics: CourseField[];
  coursePlan: string[];
  isReadingPartial: boolean;
  teachingContext: TeachingContext;
  prefilled: ContextKey[];
  aiFilled: ContextKey[];
  aiSuggested: ContextKey[];
  contextEvidence: Partial<Record<ContextKey, string>>;
}

const fileKey = (file: File, lang: CourseLanguage, focus: string | null) =>
  `${file.name}|${file.size}|${file.lastModified}|${lang}|${focus ?? ''}`;

// syllabus v2, "I have a course" (flag syllabusV2). kept apart from the `tutor` store, whose
// files belong to the "from scratch" path and keep working as they did
export const useCourseStore = defineStore('course', () => {
  // 1: your course, 2: review the course, 3: sustainability additions, 4: updated syllabus
  const step = ref(1);

  const file: Ref<File | null> = ref(null);
  const fileError: Ref<FileErrorReason | null> = ref(null);
  // the language WeLearn answers in: the teacher's, not the document's
  const language: Ref<CourseLanguage> = ref(i18n.global.locale.value === 'en' ? 'en' : 'fr');

  const phase: Ref<ReadingPhase> = ref('idle');
  // the upload's real progress, then the seconds WeLearn has been reading: never a made-up %
  const uploadProgress = ref(0);
  const readingStartedAt: Ref<number | null> = ref(null);
  const readError: Ref<ReadError | null> = ref(null);
  const reading: Ref<CourseReadResponse | null> = ref(null);
  // the file, language and course `reading` comes from: the same ones are not read again
  const readKey: Ref<string | null> = ref(null);
  // the one course read when the document holds several
  const focus: Ref<string | null> = ref(null);
  // the name of the file `reading` comes from, still known when a draft is resumed without it
  const fileName: Ref<string | null> = ref(null);

  // the review: what WeLearn read, then corrected by the teacher
  const detectedType: Ref<string | null> = ref(null);
  const courseDescription: Ref<CourseField | null> = ref(null);
  const courseSummary: Ref<CourseField | null> = ref(null);
  const courseObjectives: Ref<CourseField[]> = ref([]);
  const courseTopics: Ref<CourseField[]> = ref([]);
  const coursePlan: Ref<string[]> = ref([]);
  const isReadingPartial = ref(false);
  const teachingContext: Ref<TeachingContext> = ref(emptyTeachingContext());
  // context values read from the syllabus word for word; a teacher's change makes them theirs
  const prefilled: Ref<ContextKey[]> = ref([]);
  // read by the AI but not found word for word: shown for checking
  const aiFilled: Ref<ContextKey[]> = ref([]);
  // not stated in the syllabus: the AI's suggestion
  const aiSuggested: Ref<ContextKey[]> = ref([]);
  // the line of the syllabus each pre-filled value was read from
  const contextEvidence: Ref<Partial<Record<ContextKey, string>>> = ref({});

  const isReading = computed(() => phase.value !== 'idle');
  const hasStarted = computed(() => !!file.value || !!reading.value);
  // several courses in the document, none chosen yet
  const coursesFound = computed(() =>
    focus.value ? [] : (reading.value?.reading.courses_found ?? [])
  );

  const setFile = (picked: File) => {
    readError.value = null;
    const refused = courseFileError(picked);
    if (refused) fileError.value = refused;
    else {
      fileError.value = null;
      file.value = picked;
      // another file: no course chosen in it yet
      focus.value = null;
    }
  };

  const removeFile = () => {
    file.value = null;
    fileError.value = null;
    readError.value = null;
  };

  const selectLanguage = (lang: CourseLanguage) => {
    language.value = lang;
  };

  // the values a previous reading filled in are dropped; the teacher's own are kept
  const clearReadContext = () => {
    const context = { ...teachingContext.value };
    const empty = emptyTeachingContext();
    [...prefilled.value, ...aiFilled.value, ...aiSuggested.value].forEach((key) => {
      (context as Record<string, unknown>)[key] = empty[key];
    });
    teachingContext.value = context;
    prefilled.value = [];
    aiFilled.value = [];
    aiSuggested.value = [];
    contextEvidence.value = {};
  };

  const applyReading = (read: CourseReadResponse) => {
    const review = reviewFromReading(read);
    detectedType.value = review.detectedType;
    courseDescription.value = review.description;
    courseSummary.value = review.summary;
    courseObjectives.value = review.objectives;
    courseTopics.value = review.topics;
    coursePlan.value = review.plan;
    isReadingPartial.value = review.isPartial;

    clearReadContext();
    const fill = contextFromReading(read);
    const context = { ...teachingContext.value };
    const isEmpty = (key: ContextKey) => context[key] === '' || context[key] === null;
    const kept = (keys: ContextKey[]) => keys.filter(isEmpty);
    prefilled.value = kept(fill.prefilled);
    aiFilled.value = kept(fill.aiFilled);
    aiSuggested.value = kept(fill.aiSuggested);
    [...prefilled.value, ...aiFilled.value, ...aiSuggested.value].forEach((key) => {
      (context as Record<string, unknown>)[key] = fill.values[key];
    });
    const evidence: Partial<Record<ContextKey, string>> = Object.fromEntries(
      prefilled.value.map((key) => [key, fill.evidence[key]])
    );

    // what the syllabus states plainly (sessions, their length and type, format, class size),
    // read from its text where the reading left the field empty: nothing is guessed
    const fromText = readTeachingContext(read.text);
    (Object.keys(fromText.values) as ContextKey[]).filter(isEmpty).forEach((key) => {
      (context as Record<string, unknown>)[key] = fromText.values[key];
      prefilled.value = [...prefilled.value, key];
      if (fromText.evidence[key]) evidence[key] = fromText.evidence[key];
    });
    teachingContext.value = context;
    contextEvidence.value = evidence;
  };

  let controller: AbortController | undefined;

  const trackUpload = (event: { loaded: number; total?: number }) => {
    uploadProgress.value = event.total ? Math.round((event.loaded / event.total) * 100) : 0;
    // sent: from now on WeLearn is reading
    if (event.total && event.loaded >= event.total && phase.value === 'sending') {
      phase.value = 'reading';
      readingStartedAt.value = Date.now();
    }
  };

  const classifyError = (error: any): ReadError => {
    const code = apiErrorCode(error);
    if (code === 'EMPTY_DOCUMENT_TEXT') return 'emptyText';
    if (code === 'UNUSABLE_READING') return 'error';
    return isUnreachable(error) ? 'unavailable' : 'error';
  };

  // screen 1 → 2: WeLearn reads the course (only `courseTitle` of it, when the document holds
  // several and the teacher chose one)
  const readCourse = async (courseTitle: string | null = focus.value) => {
    const picked = file.value;
    if (!picked || isReading.value) return;
    const key = fileKey(picked, language.value, courseTitle);
    if (reading.value && readKey.value === key) {
      step.value = 2;
      return;
    }
    // a guest's reading counts as one of their daily syllabi
    const guestQuota = useGuestQuotaStore();
    if (!guestQuota.checkQuota('syllabus')) return;

    controller?.abort();
    controller = new AbortController();
    const { signal } = controller;
    readError.value = null;
    uploadProgress.value = 0;
    readingStartedAt.value = null;
    phase.value = 'sending';

    const formData = new FormData();
    formData.append('file', picked);
    formData.append('lang', language.value);
    if (courseTitle) formData.append('focus', courseTitle);
    try {
      const resp = await basePostAxios<ApiResponse<'/tutor/course/read', 'post'>>(
        '/tutor/course/read',
        formData,
        {
          headers: { 'content-type': 'multipart/form-data' },
          signal,
          onUploadProgress: trackUpload
        }
      );
      if (signal.aborted) return;
      // another course (a new file, or another one of the document): the connections and changes
      // found for the former one don't apply to it
      useConnectionsStore().$reset();
      reading.value = resp.data;
      readKey.value = key;
      focus.value = courseTitle;
      fileName.value = picked.name;
      applyReading(resp.data);
      const { material_type, topics, objectives } = resp.data.reading;
      track('Course Read', {
        materialType: material_type,
        topicsCount: topics.length,
        objectivesCount: objectives.length
      });
      step.value = 2;
      void guestQuota.refresh();
    } catch (error) {
      if (isAborted(error, signal)) return;
      if (!guestQuota.handleQuotaError(error)) {
        console.error('Error while reading the course:', error);
        readError.value = classifyError(error);
      }
    } finally {
      if (!signal.aborted) phase.value = 'idle';
    }
  };

  // the document holds several courses: the teacher's is read again, alone
  const chooseCourse = (courseTitle: string) => readCourse(courseTitle);

  // "Cancel" while WeLearn reads: back to where the teacher was, the file kept
  const cancelReading = () => {
    controller?.abort();
    phase.value = 'idle';
    uploadProgress.value = 0;
    readingStartedAt.value = null;
  };

  const setStep = (next: number) => {
    // the review and what follows need a reading
    if (next === 1 || reading.value) step.value = next;
  };

  // ---- the teacher's corrections on the review screen ----

  const setDescription = (value: string) => {
    const text = value.trim();
    if (!courseDescription.value) {
      courseDescription.value = text ? { value: text, origin: 'added' } : null;
      return;
    }
    courseDescription.value = text ? editField(courseDescription.value, text) : null;
  };
  const restoreDescription = () => {
    if (courseDescription.value) courseDescription.value = restoreField(courseDescription.value);
  };
  const setSummary = (value: string) => {
    const text = value.trim();
    if (courseSummary.value && text) courseSummary.value = editField(courseSummary.value, text);
  };
  const restoreSummary = () => {
    if (courseSummary.value) courseSummary.value = restoreField(courseSummary.value);
  };

  const setObjective = (index: number, value: string) => {
    const text = value.trim();
    const objective = courseObjectives.value[index];
    if (objective && text) courseObjectives.value[index] = editField(objective, text);
  };
  const restoreObjective = (index: number) => {
    const objective = courseObjectives.value[index];
    if (objective) courseObjectives.value[index] = restoreField(objective);
  };
  const addObjective = (value: string, group: ObjectiveGroup = 'objective') => {
    const text = value.trim();
    if (text) courseObjectives.value.push({ value: text, origin: 'added', group });
  };
  const removeObjective = (index: number) => {
    courseObjectives.value.splice(index, 1);
  };
  const setGroup = (index: number, group: ObjectiveGroup) => {
    const objective = courseObjectives.value[index];
    if (objective) courseObjectives.value[index] = { ...objective, group };
  };

  const saveTopics = (drafts: TopicDraft[]) => {
    courseTopics.value = applyTopicDrafts(courseTopics.value, drafts);
  };

  // one session, week or chapter per line; empty lines dropped
  const setCoursePlan = (lines: string[]) => {
    coursePlan.value = lines.map((line) => line.trim()).filter(Boolean);
  };

  // a value the teacher sets is theirs: no longer marked as read from the syllabus or by the AI
  const updateContext = <K extends ContextKey>(key: K, value: TeachingContext[K]) => {
    teachingContext.value = { ...teachingContext.value, [key]: value };
    prefilled.value = prefilled.value.filter((k) => k !== key);
    aiFilled.value = aiFilled.value.filter((k) => k !== key);
    aiSuggested.value = aiSuggested.value.filter((k) => k !== key);
    const evidence = { ...contextEvidence.value };
    delete evidence[key];
    contextEvidence.value = evidence;
  };

  // ---- the confirmed course ----

  const courseToUpdate = computed<CourseToUpdate>(() =>
    confirmCourse(teachingContext.value, {
      summary: courseSummary.value,
      description: courseDescription.value,
      objectives: courseObjectives.value,
      topics: courseTopics.value,
      plan: coursePlan.value
    })
  );
  const confirmedCourse = computed(() => toConfirmedCourse(courseToUpdate.value));
  const courseParts = computed(() => coursePartsOf(courseToUpdate.value));
  // where the teacher can place a change: the topics, their subtopics and the outline's sessions
  const coursePlaces = computed(() => [
    ...topicNames(courseToUpdate.value.topics),
    ...courseToUpdate.value.sessions
  ]);

  // the syllabus's whole text as the API read it, for the complete updated syllabus: none when
  // it was cut, or too short to stand for the syllabus (a scan)
  const wholeText = computed(() => {
    const text = reading.value?.is_text_truncated ? null : reading.value?.text;
    return text && isLongEnough(text) ? text : null;
  });

  // enough to work on: the course's objectives or competencies, its topics, or its overview. a
  // syllabus without explicit objectives is still a course
  const canConfirm = computed(
    () =>
      courseToUpdate.value.objectives.length + courseToUpdate.value.competencies.length > 0 ||
      courseTopics.value.length > 0 ||
      !!overviewOf(courseSummary.value, courseDescription.value)
  );

  // screen 2 → 3
  const confirmReview = () => {
    if (canConfirm.value) step.value = 3;
  };

  // what a draft keeps: the reading, its whole text included, and the teacher's corrections. not
  // the file itself, so the course is not read again unless the teacher uploads it
  const toDraft = (): CourseDraft => ({
    step: step.value,
    language: language.value,
    fileName: fileName.value,
    reading: reading.value,
    focus: focus.value,
    detectedType: detectedType.value,
    courseDescription: courseDescription.value,
    courseSummary: courseSummary.value,
    courseObjectives: courseObjectives.value,
    courseTopics: courseTopics.value,
    coursePlan: coursePlan.value,
    isReadingPartial: isReadingPartial.value,
    teachingContext: teachingContext.value,
    prefilled: prefilled.value,
    aiFilled: aiFilled.value,
    aiSuggested: aiSuggested.value,
    contextEvidence: contextEvidence.value
  });

  const fromDraft = (draft: CourseDraft) => {
    $reset();
    step.value = draft.step;
    language.value = draft.language;
    fileName.value = draft.fileName;
    reading.value = draft.reading;
    focus.value = draft.focus;
    detectedType.value = draft.detectedType;
    courseDescription.value = draft.courseDescription;
    courseSummary.value = draft.courseSummary;
    courseObjectives.value = draft.courseObjectives;
    courseTopics.value = draft.courseTopics;
    coursePlan.value = draft.coursePlan;
    isReadingPartial.value = draft.isReadingPartial;
    teachingContext.value = draft.teachingContext;
    prefilled.value = draft.prefilled;
    aiFilled.value = draft.aiFilled;
    aiSuggested.value = draft.aiSuggested;
    contextEvidence.value = draft.contextEvidence;
  };

  const $reset = () => {
    controller?.abort();
    step.value = 1;
    file.value = null;
    fileError.value = null;
    language.value = i18n.global.locale.value === 'en' ? 'en' : 'fr';
    phase.value = 'idle';
    uploadProgress.value = 0;
    readingStartedAt.value = null;
    readError.value = null;
    reading.value = null;
    readKey.value = null;
    focus.value = null;
    fileName.value = null;
    detectedType.value = null;
    courseDescription.value = null;
    courseSummary.value = null;
    courseObjectives.value = [];
    courseTopics.value = [];
    coursePlan.value = [];
    isReadingPartial.value = false;
    teachingContext.value = emptyTeachingContext();
    prefilled.value = [];
    aiFilled.value = [];
    aiSuggested.value = [];
    contextEvidence.value = {};
  };

  return {
    step,
    file,
    fileError,
    language,
    phase,
    uploadProgress,
    readingStartedAt,
    readError,
    reading,
    focus,
    fileName,
    isReading,
    hasStarted,
    coursesFound,
    detectedType,
    courseDescription,
    courseSummary,
    courseObjectives,
    courseTopics,
    coursePlan,
    isReadingPartial,
    teachingContext,
    prefilled,
    aiFilled,
    aiSuggested,
    contextEvidence,
    courseToUpdate,
    confirmedCourse,
    courseParts,
    coursePlaces,
    wholeText,
    canConfirm,
    setFile,
    removeFile,
    selectLanguage,
    readCourse,
    chooseCourse,
    cancelReading,
    setStep,
    setDescription,
    restoreDescription,
    setSummary,
    restoreSummary,
    setObjective,
    restoreObjective,
    addObjective,
    removeObjective,
    setGroup,
    saveTopics,
    setCoursePlan,
    updateContext,
    confirmReview,
    toDraft,
    fromDraft,
    $reset
  };
});
