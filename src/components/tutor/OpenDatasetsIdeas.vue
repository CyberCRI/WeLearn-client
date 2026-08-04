<script setup lang="ts">
import { computed } from 'vue';

interface DatasetSuggestion {
  id: string;
  title: string;
  description: string;
  url: string;
  keywords: string[];
  useCase: string;
}

interface RankedSuggestion {
  dataset: DatasetSuggestion;
  score: number;
  matchedKeywords: string[];
}

const props = defineProps<{
  summaries: string[];
  disabled?: boolean;
  selectedSuggestionIds: string[];
  toggleSuggestionSelection: (datasetId: string) => void;
}>();

const isSelected = (datasetId: string) => props.selectedSuggestionIds.includes(datasetId);

const suggestionsCatalog: DatasetSuggestion[] = [
  {
    id: 'fr-covid-urgences',
    title: 'Urgences hospitalières et SOS Medecins - COVID-19',
    description:
      'Indicateurs quotidiens sur les passages aux urgences et actes SOS Medecins avec suspicion de COVID-19.',
    url: 'https://www.data.gouv.fr/datasets/donnees-des-urgences-hospitalieres-et-de-sos-medecins-relatives-a-lepidemie-de-covid-19',
    keywords: [
      'health',
      'public health',
      'epidemic',
      'covid',
      'hospital',
      'urgence',
      'sante',
      'prevention',
      'care'
    ],
    useCase:
      'Créer une activité de data literacy sur la surveillance épidémiologique, en comparant tendances temporelles et profils territoriaux.'
  },
  {
    id: 'fr-agriculture-bio-pac',
    title: 'Parcelles en agriculture biologique (AB) déclarées à la PAC',
    description:
      'Jeu de données géographiques sur les parcelles en conversion ou certifiées en agriculture biologique déclarées à la PAC.',
    url: 'https://www.data.gouv.fr/datasets/parcelles-en-agriculture-biologique-ab-declarees-a-la-pac',
    keywords: [
      'agriculture',
      'organic',
      'biodiversity',
      'soil',
      'land',
      'food',
      'bio',
      'parcelle',
      'rural'
    ],
    useCase:
      'Concevoir une étude de cas sur transition agroécologique, usage des sols et impacts potentiels sur alimentation durable.'
  },
  {
    id: 'fr-saison-balneaire',
    title: 'Données de rapportage de la saison balnéaire',
    description:
      "Informations de rapportage sur la saison balnéaire pour analyser qualité de l'eau, risques sanitaires et gestion littorale.",
    url: 'https://www.data.gouv.fr/datasets/donnees-de-rapportage-de-la-saison-balneaire-1',
    keywords: [
      'water',
      'sanitation',
      'pollution',
      'coast',
      'climate',
      'tourism',
      'eau',
      'balneaire',
      'littoral'
    ],
    useCase:
      "Monter un projet d'investigation sur qualité des eaux de baignade, prévention des risques et adaptation au changement climatique."
  }
];

const fallbackDatasets = suggestionsCatalog.slice(0, 3);

const summariesText = computed(() =>
  (props.summaries || []).filter(Boolean).join(' ').toLowerCase()
);

const rankedSuggestions = computed<RankedSuggestion[]>(() => {
  if (!summariesText.value.trim()) {
    return [];
  }

  return suggestionsCatalog
    .map((dataset) => {
      const matchedKeywords = dataset.keywords.filter((keyword) =>
        summariesText.value.includes(keyword)
      );

      return {
        dataset,
        score: matchedKeywords.length,
        matchedKeywords
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
});

const displayedSuggestions = computed(() => {
  if (rankedSuggestions.value.length) {
    return rankedSuggestions.value;
  }

  return fallbackDatasets.map((dataset) => ({
    dataset,
    score: 0,
    matchedKeywords: []
  }));
});
</script>

<template>
  <section class="wrapper" :class="{ disabled: disabled }">
    <h2 class="title is-5 is-size-6-mobile mt-5">{{ $t('tutor.openDatasetsIdeas.title') }}</h2>
    <p class="subtitle is-6">
      {{ $t('tutor.openDatasetsIdeas.description') }}
    </p>

    <div class="cards-grid">
      <article
        v-for="suggestion in displayedSuggestions"
        :key="suggestion.dataset.id"
        class="dataset-card"
        :class="{ selected: isSelected(suggestion.dataset.id) }"
        :aria-pressed="isSelected(suggestion.dataset.id)"
        role="button"
        tabindex="0"
        @click="toggleSuggestionSelection(suggestion.dataset.id)"
        @keydown.enter.prevent="toggleSuggestionSelection(suggestion.dataset.id)"
        @keydown.space.prevent="toggleSuggestionSelection(suggestion.dataset.id)"
      >
        <header class="dataset-card-header">
          <h3 class="title is-6 mb-1">{{ suggestion.dataset.title }}</h3>
          <a
            class="link is-size-7"
            :href="suggestion.dataset.url"
            target="_blank"
            rel="noopener noreferrer"
            @click.stop
          >
            {{ $t('tutor.openDatasetsIdeas.openOnDataGouv') }}
          </a>
        </header>

        <p class="dataset-description">{{ suggestion.dataset.description }}</p>

        <p class="dataset-use-case">
          <span class="has-text-weight-semibold">{{
            $t('tutor.openDatasetsIdeas.useCaseLabel')
          }}</span>
          {{ suggestion.dataset.useCase }}
        </p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.wrapper {
  width: 100%;
  padding: 0 0 2%;
}

.wrapper.disabled {
  opacity: 0.5;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.dataset-card {
  border: 1px solid var(--neutral-20);
  border-radius: 0.75rem;
  padding: 1rem;
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  cursor: pointer;
}

.dataset-card.selected {
  border-color: var(--primary-color);
  background-color: var(--neutral-10);
}

.dataset-card-header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.dataset-description,
.dataset-use-case {
  margin: 0;
  font-size: 0.95rem;
}

@media screen and (max-width: 1024px) {
  .cards-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media screen and (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
