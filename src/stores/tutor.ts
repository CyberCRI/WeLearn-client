import { defineStore } from 'pinia';
import { type Ref, ref } from 'vue';
import { type TutorSearch, type TutorSyllabus } from '@/types';
import { postAxios } from '@/utils/fetch';
import i18n from '@/localisation/i18n';

export const useTutorStore = defineStore('tutor', () => {
  const tutorSearch: Ref<TutorSearch | null> = ref(null);
  const syllabi: Ref<string[] | null> = ref(null);
  const newFilesToSearch = ref({});
  const searchedFiles: Ref<File[]> = ref([]);
  const isLoading: Ref<boolean> = ref(false);

  // ERROR STATE
  const hasSearchError: Ref<boolean> = ref(false);
  const hasSyllabusError: Ref<boolean> = ref(false);
  const fileError: Ref<{ state: boolean; reason: 'BIG_FILE' | 'BAD_EXTENSION' | null }> = ref({
    state: false,
    reason: null
  });

  const addFile = (e: any, input_id: str) => {
    const targetFile = e.target.files[0];

    if (targetFile && targetFile.size > 5 * 1024 * 1024) {
      fileError.value = {
        state: true,
        reason: 'BIG_FILE'
      };
      return;
    }

    if (targetFile && !['application/pdf', 'text/*'].includes(targetFile.type)) {
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
      return resp.data;
    } catch (error) {
      console.error('Error during tutor search:', error);
      hasSearchError.value = true;
    } finally {
      searchedFiles.value = arg;
      isLoading.value = false;
    }
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
      );
      hasSyllabusError.value = false;
      return syllabi.value;
    } catch (error) {
      console.error('Error during syllabus retrieval:', error);
      hasSyllabusError.value = true;
    } finally {
      isLoading.value = false;
    }
  };

  const giveFeedback = async (feedback: string): Promise<TutorSyllabus> => {
    if (!tutorSearch.value || !syllabi.value) {
      throw new Error('Body is empty');
    }

    isLoading.value = true;

    try {
      const resp = await postAxios('/tutor/syllabus/feedback', {
        feedback: feedback,
        syllabus: syllabi.value,
        ...tutorSearch.value
      });

      return resp.data.syllabus;
    } catch (error) {
      console.error('Error during feedback submission:', error);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    addFile,
    removeFile,
    fileError,
    hasSearchError,
    hasSyllabusError,
    isLoading,
    searchedFiles,
    retrieveTutorSearch,
    retrieveSyllabus,
    giveFeedback
  };
});
