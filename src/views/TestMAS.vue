<script lang="ts" setup>
import { postAxios } from '@/utils/fetch';
import { ref, type Ref } from 'vue';
import SourcesList from '@/components/tutor/SecondStep.vue';
import { type Document } from '@/types';

const course_title = 'Psychology';
const discipline = 'Psychology';
const level = 'master';
const duration = '6 months';
const course_description =
  'This course provides an in-depth understanding of psychological theories and practices.';

const description: Ref<string> = ref('');
const sustainability_map: Ref<Record<string, string>> = ref({});
const outcomes: Ref<Record<string, string>[]> = ref([]);
const extracts: Ref<string[]> = ref([
  {
    summary:
      "Le féminisme désigne un ensemble de mouvements et d'idéologies sociopolitiques visant à instaurer l'égalité politique, économique, personnelle et sociale entre les sexes. Il part du principe que les sociétés modernes sont patriarcales et que les femmes y subissent des injustices. Depuis la fin du XVIIIᵉ siècle, les luttes féministes ont obtenu le droit de vote, l'accès à l'éducation, le travail, l'égalité salariale, la propriété, le droit à la contraception, à l'avortement et à la protection contre les violences sexuelles. Le féminisme s’est diversifié en plusieurs courants (libéral, socialiste, radical, intersectionnel, etc.) et a suscité des critiques quant à la prise en compte exclusive de perspectives blanches, hétérosexuelles et de classe moyenne, menant à la création de formes plus inclusives comme le féminisme noir et intersectionnel.",
    themes: [
      {
        theme: 'Égalité des sexes et lutte contre le patriarcat',
        reason:
          "Le texte souligne que le féminisme vise à établir l'égalité entre hommes et femmes et critique la domination masculine dans les sociétés modernes."
      },
      {
        theme: 'Droits et libertés des femmes',
        reason:
          'Il détaille les conquêtes historiques du féminisme : droit de vote, éducation, travail, salaire égal, propriété, contraception, avortement et protection contre les violences.'
      },
      {
        theme: 'Évolution et diversité des courants féministes',
        reason:
          'Le passage décrit les différentes vagues (première, deuxième, etc.) et les courants (libéral, socialiste, radical) ainsi que les nouvelles formes comme le féminisme intersectionnel.'
      },
      {
        theme: 'Critiques et inclusion intersectionnelle',
        reason:
          'Le texte mentionne les critiques du féminisme blanc et la naissance de mouvements spécifiques (féminisme noir, intersectionnel) pour intégrer les perspectives raciales, de classe et de genre.'
      }
    ]
  }
]);
const newFilesToSearch: Ref<Record<string, File>> = ref({});
const learningObjectives: Ref<Record<string, string>[]> = ref([]);
const searchResults: Ref<Document[]> = ref([]);

const getFilesContent = async () => {
  const files = Object.values(newFilesToSearch.value).filter((e) => e);

  const formData = new FormData();
  files.forEach((file) => {
    if (file) {
      formData.append('files', file);
    }
  });
  try {
    const resp = await postAxios(`/tutor/files/content?lang=fr}`, formData, {
      headers: { 'content-type': 'multipart/form-data' }
    });
    if (resp.status === 204) {
      throw new Error('retry getFilesContent');
    } else {
      extracts.value = resp.data.extracts;
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
};

const handdleSearch = async () => {
  // Logic to search for relevant documents
  const response = await postAxios('/tutor/search_extracts', {
    summaries: [extracts.value[0].summary]
  });

  searchResults.value = response.data.documents;

  console.log(response.data);
};

const handleCreateDescription = async () => {
  // Logic to create a course description
  const response = await postAxios('/tutor/syllabus/description', {
    course_title,
    discipline,
    level,
    duration,
    description: course_description,
    nb_results: 5,
    documents: searchResults.value,
    extracts: extracts.value
  });
  description.value = response.data.syllabus[0].content;
};

const handleCreateLearningObjectives = async () => {
  // Logic to create learning objectives
  const response = await postAxios('/tutor/syllabus/learning_objectives', {
    course_title,
    discipline,
    level,
    duration,
    nb_results: 5,
    documents: [],
    description: description.value,
    extracts: extracts.value
  });

  learningObjectives.value = response.data;

  console.log(response.data);
};

const handleIntegrateSustainability = async () => {
  // Logic to integrate sustainability
  const response = await postAxios('/tutor/syllabus/sustainability_integration', {
    body: {
      course_title,
      discipline,
      level,
      duration,
      nb_results: 5,
      documents: searchResults.value,
      description: description.value,
      extracts: extracts.value
    },
    objectives: learningObjectives.value
  });

  sustainability_map.value = response.data.sustainability_map;

  console.log(response.data);
};

const handleCreateLearningOutcomes = async () => {
  // Logic to create learning outcomes
  const response = await postAxios('/tutor/syllabus/learning_outcomes', {
    body: {
      course_title,
      discipline,
      level,
      duration,
      nb_results: 5,
      documents: searchResults.value,
      description: description.value,
      extracts: extracts.value
    },
    objectives: learningObjectives.value,
    sustainability_map: sustainability_map.value
  });

  outcomes.value = response.data.learning_outcomes;

  console.log(response.data);
};

const handleCompetencyMapping = async () => {
  // Logic to create learning outcomes
  const response = await postAxios('/tutor/syllabus/competency_map', {
    body: {
      course_title,
      discipline,
      level,
      duration,
      nb_results: 5,
      documents: searchResults.value,
      description: description.value,
      extracts: extracts.value
    },
    outcomes: outcomes.value
  });

  console.log(response.data);
};
</script>

<template>
  <div class="test-mas">
    <h1>Test MAS</h1>
    <p>This is a test page for the MAS component.</p>
    <input
      ref="fileInputRef"
      class="input"
      type="file"
      accept="application/pdf, text/plain, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      placeholder="Enter the new file"
      data-testid="file-input"
      @change="(e) => addFile(e, 'file_0')"
    />
    <button class="button is-primary" @click="getFilesContent">Get Files Content</button>
    <button class="button is-secondary" @click="handdleSearch">search</button>
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
    <p v-if="extracts.length > 0" v-for="extract in extracts" :key="extract">
      Extracts: {{ extract.summary }}
    </p>
    <SourcesList
      v-if="searchResults.length > 0"
      data-test="second-step"
      :sources="searchResults"
      actionText="genSyllabus"
      :appendSource="(arg: Document) => {}"
      :selectedSources="[]"
      :action="() => {}"
    />
    <p v-if="description" class="mt-4">Course Description: {{ description }}</p>
    <ol v-if="learningObjectives.length > 0" class="mt-4">
      <li class="my-2" :key="obj.number" v-for="obj in learningObjectives">
        <p>objective : {{ obj.text }}</p>
        <p>bloom level: {{ obj.bloom_level }}</p>
      </li>
    </ol>
  </div>
</template>
