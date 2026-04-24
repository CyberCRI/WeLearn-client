<script lang="ts" setup>
import { basePostAxios } from '@/utils/fetch';
import { ref, type Ref } from 'vue';
import SourcesList from '@/components/tutor/SecondStep.vue';
import { type Document } from '@/types';
import { text } from 'stream/consumers';

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
const docsToSend: Ref<Record<string, string>[]> = ref([]);
const competencies: Ref<Record<string, any>[]> = ref([]);

const getFilesContent = async () => {
  const files = Object.values(newFilesToSearch.value).filter((e) => e);

  const formData = new FormData();
  files.forEach((file) => {
    if (file) {
      formData.append('files', file);
    }
  });
  try {
    const resp = await basePostAxios(`/tutor/files/content?lang=fr}`, formData, {
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
  const response = await basePostAxios('/tutor/search_extracts', {
    summaries: [extracts.value[0].summary]
  });

  const docs = response.data.documents.map((doc) => ({
    metadata: {
      title: doc.payload.document_title,
      url: doc.payload.document_url,
      description: doc.payload.document_desc,
      source: doc.payload.document_corpus
    },
    text: doc.payload.slice_content,
    relevance_score: doc.score
  }));

  docsToSend.value = docs;

  searchResults.value = response.data.documents;

  console.log(response.data);
};

const handleCreateDescription = async () => {
  // Logic to create a course description
  const response = await basePostAxios('/tutor/syllabus/description', {
    course_metadata: {
      topic: course_title,
      discipline,
      level,
      num_sessions: 12,
      session_duration: 50,
      user_description: course_description,

      session_type: 'cours magistral',
      class_size: 30,
      session_mode: 'PRESENTIEL',
      output_language: 'fr'
    },
    context_text: extracts.value[0].summary,
    mode: 'new syllabus'
  });
  description.value = response.data.text;
};

const handleCreateLearningObjectives = async () => {
  // Logic to create learning objectives
  const response = await basePostAxios('/tutor/syllabus/learning_objectives', {
    course_metadata: {
      topic: course_title,
      discipline,
      level,
      num_sessions: 12,
      session_duration: 50,
      user_description: course_description,
      session_type: 'cours magistral',
      class_size: 30,
      session_mode: 'PRESENTIEL',
      output_language: 'fr'
    },
    context_text: extracts.value[0].summary,
    description: description.value,
    mode: 'new syllabus'
  });

  learningObjectives.value = response.data.objectives;

  console.log(response.data);
};

const handleIntegrateSustainability = async () => {
  const payload = {
    description: description.value,
    sdg_resources: docsToSend.value,
    course_metadata: {
      topic: course_title,
      discipline,
      level,
      num_sessions: 12,
      session_duration: 50,
      user_description: course_description,
      session_type: 'cours magistral',
      class_size: 30,
      session_mode: 'PRESENTIEL',
      output_language: 'fr'
    },
    objectives: { objectives: learningObjectives.value },
    mode: 'new syllabus'
  };

  console.log('Payload for sustainability integration:', payload);
  // Logic to integrate sustainability
  const response = await basePostAxios('/tutor/syllabus/sustainability_integration', payload);

  sustainability_map.value = response.data;

  console.log(response.data);
};

const handleCreateLearningOutcomes = async () => {
  const payload = {
    description: description.value,
    sdg_resources: docsToSend.value,
    course_metadata: {
      topic: course_title,
      discipline,
      level,
      num_sessions: 12,
      session_duration: 50,
      user_description: course_description,
      session_type: 'cours magistral',
      class_size: 30,
      session_mode: 'PRESENTIEL',
      output_language: 'fr'
    },
    objectives: { objectives: learningObjectives.value },
    mode: 'new syllabus',
    sustainability_map: sustainability_map.value
  };

  console.log('Payload for learning outcomes creation:', payload);
  // Logic to create learning outcomes
  const response = await basePostAxios('/tutor/syllabus/learning_outcomes', payload);

  outcomes.value = response.data.outcomes;

  console.log(response.data);
};

const handleCompetencyMapping = async () => {
  const payload = {
    outcomes: outcomes.value,
    output_language: 'fr'
  };
  // Logic to create learning outcomes
  const response = await basePostAxios('/tutor/syllabus/competency_map', payload);

  competencies.value = response.data.mappings;

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

    <p v-if="description" class="mt-4"></p>
    <p>----- description -----</p>
    <p>Course Description: {{ description }}</p>

    <ol v-if="learningObjectives.length > 0" class="mt-4">
      ----- learning objectives -----
      <li class="my-2" :key="obj.number" v-for="obj in learningObjectives">
        <p>objective : {{ obj.text }}</p>
        <p v-if="obj.bloom_level">bloom level: {{ obj.bloom_level }}</p>
      </li>
    </ol>

    <ol
      v-if="sustainability_map.connections && sustainability_map.connections.length > 0"
      class="mt-4"
    >
      ----- sustainability connections -----
        <li class="my-2" :key="obj.objective_number" v-for="obj in sustainability_map.connections">
          <p>explanation : {{ obj.connection_explanation }}</p>
          <li v-if="obj.sdg_themes && obj.sdg_themes.length > 0">
            ---- SDG themes -------
          <p v-for="sdg in obj.sdg_themes" :key="sdg">- {{ sdg }}</p>
        </li>
        >>>>>>>>>>>>>>>>
      </li>

      
    </ol>

    <ol v-if="outcomes.length > 0" class="mt-4">
      <li class="my-2" :key="obj.number" v-for="obj in outcomes">
        <p>outcome : {{ obj.text }}</p>
        <p>related objectives: {{ obj.related_objectives }}</p>
        <p>assessement method: {{ obj.assessment_method }}</p>
      </li>
    </ol>

    <ol v-if="competencies.length > 0" class="mt-4">
      ----- competencies mapping -----
      <li class="my-2" :key="obj.number" v-for="obj in competencies">
        <p>outcome number : {{ obj.outcome_number }}</p>
        <p>greencomp competency: {{ obj.greencomp_competencies }}</p>
        <p>rationale: {{ obj.rationale }}</p>
      </li>
    </ol>
  </div>
</template>
