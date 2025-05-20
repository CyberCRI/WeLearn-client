import { defineStore } from 'pinia';
import { type Ref, ref } from 'vue';
import { type Document } from '@/types';
import { postAxios } from '@/utils/fetch';
import i18n from '@/localisation/i18n';

export type TutorSearch = {
  extracts: { original_document: string; summary: string; themes: string[] }[];
  nb_results: number;
  documents: Document[];
};

type TutorSyllabus = {
  syllabus: string[];
  documents: Document[];
};

// TODO: :arrow-up: move this to types

export const useTutorStore = defineStore('tutor', () => {
  const tutorSearch: Ref<TutorSearch | null> = ref(null);
  const syllabi: Ref<string[] | null> = ref(null);

  const retrieveTutorSearch = async (arg: { string: File }): Promise<TutorSearch> => {
    const formData = new FormData();
    const files = Object.values(arg);
    files.forEach((file) => formData.append('files', file));

    const resp = await postAxios('/tutor/search', formData, {
      headers: { 'content-type': 'multipart/form-data' }
    });

    tutorSearch.value = resp.data;

    return resp.data;
  };

  const retrieveSyllabus = async (): Promise<TutorSyllabus> => {
    if (!tutorSearch.value) {
      throw new Error('Body is empty');
    }
    const resp = await postAxios(`/tutor/syllabus?lang=${i18n.global.locale.value}`, {
      ...tutorSearch.value
    });

    syllabi.value = resp.data.syllabus;
    return resp.data;
  };

  const giveFeedback = async (feedback: string): Promise<TutorSyllabus> => {
    if (!tutorSearch.value || !syllabi.value) {
      throw new Error('Body is empty');
    }

    const resp = await postAxios('/tutor/syllabus/feedback', {
      feedback: feedback,
      syllabus: [syllabi.value[2]],
      ...tutorSearch.value
    });

    return resp.data;
  };

  return { retrieveTutorSearch, retrieveSyllabus, giveFeedback };
});
