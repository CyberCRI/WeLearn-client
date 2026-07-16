import { defineStore } from 'pinia';
import { basePostAxios } from '@/utils/fetch';
import { computed, ref, type Ref } from 'vue';
import { type CourseMetadata, type Document, type SyllabusData } from '@/types';
import { scrollToAnchor } from '@/utils/navigation';
import { saveToStorage } from '@/utils/storage';
import type { AxiosResponse } from 'axios';

interface MAS_FILES {
  detected_document_type: string;
  confidence: number;

  summary?: string;
  description?: string;
  objectives: string[];

  reasoning?: string;
}

export const useMAsTutorStore = defineStore('masTutor', () => {
  const mode: Ref<'1' | '2' | '3' | '4'> = ref('1');
  const isLoading: Ref<boolean> = ref(false);
  const summaries: Ref<string[]> = ref([]);
  const newFilesToSearch: Ref<Record<string, File>> = ref({});
  const searchResults: Ref<Document[]> = ref([]);
  const summaryData: Ref<MAS_FILES | undefined> = ref(undefined);

  const courseMetadaRef: Ref<CourseMetadata> = ref({
    discipline: undefined,
    topic: undefined,
    level: undefined,
    num_sessions: undefined,
    session_duration: undefined,
    user_description: undefined,
    session_type: undefined,
    class_size: undefined,
    session_mode: undefined,
    output_language: undefined,
    syllabus_mode: undefined
  });

  const filesRef: Ref<File[]> = ref([]);
  const hasUserInputData: Ref<boolean> = ref(false);
  const selectedSources: Ref<Document[]> = ref([]);

  const hasSummaries = computed(() => summaries.value.length);

  const setCourseMetadata = async (args: CourseMetadata): Promise<void> => {
    courseMetadaRef.value = { ...args };
    hasUserInputData.value = true;

    saveToStorage('courseMetadaRef', courseMetadaRef.value);
    if (courseMetadaRef.value.syllabus_mode !== 'one') {
      if (filesRef.value.length === 0) {
        window.alert('Please upload a syllabus file before proceeding.');
        return;
      }
      isLoading.value = true;

      await getFilesContent();
    }

    scrollToAnchor('target-2');
    isLoading.value = false;
  };

  const getFilesContent = async () => {
    const files = Object.values(newFilesToSearch.value).filter((e) => e);

    const formData = new FormData();
    files.forEach((file) => {
      if (file) {
        formData.append('files', file);
        filesRef.value.push(file);
      }
    });
    try {
      const resp: AxiosResponse<MAS_FILES, any, {}> = await basePostAxios(
        `/tutor/mas_files/content?lang=${courseMetadaRef.value.output_language}&mode=${courseMetadaRef.value.syllabus_mode}`,
        formData,
        {
          headers: { 'content-type': 'multipart/form-data' }
        }
      );
      if (resp.status === 204) {
        throw new Error('retry getFilesContent');
      } else {
        const data = resp.data;
        summaryData.value = data;
        if (data.summary) {
          summaries.value = [data.summary];
        }

        if (data.description) {
          summaries.value = [data.description];

          if (data.objectives) {
            summaries.value.push(`Objectives: ${data.objectives.join('; ')}`);
          }
        }
      }
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const addFile = (e: any, input_id: string) => {
    const targetFile = e.target.files[0];

    newFilesToSearch.value = {
      ...newFilesToSearch.value,
      [input_id]: targetFile
    };
    filesRef.value.push(targetFile);
  };

  const updateSummary = (index: number, content: string) => {
    summaries.value[index] = content;
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

  const handleSearch = async () => {
    // Logic to search for relevant documents
    const response = await basePostAxios('/tutor/search_extracts', {
      summaries: summaries.value
    });

    scrollToAnchor('target-3');

    searchResults.value = response.data.documents;
  };

  const syllabus: Ref<SyllabusData | undefined> = ref(undefined);

  const transformDocsToSend = () => {
    const docsToSend = selectedSources.value.length ? selectedSources.value : searchResults.value;

    const docs = docsToSend.map((doc) => ({
      title: doc.payload.document_title,
      url: doc.payload.document_url,
      sdg: doc.payload.document_sdg,
      corpus: doc.payload.document_corpus,
      description: doc.payload.document_desc,
      text: doc.payload.slice_content,
      relevance_score: doc.score
    }));

    return docs;
  };

  const handleGenerateSyllabus = async () => {
    const payload = {
      provided_description: courseMetadaRef.value.user_description,
      rag_resources: transformDocsToSend(),
      course_metadata: courseMetadaRef.value,
      mode: mode.value,
      provided_objectives: undefined,
      context: summaryData.value
    };
    // Logic to generate syllabus
    const response = await basePostAxios('/tutor/api/generate', payload);
    scrollToAnchor('target-4');

    syllabus.value = response.data;
  };

  const stepToActionMap = {
    search: handleSearch,
    syllabus: handleGenerateSyllabus
  };

  const handleActionFromStep = async (action: () => Promise<void>) => {
    isLoading.value = true;
    await action();

    isLoading.value = false;
  };

  return {
    stepToActionMap,
    mode,
    isLoading,
    summaries,
    newFilesToSearch,
    searchResults,
    courseMetadaRef,
    filesRef,
    hasUserInputData,
    syllabus,
    setCourseMetadata,
    addFile,
    updateSummary,
    handleActionFromStep,
    hasSummaries,
    appendSource,
    selectedSources
  };
});
