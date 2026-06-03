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

  data.value = response.data;

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

const tabs = [
  {
    label: '📚 Objectives',
    value: 'objectives'
  },
  {
    label: '🌍 Sustainability',
    value: 'sustainability'
  },
  {
    label: '🎯 Outcomes',
    value: 'outcomes'
  },
  {
    label: '💡 Competencies',
    value: 'competencies'
  },
  {
    label: '✅ Validation',
    value: 'validation'
  }
];

const data = ref(undefined) as any; // to avoid TS errors, will be passed as prop in the actual use case

const activeTab = ref('objectives');

const openAccordions = ref({});

// const editedObjectivesText = ref(
//   data.value.objectives.objectives.map((obj) => `${obj.number}. ${obj.text}`).join('\n')
// );

// const editedOutcomesText = ref(
//   data.value.outcomes.outcomes.map((out) => `${out.number}. ${out.text}`).join('\n')
// );
const editedObjectivesText = ref('');
const editedOutcomesText = ref('');
const feedbackText = ref('');

const toggleAccordion = (key) => {
  openAccordions.value[key] = !openAccordions.value[key];
};

const isOriginalObjective = (text) => {
  return props.originalObjectives.includes(text);
};

const getConnection = (objectiveNumber) => {
  return data.sustainability.connections.find((c) => c.objective_number === objectiveNumber);
};

