<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { scrollToAnchor } from '@/utils/navigation';
import type { SyllabusData } from '@/types';

defineProps<{
  syllabusData?: SyllabusData;
}>();

const tabs = [
  {
    label: 'Description',
    emoji: '📖',
    value: 'description'
  },
  {
    label: 'Objectives',
    emoji: '📚',
    value: 'objectives'
  },
  {
    label: 'Sustainability',
    emoji: '🌍',
    value: 'sustainability'
  },
  {
    label: 'Outcomes',
    emoji: '🎯',
    value: 'outcomes'
  },
  {
    label: 'Competencies',
    emoji: '💡',
    value: 'competencies'
  },
  {
    label: 'Validation',
    emoji: '✅',
    value: 'validation'
  }
];

const activeTab: Ref<string> = ref('objectives');

const feedbackText: Ref<string> = ref('');
</script>
<template>
  <div v-if="syllabusData" class="syllabus-section">
    <h1 class="title is-4 is-size-5-mobile">
      {{ $t('syllabus') }}
    </h1>
    <div class="syllabus-section-content">
      <div class="table-of-contents">
        <h2 class="title is-6">Syllabus</h2>
        <ul>
          <li v-for="tab in tabs" :key="tab.value">
            <a
              @click="scrollToAnchor(`target-tab-${tab.value}`)"
              @click.prevent="activeTab = tab.value"
            >
              <span>{{ tab.emoji }} </span>
              {{ $t(tab.label) }}
            </a>
          </li>
        </ul>
      </div>
      <div class="col">
        <div class="syllabus-part" v-if="syllabusData">
          <!-- <h1 class="title is-3">Generated Syllabus</h1> -->
          <p id="target-tab-description" class="has-text-weight-bold is-size-4">
            {{ tabs.find((tab) => tab.value === 'description')?.emoji }}
            {{ $t('courseDescription') }}
          </p>
          <p>
            {{ syllabusData.description.text }}
          </p>
        </div>

        <div class="syllabus-part">
          <!-- OBJECTIVES -->
          <details id="target-tab-objectives" open class="main-details">
            <summary class="mb-2 py-2 is-clickable main-summary">
              <p class="has-text-weight-bold is-size-4">
                {{ tabs.find((tab) => tab.value === 'objectives')?.emoji }}
                {{ $t('learningObjectives') }}
              </p>
              <p class="tag">{{ $t('learningObjectivesSubtitle') }}</p>
            </summary>
            <div>
              <div v-for="obj in syllabusData.objectives.objectives" :key="obj.number">
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
        <div class="syllabus-part">
          <details id="target-tab-sustainability" open class="main-details">
            <summary class="mb-2 py-2 is-clickable main-summary">
              <p class="has-text-weight-bold is-size-4">
                {{ tabs.find((tab) => tab.value === 'sustainability')?.emoji }}
                {{ $t('sustainabilityIntegration') }}
              </p>
              <p class="tag">{{ $t('sustainabilityIntegrationSubtitle') }}</p>
            </summary>
            <div>
              <div
                v-for="sust in syllabusData.sustainability.connections"
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
                      {{ tabs.find((tab) => tab.value === 'sustainability')?.emoji }}
                      {{ $t('seeConnectionExplanation') }}
                    </summary>
                    <p>
                      <strong>Connection:</strong>
                      {{ sust.connection_explanation }}
                    </p>
                    <div v-if="sust.key_resources && sust.key_resources.length > 0">
                      <h4>
                        {{ tabs.find((tab) => tab.value === 'sustainability')?.emoji }}
                        {{ $t('resourcesUsed') }}
                      </h4>

                      <div
                        v-for="resourceRef in sust.key_resources"
                        :key="resourceRef.url"
                        class="resource-item"
                      >
                        <a :href="resourceRef.url" target="_blanl">
                          <span>{{ resourceRef.corpus }} : {{ resourceRef.title }}</span>
                        </a>
                      </div>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          </details>
        </div>

        <!-- OUTCOMES -->
        <div class="syllabus-part">
          <details id="target-tab-outcomes" open class="main-details">
            <summary class="mb-2 py-2 is-clickable main-summary">
              <p class="has-text-weight-bold is-size-4">
                {{ tabs.find((tab) => tab.value === 'outcomes')?.emoji }}
                {{ $t('learningOutcomes') }}
              </p>
              <p class="tag">{{ $t('learningOutcomesSubtitle') }}</p>
            </summary>
            <div v-for="out in syllabusData.outcomes.outcomes" :key="out.number" class="">
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
        <div class="syllabus-part">
          <details id="target-tab-competencies" open class="main-details">
            <summary class="mb-2 pl-4 py-2 is-clickable main-summary">
              <p class="has-text-weight-bold is-size-4">
                {{ tabs.find((tab) => tab.value === 'competencies')?.emoji }}
                {{ $t('greenCompCompetencies') }}
              </p>
              <p class="tag">{{ $t('greenCompCompetenciesSubtitle') }}</p>
            </summary>
            <div
              v-for="mapping in syllabusData.competencies.mappings"
              :key="mapping.outcome_number"
            >
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

        <!-- FEEDBACK -->
        <div class="feedback-section">
          <h2>
            {{ tabs.find((tab) => tab.value === 'feedback')?.emoji }}
            {{ $t('provideFeedback') }}
          </h2>

          <textarea
            v-model="feedbackText"
            rows="5"
            class="textarea"
            :placeholder="$t('describeFeedback')"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="css" scoped>
.syllabus-section {
  height: 100vh;
  overflow: hidden;
}
.syllabus-section-content {
  height: 100%;
  margin-top: 2rem;
  gap: 2rem;
  display: flex;
  overflow-y: hidden;
  margin: auto;
}

.table-of-contents {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--neutral-50);
  padding: 2rem;
  padding-top: 5%;
  background-color: var(--neutral-10);
  height: 100%;
  overflow: hidden;
}

.syllabus-part {
  width: 100%;
  padding: 1rem 1rem;
}

@media screen and (max-width: 1380px) {
  .syllabus-part {
    gap: 2rem;
  }
}

.col {
  overflow-y: auto;
  overflow-x: hidden;
  flex: 6;
  padding: 1rem 1rem;
  height: 100%;
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
