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
const summaries: Ref<string[]> = ref([]);
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

const data = {
  status: 'success',
  validation: {
    passed: true,
    major_issues: [],
    minor_issues: [],
    suggestions: []
  },
  description: {
    text: 'Ce cours propose une analyse critique des constructions psychologiques du genre à la lumière des problématiques de durabilité sociale et environnementale. À travers dix séances magistrales, les étudiantes et étudiants exploreront les fondements théoriques des approches psychanalytiques, cognitivo‑comportementales et socioculturelles du genre, puis les mettront en relation avec les enjeux de justice climatique, d’équité intergénérationnelle et de résilience communautaire. Les travaux porteront sur la manière dont les stéréotypes sexistes influencent les comportements de consommation, les trajectoires professionnelles et les réponses au stress lié aux changements climatiques. En s’appuyant sur des études de cas empiriques et des données longitudinales, les participants apprendront à concevoir des protocoles de recherche sensibles au genre et à évaluer l’impact psychologique des politiques de développement durable. Le cours souligne l’importance d’une perspective intersectionnelle pour appréhender les effets cumulatifs de la discrimination de genre et des vulnérabilités environnementales. À l’issue du module, les étudiantes et étudiants seront capables de produire des analyses rigoureuses, d’articuler des recommandations psychologiques éthiques et de contribuer à des projets multidisciplinaires visant à promouvoir une société plus équitable et résiliente.',
    word_count: 177
  },
  objectives: {
    objectives: [
      {
        number: 1,
        text: 'Introduire les étudiantes et étudiants aux fondements théoriques des approches psychanalytiques, cognitivo‑comportementales et socioculturelles du genre.',
        bloom_level: null
      },
      {
        number: 2,
        text: 'Présenter les concepts clés de l’intersectionnalité et examiner leurs implications pour la compréhension des discriminations de genre dans les contextes environnementaux.',
        bloom_level: null
      },
      {
        number: 3,
        text: 'Explorer les relations entre les stéréotypes sexistes, les comportements de consommation et les trajectoires professionnelles à travers des études de cas empiriques.',
        bloom_level: null
      },
      {
        number: 4,
        text: "Fournir une vue d'ensemble des méthodologies de recherche sensibles au genre, y compris la conception de protocoles et l’analyse de données longitudinales.",
        bloom_level: null
      },
      {
        number: 5,
        text: 'Examiner les impacts psychologiques des politiques de développement durable et préparer les étudiantes et étudiants à formuler des recommandations éthiques basées sur des analyses rigoureuses.',
        bloom_level: null
      }
    ]
  },
  outcomes: {
    outcomes: [
      {
        number: 1,
        text: 'Les étudiant·e·s démontreront, à l’aide d’un questionnaire à réponses ouvertes, leur compréhension des fondements théoriques des approches psychanalytiques, cognitivo‑comportementales et socioculturelles du genre et expliqueront comment ces cadres peuvent mobiliser les deux sexes dans des actions d’atténuation climatique (SDG 5 & 13).',
        related_objectives: [1],
        assessment_method:
          'Quiz écrit suivi d’une courte présentation orale (10 min) évaluée selon une grille de critères'
      },
      {
        number: 2,
        text: 'Les étudiant·e·s analyseront, à partir de deux articles scientifiques, les mécanismes par lesquels la perception du risque climatique est modélisée dans la théorie cognitivo‑comportementale et proposeront des ajustements prenant en compte les principes du féminisme libéral (égalité juridique et participation citoyenne).',
        related_objectives: [1],
        assessment_method: 'Analyse critique écrite (2 pages) notée'
      },
      {
        number: 3,
        text: 'Les étudiant·e·s évalueront les dimensions intersectionnelles (genre, race, classe, localisation) de la vulnérabilité environnementale en construisant un tableau comparatif à partir d’études de cas réelles, puis identifieront les lacunes en matière de réduction des inégalités (SDG 10) et d’égalité des sexes (SDG 5).',
        related_objectives: [2],
        assessment_method:
          'Tableau synthétique présenté lors d’un séminaire et commenté par le·la professeur·e'
      },
      {
        number: 4,
        text: 'Les étudiant·e·s créeront un brief de politique publique (1 000 mots) recommandant des mesures d’adaptation climatique qui intègrent l’intersectionnalité et visent à réduire les inégalités socio‑économiques pour les femmes noires LGBTQ +. ',
        related_objectives: [2],
        assessment_method:
          'Produit écrit évalué selon critères de pertinence, logique argumentaire et prise en compte des SDG 5 et 10'
      },
      {
        number: 5,
        text: 'Les étudiant·e·s analyseront, à partir de trois études de cas empiriques, comment les stéréotypes sexistes influencent les comportements de consommation et orientent les parcours professionnels vers des secteurs à forte intensité carbone, puis synthétiseront leurs résultats dans un rapport de 3 pages. ',
        related_objectives: [3],
        assessment_method: 'Rapport de synthèse noté et discussion en groupe'
      },
      {
        number: 6,
        text: 'Les étudiant·e·s concevront un plan d’intervention (diagramme et justification de 2 pages) visant à promouvoir une consommation responsable (SDG 12) et des emplois décents (SDG 8) en déconstruisant les stéréotypes de genre dans le secteur du textile. ',
        related_objectives: [3],
        assessment_method:
          'Projet de groupe présenté sous forme de poster et défendu devant un jury'
      },
      {
        number: 7,
        text: 'Les étudiant·e·s rédigeront un protocole de recherche longitudinal intégrant des indicateurs sensibles au genre (ex. fémonationalisme) pour évaluer l’impact des politiques climatiques sur les ménages dirigés par des femmes migrantes, incluant le plan d’échantillonnage et les outils de mesure. ',
        related_objectives: [4],
        assessment_method:
          'Protocole complet soumis en format PDF, évalué selon une grille de validité méthodologique'
      },
      {
        number: 8,
        text: 'Les étudiant·e·s réaliseront une revue critique (2 pages) des évaluations d’impact environnemental existantes, en identifiant les biais de genre et en proposant des indicateurs correctifs conformes aux objectifs SDG 5 et 13. ',
        related_objectives: [4],
        assessment_method: 'Travail écrit soumis et commenté par le·la chargé·e de cours'
      },
      {
        number: 9,
        text: 'Les étudiant·e·s évalueront les effets psychologiques des politiques de développement durable, notamment le stress lié aux réactions antiféministes, et formuleront trois recommandations éthiques visant à protéger le bien‑être mental (SDG 3) tout en soutenant la justice climatique (SDG 13). ',
        related_objectives: [5],
        assessment_method: 'Essai analytique de 1500 mots noté'
      },
      {
        number: 10,
        text: 'Les étudiant·e·s élaboreront, en petit groupe, un plan de résilience communautaire fondé sur le womanisme, incluant des actions concrètes pour renforcer le soutien psychologique des femmes noires face au stress climatique, présentées sous forme de diaporama de 10 minutes. ',
        related_objectives: [5],
        assessment_method:
          'Présentation orale évaluée avec grille de critères (pertinence, créativité, ancrage dans les SDG)'
      }
    ]
  },
  competencies: {
    mappings: [
      {
        outcome_number: 1,
        greencomp_competencies: [
          'C5: Critical thinking',
          'C9: Exploratory thinking',
          'C2: Supporting fairness'
        ],
        rationale:
          "L'activité exige une analyse critique des théories de genre (C5), explore les liens entre approches psychologiques et actions climatiques (C9) et vise à promouvoir l’équité entre les sexes dans la mitigation climatique (C2)."
      },
      {
        outcome_number: 2,
        greencomp_competencies: [
          'C5: Critical thinking',
          'C2: Supporting fairness',
          'C4: Systems thinking'
        ],
        rationale:
          'Les étudiants évaluent de façon critique les modèles de perception du risque (C5), intègrent les principes du féminisme libéral pour renforcer l’égalité (C2) et situent le risque climatique dans un système sociotechnique complexe (C4).'
      },
      {
        outcome_number: 3,
        greencomp_competencies: [
          'C2: Supporting fairness',
          'C4: Systems thinking',
          'C6: Problem framing'
        ],
        rationale:
          "L'examen des dimensions intersectionnelles met en avant la justice sociale (C2), utilise une approche systémique pour comprendre la vulnérabilité multi‑facteurs (C4) et formule le problème d’inégalités environnementales (C6)."
      },
      {
        outcome_number: 4,
        greencomp_competencies: [
          'C10: Political agency',
          'C2: Supporting fairness',
          'C11: Collective action'
        ],
        rationale:
          'La rédaction du brief montre la capacité à naviguer le système politique (C10), intègre l’équité intersectionnelle (C2) et propose des mesures collectives pour les femmes noires LGBTQ+ (C11).'
      },
      {
        outcome_number: 5,
        greencomp_competencies: [
          'C5: Critical thinking',
          'C9: Exploratory thinking',
          'C2: Supporting fairness'
        ],
        rationale:
          'L’analyse critique des stéréotypes sexistes (C5) explore leurs effets sur consommation et trajectoires professionnelles à forte intensité carbone (C9) tout en visant la justice de genre (C2).'
      },
      {
        outcome_number: 6,
        greencomp_competencies: [
          'C12: Individual initiative',
          'C11: Collective action',
          'C2: Supporting fairness'
        ],
        rationale:
          'Les étudiants conçoivent un plan d’intervention personnel (C12), mobilisent une action collective dans le secteur textile (C11) et placent l’équité de genre au cœur de la consommation responsable et des emplois décents (C2).'
      },
      {
        outcome_number: 7,
        greencomp_competencies: [
          'C5: Critical thinking',
          'C9: Exploratory thinking',
          'C4: Systems thinking'
        ],
        rationale:
          'Le protocole de recherche requiert une évaluation critique des indicateurs sensibles au genre (C5), explore les interactions entre genre, migration et politiques climatiques (C9) et situe le phénomène dans un système socio‑écologique (C4).'
      },
      {
        outcome_number: 8,
        greencomp_competencies: [
          'C5: Critical thinking',
          'C2: Supporting fairness',
          'C6: Problem framing'
        ],
        rationale:
          'La revue critique identifie les biais de genre dans les évaluations d’impact (C5), propose des indicateurs correctifs favorisant l’équité (C2) et reformule le problème comme une question d’injustice environnementale (C6).'
      },
      {
        outcome_number: 9,
        greencomp_competencies: [
          'C1: Valuing sustainability',
          'C2: Supporting fairness',
          'C8: Adaptability'
        ],
        rationale:
          'L’évaluation des effets psychologiques valorise le bien‑être comme composante de la durabilité (C1), intègre la justice de genre (C2) et recommande des stratégies adaptatives pour gérer le stress antiféministe et soutenir la justice climatique (C8).'
      },
      {
        outcome_number: 10,
        greencomp_competencies: [
          'C11: Collective action',
          'C10: Political agency',
          'C8: Adaptability'
        ],
        rationale:
          'Le plan de résilience communautaire mobilise une action collective ancrée dans le womanisme (C11), démontre la capacité à influencer les décisions locales (C10) et développe l’adaptabilité face aux stress climatiques et psychologiques (C8).'
      }
    ]
  },
  sustainability: {
    connections: [
      {
        objective_number: 1,
        sdg_themes: ['SDG 5 : Égalité des sexes', 'SDG 13 : Action pour le climat'],
        connection_explanation:
          'Les approches psychanalytiques, cognitivo‑comportementales et socioculturelles du genre sont éclairées par les discours féministes qui cherchent à rendre les hommes et les femmes égaux (Document 1 – définition du féminisme). Par exemple, la théorie cognitivo‑comportementale de la perception du risque climatique peut être enrichie par le libéralisme féministe qui insiste sur l’égalité juridique et la participation citoyenne (Document 2). Ainsi, les étudiantes et étudiants verront comment la reconnaissance de l’égalité des sexes (SDG 5) ouvre la voie à des modèles psychologiques capables de mobiliser les deux genres dans des actions de mitigation climatique (SDG 13).',
        key_resources: ['Document 1', 'Document 2']
      },
      {
        objective_number: 2,
        sdg_themes: ['SDG 5 : Égalité des sexes', 'SDG 10 : Réduction des inégalités'],
        connection_explanation:
          'L’intersectionnalité, articulée dans les travaux sur le féminisme lesbien (Document 6) et les critiques des représentations négatives du féminisme (Document 3), montre comment le genre se combine avec la race, la classe et la localisation géographique pour produire des vulnérabilités environnementales accrues. Un exemple concret tiré du document 6 décrit comment les femmes noires LGBTQ + subissent simultanément discrimination de genre et marginalisation socio‑économique, ce qui amplifie leur exposition aux catastrophes climatiques. Cette lecture croisée (SDG 10) permet aux étudiantes et étudiants d’analyser les politiques climatiques sous l’angle de l’équité intergénérationnelle et de la justice climatique (SDG 13).',
        key_resources: ['Document 3', 'Document 6']
      },
      {
        objective_number: 3,
        sdg_themes: [
          'SDG 12 : Consommation et production responsables',
          'SDG 8 : Travail décent et croissance économique'
        ],
        connection_explanation:
          'Les stéréotypes sexistes influencent les habitudes de consommation (ex. la promotion du « shopping » comme activité féminine) et les trajectoires professionnelles vers des secteurs à forte intensité carbone, comme le textile à bas coût. Le texte historique du féminisme (Document 5) montre que la quête d’émancipation a d’abord conduit les femmes à occuper des emplois de production de masse, aggravant l’impact environnemental. En confrontant ces données à des études de cas empiriques contemporaines, les étudiantes et étudiants pourront démontrer comment la reproduction des rôles de genre alimente la surconsommation (SDG 12) et la ségrégation professionnelle dans des industries polluantes (SDG 8).',
        key_resources: ['Document 5', 'Document 1']
      },
      {
        objective_number: 4,
        sdg_themes: ['SDG 5 : Égalité des sexes', 'SDG 13 : Action pour le climat'],
        connection_explanation:
          'Le concept de « fémonationalisme » (Document 4) illustre comment les discours féministes sont parfois instrumentalisés par des politiques nationales pour légitimer des stratégies de « care » qui reposent sur des travailleurs migrants, souvent des femmes. Cette appropriation montre la nécessité de protocoles de recherche longitudinales capables de distinguer les effets différenciés des politiques climatiques sur les populations féminines (ex. subventions à l’énergie renouvelable qui excluent les ménages dirigés par des femmes migrantes). En intégrant ces exemples, les étudiantes et étudiants apprendront à concevoir des méthodologies sensibles au genre afin de détecter les biais de genre dans les évaluations d’impact des politiques de durabilité (SDG 13).',
        key_resources: ['Document 4', 'Document 2']
      },
      {
        objective_number: 5,
        sdg_themes: ['SDG 13 : Action pour le climat', 'SDG 3 : Bonne santé et bien‑être'],
        connection_explanation:
          'Les impacts psychologiques des politiques de développement durable peuvent être aggravés par les réactions antiféministes (Document 7) qui stigmatisent les femmes actives dans les mouvements écologiques. À l’inverse, le womanisme (Document 9) fournit des stratégies de résilience communautaire où les femmes noires mobilisent leurs réseaux pour faire face au stress climatique. En analysant ces deux perspectives, les étudiantes et étudiants seront capables de formuler des recommandations éthiques qui tiennent compte du bien‑être mental (SDG 3) tout en soutenant des politiques climatiques justes (SDG 13).',
        key_resources: ['Document 7', 'Document 9']
      }
    ],
    suggested_objectives: null,
    integration_strategy:
      'L’intégration du développement durable dans ce cours repose sur une approche transversale qui place la justice de genre au cœur des problématiques environnementales. En mobilisant des ressources issues de la littérature féministe (documents 1‑9), chaque objectif pédagogique lie les théories psychologiques aux enjeux de durabilité sociale, climatique et économique, montrant ainsi comment les biais de genre façonnent les comportements, les politiques et la santé mentale. Cette stratégie pédagogique enrichit la discipline en offrant aux étudiantes et étudiants des outils analytiques capables de produire des recherches et des interventions plus équitables et résilientes, répondant aux exigences contemporaines d’une psychologie engagée dans la transformation sociétale.',
    resources_used: []
  },
  sessions: null
}; // to avoid TS errors, will be passed as prop in the actual use case

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

