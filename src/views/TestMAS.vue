<script lang="ts" setup>
import { basePostAxios } from '@/utils/fetch';
import { ref, type Ref } from 'vue';
import SourcesList from '@/components/tutor/SecondStep.vue';
import { type Document } from '@/types';
import UserInputMas from '@/components/MAS_tutor/userInputMas.vue';
import FeaturePresentation from '@/components/MAS_tutor/featurePresentation.vue';
import SummariesStep from '@/components/tutor/SummariesStep.vue';
import { scrollToAnchor } from '@/utils/navigation';

const mode: Ref<'1' | '2' | '3' | '4'> = ref('1');

const tutorDescription: Ref<string> = ref('');
const sustainability_map: Ref<Record<string, string>> = ref({});
const outcomes: Ref<Record<string, string>[]> = ref([]);
const summaries: Ref<string[]> = ref([
  "Le féminisme désigne un ensemble de mouvements et d'idéologies sociopolitiques visant à instaurer l'égalité politique, économique, personnelle et sociale entre les sexes. Il part du principe que les sociétés modernes sont patriarcales et que les femmes y subissent des injustices. Depuis la fin du XVIIIᵉ siècle, les luttes féministes ont obtenu le droit de vote, l'accès à l'éducation, le travail, l'égalité salariale, la propriété, le droit à la contraception, à l'avortement et à la protection contre les violences sexuelles. Le féminisme s’est diversifié en plusieurs courants (libéral, socialiste, radical, intersectionnel, etc.) et a suscité des critiques quant à la prise en compte exclusive de perspectives blanches, hétérosexuelles et de classe moyenne, menant à la création de formes plus inclusives comme le féminisme noir et intersectionnel."
]);
const newFilesToSearch: Ref<Record<string, File>> = ref({});
const learningObjectives: Ref<Record<string, string>[]> = ref([]);
const searchResults: Ref<Document[]> = ref([]);
const docsToSend: Ref<Record<string, string>[]> = ref([]);
const competencies: Ref<Record<string, any>[]> = ref([]);

export interface CourseMetadata {
  topic?: string;
  discipline?: string;
  level?: string;
  num_sessions?: number;
  session_duration?: number;
  user_description?: string;
  session_type?: string;
  class_size?: number;
  session_mode?: 'in person' | 'remote' | 'hybrid';
  output_language: 'french' | 'english';
}

const courseMetadaRef: Ref<CourseMetadata> = ref({
  topic: undefined,
  discipline: undefined,
  level: undefined,
  num_sessions: undefined,
  session_duration: 1,
  user_description: undefined,
  session_type: undefined,
  class_size: undefined,
  session_mode: 'in person',
  output_language: 'french'
});

const filesRef: Ref<File[]> = ref([]);

const setCourseMetadata = (args: CourseMetadata): undefined => {
  courseMetadaRef.value = { ...args };
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
      scrollToAnchor(`target-${2 + 1}`);
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

  scrollToAnchor(`target-${3 + 1}`);

  docsToSend.value = docs;

  searchResults.value = response.data.documents;
};

const handleCreateDescription = async () => {
  // Logic to create a course description
  const response = await basePostAxios('/tutor/syllabus/description', {
    course_metadata: courseMetadaRef.value,
    context_text: summaries.value[0],
    mode: mode.value
  });
  tutorDescription.value = response.data.text;
};

const handleCreateLearningObjectives = async () => {
  // Logic to create learning objectives
  const response = await basePostAxios('/tutor/syllabus/learning_objectives', {
    course_metadata: courseMetadaRef.value,
    context_text: summaries.value[0],
    description: tutorDescription.value,
    mode: mode.value
  });

  learningObjectives.value = response.data.objectives;

  console.log(response.data);
};

const handleIntegrateSustainability = async () => {
  const payload = {
    description: tutorDescription.value,
    sdg_resources: docsToSend.value,
    course_metadata: courseMetadaRef.value,
    objectives: { objectives: learningObjectives.value },
    mode: mode.value
  };

  // Logic to integrate sustainability
  const response = await basePostAxios('/tutor/syllabus/sustainability_integration', payload);

  sustainability_map.value = response.data;

  console.log(response.data);
};

