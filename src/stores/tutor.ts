import { defineStore } from 'pinia';
import axios from 'axios';
import { convertMarkdownToDocx, downloadDocx } from '@/utils/md-to-docx';
import _isequal from 'lodash.isequal';
import { type Ref, ref } from 'vue';
import { type Document, type TutorSearch, type TutorSyllabus } from '@/types';
import { basePostAxios } from '@/utils/fetch';
import i18n from '@/localisation/i18n';
import { track } from '@/utils/analytics';
import { useAuthStore } from '@/stores/auth';
import { useGuestQuotaStore } from '@/stores/guestQuota';
import { clearFromStorage, getFromStorage, saveToStorage } from '@/utils/storage';

const MAX_FILES = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
// a guest's syllabus, kept through the keycloak redirect and downloaded once they are logged in
export const PENDING_SYLLABUS_KEY = 'pendingSyllabus';

// the LLM sometimes writes a literal "\n" (backslash + n): inside a table cell it
// means a line break (<br>), anywhere else a real new line
export const cleanSyllabus = (content: string) =>
  content
    .split('\n')
    .map((line) =>
      line.trim().startsWith('|') ? line.replace(/\\n/g, '<br>') : line.replace(/\\n/g, '\n')
    )
    .join('\n');

// the api may leave a slice without an id, then the document id tells sources apart
export const sourceKey = (source: Document) => source.id ?? source.payload.document_id;

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

  // ERROR STATES
  const shouldRetryAction: Ref<boolean> = ref(false);
  const hasSearchError: Ref<boolean> = ref(false);
  const reloadError: Ref<boolean> = ref(false);
  const hasDownloadError: Ref<boolean> = ref(false);
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

  // a response that comes back after the request was stopped (restart, cancel) must not
  // refill the wizard: handled like an axios cancel
  const throwIfAborted = (signal: AbortSignal) => {
    if (signal.aborted) throw new axios.CanceledError();
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
  const selectSyllabusLanguage = (lang: string) => {
    syllabusLanguage.value = lang;
    // summaries are extracted in this language, so they must be redone
    searchedFiles.value = [];
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
    throwIfAborted(signal);
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
    const startedAt = Date.now();

    try {
      const resp = await basePostAxios(
        '/tutor/search_extracts',
        { summaries: summaries.value },
        { signal }
      );
      throwIfAborted(signal);
      if (resp.status === 204) {
        shouldRetryAction.value = true;
        return;
      }
      tutorSearch.value = resp.data;
      // the selection belongs to the previous result
      selectedSources.value = [];
      hasSearchError.value = false;
      isLoading.value = false;
      setStep(3);
      track('Tutor Step Completed', {
        step: 2,
        durationMs: Date.now() - startedAt,
        sourcesCount: resp.data.documents?.length ?? 0
      });
    } catch (error: any) {
      if (axios.isCancel(error)) return;
      console.error('Error during tutor search:', error);
      track('Tutor Step Failed', { step: 2, durationMs: Date.now() - startedAt });
      hasSearchError.value = true;
      shouldRetryAction.value = true;
      if (error.code === 'ERR_NETWORK') {
        reloadError.value = true;
      }
    }
  };

  const appendSource = (source: Document) => {
    const key = sourceKey(source);
    const sourceExists = selectedSources.value.some((s) => sourceKey(s) === key);
    if (!sourceExists) {
      selectedSources.value.push(source);
    } else {
      selectedSources.value = selectedSources.value.filter((s) => sourceKey(s) !== key);
    }
  };

  // resolves true when the files did not change, so the later steps were kept as they are
  const handleSummaryFiles = async (): Promise<boolean> => {
    // a guest who used their syllabus would upload files for nothing
    if (!useGuestQuotaStore().checkQuota('syllabus')) return false;

    reloadError.value = false;
    const arg = Object.values(newFilesToSearch.value);
    if (!arg.length) {
      console.error('No files selected');
      return false;
    }

    // same files as last time: keep the summaries, resources and syllabus the user may have
    // edited, and only move on when the wizard is still on the documents step
    if (_isequal(searchedFiles.value, arg)) {
      if (step.value === 1) goNext();
      return true;
    }

    // new files: everything found from the old ones is outdated
    setStep(1);
    selectedSources.value = [];
    tutorSearch.value = undefined;
    const startedAt = Date.now();
    try {
      await getFilesContent(arg);
      searchedFiles.value = arg;
      goNext();
      track('Tutor Step Completed', {
        step: 1,
        durationMs: Date.now() - startedAt,
        filesCount: arg.length,
        fileTypes: [...new Set(arg.map((file) => file.type))],
        totalSizeKb: Math.round(arg.reduce((total, file) => total + file.size, 0) / 1024)
      });
    } catch (error) {
      if (axios.isCancel(error)) return false;
      console.error('get files content did not work', error);
      shouldRetryAction.value = true;
      track('Tutor Step Failed', { step: 1, durationMs: Date.now() - startedAt });
    }
    return false;
  };

  const restart = () => {
    // a request still running would come back and refill the wizard
    stopAction();
    reloadError.value = false;
    hasDownloadError.value = false;
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
    fileError.value = { state: false, reason: null };
  };

  const retrieveSyllabus = async (): Promise<boolean> => {
    const { signal } = startRequest();
    const startedAt = Date.now();
    try {
      const resp = await basePostAxios(
        `/tutor/syllabus?lang=${syllabusLanguage.value}`,
        {
          ...tutorSearch.value,
          // nothing selected = no WeLearn resources, only the uploaded files
          documents: selectedSources.value,
          extracts: extracts.value,
          ...(courseTitle.value && { course_title: courseTitle.value }),
          ...(level.value && { level: level.value }),
          ...(duration.value && { duration: duration.value }),
          ...(description.value && { description: description.value })
        },
        { signal }
      );
      throwIfAborted(signal);

      const data = resp.data as TutorSyllabus;

      //keep only the syllabus from pedagogical engineer
      const syllabus = data.syllabus?.find(({ source }) =>
        source.toLowerCase().includes('pedagogicalengineeragent')
      );
      // nothing to show is a failure: the user can retry and a guest keeps their syllabus
      if (!syllabus?.content) throw new Error('No syllabus in the response');
      syllabi.value = { ...syllabus, content: cleanSyllabus(syllabus.content) };
      isLoading.value = false;
      track('Tutor Step Completed', {
        step: 3,
        durationMs: Date.now() - startedAt,
        sourcesCount: selectedSources.value.length
      });
      return true;
    } catch (error) {
      if (axios.isCancel(error)) return false;
      console.error('Error during syllabus retrieval:', error);
      track('Tutor Step Failed', { step: 3, durationMs: Date.now() - startedAt });
      shouldRetryAction.value = true;
      return false;
    }
  };

  // feedback on the generated syllabus is not counted, only generating one
  const handleCreateSyllabus = async () => {
    setStep(3);
    if (!tutorSearch.value) {
      console.error('No documents found');
      return;
    }

    const guestQuota = useGuestQuotaStore();
    if (!guestQuota.checkQuota('syllabus')) return;

    if (await retrieveSyllabus()) {
      guestQuota.consume('syllabus');
      feedbackHistory.value = [];
      goNext();
    }
  };

  // true = applied, false = failed, undefined = cancelled by the user
  const giveFeedback = async (feedback: string): Promise<boolean | undefined> => {
    if (!tutorSearch.value || !syllabi.value) {
      console.error('No syllabus to give feedback on');
      return false;
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
      throwIfAborted(signal);

      const syllabus = resp.data.syllabus[0];
      syllabi.value = { ...syllabus, content: cleanSyllabus(syllabus.content) };
      feedbackHistory.value.push(feedback);
      track('Syllabus Feedback Sent', { feedbackLength: feedback.length, isApplied: true });
      return true;
    } catch (error) {
      if (axios.isCancel(error)) return undefined;
      console.error('Error during feedback submission:', error);
      track('Syllabus Feedback Sent', { feedbackLength: feedback.length, isApplied: false });
      return false;
    } finally {
      // aborted: stopAction already stopped the loading, or a newer request is running
      if (!signal.aborted) isLoading.value = false;
    }
  };

  // resolves false when the word file could not be made
  const downloadSyllabus = async (content: string): Promise<boolean> => {
    hasDownloadError.value = false;
    try {
      const docxContent = await convertMarkdownToDocx(content);
      downloadDocx(docxContent, 'syllabus.docx');
    } catch (error) {
      console.error('Error during syllabus download:', error);
      hasDownloadError.value = true;
      return false;
    }
    track('Syllabus Downloaded', {});
    try {
      await basePostAxios('/metric/syllabus_downloaded');
    } catch (error) {
      console.error('Error during metrics update:', error);
    }
    return true;
  };

  const handleDownloadSyllabus = async () => {
    if (!syllabi.value || !syllabi.value.content) {
      console.error('No syllabi available for download');
      return;
    }

    const authStore = useAuthStore();
    if (authStore.isGuest) {
      saveToStorage(PENDING_SYLLABUS_KEY, syllabi.value.content);
      authStore.askToSignUp('download');
      return;
    }

    await downloadSyllabus(syllabi.value.content);
  };

  // the wizard itself is not restored after the login (uploaded files can't be stored),
  // only the syllabus the guest asked for is downloaded
  const downloadPendingSyllabus = async () => {
    const content: unknown = getFromStorage(PENDING_SYLLABUS_KEY);
    if (useAuthStore().isGuest || typeof content !== 'string' || !content) return;

    // kept on a failure, so the next visit tries again
    if (await downloadSyllabus(content)) clearFromStorage(PENDING_SYLLABUS_KEY);
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
    syllabusLanguage,
    selectSyllabusLanguage,
    step,
    goNext,
    setStep,
    syllabi,
    addFiles,
    removeFile,
    fileError,
    restart,
    reloadError,
    hasDownloadError,
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
    downloadPendingSyllabus,
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
