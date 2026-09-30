import { defineStore } from 'pinia';
import axios from 'axios';
import { convertMarkdownToDocx, downloadDocx } from '@/utils/md-to-docx';
import _isequal from 'lodash.isequal';
import { type Ref, ref } from 'vue';
import { type Document, type TutorSearch, type TutorSyllabus } from '@/types';
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
    fileError.value = { state: false, reason: null };
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
