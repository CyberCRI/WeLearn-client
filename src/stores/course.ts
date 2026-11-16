import { defineStore } from 'pinia';
import axios from 'axios';
import { type Ref, computed, ref } from 'vue';
import i18n from '@/localisation/i18n';
import { basePostAxios } from '@/utils/fetch';
import { apiErrorCode } from '@/utils/apiErrors';
import { useGuestQuotaStore } from '@/stores/guestQuota';
import type { FileErrorReason } from '@/stores/tutor';
import type { CourseReadResponse } from '@/types';
import type { ApiResponse } from '@/types/api';

// one course document, as the API accepts it
export const MAX_COURSE_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = [
  'application/pdf',
  'text/plain',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export type CourseLanguage = 'fr' | 'en';
export type ReadingPhase = 'idle' | 'sending' | 'reading';
// unavailable: WeLearn could not be reached; emptyText: no text in the file (a scanned pdf)
export type ReadError = 'unavailable' | 'error' | 'emptyText';

// statuses that mean the API was not reached or did not answer, rather than a reading that
// failed (UNUSABLE_READING is a 502 too, told apart by its code)
const UNREACHABLE_STATUSES = [404, 502, 503, 504];

const fileKey = (file: File, lang: CourseLanguage) =>
  `${file.name}|${file.size}|${file.lastModified}|${lang}`;

// syllabus v2, "I have a course" (flag syllabusV2). kept apart from the `tutor` store, whose
// files belong to the "from scratch" path and keep working as they did
export const useCourseStore = defineStore('course', () => {
  // 1: your course, 2: review the course
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
  // the file and language `reading` comes from: the same ones are not read again
  const readKey: Ref<string | null> = ref(null);

  const isReading = computed(() => phase.value !== 'idle');
  const hasStarted = computed(() => !!file.value || !!reading.value);

  const setFile = (picked: File) => {
    readError.value = null;
    if (picked.size > MAX_COURSE_FILE_SIZE) fileError.value = 'BIG_FILE';
    else if (!ALLOWED_TYPES.includes(picked.type)) fileError.value = 'BAD_EXTENSION';
    else {
      fileError.value = null;
      file.value = picked;
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
    const status = error?.response?.status;
    return !error?.response || UNREACHABLE_STATUSES.includes(status) ? 'unavailable' : 'error';
  };

  // screen 1 → 2: WeLearn reads the course
  const readCourse = async () => {
    const picked = file.value;
    if (!picked || isReading.value) return;
    const key = fileKey(picked, language.value);
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
      reading.value = resp.data;
      readKey.value = key;
      step.value = 2;
      void guestQuota.refresh();
    } catch (error) {
      if (axios.isCancel(error) || signal.aborted) return;
      if (!guestQuota.handleQuotaError(error)) {
        console.error('Error while reading the course:', error);
        readError.value = classifyError(error);
      }
    } finally {
      if (!signal.aborted) phase.value = 'idle';
    }
  };

  // "Cancel" while WeLearn reads: back to the upload, the file kept
  const cancelReading = () => {
    controller?.abort();
    phase.value = 'idle';
    uploadProgress.value = 0;
    readingStartedAt.value = null;
  };

  const setStep = (next: number) => {
    // review needs a reading
    if (next === 1 || reading.value) step.value = next;
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
    isReading,
    hasStarted,
    setFile,
    removeFile,
    selectLanguage,
    readCourse,
    cancelReading,
    setStep,
    $reset
  };
});
