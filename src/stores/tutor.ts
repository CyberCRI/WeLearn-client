import { defineStore } from 'pinia';
import axios from 'axios';
import { convertMarkdownToDocx, downloadDocx } from '@/utils/md-to-docx';
import _isequal from 'lodash.isequal';
import { type Ref, computed, ref } from 'vue';
import {
  type ChatAnswerResponse,
  type CourseField,
  type CourseReading,
  type CoursePath,
  type ObjectiveGroup,
  type Document,
  type TeachingContext,
  type TutorSearch,
  type TutorSyllabus
} from '@/types';
import type { ApiResponse } from '@/types/api';
import {
  type ContextReading,
  emptyTeachingContext,
  levelFromText,
  readTeachingContext
} from '@/utils/teachingContext';
import {
  askUsableAnswer,
  buildOutlineRequest,
  buildReadingRequest,
  guessLanguage,
  MAX_TEXT_LENGTH,
  parseOutlineAnswer,
  parseReadingAnswer,
  preferNumberedTopics,
  textParts,
  type ReadingLanguage
} from '@/utils/courseReading';
import { normalise } from '@/utils/courseCheck';
import { isCheckable, readDocumentText } from '@/utils/documentText';
import {
  checkObjectives,
  placeObjectives,
  editField,
  fromSyllabus,
  looksLikeMoreThanDescription,
  restoreField,
  verify
} from '@/utils/courseCheck';
import type { ConfirmedCourse } from '@/utils/connections';
import type { CourseToUpdate } from '@/utils/updatedSyllabus';
import type { TutorDraft } from '@/utils/draft';
import { basePostAxios } from '@/utils/fetch';
import i18n from '@/localisation/i18n';

const MAX_FILES = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// the LLM sometimes writes a literal "\n" (backslash + n): inside a table cell it
// means a line break (<br>), anywhere else a real new line
export const cleanSyllabus = (content: string) =>
  content
    .split('\n')
    .map((line) =>
      line.trim().startsWith('|') ? line.replace(/\\n/g, '<br>') : line.replace(/\\n/g, '\n')
    )
    .join('\n');

// an answer came back, but nothing usable in it: a reading problem, not an unreachable WeLearn
const UNUSABLE_READING = 'unusable reading';

export type FileErrorReason = 'BIG_FILE' | 'BAD_EXTENSION' | 'TOO_MANY_FILES';

