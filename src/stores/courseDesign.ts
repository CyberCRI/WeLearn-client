import { defineStore } from 'pinia';
import axios from 'axios';
import { computed, ref, type Ref } from 'vue';
import { basePostAxios } from '@/utils/fetch';
import i18n from '@/localisation/i18n';
import {
  COURSE_EXTRA_KEYS,
  COURSE_OVERVIEW_KEYS,
  type CourseExtraKey,
  type CourseField,
  type CourseOverviewKey,
  type CourseReading,
  type MaterialType,
  type SyllabusExtraction
} from '@/types';
import {
  MAX_TEXT_LENGTH,
  askUsableAnswer,
  buildReadingRequest,
  guessLanguage,
  parseReadingAnswer,
  verifyReading
} from '@/utils/courseReading';
import { fileKind, readSyllabusText } from '@/utils/syllabusText';
import {
  buildProposalRequest,
  parseProposal,
  type CourseBrief,
  type CourseProposal
} from '@/utils/courseProposal';
import type { ConnectionIdea } from '@/utils/connections';

const emptyBrief = (): CourseBrief => ({ idea: '', disciplineLevel: '', format: '', goals: '' });

// course design, "adapt my existing course": upload one syllabus, let WeLearn's AI read it, then
// let the teacher review and correct the result. everything lives in memory: nothing is saved,
// and nothing is sent after the single reading request

// ponytail: same file rules as /tutor (stores/tutor.ts), kept separate so /tutor stays untouched
const MAX_FILE_SIZE = 5 * 1024 * 1024;
// pdf, docx, txt as in /tutor, plus excel (xlsx) for plans and timetables
const isAllowedType = (file: File) => fileKind(file) !== null;

export const EXAMPLE_OBJECTIVE_KEYS = ['o1', 'o2', 'o3'] as const;

// 'choosing' = the document holds several courses: the teacher picks one before the review
export type ReadingStatus =
  | 'idle'
  | 'uploading'
  | 'reading'
  | 'choosing'
  | 'ready'
  | 'unavailable'
  | 'error';

// material that is a whole course (several sessions) rather than one lesson or a fragment: what
// the review asks for and the scale of the sustainability connections depend on it
export const COURSE_SCALE_TYPES: MaterialType[] = ['syllabus', 'course_plan'];
export type UploadErrorReason = 'BIG_FILE' | 'BAD_EXTENSION';

const emptyExtras = () =>
  Object.fromEntries(COURSE_EXTRA_KEYS.map((key) => [key, ''])) as Record<CourseExtraKey, string>;

const emptyOverview = () =>
  Object.fromEntries(COURSE_OVERVIEW_KEYS.map((key) => [key, null])) as Record<
    CourseOverviewKey,
    CourseField | null
  >;

const fromExtraction = (text: string | null): CourseField | null =>
  text ? { value: text, origin: 'extracted', original: text } : null;

// lists (topics, sessions) are reviewed as one field, one item per line
const fromList = (items: string[]) => fromExtraction(items.length ? items.join('\n') : null);

// WeLearn's proposal (a course created from scratch): kept, edited or rejected by the teacher
const fromSuggestion = (text: string | null): CourseField | null =>
  text ? { value: text, origin: 'suggested', original: text, isSuggestion: true } : null;
const fromSuggestedList = (items: string[]) =>
  fromSuggestion(items.length ? items.join('\n') : null);

// below this, the file gave no usable text (a scanned pdf, for example)
const MIN_TEXT_LENGTH = 100;