const handleCreateLearningOutcomes = async () => {
  const payload = {
    description: tutorDescription.value,
    sdg_resources: docsToSend.value,
    course_metadata: courseMetadaRef.value,
    objectives: { objectives: learningObjectives.value },
    mode: mode.value,
    sustainability_map: sustainability_map.value
  };
  // Logic to create learning outcomes
  const response = await basePostAxios('/tutor/syllabus/learning_outcomes', payload);

  outcomes.value = response.data.outcomes;

  console.log(response.data);
};

const handleCompetencyMapping = async () => {
  const payload = {
    outcomes: outcomes.value,
    output_language: courseMetadaRef.value.output_language
  };
  // Logic to create learning outcomes
  const response = await basePostAxios('/tutor/syllabus/competency_map', payload);

  competencies.value = response.data.mappings;

  console.log(response.data);
};
</script>

<template>
  <div class="test-mas">
    <FeaturePresentation :id_number="0" />
    <UserInputMas :id_number="1" @submit="setCourseMetadata" />

    <div id="target-2" class="file-section">
      <h2 class="title is-4 is-size-5-mobile">File Upload and Content Extraction</h2>
      <input
        ref="fileInputRef"
        class="input"
        type="file"
        accept="application/pdf, text/plain, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        placeholder="Enter the new file"
        data-testid="file-input"
        @change="(e) => addFile(e, 'file_0')"
      />
      <div class="action-button">
        <button class="button is-primary" @click="getFilesContent">Get Files Content</button>
      </div>
    </div>

    <SummariesStep
      :id_number="3"
      :updateSummary="updateSummary"
      :summaries="summaries"
      :files="filesRef"
      :action="handdleSearch"
      actionText="search"
    />

    <SourcesList
      :id_number="4"
      v-if="searchResults.length > 0"
      data-test="second-step"
      :sources="searchResults"
      actionText="genSyllabus"
      :appendSource="(arg: Document) => {}"
      :selectedSources="[]"
      :action="() => {}"
    />

    <button class="button is-secondary" @click="handleCreateDescription">create description</button>
    <button class="button is-tertiary" @click="handleCreateLearningObjectives">
      create learning objectives
    </button>
    <button class="button is-tertiary" @click="handleIntegrateSustainability">
      integrate sustainability
    </button>
    <button class="button is-tertiary" @click="handleCreateLearningOutcomes">
      create learning outcomes
    </button>
    <button class="button is-tertiary" @click="handleCompetencyMapping">competency mapping</button>

    <p v-if="tutorDescription" class="mt-4"></p>
    <p>----- description -----</p>
    <SummariesStep
      :id_number="3"
      :updateSummary="updateSummary"
      :summaries="tutorDescription ? [tutorDescription] : []"
      :files="filesRef"
      :action="handdleSearch"
      actionText="search"
    />

    ----- learning objectives -----
    <SummariesStep
      :id_number="3"
      :updateSummary="updateSummary"
      :summaries="learningObjectives.length > 0 ? learningObjectives : []"
      :files="filesRef"
      :action="handdleSearch"
      actionText="search"
    />

    ----- sustainability connections -----
    <SummariesStep
      v-if="sustainability_map?.connections?.length > 0"
      :id_number="3"
      :updateSummary="updateSummary"
      :summaries="sustainability_map.connections"
      :files="filesRef"
      :action="handdleSearch"
      actionText="search"
    />

    <SummariesStep
      v-if="outcomes.length > 0"
      :id_number="3"
      :updateSummary="updateSummary"
      :summaries="outcomes"
      :files="filesRef"
      :action="handdleSearch"
      actionText="search"
    />

    <SummariesStep
      v-if="competencies.length > 0"
      :id_number="3"
      :updateSummary="updateSummary"
      :summaries="competencies"
      :files="filesRef"
      :action="handdleSearch"
      actionText="search"
    />
  </div>
</template>

<style lang="css" scoped>
.test-mas {
  padding: 3rem;
}
.file-section {
  margin: 2rem 0;
  width: 100%;

  padding: 10rem 0rem;
}

.action-button {
  margin-top: 1rem;
  margin-left: auto;
  display: flex;
  justify-content: flex-end;
}
</style>