// const data = ref(undefined) as any; // to avoid TS errors, will be passed as prop in the actual use case

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
  return false;
  // return props.originalObjectives.includes(text);
};

const getConnection = (objectiveNumber?: number) => {
  if (!objectiveNumber) return null;
  return data.sustainability.connections.find((c) => c.objective_number === objectiveNumber);
};

const findDocument = (resourceRef) => {
  return data.sustainability.resources_used?.find((doc) => doc.reference === resourceRef);
};
</script>

<template>
  <div class="test-mas">
    <UserInputMas :id_number="1" @submit="setCourseMetadata" />
    <div class="body">
      <FeaturePresentation :id_number="0" />

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

      <div class="is-flex is-flex-direction-column is-flex-wrap-wrap mt-6" v-if="data">
        <div>
          <h1 class="title is-4">Course Description</h1>
          <p>
            {{ data.description.text }}
          </p>
        </div>
        <div class="syllabus-part mb-5">
          <div class="col">
            <!-- OBJECTIVES -->
            <details open class="main-details">
              <summary class="mb-2 py-2 is-clickable main-summary">
                <p class="has-text-weight-bold is-size-4">🎯 Learning Objectives</p>
                <p class="tag">Learning objectives for your class</p>
              </summary>
              <div>
                <div v-for="obj in data.objectives.objectives" :key="obj.number">
                  <div class="mb-3">
                    <h1 class="has-text-weight-bold is-size-6">Objective {{ obj.number }}</h1>
                    <span class="caption">
                      {{ obj.text }}
                    </span>
                  </div>
                </div>
              </div>
            </details>
          </div>
          <div class="col">
            <details open class="main-details">
              <summary class="mb-2 py-2 is-clickable main-summary">
                <p class="has-text-weight-bold is-size-4">🌍 Sustainability Integration</p>
                <p class="tag">Learning outcomes for your class</p>
              </summary>
              <div>
                <div
                  v-for="sust in data.sustainability.connections"
                  :key="sust.objective_number"
                  class=""
                >
                  <div>
                    <p>
                      <strong>Related to Objective {{ sust.objective_number }} </strong>
                    </p>
                    <p>
                      <strong>SDG Themes:</strong>
                      {{ sust.sdg_themes.join(', ') }}
                    </p>
                    <details class="mb-3 secondary-details">
                      <summary class="is-clickable secondary-summary">
                        See connection explanation
                      </summary>
                      <p>
                        <strong>Connection:</strong>
                        {{ sust.connection_explanation }}
                      </p>
                      <div v-if="sust.key_resources && sust.key_resources.length > 0">
                        <h4>📚 Resources Used</h4>

                        <div
                          v-for="resourceRef in sust.key_resources"
                          :key="resourceRef"
                          class="resource-item"
                        >
                          <div v-if="findDocument(resourceRef)">
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
                              This resource provides examples and evidence for sustainability
                              integration.
                            </small>
                          </div>

                          <span v-else>{{ resourceRef }}</span>
                        </div>
                      </div>
                    </details>

                    <!-- <div class="info-box">No sustainability integration available yet.</div> -->
                  </div>
                </div>
              </div>
            </details>
          </div>
        </div>

        <div class="syllabus-part">
          <!-- OUTCOMES -->
          <div class="col">
            <details open class="main-details">
              <summary class="mb-2 py-2 is-clickable main-summary">
                <p class="has-text-weight-bold is-size-4">📊 Learning Outcomes</p>
                <p class="tag">Learning outcomes for your class</p>
              </summary>
              <div v-for="out in data.outcomes.outcomes" :key="out.number" class="">
                <div>
                  <h3 class="has-text-weight-bold">Outcome {{ out.number }}</h3>
                  <p class="caption">
                    {{ out.text }}
                  </p>
                </div>
              </div>
            </details>
          </div>

          <!-- COMPETENCIES -->
          <div class="col">
            <details open class="main-details">
              <summary class="mb-2 pl-4 py-2 is-clickable main-summary">
                <p class="has-text-weight-bold is-size-4">🌱 GreenComp Competencies</p>
                <p class="tag">See how the learning outcomes map to GreenComp</p>
              </summary>
              <div v-for="mapping in data.competencies.mappings" :key="mapping.outcome_number">
                <div class="pt-4">
                  <h3 class="has-text-weight-bold">
                    Outcome {{ mapping.outcome_number }}
                    <span class="ml-2">{{ mapping.greencomp_competencies.join(', ') }}</span>
                  </h3>
                  <p class="caption">{{ mapping.rationale }}</p>
                </div>
              </div>
            </details>
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
  display: flex;
  width: 100%;
  height: 100%;
}