const findDocument = (resourceRef) => {
  return data.sustainability.resources_used?.find((doc) => doc.reference === resourceRef);
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

    <button class="button is-secondary" @click="handleGenerateSyllabus">Generate Syllabus</button>

    <div class="framework-tabs" v-if="data">
      <!-- Tabs -->
      <div class="tabs-header">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          :class="['tab-btn', activeTab === tab.value ? 'active' : '']"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- OBJECTIVES -->
      <div v-if="activeTab === 'objectives'" class="tab-content">
        <h2>Learning Objectives</h2>

        <div v-if="originalObjectives.length" class="info-box">
          <strong>Note:</strong>
          Objectives in <strong>bold</strong> are your original objectives.
        </div>

        <div v-for="obj in data.objectives.objectives" :key="obj.number" class="accordion">
          <div class="accordion-header" @click="toggleAccordion(`objective-${obj.number}`)">
            <div>
              <strong v-if="isOriginalObjective(obj.text)">
                📚 {{ obj.number }}. {{ obj.text }}
              </strong>

              <span v-else> 📚 {{ obj.number }}. {{ obj.text }} </span>
            </div>

            <span>
              {{ openAccordions[`objective-${obj.number}`] ? '−' : '+' }}
            </span>
          </div>

          <div v-if="openAccordions[`objective-${obj.number}`]" class="accordion-content">
            <template v-if="getConnection(obj.number)">
              <h3>🌍 Sustainability Integration</h3>

              <p>
                <strong>SDG Themes:</strong>
                {{ getConnection(obj.number).sdg_themes.join(', ') }}
              </p>

              <p>
                <strong>Connection:</strong>
                {{ getConnection(obj.number).connection_explanation }}
              </p>

              <div v-if="getConnection(obj.number).key_resources?.length">
                <h4>📚 Resources Used</h4>

                <div
                  v-for="resourceRef in getConnection(obj.number).key_resources"
                  :key="resourceRef"
                  class="resource-item"
                >
                  <template v-if="findDocument(resourceRef)">
                    <a
                      v-if="findDocument(resourceRef).url"
                      :href="findDocument(resourceRef).url"
                      target="_blank"
                    >
                      {{
                        findDocument(resourceRef).metadata?.document_title ||
                        findDocument(resourceRef).text?.slice(0, 50)
                      }}
                    </a>

                    <span v-else>
                      {{
                        findDocument(resourceRef).metadata?.document_title ||
                        findDocument(resourceRef).text?.slice(0, 50)
                      }}
                    </span>

                    <small>
                      This resource provides examples and evidence for sustainability integration.
                    </small>
                  </template>

                  <span v-else>{{ resourceRef }}</span>
                </div>
              </div>
            </template>

            <div v-else class="info-box">No sustainability integration available yet.</div>
          </div>
        </div>

        <!-- Edit objectives -->
        <div class="editor-section">
          <label>
            <strong>Edit all objectives:</strong>
          </label>

          <textarea v-model="editedObjectivesText" rows="10" class="textarea" />
        </div>
      </div>

      <!-- SUSTAINABILITY -->
      <div v-if="activeTab === 'sustainability'" class="tab-content">
        <h2>Sustainability Integration</h2>

        <div
          v-for="conn in data.sustainability.connections"
          :key="conn.objective_number"
          class="accordion"
        >
          <div
            class="accordion-header"
            @click="toggleAccordion(`sustain-${conn.objective_number}`)"
          >
            <div>🎯 Objective {{ conn.objective_number }}</div>

            <span>
              {{ openAccordions[`sustain-${conn.objective_number}`] ? '−' : '+' }}
            </span>
          </div>

          <div v-if="openAccordions[`sustain-${conn.objective_number}`]" class="accordion-content">
            <p>
              <strong>SDG Themes:</strong>
              {{ conn.sdg_themes.join(', ') }}
            </p>

            <p>
              <strong>Connection:</strong>
              {{ conn.connection_explanation }}
            </p>

            <div v-if="conn.key_resources?.length">
              <h4>📚 Sources Used</h4>

              <div
                v-for="resourceRef in conn.key_resources"
                :key="resourceRef"
                class="resource-item"
              >
                <template v-if="findDocument(resourceRef)">
                  <a
                    v-if="findDocument(resourceRef).url"
                    :href="findDocument(resourceRef).url"
                    target="_blank"
                  >
                    {{
                      findDocument(resourceRef).metadata?.title ||
                      findDocument(resourceRef).text?.slice(0, 50)
                    }}
                  </a>

                  <span v-else>
                    {{
                      findDocument(resourceRef).metadata?.title ||
                      findDocument(resourceRef).text?.slice(0, 50)
                    }}
                  </span>

                  <small>
                    Author:
                    {{ findDocument(resourceRef).metadata?.author || 'N/A' }}
                  </small>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- OUTCOMES -->
      <div v-if="activeTab === 'outcomes'" class="tab-content">
        <h2>Learning Outcomes</h2>

        <textarea v-model="editedOutcomesText" rows="12" class="textarea" />
      </div>

      <!-- COMPETENCIES -->
      <div v-if="activeTab === 'competencies'" class="tab-content">
        <h2>GreenComp Competencies</h2>

        <div
          v-for="mapping in data.competencies.mappings"
          :key="mapping.outcome_number"
          class="card"
        >
          <h3>Outcome {{ mapping.outcome_number }}</h3>

          <p>• {{ mapping.greencomp_competencies.join(', ') }}</p>

          <small>{{ mapping.rationale }}</small>
        </div>
      </div>

      <!-- VALIDATION -->
      <div v-if="activeTab === 'validation'" class="tab-content">
        <h2>Pedagogical Validation</h2>

        <div v-if="data.validation.passed" class="success-box">✅ Framework passed validation</div>

        <div v-else class="warning-box">
          ⚠️ Validation completed with some issues ({{ data.validation.severity }})
        </div>

        <!-- Major Issues -->
        <div v-if="data.validation.major_issues?.length">
          <h3>🔴 Major Issues</h3>

          <div v-for="issue in data.validation.major_issues" :key="issue.description" class="card">
            <p>
              <strong>{{ issue.description }}</strong>
            </p>

            <p v-if="issue.fix_applied">
              Fix applied:
              {{ issue.fix_applied }}
            </p>
          </div>
        </div>

        <!-- Minor Issues -->
        <div v-if="data.validation.minor_issues?.length">
          <h3>🟡 Minor Issues</h3>

          <div v-for="issue in data.validation.minor_issues" :key="issue.description" class="card">
            <p>
              <strong>{{ issue.description }}</strong>
            </p>

            <p v-if="issue.fix_applied">
              Fix applied:
              {{ issue.fix_applied }}
            </p>
          </div>
        </div>

        <!-- Suggestions -->
        <div v-if="data.validation.suggestions?.length">
          <h3>💡 Suggestions</h3>

          <div v-for="suggestion in data.validation.suggestions" :key="suggestion" class="info-box">
            {{ suggestion }}
          </div>
        </div>
      </div>

      <!-- FEEDBACK -->
      <div class="feedback-section">
        <h2>💬 Provide Feedback</h2>

        <textarea
          v-model="feedbackText"
          rows="5"
          class="textarea"
          placeholder="Describe what you'd like to change..."
        />
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.framework-tabs {
  padding: 1rem;
}

.info-box,
.success-box,
.warning-box {
  padding: 1rem;
  border-radius: 10px;
  margin: 1rem 0;
}

.info-box {
  background: #eef5ff;
}

.success-box {
  background: #e9f9ee;
}

.warning-box {
  background: #fff5e6;
}

.resource-item {
  margin: 1rem 0;
}

.resource-item small {
  display: block;
  color: #666;
  margin-top: 0.3rem;
}

.editor-section,
.feedback-section {
  margin-top: 2rem;
}

.competency-card {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.caption {
  color: #777;
  margin-bottom: 1rem;
}

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
