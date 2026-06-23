<script lang="ts" setup>
// TODO:
/*
make sure its responsive
check syllabus data
check references
*/

import { basePostAxios } from '@/utils/fetch';
import { ref, type Ref } from 'vue';
import SourcesList from '@/components/tutor/SecondStep.vue';
import { type CourseMetadata, type Document, type SyllabusData } from '@/types';
import UserInputMas from '@/components/MAS_tutor/userInputMas.vue';
import FeaturePresentation from '@/components/MAS_tutor/featurePresentation.vue';
import { scrollToAnchor } from '@/utils/navigation';
import UserDataDisplay from '@/components/MAS_tutor/UserDataDisplay.vue';
import SyllabusMas from '@/components/MAS_tutor/SyllabusMas.vue';
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import { saveToStorage } from '@/utils/storage';

const mode: Ref<'1' | '2' | '3' | '4'> = ref('1');
const isLoading: Ref<boolean> = ref(false);
const summaries: Ref<string[]> = ref([]);
const newFilesToSearch: Ref<Record<string, File>> = ref({});
const searchResults: Ref<Document[]> = ref([]);
const docsToSend: Ref<Record<string, string>[]> = ref([]);

const createSyllabusStepsId = {
  inittial: 'initial',
  userData: 'userData',
  searchResults: 'searchResults',
  syllabus: 'syllabus'
};

const activeStep: Ref<string> = ref(createSyllabusStepsId.inittial);

const checkNextStep = () => {
  switch (activeStep.value) {
    case createSyllabusStepsId.inittial:
      activeStep.value = createSyllabusStepsId.userData;
      break;
    case createSyllabusStepsId.userData:
      if (summaries.value.length > 0) {
        activeStep.value = createSyllabusStepsId.searchResults;
      } else {
        activeStep.value = createSyllabusStepsId.syllabus;
      }
      break;
    case createSyllabusStepsId.searchResults:
      if (searchResults.value.length > 0) {
        activeStep.value = createSyllabusStepsId.syllabus;
      }
      break;
    default:
      break;
  }
};

const nextAction = async () => {
  checkNextStep();
  switch (activeStep.value) {
    case createSyllabusStepsId.searchResults:
      isLoading.value = true;
      await handdleSearch();
      isLoading.value = false;
      break;
    case createSyllabusStepsId.syllabus:
      isLoading.value = true;
      await handleGenerateSyllabus();
      isLoading.value = false;
      break;
    default:
      break;
  }
};

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

const setCourseMetadata = async (args: CourseMetadata): Promise<void> => {
  courseMetadaRef.value = { ...args };
  hasUserInputData.value = true;

  saveToStorage('courseMetadaRef', courseMetadaRef.value);
  scrollToAnchor('target-2');
  if (courseMetadaRef.value.syllabus_mode === 'two') {
    if (filesRef.value.length === 0) {
      window.alert('Please upload a syllabus file before proceeding.');
      return;
    }

    await getFilesContent();
  }
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
    const resp = await basePostAxios(`/tutor/files/content?lang=fr}`, formData, {
      headers: { 'content-type': 'multipart/form-data' }
    });
    if (resp.status === 204) {
      throw new Error('retry getFilesContent');
    } else {
      const red_summaries = resp.data.extracts.reduce(
        (acc: string[], curr: { summary: string }) => {
          acc = [...acc, curr.summary];
          return acc;
        },
        []
      );
      summaries.value = red_summaries;
    }
  } catch (error: any) {
    throw new Error(error);
  }
};

const addFile = (e: any, input_id: string) => {
  console.log('addFile', e, input_id);
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

const handdleSearch = async () => {
  // Logic to search for relevant documents
  const response = await basePostAxios('/tutor/search_extracts', {
    summaries: [summaries.value[0]]
  });

  const docs = response.data.documents.map((doc) => ({
    metadata: courseMetadaRef.value,
    text: doc.payload.slice_content,
    relevance_score: doc.score
  }));

  scrollToAnchor(`target-${3}`);

  docsToSend.value = docs;

  searchResults.value = response.data.documents;
};

const syllabus: Ref<SyllabusData | undefined> = ref(undefined);

const handleGenerateSyllabus = async () => {
  const payload = {
    provided_description: courseMetadaRef.value.user_description,
    rag_resources: docsToSend.value,
    course_metadata: courseMetadaRef.value,
    mode: mode.value,
    provided_objectives: undefined
  };
  // Logic to generate syllabus
  const response = await basePostAxios('/tutor/api/generate', payload);

  syllabus.value = response.data;
  console.log('Generated syllabus:');
};
</script>

<template>
  <div class="test-mas">
    <LoadingOverlay v-if="isLoading" />
    <div class="side-form">
      <UserInputMas @submit="setCourseMetadata" :fileHandler="addFile" :action="nextAction" />
    </div>

    <div class="body">
      <FeaturePresentation :id_number="0" />

      <UserDataDisplay
        :courseMetadaRef="courseMetadaRef"
        :summaries="summaries"
        :filesRef="filesRef"
        :hasUserInputData="hasUserInputData"
        :nextAction="nextAction"
        :updateSummary="updateSummary"
      />

      <SourcesList
        :id_number="3"
        v-if="searchResults.length > 0"
        data-test="second-step"
        :sources="searchResults"
        actionText="genSyllabus"
        :appendSource="(arg: Document) => {}"
        :selectedSources="[]"
        :action="nextAction"
      />

      <SyllabusMas :syllabusData="syllabus" />
    </div>
  </div>
</template>

<style lang="css" scoped>
.test-mas {
  display: flex;
  width: 100%;
  height: 100%;
}

.side-form {
  flex: 1;
  height: 100%;
  min-width: 350px;
  border-right: 1px solid var(--neutral-50);
  margin: 0 2rem;
  padding-top: 0.5rem;
  overflow-y: hidden;
}

.body {
  flex: 4;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  height: 100%;
  overflow-y: auto;
  padding: 2rem;
}
</style>