export const useCourseDesignStore = defineStore('courseDesign', () => {
  const file: Ref<File | null> = ref(null);
  const uploadError: Ref<UploadErrorReason | null> = ref(null);
  const language: Ref<string> = ref(i18n.global.locale.value);
  const status: Ref<ReadingStatus> = ref('idle');
  const uploadProgress = ref(0);
  const readingStartedAt: Ref<number | null> = ref(null);
  // 'upload' = read by the API from the teacher's file, 'example' = fictional demonstration,
  // 'pasted' = the teacher's own text, kept in this tab; the last two are never sent or analysed
  // 'scratch' = a new course proposed by WeLearn from the teacher's brief
  const source: Ref<'upload' | 'example' | 'pasted' | 'scratch' | null> = ref(null);
  const pastedText = ref('');
  // creating from scratch: the teacher's brief, the proposal's extra parts, its sustainability
  // opportunities (each kept or not by the teacher) and the teacher's final text, if edited
  const brief: Ref<CourseBrief> = ref(emptyBrief());
  const activities: Ref<CourseField | null> = ref(null);
  const assessment: Ref<CourseField | null> = ref(null);
  const opportunities: Ref<{ idea: ConnectionIdea; isKept: boolean }[]> = ref([]);
  const proposalText: Ref<string | null> = ref(null);
  // the basic reading (/tutor/mas_files/content) only; the full reading leaves it null
  const extraction: Ref<SyllabusExtraction | null> = ref(null);
  // 'full' = title, level, topics, sessions... read by WeLearn's AI from the file's text;
  // 'basic' = description and objectives only (a docx, or a file without readable text)
  const readingMode: Ref<'full' | 'basic' | null> = ref(null);
  // values the AI returned that are not written in the syllabus: never shown, only counted
  const droppedCount = ref(0);
  const isTextCut = ref(false);
  // what the material is, as the AI interpreted it; the teacher can change it
  const materialType: Ref<MaterialType | null> = ref(null);
  const isMaterialTypeChanged = ref(false);
  // several courses in one document: their titles, and the reading kept in case the teacher
  // says it is one course after all
  const coursesFound: Ref<string[]> = ref([]);
  const focusCourse: Ref<string | null> = ref(null);
  let pendingReading: CourseReading | null = null;
  // the material's text, kept in memory to read one chosen course again
  let materialText = '';

  const description: Ref<CourseField | null> = ref(null);
  const objectives: Ref<CourseField[]> = ref([]);
  const overview: Ref<Record<CourseOverviewKey, CourseField | null>> = ref(emptyOverview());
  const topics: Ref<CourseField | null> = ref(null);
  const sessions: Ref<CourseField | null> = ref(null);
  const extras: Ref<Record<CourseExtraKey, string>> = ref(emptyExtras());
  const isConfirmed = ref(false);

  // the course as the teacher confirmed it, corrections included, for the connections step
  const confirmedCourse = computed(() => {
    const lines = (field: CourseField | null) => (field ? field.value.split('\n') : []);
    return {
      title: overview.value.title?.value || null,
      discipline: overview.value.discipline?.value || null,
      level: overview.value.level?.value || null,
      isLesson: materialType.value === 'lesson',
      topics: lines(topics.value),
      sessions: lines(sessions.value),
      // the course's own objectives: programme-level ones are not this course's to adapt
      objectives: objectives.value
        .filter((objective) => !objective.isProgramme)
        .map((objective) => objective.value),
      description: description.value?.value || null
    };
  });

  const isExample = computed(() => source.value === 'example');
  const isPasted = computed(() => source.value === 'pasted');
  const isScratch = computed(() => source.value === 'scratch');

  // a failure message belongs to the request that failed: forget it once the teacher moves on
  const dismissProblem = () => {
    if (status.value === 'unavailable' || status.value === 'error') status.value = 'idle';
  };

  const setFile = (picked: File | null) => {
    dismissProblem();
    uploadError.value = null;
    if (picked && picked.size > MAX_FILE_SIZE) uploadError.value = 'BIG_FILE';
    else if (picked && !isAllowedType(picked)) uploadError.value = 'BAD_EXTENSION';
    file.value = uploadError.value ? null : picked;
  };

  const resetCourse = () => {
    overview.value = emptyOverview();
    topics.value = null;
    sessions.value = null;
    extras.value = emptyExtras();
    droppedCount.value = 0;
    isTextCut.value = false;
    isConfirmed.value = false;
    materialType.value = null;
    isMaterialTypeChanged.value = false;
  };

  // basic reading, the example and pasted text: description and objectives only
  const showCourse = (result: SyllabusExtraction) => {
    resetCourse();
    extraction.value = result;
    description.value = fromExtraction(result.description);
    objectives.value = result.objectives.map((text) => fromExtraction(text) as CourseField);
    status.value = 'ready';
  };

  // full reading: only values found word for word in the syllabus reach this point
  const showReading = (reading: CourseReading) => {
    resetCourse();
    extraction.value = null;
    overview.value = {
      title: fromExtraction(reading.title),
      discipline: fromExtraction(reading.discipline),
      level: fromExtraction(reading.level)
    };
    topics.value = fromList(reading.topics);
    sessions.value = fromList(
      reading.sessions.map(({ label, title }) => (label ? `${label} · ${title}` : title))
    );
    description.value = fromExtraction(reading.description);
    materialType.value = reading.material_type;
    // programme objectives are the ones the syllabus itself lists under a programme heading;
    // the teacher can still move any objective between the two groups. a course whose every
    // objective would be programme-level is a misreading: then nothing is set apart
    const isEveryProgramme = reading.objectives.every(({ scope }) => scope === 'programme');
    objectives.value = reading.objectives.map(({ text, scope }) => ({
      ...(fromExtraction(text) as CourseField),
      isProgramme: scope === 'programme' && !isEveryProgramme
    }));
    status.value = 'ready';
  };

  let controller: AbortController | undefined;

  // real progress of the request; once it is sent, WeLearn is reading
  const trackUpload = (event: { loaded: number; total?: number }) => {
    uploadProgress.value = event.total ? Math.round((event.loaded / event.total) * 100) : 0;
    if (event.total && event.loaded >= event.total && status.value === 'uploading') {
      status.value = 'reading';
      readingStartedAt.value = Date.now();
    }
  };

  const handleFailure = (error: any) => {
    if (axios.isCancel(error)) return;
    // no answer at all (network, VPN, CORS) or the API refusing access: say it is unavailable
    const code = error?.response?.status;
    status.value =
      !error?.response || [403, 404, 502, 503, 504].includes(code) ? 'unavailable' : 'error';
  };

  const readFull = async (text: string, signal: AbortSignal, focus?: string) => {
    const lang = guessLanguage(text, language.value === 'en' ? 'en' : 'fr');
    const reading = await askUsableAnswer(
      () =>
        basePostAxios('/qna/chat/answer', buildReadingRequest(text, lang, focus), {
          signal,
          onUploadProgress: trackUpload
        }),
      parseReadingAnswer
    );
    // an answer that is not the expected structure is a failure, never a partial result
    if (!reading) {
      status.value = 'error';
      return;
    }
    const verified = verifyReading(reading, text);
    readingMode.value = 'full';
    // several courses: never merged into one, the teacher chooses first
    if (!focus && verified.reading.courses_found.length > 1) {
      pendingReading = verified.reading;
      coursesFound.value = verified.reading.courses_found;
      status.value = 'choosing';
      return;
    }
    showReading(verified.reading);
    droppedCount.value = verified.droppedCount;
    isTextCut.value = text.length > MAX_TEXT_LENGTH;
  };

  // reads the document again for the chosen course only
  const chooseCourse = async (title: string) => {
    controller?.abort();
    controller = new AbortController();
    focusCourse.value = title;
    status.value = 'reading';
    readingStartedAt.value = Date.now();
    try {
      await readFull(materialText, controller.signal, title);
    } catch (error: any) {
      handleFailure(error);
    }
  };

  // the teacher says the document is one course after all: its reading is shown as it is
  const keepWholeDocument = () => {
    if (!pendingReading) return;
    focusCourse.value = null;
    showReading(pendingReading);
  };

  const setMaterialType = (type: MaterialType) => {
    materialType.value = type;
    isMaterialTypeChanged.value = true;
  };

  const readBasic = async (signal: AbortSignal) => {
    const formData = new FormData();
    formData.append('files', file.value as File);
    const resp = await basePostAxios(
      `/tutor/mas_files/content?lang=${language.value}&mode=mode_2`,
      formData,
      {
        headers: { 'content-type': 'multipart/form-data' },
        signal,
        onUploadProgress: trackUpload
      }
    );
    if (resp.status === 204 || !resp.data) {
      status.value = 'error';
      return;
    }
    readingMode.value = 'basic';
    showCourse(resp.data as SyllabusExtraction);
  };

  const readSyllabus = async () => {
    if (!file.value) return;
    controller?.abort();
    controller = new AbortController();
    const { signal } = controller;
    source.value = 'upload';
    readingMode.value = null;
    coursesFound.value = [];
    focusCourse.value = null;
    pendingReading = null;
    uploadProgress.value = 0;
    readingStartedAt.value = null;
    status.value = 'uploading';

    // the text is read here, in the browser; a file without usable text gets the basic reading
    let text: string | null = null;
    try {
      text = await readSyllabusText(file.value);
    } catch {
      text = null;
    }
    if (signal.aborted) return;
    materialText = text || '';

    try {
      if (text && text.trim().length >= MIN_TEXT_LENGTH) await readFull(text, signal);
      else await readBasic(signal);
    } catch (error: any) {
      handleFailure(error);
    }
  };

  const cancelReading = () => {
    controller?.abort();
    status.value = 'idle';
  };

  // the fictional example: written for this prototype, shown as an example, never sent anywhere
  const loadExample = () => {
    controller?.abort();
    const { t } = i18n.global;
    source.value = 'example';
    readingMode.value = null;
    showCourse({
      detected_document_type: 'syllabus',
      confidence: 1,
      summary: null,
      description: t('journey.teach.adapt.example.description'),
      objectives: EXAMPLE_OBJECTIVE_KEYS.map((key) =>
        t(`journey.teach.adapt.example.objectives.${key}`)
      ),
      reasoning: null
    });
  };

  // the teacher's own text: shown as the original, nothing is read from it; the teacher fills in
  // the course from it. never sent anywhere
  const loadPastedText = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    controller?.abort();
    source.value = 'pasted';
    readingMode.value = null;
    pastedText.value = trimmed;
    showCourse({
      detected_document_type: 'unknown',
      confidence: 0,
      summary: null,
      description: null,
      objectives: [],
      reasoning: null
    });
  };

  // teacher corrections: a changed extracted text becomes "edited" (its original is kept),
  // getting the original text back makes it "extracted" again
  const editField = (field: CourseField, value: string): CourseField => {
    if (field.origin === 'added') return { ...field, value };
    const base = field.isSuggestion ? 'suggested' : 'extracted';
    return { ...field, value, origin: value === field.original ? base : 'edited' };
  };

  // a single field (description, overview line, topics, sessions): added when missing, removed
  // when the teacher empties what they added, otherwise corrected
  const changeField = (field: CourseField | null, value: string): CourseField | null => {
    const text = value.trim();
    if (!field) return text ? { value: text, origin: 'added' } : null;
    // emptying what the teacher added, or a proposal they reject, removes it
    if (!text && (field.origin === 'added' || field.isSuggestion)) return null;
    return editField(field, text);
  };

  const restoreField = (field: CourseField | null) =>
    field?.original ? editField(field, field.original) : field;

  const updateDescription = (value: string) => {
    description.value = changeField(description.value, value);
  };

  const restoreDescription = () => {
    description.value = restoreField(description.value);
  };

  const updateOverview = (key: CourseOverviewKey, value: string) => {
    overview.value[key] = changeField(overview.value[key], value);
  };

  const restoreOverview = (key: CourseOverviewKey) => {
    overview.value[key] = restoreField(overview.value[key]);
  };

  // one item per line; empty lines are dropped
  const cleanLines = (value: string) =>
    value
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .join('\n');

  const updateTopics = (value: string) => {
    topics.value = changeField(topics.value, cleanLines(value));
  };

  const restoreTopics = () => {
    topics.value = restoreField(topics.value);
  };

  const updateSessions = (value: string) => {
    sessions.value = changeField(sessions.value, cleanLines(value));
  };

  const restoreSessions = () => {
    sessions.value = restoreField(sessions.value);
  };

  const updateObjective = (index: number, value: string) => {
    const text = value.trim();
    if (!text) return;
    objectives.value[index] = editField(objectives.value[index], text);
  };

  const restoreObjective = (index: number) => {
    const objective = objectives.value[index];
    if (objective.original) objectives.value[index] = editField(objective, objective.original);
  };

  const addObjective = (value: string) => {
    const text = value.trim();
    if (text) objectives.value.push({ value: text, origin: 'added' });
  };

  // only what the teacher added can be removed; read text is corrected, not deleted
  const removeObjective = (index: number) => {
    const objective = objectives.value[index];
    if (objective?.origin === 'added' || objective?.isSuggestion) objectives.value.splice(index, 1);
  };

  // a syllabus often mixes degree-level goals with the course's own: the ones listed under a
  // programme heading start in that group; the teacher can move any objective, nothing is
  // rewritten, and the move can be undone
  const toggleProgrammeObjective = (index: number) => {
    const objective = objectives.value[index];
    if (objective) objectives.value[index] = { ...objective, isProgramme: !objective.isProgramme };
  };

  const setExtra = (key: CourseExtraKey, value: string) => {
    extras.value[key] = value;
  };

  const confirmCourse = () => {
    isConfirmed.value = true;
  };

  // creating from scratch: one request with the brief, then the proposal to review
  const draftProposal = async () => {
    if (!brief.value.idea.trim()) return;
    controller?.abort();
    controller = new AbortController();
    const { signal } = controller;
    source.value = 'scratch';
    readingMode.value = null;
    status.value = 'reading';
    readingStartedAt.value = Date.now();
    const text = Object.values(brief.value).join(' ');
    const lang = guessLanguage(text, language.value === 'en' ? 'en' : 'fr');
    try {
      const proposal = await askUsableAnswer(
        () =>
          basePostAxios('/qna/chat/answer', buildProposalRequest(brief.value, lang), { signal }),
        parseProposal
      );
      if (signal.aborted) return;
      if (!proposal) {
        status.value = 'error';
        return;
      }
      showProposal(proposal);
    } catch (error: any) {
      handleFailure(error);
    }
  };

  const showProposal = (proposal: CourseProposal) => {
    resetCourse();
    extraction.value = null;
    overview.value = {
      title: fromSuggestion(proposal.title),
      discipline: fromSuggestion(proposal.discipline),
      level: fromSuggestion(proposal.level)
    };
    description.value = fromSuggestion(proposal.purpose);
    objectives.value = proposal.objectives.map((text) => fromSuggestion(text) as CourseField);
    topics.value = fromSuggestedList(proposal.topics);
    sessions.value = fromSuggestedList(proposal.sessions);
    activities.value = fromSuggestedList(proposal.activities);
    assessment.value = fromSuggestedList(proposal.assessment);
    opportunities.value = proposal.opportunities.map((idea) => ({ idea, isKept: true }));
    proposalText.value = null;
    status.value = 'ready';
  };

  const updateActivities = (value: string) => {
    activities.value = changeField(activities.value, cleanLines(value));
  };
  const restoreActivities = () => {
    activities.value = restoreField(activities.value);
  };
  const updateAssessment = (value: string) => {
    assessment.value = changeField(assessment.value, cleanLines(value));
  };
  const restoreAssessment = () => {
    assessment.value = restoreField(assessment.value);
  };

  const toggleOpportunity = (index: number) => {
    const opportunity = opportunities.value[index];
    if (opportunity) opportunity.isKept = !opportunity.isKept;
  };

  // the sustainability opportunities the teacher kept, as ideas for the connections step
  const keptIdeas = computed(() =>
    opportunities.value.filter(({ isKept }) => isKept).map(({ idea }) => idea)
  );

  const setProposalText = (text: string | null) => {
    proposalText.value = text?.trim() || null;
  };

  const $reset = () => {
    controller?.abort();
    file.value = null;
    uploadError.value = null;
    status.value = 'idle';
    uploadProgress.value = 0;
    readingStartedAt.value = null;
    source.value = null;
    pastedText.value = '';
    brief.value = emptyBrief();
    activities.value = null;
    assessment.value = null;
    opportunities.value = [];
    proposalText.value = null;
    extraction.value = null;
    readingMode.value = null;
    description.value = null;
    objectives.value = [];
    coursesFound.value = [];
    focusCourse.value = null;
    pendingReading = null;
    materialText = '';
    resetCourse();
  };

  return {
    file,
    uploadError,
    language,
    status,
    uploadProgress,
    readingStartedAt,
    source,
    pastedText,
    isExample,
    isPasted,
    confirmedCourse,
    extraction,
    readingMode,
    droppedCount,
    isTextCut,
    materialType,
    isMaterialTypeChanged,
    coursesFound,
    focusCourse,
    description,
    objectives,
    overview,
    topics,
    sessions,
    extras,
    isConfirmed,
    setFile,
    dismissProblem,
    readSyllabus,
    cancelReading,
    chooseCourse,
    keepWholeDocument,
    setMaterialType,
    loadExample,
    loadPastedText,
    updateDescription,
    restoreDescription,
    updateObjective,
    restoreObjective,
    addObjective,
    removeObjective,
    toggleProgrammeObjective,
    updateOverview,
    restoreOverview,
    updateTopics,
    restoreTopics,
    updateSessions,
    restoreSessions,
    setExtra,
    confirmCourse,
    isScratch,
    brief,
    activities,
    assessment,
    opportunities,
    keptIdeas,
    proposalText,
    draftProposal,
    updateActivities,
    restoreActivities,
    updateAssessment,
    restoreAssessment,
    toggleOpportunity,
    setProposalText,
    $reset
  };
});
