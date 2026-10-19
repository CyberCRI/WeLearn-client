<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import SpaceCard from '@/components/SpaceCard.vue';
import SpaceLabel from '@/components/SpaceLabel.vue';
import PreviewIntro from '@/components/teacher/PreviewIntro.vue';
import {
  EXPLORE_LENSES,
  TEACH_STEPS,
  TEACHER_MODULES,
  TEACHER_SPACE_COLOURS,
  type TeacherModule,
  type TeacherSpace
} from '@/components/teacher/teacherSpaces';

// one page per teacher space: understand and design list their modules,
// explore (two lenses) and teach (three steps) are previews
const route = useRoute();
const space = computed(() => route.params.space as TeacherSpace);
const colours = computed(() => TEACHER_SPACE_COLOURS[space.value]);
const modules = computed(() => TEACHER_MODULES[space.value]);
const texts = computed(() => `journey.teach.spaces.${space.value}`);

// existing features open their page, the others open their preview
const moduleLink = (module: TeacherModule) =>
  module.route
    ? { name: module.route }
    : { name: 'teach-preview', params: { space: space.value, module: module.key } };
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

      <!-- explore: the two lenses side by side, both leading to search and chat -->
      <template v-else-if="space === 'explore'">
        <PreviewIntro :question="$t(`${texts}.question`)" :objective="$t(`${texts}.objective`)" />
        <ul class="cards">
          <li v-for="lens in EXPLORE_LENSES" :key="lens" :data-testid="`lens-${lens}`">
            <SpaceCard
              :title="$t(`${texts}.lenses.${lens}.title`)"
              :description="$t(`${texts}.lenses.${lens}.description`)"
              :accent="colours.accent"
            >
              <router-link class="space-action" :to="{ name: 'search-sdg' }">
                {{ $t(`${texts}.search`) }} →
              </router-link>
              <router-link class="space-action" :to="{ name: 'q-and-a' }">
                {{ $t(`${texts}.chat`) }} →
              </router-link>
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

.cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 2rem;
}

.cards.is-three {
  grid-template-columns: repeat(3, 1fr);
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
