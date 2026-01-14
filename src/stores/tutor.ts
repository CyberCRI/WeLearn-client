import { defineStore } from 'pinia';
import { scrollToAnchor } from '@/utils/navigation.ts';
import { convertMarkdownToDocx, downloadDocx } from '@/utils/md-to-docx';
import _isequal from 'lodash.isequal';
import { type Ref, ref } from 'vue';
import { type Document, type TutorSearch, type TutorSyllabus } from '@/types';
import { postAxios } from '@/utils/fetch';
import i18n from '@/localisation/i18n';

export const useTutorStore = defineStore('tutor', () => {
  const tutorSearch: Ref<TutorSearch | undefined> = ref(undefined);
  const syllabi: Ref<{ content: string; source: string } | undefined> = ref(undefined);
  const newFilesToSearch: Ref<Record<string, File>> = ref({});
  const searchedFiles: Ref<File[]> = ref([]);
  const isLoading: Ref<boolean> = ref(false);
  const step: Ref<number> = ref(1);
  const hasNewSearch: Ref<boolean> = ref(false);
  const level: Ref<string> = ref('');
  const duration: Ref<string> = ref('');
  const description: Ref<string> = ref('');
  const courseTitle: Ref<string> = ref('');
  const selectedSources: Ref<Document[]> = ref([]);
  const extracts: Ref<string[]> = ref([]);

  const goBack = () => (step.value = step.value - 1);
  const goNext = () => (step.value = step.value + 1);
  const setStep = (newStep: number) => (step.value = newStep);

  // ERROR STATES
  const shouldRetryAction: Ref<boolean> = ref(false);
  const hasSearchError: Ref<boolean> = ref(false);
  const reloadError: Ref<boolean> = ref(false);
  const hasSyllabusError: Ref<boolean> = ref(false);
  const fileError: Ref<{ state: boolean; reason: 'BIG_FILE' | 'BAD_EXTENSION' | null }> = ref({
    state: false,
    reason: null
  });

  const addFile = (e: any, input_id: string) => {
    const targetFile = e.target.files[0];

    if (targetFile && targetFile.size > 5 * 1024 * 1024) {
      fileError.value = {
        state: true,
        reason: 'BIG_FILE'
      };
      return;
    }

    if (
      targetFile &&
      !(
        targetFile.type === 'application/pdf' ||
        targetFile.type.startsWith('text/') ||
        targetFile.type ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      )
    ) {
      fileError.value = {
        state: true,
        reason: 'BAD_EXTENSION'
      };
      return;
    }

    newFilesToSearch.value = {
      ...newFilesToSearch.value,
      [input_id]: targetFile
    };

    fileError.value = {
      state: false,
      reason: null
    };
  };

  const removeFile = (input_id: string) => {
    if (newFilesToSearch.value[input_id]) {
      delete newFilesToSearch.value[input_id];
    }
    fileError.value = {
      state: false,
      reason: null
    };
  };

  const summaries = ref<[string]>([]);

  const updateSummary = (index: number, content: string) => {
    summaries.value[index] = content;
  };

  const updateSyllabus = (index, content) => {
    syllabi.value[index] = content;
  };

  const syllabusLanguage: Ref<string> = ref(i18n.global.locale.value);
  const selectSyllabusLanguage = (lang: string) => {
    syllabusLanguage.value = lang;
  };

  const getFilesContent = async (arg: File[]) => {
    isLoading.value = true;
    shouldRetryAction.value = false;
    const formData = new FormData();
    arg.forEach((file) => {
      if (file) {
        formData.append('files', file);
      }
    });
    try {
      const resp = await postAxios(
        `/tutor/files/content?lang=${syllabusLanguage.value}`,
        formData,
        {
          headers: { 'content-type': 'multipart/form-data' }
        }
      );
      if (resp.status === 204) {
        shouldRetryAction.value = true;
        throw new Error('retry getFilesContent');
      } else {
        extracts.value = resp.data.extracts;
        const red_summaries = resp.data.extracts.reduce(
          (acc: string[], curr: { summary: string }) => {
            acc = [...acc, curr.summary];
            return acc;
          },
          []
        );
        summaries.value = red_summaries;
        goNext();
        isLoading.value = false;
      }
    } catch (error: any) {
      shouldRetryAction.value = true;
      throw new Error(error);
    }
  };

  const stopAction = () => {
    isLoading.value = false;
  };

  const retrieveTutorSearch = async (arg: File[]) => {
    setStep(2);
    isLoading.value = true;

    try {
      const resp = await postAxios('/tutor/search_extracts', { summaries: summaries.value });
      if (resp.status === 204) {
        shouldRetryAction.value = true;
      } else {
        tutorSearch.value = resp.data;
        hasSearchError.value = false;
        isLoading.value = false;
        shouldRetryAction.value = false;

        goNext();
        scrollToAnchor('target-3');
      }
    } catch (error: any) {
      console.error('Error during tutor search:', error);
      hasSearchError.value = true;
      if (error.code === 'ERR_NETWORK') {
        reloadError.value = true;
      }
    } finally {
      setStep(3);
      searchedFiles.value = arg;
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
    const arg = Object.values(newFilesToSearch.value).filter((e) => e);
    if (!arg.length) {
      console.error('No files selected');
      return;
    }

    if (_isequal(searchedFiles.value, arg)) {
      hasNewSearch.value = false;
      goNext();
      return;
    }

    tutorSearch.value = undefined;
    try {
      await getFilesContent(arg);
      hasNewSearch.value = true;
      scrollToAnchor('target-2');
      // goNext();
    } catch (error) {
      console.log('get files content did not work');
    }
  };

  const handleSearch = async () => {
    reloadError.value = false;
    selectedSources.value = [];
    const arg = Object.values(newFilesToSearch.value).filter((e) => e);
    if (!arg.length) {
      console.error('No files selected');
      return;
    }

    if (_isequal(searchedFiles.value, arg) && !shouldRetryAction.value) {
      hasNewSearch.value = false;
      goNext();
      return;
    }

    tutorSearch.value = undefined;
    await retrieveTutorSearch(arg);
    hasNewSearch.value = true;
  };

  const restart = () => {
    setStep(1);
    scrollToAnchor('target-1');

    //reset all refs
    tutorSearch.value = undefined;
    selectedSources.value = [];
    courseTitle.value = '';
    level.value = '';
    duration.value = '';
    description.value = '';
    newFilesToSearch.value = {};
    searchedFiles.value = [];
    extracts.value = [];
  };

  const retrieveSyllabus = async () => {
    if (!tutorSearch.value) {
      throw new Error('Body is empty');
    }
    isLoading.value = true;
    try {
      const resp = await postAxios(`/tutor/syllabus?lang=${syllabusLanguage.value}`, {
        ...tutorSearch.value,
        documents: selectedSources.value,
        extracts: extracts.value,
        ...(courseTitle.value && { course_title: courseTitle.value }),
        ...(level.value && { level: level.value }),
        ...(duration.value && { duration: duration.value }),
        ...(description.value && { description: description.value })
      });

      const data = resp.data as TutorSyllabus;

      //keep only the syllabus from pedagogical engineer
      syllabi.value = data.syllabus.filter(({ source }) =>
        source.toLowerCase().includes('pedagogicalengineer')
      )[0];
      hasSyllabusError.value = false;
      scrollToAnchor('target-4');
    } catch (error) {
      console.error('Error during syllabus retrieval:', error);
      hasSyllabusError.value = true;
    } finally {
      isLoading.value = false;
    }
  };

  const handleCreateSyllabus = async () => {
    setStep(3);
    if (
      !tutorSearch.value ||
      (!tutorSearch.value.documents.length && !searchedFiles.value.length)
    ) {
      console.error('No documents found');
      return;
    }

    await retrieveSyllabus();
    hasNewSearch.value = false;
    goNext();
  };

  const giveFeedback = async (feedback: string) => {
    if (!tutorSearch.value || !syllabi.value) {
      throw new Error('Body is empty');
    }

    isLoading.value = true;

    try {
      const resp = await postAxios('/tutor/syllabus/feedback', {
        feedback: feedback,
        syllabus: [syllabi.value],
        ...tutorSearch.value,
        documents: selectedSources.value
      });

      syllabi.value = resp.data.syllabus[0];
    } catch (error) {
      console.error('Error during feedback submission:', error);
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
  };

  return {
    syllabusLanguage,
    selectSyllabusLanguage,
    step,
    goBack,
    goNext,
    setStep,
    syllabi,
    addFile,
    removeFile,
    fileError,
    restart,
    reloadError,
    handleSearch,
    retrieveTutorSearch,
    tutorSearch,
    appendSource,
    retrieveSyllabus,
    updateSummary,
    handleCreateSyllabus,
    hasSearchError,
    hasSyllabusError,
    isLoading,
    searchedFiles,
    giveFeedback,
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
    updateSyllabus
  };
});
