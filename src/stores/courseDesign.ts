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
  type SyllabusExtraction
} from '@/types';

// course design, "adapt my existing course": upload one syllabus, let the API read it, then let
// the teacher review and correct the result. everything lives in memory: nothing is saved, and
// nothing is sent after the single extraction request

// ponytail: same file rules as /tutor (stores/tutor.ts), kept separate so /tutor stays untouched
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const isAllowedType = (file: File) =>
  file.type === 'application/pdf' ||
  file.type.startsWith('text/') ||
  file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export const EXAMPLE_OBJECTIVE_KEYS = ['o1', 'o2', 'o3'] as const;

export type ReadingStatus = 'idle' | 'uploading' | 'reading' | 'ready' | 'unavailable' | 'error';
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

export const useCourseDesignStore = defineStore('courseDesign', () => {
  const file: Ref<File | null> = ref(null);
  const uploadError: Ref<UploadErrorReason | null> = ref(null);
  const language: Ref<string> = ref(i18n.global.locale.value);
  const status: Ref<ReadingStatus> = ref('idle');
  const uploadProgress = ref(0);
  const readingStartedAt: Ref<number | null> = ref(null);
  // 'upload' = read by the API from the teacher's file, 'example' = fictional demonstration,
  // 'pasted' = the teacher's own text, kept in this tab; the last two are never sent or analysed
  const source: Ref<'upload' | 'example' | 'pasted' | null> = ref(null);
  const pastedText = ref('');
  const extraction: Ref<SyllabusExtraction | null> = ref(null);

  const description: Ref<CourseField | null> = ref(null);
  const objectives: Ref<CourseField[]> = ref([]);
  const overview: Ref<Record<CourseOverviewKey, CourseField | null>> = ref(emptyOverview());
  const extras: Ref<Record<CourseExtraKey, string>> = ref(emptyExtras());
  const isConfirmed = ref(false);

  const isExample = computed(() => source.value === 'example');
  const isPasted = computed(() => source.value === 'pasted');

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

  const showCourse = (result: SyllabusExtraction) => {
    extraction.value = result;
    description.value = fromExtraction(result.description);
    objectives.value = result.objectives.map((text) => fromExtraction(text) as CourseField);
    overview.value = emptyOverview();
    extras.value = emptyExtras();
    isConfirmed.value = false;
    status.value = 'ready';
  };

  let controller: AbortController | undefined;

  const readSyllabus = async () => {
    if (!file.value) return;
    controller?.abort();
    controller = new AbortController();
    source.value = 'upload';
    uploadProgress.value = 0;
    readingStartedAt.value = null;
    status.value = 'uploading';

    const formData = new FormData();
    formData.append('files', file.value);
    try {
      const resp = await basePostAxios(
        `/tutor/mas_files/content?lang=${language.value}&mode=mode_2`,
        formData,
        {
          headers: { 'content-type': 'multipart/form-data' },
          signal: controller.signal,
          // real progress of the upload; once it is complete, the API is reading
          onUploadProgress: (event) => {
            uploadProgress.value = event.total ? Math.round((event.loaded / event.total) * 100) : 0;
            if (event.total && event.loaded >= event.total && status.value === 'uploading') {
              status.value = 'reading';
              readingStartedAt.value = Date.now();
            }
          }
        }
      );
      if (resp.status === 204 || !resp.data) {
        status.value = 'error';
        return;
      }
      showCourse(resp.data as SyllabusExtraction);
    } catch (error: any) {
      if (axios.isCancel(error)) return;
      // no answer at all (network, VPN, CORS) or the API refusing access: say it is unavailable
      const code = error?.response?.status;
      status.value =
        !error?.response || [403, 404, 502, 503, 504].includes(code) ? 'unavailable' : 'error';
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
    return { ...field, value, origin: value === field.original ? 'extracted' : 'edited' };
  };

  const updateDescription = (value: string) => {
    const text = value.trim();
    if (!description.value) {
      description.value = text ? { value: text, origin: 'added' } : null;
      return;
    }
    if (!text && description.value.origin === 'added') {
      description.value = null;
      return;
    }
    description.value = editField(description.value, text);
  };

  const restoreDescription = () => {
    if (description.value?.original) {
      description.value = editField(description.value, description.value.original);
    }
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
    if (objectives.value[index]?.origin === 'added') objectives.value.splice(index, 1);
  };

  // a syllabus often mixes degree-level goals with the course's own: the teacher marks them,
  // nothing is moved, rewritten or decided automatically, and the mark can be undone
  const toggleProgrammeObjective = (index: number) => {
    const objective = objectives.value[index];
    if (objective) objectives.value[index] = { ...objective, isProgramme: !objective.isProgramme };
  };

  // overview lines are only ever written by the teacher (the extraction does not return them)
  const setOverview = (key: CourseOverviewKey, value: string) => {
    const text = value.trim();
    overview.value[key] = text ? { value: text, origin: 'added' } : null;
  };

  const setExtra = (key: CourseExtraKey, value: string) => {
    extras.value[key] = value;
  };

  const confirmCourse = () => {
    isConfirmed.value = true;
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
    extraction.value = null;
    description.value = null;
    objectives.value = [];
    overview.value = emptyOverview();
    extras.value = emptyExtras();
    isConfirmed.value = false;
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
    extraction,
    description,
    objectives,
    overview,
    extras,
    isConfirmed,
    setFile,
    dismissProblem,
    readSyllabus,
    cancelReading,
    loadExample,
    loadPastedText,
    updateDescription,
    restoreDescription,
    updateObjective,
    restoreObjective,
    addObjective,
    removeObjective,
    toggleProgrammeObjective,
    setOverview,
    setExtra,
    confirmCourse,
    $reset
  };
});