export const useTutorStore = defineStore('tutor', () => {
  const tutorSearch: Ref<TutorSearch | undefined> = ref(undefined);
  const syllabi: Ref<{ content: string; source: string } | undefined> = ref(undefined);
  // keyed by file name, so the same file can't be added twice
  const newFilesToSearch: Ref<Record<string, File>> = ref({});
  const searchedFiles: Ref<File[]> = ref([]);
  const isLoading: Ref<boolean> = ref(false);
  const step: Ref<number> = ref(1);
  const level: Ref<string> = ref('');
  const duration: Ref<string> = ref('');
  const description: Ref<string> = ref('');
  const courseTitle: Ref<string> = ref('');
  const selectedSources: Ref<Document[]> = ref([]);
  const extracts: Ref<string[]> = ref([]);
  // feedback the user already sent for the current syllabus, oldest first
  const feedbackHistory: Ref<string[]> = ref([]);

  const goNext = () => (step.value = step.value + 1);
  const setStep = (newStep: number) => (step.value = newStep);
  // each confirmation of the course in step 2 (the first, or again after a correction) leads to
  // the sustainability additions, made again for the course as it now is
  const confirmations = ref(0);
  const confirmCourse = () => {
    confirmations.value++;
    setStep(3);
  };

  // ERROR STATES
  const shouldRetryAction: Ref<boolean> = ref(false);
  const hasSearchError: Ref<boolean> = ref(false);
  const reloadError: Ref<boolean> = ref(false);
  const fileError: Ref<{ state: boolean; reason: FileErrorReason | null }> = ref({
    state: false,
    reason: null
  });

  // one request at a time: closing the loading modal aborts it
  let controller: AbortController | undefined;
  const startRequest = () => {
    controller?.abort();
    controller = new AbortController();
    shouldRetryAction.value = false;
    isLoading.value = true;
    return { signal: controller.signal };
  };

  const isAllowedType = (file: File) =>
    file.type === 'application/pdf' ||
    file.type.startsWith('text/') ||
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  const addFiles = (files: FileList | File[]) => {
    let reason: FileErrorReason | null = null;
    const next = { ...newFilesToSearch.value };
    for (const file of Array.from(files)) {
      if (file.size > MAX_FILE_SIZE) reason = 'BIG_FILE';
      else if (!isAllowedType(file)) reason = 'BAD_EXTENSION';
      else if (!next[file.name] && Object.keys(next).length >= MAX_FILES) reason = 'TOO_MANY_FILES';
      else next[file.name] = file;
    }
    newFilesToSearch.value = next;
    fileError.value = { state: !!reason, reason };
  };

  const removeFile = (name: string) => {
    const rest = { ...newFilesToSearch.value };
    delete rest[name];
    newFilesToSearch.value = rest;
    fileError.value = { state: false, reason: null };
  };

  // the new flow: the teacher first says whether they already have a course
  const path: Ref<CoursePath | null> = ref(null);
  const syllabusFile: Ref<File | null> = ref(null);
  // a restored draft keeps the file's name only, never the file
  const draftFileName: Ref<string | null> = ref(null);
  const syllabusFileName = computed(() => syllabusFile.value?.name || draftFileName.value || '');
  const teachingContext: Ref<TeachingContext> = ref(emptyTeachingContext());
  // fields filled from what the syllabus states; a teacher's change makes them their own
  const prefilled: Ref<(keyof TeachingContext)[]> = ref([]);
  // the line of the syllabus each pre-filled value was read from
  const contextEvidence: Ref<ContextReading['evidence']> = ref({});
  // the syllabus's own text, when the browser can read it (txt, docx): what WeLearn extracted
  // is checked against it. null for a pdf, or a file that could not be read
  const documentText: Ref<string | null> = ref(null);
  let textReading: Promise<string | null> = Promise.resolve(null);

  // what WeLearn read from the syllabus (screen 1.2), then corrected by the teacher
  const readKey: Ref<string | null> = ref(null);
  const detectedType: Ref<string | null> = ref(null);
  const courseDescription: Ref<CourseField | null> = ref(null);
  // a short overview written by the AI from the syllabus, shown when it has no clear description
  const courseSummary: Ref<CourseField | null> = ref(null);
  // a description the teacher removed, kept so it can be brought back
  const removedDescription: Ref<CourseField | null> = ref(null);
  const courseObjectives: Ref<CourseField[]> = ref([]);
  // the course's topics and its sessions, as the reading lists them; the teacher adds or removes
  // topics
  const courseTopics: Ref<CourseField[]> = ref([]);
  const coursePlan: Ref<string[]> = ref([]);
  // the reading may be incomplete: a long syllabus is read only up to MAX_TEXT_LENGTH, and the
  // answer can stop before its end. the check screen says so
  const isReadingPartial = ref(false);
  // context values filled from the AI reading but not found word for word: shown for checking
  const aiFilled: Ref<(keyof TeachingContext)[]> = ref([]);
  // context values the AI inferred from the course (not stated in the syllabus): its suggestion
  const aiSuggested: Ref<(keyof TeachingContext)[]> = ref([]);

  // the reading, step by step, for the in-page progress: only real operations are shown
  const readingPhase: Ref<'idle' | 'sending' | 'reading'> = ref('idle');
  const uploadProgress = ref(0);
  const readingStartedAt: Ref<number | null> = ref(null);
  // no answer at all (network, access) or an answer that could not be used
  const readError: Ref<'unavailable' | 'error' | null> = ref(null);

  const clearReading = () => {
    readKey.value = null;
    detectedType.value = null;
    courseDescription.value = null;
    courseSummary.value = null;
    removedDescription.value = null;
    courseObjectives.value = [];
    courseTopics.value = [];
    coursePlan.value = [];
    isReadingPartial.value = false;
  };

  const hasStartedCourse = computed(
    () =>
      !!syllabusFile.value ||
      Object.values(teachingContext.value).some((value) => value !== '' && value !== null)
  );

  const choosePath = (chosen: CoursePath) => {
    path.value = chosen;
    setStep(1);
  };

  const clearPrefilled = () => {
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

  const setSyllabusFile = async (file: File) => {
    if (file.size > MAX_FILE_SIZE || !isAllowedType(file)) {
      fileError.value = {
        state: true,
        reason: file.size > MAX_FILE_SIZE ? 'BIG_FILE' : 'BAD_EXTENSION'
      };
      return;
    }
    fileError.value = { state: false, reason: null };
    clearPrefilled();
    clearReading();
    syllabusFile.value = file;
    draftFileName.value = null;
    documentText.value = null;
    // the text is read here (txt, docx, pdf with a text layer); without it, WeLearn reads the file
    textReading = isCheckable(file) ? readDocumentText(file) : Promise.resolve(null);
    const text = await textReading;
    if (syllabusFile.value !== file) return;
    documentText.value = text;
    if (!text) return;
    const { values, evidence } = readTeachingContext(text);
    const context = { ...teachingContext.value };
    const keys = (Object.keys(values) as (keyof TeachingContext)[]).filter(
      (key) => context[key] === '' || context[key] === null
    );
    keys.forEach((key) => ((context as Record<string, unknown>)[key] = values[key]));
    teachingContext.value = context;
    prefilled.value = keys;
    contextEvidence.value = evidence;
  };

  const removeSyllabusFile = () => {
    clearPrefilled();
    clearReading();
    syllabusFile.value = null;
    documentText.value = null;
    textReading = Promise.resolve(null);
    fileError.value = { state: false, reason: null };
  };

  const updateContext = <K extends keyof TeachingContext>(key: K, value: TeachingContext[K]) => {
    teachingContext.value = { ...teachingContext.value, [key]: value };
    prefilled.value = prefilled.value.filter((name) => name !== key);
    aiFilled.value = aiFilled.value.filter((name) => name !== key);
    aiSuggested.value = aiSuggested.value.filter((name) => name !== key);
  };

  // "Change" next to a value read from the syllabus: it joins the teaching context to complete
  const unmarkPrefilled = (key: keyof TeachingContext) => {
    prefilled.value = prefilled.value.filter((name) => name !== key);
  };

  // "Back to starting options": everything added for the course is discarded
  const resetCourse = () => {
    path.value = null;
    syllabusFile.value = null;
    draftFileName.value = null;
    documentText.value = null;
    textReading = Promise.resolve(null);
    teachingContext.value = emptyTeachingContext();
    prefilled.value = [];
    aiFilled.value = [];
    aiSuggested.value = [];
    contextEvidence.value = {};
    clearReading();
    readError.value = null;
    fileError.value = { state: false, reason: null };
    setStep(1);
  };

  const summaries = ref<string[]>([]);

  const updateSummary = (index: number, content: string) => {
    summaries.value[index] = content;
  };

  const updateSyllabus = (content: string) => {
    if (!syllabi.value) {
      return;
    }
    syllabi.value = { ...syllabi.value, content };
  };

  const syllabusLanguage: Ref<string> = ref(i18n.global.locale.value);

  // the course for a draft kept in the browser (utils/draft.ts): what step 2 holds and the text
  // read from the syllabus, which the complete word document is built from. a plain copy
  const toDraft = (): TutorDraft =>
    JSON.parse(
      JSON.stringify({
        step: step.value,
        syllabusLanguage: syllabusLanguage.value,
        fileName: syllabusFileName.value || null,
        teachingContext: teachingContext.value,
        prefilled: prefilled.value,
        aiFilled: aiFilled.value,
        aiSuggested: aiSuggested.value,
        contextEvidence: contextEvidence.value,
        documentText: documentText.value,
        detectedType: detectedType.value,
        courseDescription: courseDescription.value,
        courseSummary: courseSummary.value,
        removedDescription: removedDescription.value,
        courseObjectives: courseObjectives.value,
        courseTopics: courseTopics.value,
        coursePlan: coursePlan.value,
        isReadingPartial: isReadingPartial.value
      })
    );
  // a restored course: improving an existing one, at the step it was saved at. uploading a file
  // again reads it again, as it always does
  const fromDraft = (draft: TutorDraft) => {
    resetCourse();
    path.value = 'existing';
    syllabusLanguage.value = draft.syllabusLanguage || syllabusLanguage.value;
    draftFileName.value = draft.fileName || null;
    teachingContext.value = { ...emptyTeachingContext(), ...draft.teachingContext };
    prefilled.value = draft.prefilled || [];
    aiFilled.value = draft.aiFilled || [];
    aiSuggested.value = draft.aiSuggested || [];
    contextEvidence.value = draft.contextEvidence || {};
    documentText.value = draft.documentText;
    textReading = Promise.resolve(draft.documentText);
    detectedType.value = draft.detectedType || null;
    courseDescription.value = draft.courseDescription || null;
    courseSummary.value = draft.courseSummary || null;
    removedDescription.value = draft.removedDescription || null;
    courseObjectives.value = draft.courseObjectives;
    courseTopics.value = draft.courseTopics;
    coursePlan.value = draft.coursePlan;
    isReadingPartial.value = !!draft.isReadingPartial;
    setStep(draft.step);
  };
  const selectSyllabusLanguage = (lang: string) => {
    syllabusLanguage.value = lang;
    // summaries are extracted in this language, so they must be redone
    searchedFiles.value = [];
  };

  const trackUpload = (event: { loaded: number; total?: number }) => {
    uploadProgress.value = event.total ? Math.round((event.loaded / event.total) * 100) : 0;
    if (event.total && event.loaded >= event.total && readingPhase.value === 'sending') {
      readingPhase.value = 'reading';
      readingStartedAt.value = Date.now();
    }
  };

  // title, discipline and level from the reading, where the teacher has not filled them in:
  // found word for word, they are marked as read from the syllabus; otherwise for checking
  const fillFromReading = (reading: CourseReading, text: string) => {
    const found: Partial<Record<keyof TeachingContext, [string, string]>> = {};
    if (reading.title) found.title = [reading.title, reading.title];
    if (reading.discipline) found.discipline = [reading.discipline, reading.discipline];
    const level = reading.level && levelFromText(reading.level);
    if (reading.level && level) found.level = [level, reading.level];
    const context = { ...teachingContext.value };
    (Object.keys(found) as (keyof TeachingContext)[]).forEach((key) => {
      const [value, asWritten] = found[key] as [string, string];
      if (context[key] !== '' && context[key] !== null) return;
      (context as Record<string, unknown>)[key] = value;
      if (verify(asWritten, text) === 'verified') {
        prefilled.value = [...prefilled.value, key];
        contextEvidence.value = { ...contextEvidence.value, [key]: asWritten };
      } else {
        aiFilled.value = [...aiFilled.value, key];
      }
    });
    if (!context.discipline && reading.disciplineSuggested) {
      context.discipline = reading.disciplineSuggested;
      aiSuggested.value = [...aiSuggested.value, 'discipline'];
    }
    teachingContext.value = context;
  };

  // the full reading of the "design your course" prototype: description, objectives with the
  // heading level they sit under, topics, sessions, title, discipline and level. each value is
  // checked against the text; what is not found word for word is kept and marked
  const showReading = (reading: CourseReading, text: string) => {
    detectedType.value = reading.material_type;
    courseDescription.value = reading.description
      ? fromSyllabus(reading.description, verify(reading.description, text))
      : null;
    // the course's own, its competencies, wider ones, and those to sort: by the reading's scope
    // and the headings they sit under
    courseObjectives.value = placeObjectives(reading.objectives, text);
    courseSummary.value = reading.summary
      ? { ...fromSyllabus(reading.summary, 'unchecked'), isSummary: true }
      : null;
    // topics may be named by the AI in its own words; the line they come from must be in the
    // syllabus: a topic whose source is not found is kept and marked for checking, never dropped
    // the syllabus's own numbered topics first, when the AI regrouped or repeated them
    courseTopics.value = preferNumberedTopics(reading.topics, text).map(
      ({ title, subtopics, source }) => {
        const asWritten = verify(title, text);
        const grounding = asWritten === 'verified' ? asWritten : verify(source || title, text);
        return {
          ...fromSyllabus(title, grounding),
          isSummary: asWritten !== 'verified',
          subtopics,
          // the line it was read from, kept only when it is really in the syllabus
          source: asWritten === 'verified' ? title : grounding === 'verified' ? source : null
        };
      }
    );
    coursePlan.value = reading.sessions.map(({ label, title }) =>
      [label, title].filter(Boolean).join(' – ')
    );
    // only when something may really be missing: objectives cut off, topics still missing after
    // the outline request, or a syllabus longer than what the reading covers for its objectives
    isReadingPartial.value =
      text.length > MAX_TEXT_LENGTH ||
      reading.isObjectivesCut ||
      (reading.isAnswerCut && !reading.topics.length);
    fillFromReading(reading, text);
  };

  // without the file's text (a scanned pdf), or when the full reading gave nothing usable: the basic
  // reading of the file by WeLearn (description and objectives only)
  const readBasic = async (file: File, text: string | null, signal: AbortSignal) => {
    readingPhase.value = 'sending';
    uploadProgress.value = 0;
    const formData = new FormData();
    formData.append('files', file);
    const resp = await basePostAxios<ApiResponse<'/tutor/mas_files/content', 'post'>>(
      `/tutor/mas_files/content?lang=${syllabusLanguage.value}&mode=mode_2`,
      formData,
      { headers: { 'content-type': 'multipart/form-data' }, signal, onUploadProgress: trackUpload }
    );
    const reading = resp.data;
    if (!reading) throw new Error(UNUSABLE_READING);
    detectedType.value = reading.detected_document_type;
    courseDescription.value = reading.description
      ? fromSyllabus(reading.description, verify(reading.description, text))
      : null;
    courseObjectives.value = checkObjectives(reading.objectives, text);
  };

  // screen 1.1 → 1.2: WeLearn reads the syllabus. the same file is not read again, so
  // corrections are kept
  // the topics and overview the full reading could not give: its answer stopped before them, it
  // found no topics, or the syllabus is longer than what one request reads. asked part by part,
  // only then; what the reading already gave is kept, and a failure here keeps the reading as is
  const completeOutline = async (
    reading: CourseReading,
    text: string,
    lang: ReadingLanguage,
    signal: AbortSignal
  ): Promise<CourseReading> => {
    const parts = textParts(text);
    const hasTopics = reading.topics.length > 0 && !reading.isAnswerCut;
    // the first part was read in full: only the rest is asked for, unless its topics are missing
    const missing = hasTopics ? parts.slice(1) : parts;
    if (!missing.length) return reading;
    const topics = [...reading.topics];
    let summary = reading.summary;
    try {
      for (const part of missing) {
        const outline = await askUsableAnswer(
          () =>
            basePostAxios<ChatAnswerResponse>('/qna/chat/answer', buildOutlineRequest(part, lang), {
              signal
            }),
          parseOutlineAnswer
        );
        if (!outline) continue;
        summary = summary || outline.summary;
        const known = new Set(topics.map((topic) => normalise(topic.title)));
        outline.topics.forEach((topic) => {
          if (!known.has(normalise(topic.title))) topics.push(topic);
        });
      }
    } catch (error) {
      if (axios.isCancel(error)) throw error;
    }
    return { ...reading, summary, topics };
  };

  const readSyllabus = async () => {
    const file = syllabusFile.value;
    if (!file) return;
    const key = `${file.name}|${file.size}|${file.lastModified}|${syllabusLanguage.value}`;
    if (readKey.value === key) {
      setStep(2);
      return;
    }

    const { signal } = startRequest();
    readError.value = null;
    uploadProgress.value = 0;
    readingStartedAt.value = null;
    readingPhase.value = 'sending';
    try {
      const text = await textReading;
      const lang = guessLanguage(text || '', syllabusLanguage.value === 'en' ? 'en' : 'fr');
      const reading = text?.trim()
        ? await askUsableAnswer(
            () =>
              basePostAxios<ChatAnswerResponse>(
                '/qna/chat/answer',
                buildReadingRequest(text, lang),
                { signal, onUploadProgress: trackUpload }
              ),
            parseReadingAnswer
          )
        : null;
      removedDescription.value = null;
      if (reading && text) showReading(await completeOutline(reading, text, lang, signal), text);
      else await readBasic(file, text, signal);
      readKey.value = key;
      isLoading.value = false;
      readingPhase.value = 'idle';
      setStep(2);
    } catch (error: any) {
      if (axios.isCancel(error)) return;
      console.error('Error while reading the syllabus:', error);
      isLoading.value = false;
      readingPhase.value = 'idle';
      const code = error?.response?.status;
      const isUnreachable =
        error?.message !== UNUSABLE_READING &&
        (!error?.response || [403, 404, 502, 503, 504].includes(code));
      readError.value = isUnreachable ? 'unavailable' : 'error';
    }
  };

  // "Cancel" while WeLearn reads: back to the upload, nothing kept
  const cancelReading = () => {
    controller?.abort();
    isLoading.value = false;
    readingPhase.value = 'idle';
  };

  // the teacher's corrections on screen 1.2
  const setDescription = (value: string) => {
    const text = value.trim();
    if (!courseDescription.value) {
      courseDescription.value = text ? { value: text, origin: 'added' } : null;
      removedDescription.value = null;
      return;
    }
    courseDescription.value = text ? editField(courseDescription.value, text) : null;
  };

  const setSummary = (text: string) => {
    if (courseSummary.value) courseSummary.value = editField(courseSummary.value, text.trim());
  };

  const restoreSummary = () => {
    if (courseSummary.value) courseSummary.value = restoreField(courseSummary.value);
  };

  const restoreDescription = () => {
    if (courseDescription.value) courseDescription.value = restoreField(courseDescription.value);
  };

  // a description read from the syllabus is set aside, not lost: it can be brought back
  const removeDescription = () => {
    const field = courseDescription.value;
    if (field && field.origin !== 'added') removedDescription.value = restoreField(field);
    courseDescription.value = null;
  };

  const bringBackDescription = () => {
    courseDescription.value = removedDescription.value;
    removedDescription.value = null;
  };

  const setObjective = (index: number, value: string) => {
    const text = value.trim();
    const objective = courseObjectives.value[index];
    if (!objective || !text) return;
    courseObjectives.value[index] = editField(objective, text);
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

  const addTopic = (value: string) => {
    const text = value.trim();
    const isKnown = courseTopics.value.some(
      (topic) => topic.value.toLowerCase() === text.toLowerCase()
    );
    if (text && !isKnown) courseTopics.value.push({ value: text, origin: 'added' });
  };

  const removeTopic = (index: number) => {
    courseTopics.value.splice(index, 1);
  };

  // the teacher's corrections to the topics, saved at once: a topic keeps its place and what was
  // read (`from` is its index before editing), a new one is the teacher's; an empty title removes it
  const saveTopics = (drafts: { from: number | null; title: string; subtopics: string[] }[]) => {
    courseTopics.value = drafts
      .map(({ from, title, subtopics }): CourseField | null => {
        const text = title.trim();
        const kept = subtopics.map((sub) => sub.trim()).filter(Boolean);
        const topic = from === null ? null : courseTopics.value[from];
        if (!text) return null;
        if (!topic) return { value: text, origin: 'added' as const, subtopics: kept };
        return { ...(text === topic.value ? topic : editField(topic, text)), subtopics: kept };
      })
      .filter((topic): topic is CourseField => !!topic);
  };

  const setGroup = (index: number, group: ObjectiveGroup) => {
    const objective = courseObjectives.value[index];
    if (objective) courseObjectives.value[index] = { ...objective, group };
  };

  // the course's own objectives and competencies; the degree's are kept apart
  const courseOnlyObjectives = computed(() =>
    courseObjectives.value.filter((objective) => (objective.group || 'objective') === 'objective')
  );
  const courseCompetencies = computed(() =>
    courseObjectives.value.filter((objective) => objective.group === 'competency')
  );

  // the course as the teacher confirmed it in step 2, for the sustainability additions: their
  // corrections included, degree-level objectives left out
  const confirmedCourse = computed<ConfirmedCourse>(() => {
    const { title, discipline, level } = teachingContext.value;
    const description = courseDescription.value;
    const isClearDescription =
      !!description &&
      (description.origin !== 'extracted' || !looksLikeMoreThanDescription(description.value));
    return {
      title: title || null,
      discipline: discipline || null,
      level: level ? i18n.global.t(`tutor.course.levels.${level}`) : null,
      overview: courseSummary.value?.value || (isClearDescription ? description!.value : null),
      topics: courseTopics.value.map(({ value, subtopics }) =>
        subtopics?.length ? `${value} (${subtopics.join(', ')})` : value
      ),
      objectives: courseOnlyObjectives.value.map(({ value }) => value),
      competencies: courseCompetencies.value.map(({ value }) => value),
      sessions: coursePlan.value
    };
  });

  // the parts of the course a connection may build on, each as the teacher sees it
  const courseParts = computed(() => [
    ...courseTopics.value.flatMap(({ value, subtopics }) => [value, ...(subtopics || [])]),
    ...courseOnlyObjectives.value.map(({ value }) => value),
    ...courseCompetencies.value.map(({ value }) => value),
    ...coursePlan.value
  ]);

  // the confirmed course as the updated syllabus and its exports use it
  const courseToUpdate = computed<CourseToUpdate>(() => ({
    title: confirmedCourse.value.title,
    discipline: confirmedCourse.value.discipline,
    level: confirmedCourse.value.level,
    overview: confirmedCourse.value.overview,
    topics: courseTopics.value.map(({ value, subtopics, source }) => ({
      title: value,
      subtopics: subtopics || [],
      source: source || null
    })),
    objectives: courseOnlyObjectives.value.map(({ value }) => value),
    competencies: courseCompetencies.value.map(({ value }) => value),
    sessions: coursePlan.value
  }));

  // where the teacher may put a change: the topics with their subtopics, then the outline
  const coursePlaces = computed(() => [
    ...new Set([
      ...courseTopics.value.flatMap(({ value, subtopics }) => [value, ...(subtopics || [])]),
      ...coursePlan.value
    ])
  ]);

  // the teacher's corrections to the course outline, one session or chapter per line
  const setCoursePlan = (lines: string[]) => {
    coursePlan.value = lines.map((line) => line.trim()).filter(Boolean);
  };

  const getFilesContent = async (arg: File[]) => {
    const { signal } = startRequest();
    const formData = new FormData();
    arg.forEach((file) => {
      if (file) {
        formData.append('files', file);
      }
    });
    const resp = await basePostAxios(
      `/tutor/files/content?lang=${syllabusLanguage.value}`,
      formData,
      {
        headers: { 'content-type': 'multipart/form-data' },
        signal
      }
    );
    if (resp.status === 204) {
      throw new Error('retry getFilesContent');
    }
    extracts.value = resp.data.extracts;
    summaries.value = resp.data.extracts.map((e: { summary: string }) => e.summary);
    isLoading.value = false;
  };

  const stopAction = () => {
    controller?.abort();
    isLoading.value = false;
    shouldRetryAction.value = false;
  };

  const retrieveTutorSearch = async () => {
    setStep(2);
    const { signal } = startRequest();

    try {
      const resp = await basePostAxios(
        '/tutor/search_extracts',
        { summaries: summaries.value },
        { signal }
      );
      if (resp.status === 204) {
        shouldRetryAction.value = true;
        return;
      }
      tutorSearch.value = resp.data;
      hasSearchError.value = false;
      isLoading.value = false;
      setStep(3);
    } catch (error: any) {
      if (axios.isCancel(error)) return;
      console.error('Error during tutor search:', error);
      hasSearchError.value = true;
      shouldRetryAction.value = true;
      if (error.code === 'ERR_NETWORK') {
        reloadError.value = true;
      }
    }
  };

  const appendSource = (source: Document) => {
    const sourceExists =
      selectedSources.value && selectedSources.value.some((s) => s.id === source.id);
    if (!sourceExists) {
      selectedSources.value.push(source);
    } else {
      selectedSources.value = selectedSources.value.filter((s) => s.id !== source.id);
    }
  };

  const handleSummaryFiles = async () => {
    setStep(1);
    reloadError.value = false;
    selectedSources.value = [];
    const arg = Object.values(newFilesToSearch.value);
    if (!arg.length) {
      console.error('No files selected');
      return;
    }

    // same files as last time: keep the summaries the user may have edited
    if (_isequal(searchedFiles.value, arg)) {
      goNext();
      return;
    }

    tutorSearch.value = undefined;
    try {
      await getFilesContent(arg);
      searchedFiles.value = arg;
      goNext();
    } catch (error) {
      if (axios.isCancel(error)) return;
      console.error('get files content did not work', error);
      shouldRetryAction.value = true;
    }
  };

  const restart = () => {
    setStep(1);

    //reset all refs
    tutorSearch.value = undefined;
    syllabi.value = undefined;
    summaries.value = [];
    selectedSources.value = [];
    courseTitle.value = '';
    level.value = '';
    duration.value = '';
    description.value = '';
    newFilesToSearch.value = {};
    searchedFiles.value = [];
    extracts.value = [];
    feedbackHistory.value = [];
    hasSearchError.value = false;
    resetCourse();
  };

  // with nothing selected, all found resources are used
  const documentsToUse = () =>
    selectedSources.value.length ? selectedSources.value : tutorSearch.value?.documents || [];

  const retrieveSyllabus = async (): Promise<boolean> => {
    const { signal } = startRequest();
    try {
      const resp = await basePostAxios(
        `/tutor/syllabus?lang=${syllabusLanguage.value}`,
        {
          ...tutorSearch.value,
          documents: documentsToUse(),
          extracts: extracts.value,
          ...(courseTitle.value && { course_title: courseTitle.value }),
          ...(level.value && { level: level.value }),
          ...(duration.value && { duration: duration.value }),
          ...(description.value && { description: description.value })
        },
        { signal }
      );

      const data = resp.data as TutorSyllabus;

      //keep only the syllabus from pedagogical engineer
      const syllabus = data.syllabus.filter(({ source }) =>
        source.toLowerCase().includes('pedagogicalengineeragent')
      )[0];
      syllabi.value = syllabus && { ...syllabus, content: cleanSyllabus(syllabus.content) };
      isLoading.value = false;
      return true;
    } catch (error) {
      if (axios.isCancel(error)) return false;
      console.error('Error during syllabus retrieval:', error);
      shouldRetryAction.value = true;
      return false;
    }
  };

  const handleCreateSyllabus = async () => {
    setStep(3);
    if (!tutorSearch.value) {
      console.error('No documents found');
      return;
    }

    if (await retrieveSyllabus()) {
      feedbackHistory.value = [];
      goNext();
    }
  };

  // true = applied, false = failed, undefined = cancelled by the user
  const giveFeedback = async (feedback: string): Promise<boolean | undefined> => {
    if (!tutorSearch.value || !syllabi.value) {
      throw new Error('Body is empty');
    }

    const { signal } = startRequest();

    try {
      const resp = await basePostAxios(
        '/tutor/syllabus/feedback',
        {
          feedback: feedback,
          syllabus: [syllabi.value],
          ...tutorSearch.value,
          // known behaviour: feedback only relies on the current syllabus and the request
          documents: selectedSources.value
        },
        { signal }
      );

      const syllabus = resp.data.syllabus[0];
      syllabi.value = { ...syllabus, content: cleanSyllabus(syllabus.content) };
      feedbackHistory.value.push(feedback);
      return true;
    } catch (error) {
      if (axios.isCancel(error)) return undefined;
      console.error('Error during feedback submission:', error);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const handleDownloadSyllabus = async () => {
    if (!syllabi.value || !syllabi.value.content) {
      console.error('No syllabi available for download');
      return;
    }
    const docxContent = await convertMarkdownToDocx(syllabi.value.content);
    downloadDocx(docxContent, 'syllabus.docx');
    try {
      await basePostAxios('/metric/syllabus_downloaded');
    } catch (error) {
      console.error('Error during metrics update:', error);
    }
  };

  const updateSyllabusInDB = async () => {
    if (!syllabi.value || !syllabi.value.content) {
      console.error('No syllabi available for download');
      return;
    }

    try {
      await basePostAxios('/tutor/syllabus/user_update', {
        syllabus: syllabi.value.content
      });
    } catch (error) {
      console.error('Error during syllabus update:', error);
    }
  };

  return {
    path,
    syllabusFile,
    syllabusFileName,
    toDraft,
    fromDraft,
    teachingContext,
    prefilled,
    hasStartedCourse,
    choosePath,
    setSyllabusFile,
    removeSyllabusFile,
    updateContext,
    unmarkPrefilled,
    resetCourse,
    detectedType,
    courseDescription,
    courseSummary,
    setSummary,
    restoreSummary,
    courseObjectives,
    courseOnlyObjectives,
    documentText,
    contextEvidence,
    removedDescription,
    removeDescription,
    bringBackDescription,
    courseCompetencies,
    confirmedCourse,
    courseToUpdate,
    coursePlaces,
    courseParts,
    courseTopics,
    coursePlan,
    setCoursePlan,
    isReadingPartial,
    aiFilled,
    aiSuggested,
    readingPhase,
    uploadProgress,
    readingStartedAt,
    readError,
    cancelReading,
    addTopic,
    removeTopic,
    saveTopics,
    readSyllabus,
    setDescription,
    restoreDescription,
    setObjective,
    restoreObjective,
    addObjective,
    removeObjective,
    setGroup,
    syllabusLanguage,
    selectSyllabusLanguage,
    step,
    goNext,
    confirmations,
    confirmCourse,
    setStep,
    syllabi,
    addFiles,
    removeFile,
    fileError,
    restart,
    reloadError,
    retrieveTutorSearch,
    tutorSearch,
    appendSource,
    retrieveSyllabus,
    updateSummary,
    handleCreateSyllabus,
    hasSearchError,
    isLoading,
    searchedFiles,
    giveFeedback,
    feedbackHistory,
    handleDownloadSyllabus,
    courseTitle,
    selectedSources,
    level,
    duration,
    shouldRetryAction,
    description,
    handleSummaryFiles,
    summaries,
    newFilesToSearch,
    stopAction,
    updateSyllabus,
    updateSyllabusInDB
  };
});
