<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SpaceCard from '@/components/SpaceCard.vue';
import SpaceLabel from '@/components/SpaceLabel.vue';
import PreviewIntro from '@/components/teacher/PreviewIntro.vue';
import AskWeLearnPanel from '@/components/teacher/AskWeLearnPanel.vue';
import ExampleResultCard from '@/components/teacher/ExampleResultCard.vue';
import { useFiltersStore } from '@/stores/filters';
import { useSourcesStore } from '@/stores/sources';
import {
  EXPLORE_LENSES,
  EXPLORE_LENS_CATEGORIES,
  RESEARCH_CASE_SOURCE_URL,
  TEACH_RESULT_KINDS,
  TEACH_STEPS,
  TEACHER_MODULES,
  TEACHER_SPACE_COLOURS,
  type TeacherModule,
  type TeacherSpace
} from '@/components/teacher/teacherSpaces';

// one page per teacher space: understand and design list their modules,
// explore (two lenses) and teach (three steps) are previews; every space ends with "Ask WeLearn"
const route = useRoute();
const router = useRouter();
const filtersStore = useFiltersStore();
const sourcesStore = useSourcesStore();

const space = computed(() => route.params.space as TeacherSpace);
const colours = computed(() => TEACHER_SPACE_COLOURS[space.value]);
const modules = computed(() => TEACHER_MODULES[space.value]);
const texts = computed(() => `journey.teach.spaces.${space.value}`);

// existing features open their page, the others open their preview
const moduleLink = (module: TeacherModule) =>
  module.route
    ? { name: module.route }
    : { name: 'teach-preview', params: { space: space.value, module: module.key } };

// search and chat read no filters from the address, so the lens pre-selects its sources in the
// shared filters store (visible and editable in their filters panel) before opening the page
const handleLens = (lens: (typeof EXPLORE_LENSES)[number], routeName: string) => {
  const categories = EXPLORE_LENS_CATEGORIES[lens];
  filtersStore.sourcesFilters = Object.entries(sourcesStore.sourceCategoryMap)
    .filter(([, category]) => categories.includes(category))
    .map(([name]) => name);
  router.push({ name: routeName });
};
</script>
<template>
  <div class="teach-page">
    <div class="teach-content" :style="{ '--accent': colours.accent }">
      <router-link class="back-link" :to="{ name: 'teach' }">
        ← {{ $t('journey.teach.allSpaces') }}
      </router-link>
      <div class="mt-5">
        <SpaceLabel :text="$t(`${texts}.name`)" :tint="colours.tint" />
      </div>
      <h1 class="title is-3 is-size-4-mobile mt-3">{{ $t(`${texts}.title`) }}</h1>
      <p class="subtitle is-6 mt-2">{{ $t(`${texts}.description`) }}</p>

      <!-- understand, design: one card per module -->
      <ul v-if="modules" class="cards">
        <li v-for="module in modules" :key="module.key" :data-testid="`module-${module.key}`">
          <SpaceCard
            :label="module.route ? undefined : $t('journey.teach.preview')"
            :title="$t(`${texts}.modules.${module.key}.title`)"
            :description="$t(`${texts}.modules.${module.key}.question`)"
            :accent="colours.accent"
            tint="var(--lpi-yellow-lighter)"
            :to="moduleLink(module)"
            :actionText="module.route ? $t('journey.teach.open') : $t('journey.teach.seePreview')"
          />
        </li>
      </ul>

      <!-- explore: the two lenses side by side, each opening search or chat on its own sources -->
      <template v-else-if="space === 'explore'">
        <PreviewIntro :question="$t(`${texts}.question`)" :objective="$t(`${texts}.objective`)" />
        <ul class="cards">
          <li v-for="lens in EXPLORE_LENSES" :key="lens" :data-testid="`lens-${lens}`">
            <SpaceCard
              :title="$t(`${texts}.lenses.${lens}.title`)"
              :description="$t(`${texts}.lenses.${lens}.description`)"
              :accent="colours.accent"
            >
              <!-- teach the topic: the two kinds of results, one invented example each -->
              <div v-if="lens === 'teach'" class="result-kinds">
                <section
                  v-for="kind in TEACH_RESULT_KINDS"
                  :key="kind"
                  :data-testid="`results-${kind}`"
                >
                  <h3 class="result-kind-title">{{ $t(`${texts}.results.${kind}.title`) }}</h3>
                  <p class="result-kind-description">
                    {{ $t(`${texts}.results.${kind}.description`) }}
                  </p>
                  <ExampleResultCard
                    class="mt-2"
                    :meta="$t(`${texts}.results.${kind}.exampleMeta`)"
                    :title="$t(`${texts}.results.${kind}.exampleTitle`)"
                    :description="$t(`${texts}.results.${kind}.exampleDescription`)"
                    :sourceNote="
                      kind === 'researchCases'
                        ? $t(`${texts}.results.${kind}.sourceNote`)
                        : undefined
                    "
                    :source="
                      kind === 'researchCases' ? $t(`${texts}.results.${kind}.source`) : undefined
                    "
                    :sourceUrl="kind === 'researchCases' ? RESEARCH_CASE_SOURCE_URL : undefined"
                  />
                </section>
              </div>
              <button
                type="button"
                class="space-action"
                :data-testid="`lens-${lens}-search`"
                @click="handleLens(lens, 'search-sdg')"
              >
                {{ $t(`${texts}.search`) }} →
              </button>
              <button
                type="button"
                class="space-action"
                :data-testid="`lens-${lens}-chat`"
                @click="handleLens(lens, 'q-and-a')"
              >
                {{ $t(`${texts}.chat`) }} →
              </button>
            </SpaceCard>
          </li>
        </ul>
      </template>

      <!-- teach: use, reflect, share -->
      <template v-else>
        <PreviewIntro :question="$t(`${texts}.question`)" :objective="$t(`${texts}.objective`)" />
        <ol class="cards is-three">
          <li v-for="(step, index) in TEACH_STEPS" :key="step" :data-testid="`step-${step}`">
            <SpaceCard
              :title="`${index + 1}. ${$t(`${texts}.steps.${step}.title`)}`"
              :description="$t(`${texts}.steps.${step}.description`)"
              :accent="colours.accent"
            />
          </li>
        </ol>
      </template>

      <AskWeLearnPanel :space="space" />
    </div>
  </div>
</template>

<style scoped>
.teach-page {
  height: 100%;
  overflow-y: auto;
}

.teach-content {
  max-width: 64rem;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
}

.back-link {
  font-size: 0.9rem;
}

/* numbers are part of the step titles, so the list shows none of its own */
.cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 2rem;
  list-style: none;
}

.cards.is-three {
  grid-template-columns: repeat(3, 1fr);
}

.result-kinds {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  margin-bottom: 0.5rem;
}

.result-kind-title {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--neutral-80);
}

.result-kind-description {
  font-size: 0.85rem;
  color: var(--neutral-70);
}

@media (max-width: 768px) {
  .cards,
  .cards.is-three {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .teach-content {
    padding: 1.5rem 1rem 2rem;
  }
}
</style>
