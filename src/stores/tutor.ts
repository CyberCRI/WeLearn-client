import { defineStore } from 'pinia';
import { convertMarkdownToDocx, downloadDocx } from '@/utils/md-to-docx';
import _isequal from 'lodash.isequal';
import { type Ref, ref } from 'vue';
import { type TutorSearch, type TutorSyllabus } from '@/types';
import { postAxios } from '@/utils/fetch';
import i18n from '@/localisation/i18n';

export const useTutorStore = defineStore('tutor', () => {
  const tutorSearch: Ref<TutorSearch | null> = ref(null);
  const syllabi: Ref<{ content: string; source: string } | null> = ref(null);
  const newFilesToSearch = ref({});
  const searchedFiles: Ref<File[]> = ref([]);
  const isLoading: Ref<boolean> = ref(false);
  const step: Ref<number> = ref(1);
  const hasNewSearch: Ref<boolean> = ref(false);

  const goBack = () => (step.value = step.value - 1);
  const goNext = () => (step.value = step.value + 1);
  const setStep = (newStep: number) => (step.value = newStep);

  // ERROR STATES
  const hasSearchError: Ref<boolean> = ref(false);
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
      !(targetFile.type === 'application/pdf' || targetFile.type.startsWith('text/'))
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

  const retrieveTutorSearch = async (arg: File[]): Promise<TutorSearch> => {
    isLoading.value = true;
    const formData = new FormData();
    arg.forEach((file) => {
      if (file) {
        formData.append('files', file);
      }
    });

    try {
      const resp = await postAxios('/tutor/search', formData, {
        headers: { 'content-type': 'multipart/form-data' }
      });
      tutorSearch.value = resp.data;
      hasSearchError.value = false;
    } catch (error) {
      console.error('Error during tutor search:', error);
      hasSearchError.value = true;
    } finally {
      searchedFiles.value = arg;
      isLoading.value = false;
    }
  };

  const handleSearch = async () => {
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

    tutorSearch.value = null;
    await retrieveTutorSearch(arg);
    hasNewSearch.value = true;

    goNext();
  };

  const retrieveSyllabus = async (): Promise<TutorSyllabus> => {
    if (!tutorSearch.value) {
      throw new Error('Body is empty');
    }
    isLoading.value = true;
    try {
      const resp = await postAxios(`/tutor/syllabus?lang=${i18n.global.locale.value}`, {
        ...tutorSearch.value
      });

      //keep only the syllabus from pedagogical engineer
      syllabi.value = resp.data.syllabus.filter(({ source }) =>
        source.toLowerCase().includes('pedagogicalengineer')
      )[0];
      hasSyllabusError.value = false;
    } catch (error) {
      console.error('Error during syllabus retrieval:', error);
      hasSyllabusError.value = true;
    } finally {
      isLoading.value = false;
    }
  };

  const handleCreateSyllabus = async () => {
    if (!tutorSearch.value || !tutorSearch.value.documents.length) {
      console.error('No documents found');
      return;
    }

    if (!hasNewSearch.value) {
      goNext();
      return;
    }

    await retrieveSyllabus();
    hasNewSearch.value = false;
    goNext();
  };

  const giveFeedback = async (feedback: string): Promise<TutorSyllabus> => {
    if (!tutorSearch.value || !syllabi.value) {
      throw new Error('Body is empty');
    }

    isLoading.value = true;

    try {
      const resp = await postAxios('/tutor/syllabus/feedback', {
        feedback: feedback,
        syllabus: [syllabi.value],
        ...tutorSearch.value
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
    const docxContent = await convertMarkdownToDocx(syllabi.value);
    downloadDocx(docxContent, 'syllabus.docx');
  };

  return {
    step,
    goBack,
    goNext,
    setStep,
    syllabi,
    addFile,
    removeFile,
    fileError,
    handleSearch,
    retrieveTutorSearch,
    tutorSearch,
    retrieveSyllabus,
    handleCreateSyllabus,
    hasSearchError,
    hasSyllabusError,
    isLoading,
    searchedFiles,
    giveFeedback,
    handleDownloadSyllabus
  };
});
