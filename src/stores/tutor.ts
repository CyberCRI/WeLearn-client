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
  syllabus: string;
  documents: Document[];
};
// TODO: :arrow-up: move this to types

export const useTutorStore = defineStore('tutor', () => {
  const tutorSearch: Ref<TutorSearch | null> = ref(null);

  const retrieveTutorSearch = async (arg: FormData): Promise<TutorSearch> => {
    const resp = await postAxios('/tutor/search', arg, {
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
    return resp.data;
  };

  return { retrieveTutorSearch, retrieveSyllabus };
});