.body {
  height: 100%;
  overflow-y: auto;
  padding: 2rem;
}

.file-section {
  margin: auto;
  width: 50%;

  padding: 0rem 0rem;
}

.action-button {
  margin-top: 1rem;
  margin-left: auto;
  display: flex;
  justify-content: flex-end;
}

.syllabus-part {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8rem;
}

.col {
  width: 40%;
}

@media screen and (max-width: 1380px) {
  .syllabus-part {
    gap: 2rem;
  }
}

@media screen and (max-width: 900px) {
  .syllabus-part {
    flex-direction: column;
    gap: 2rem;
  }

  .col {
    width: 100%;
  }
}

.feedback-section {
  width: 100%;
}

/* Light styling for presentation */
details.main-details {
  border-block-end: 1px solid var(--neutral-100);
  margin-block: 0.5rem;
  padding-block: 0.5rem;
}

summary.secondary-summary {
  margin-left: 0.5rem;
  font-size: 1rem;
  position: relative;
  /* Register summary as an anchor element */

  width: fit-content;

  &::marker {
    content: '+';
    color: var(--tertiary-hover);
  }
}

summary.main-summary {
  /* Pin the custom marker to the container */
  position: relative;
  /* Register summary as an anchor element */
  anchor-name: --summary;

  &::marker {
    content: '';
  }

  &::before,
  &::after {
    /* Custom marker dimensions */
    content: '';
    border-block-start: 3px solid var(--tertiary-hover);
    height: 0;
    width: 1rem;

    /* Positions the lines */
    inset-block-start: 40%;
    inset-inline-end: 0;

    /* Anchor the shape to the summary */
    position: absolute;
    position-anchor: --summary;
    position-area: top end;
  }

  /* Rotate just the ::after line to create a "+"" shape */
  &::after {
    transform: rotate(90deg);
    transform-origin: 50%;
  }
}

/* Rotate the line when open */
details[open] summary::after {
  transform: rotate(0deg);
}
</style>
