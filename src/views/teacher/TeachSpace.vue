<script setup lang="ts">
import { computed, type Component } from 'vue';
import { useRoute } from 'vue-router';
import SpaceCard from '@/components/SpaceCard.vue';
import SpaceLabel from '@/components/SpaceLabel.vue';
import PreviewIntro from '@/components/teacher/PreviewIntro.vue';
import AskWeLearnPanel from '@/components/teacher/AskWeLearnPanel.vue';
import FeatureRow from '@/components/teacher/FeatureRow.vue';
import BookIcon from '@/components/icons/BookIcon.vue';
import EditIcon from '@/components/icons/EditIcon.vue';
import NetworkIcon from '@/components/icons/NetworkIcon.vue';
import LinesLeaningIcon from '@/components/icons/LinesLeaningIcon.vue';
import {
  TEACH_STEPS,
  TEACHER_MODULES,
  TEACHER_SPACE_COLOURS,
  type TeacherModule,
  type TeacherSpace
} from '@/components/teacher/teacherSpaces';

// one page per teacher space: understand and design list their modules, teach (three steps) is a
// preview and ends with the "Ask WeLearn" panel. explore has its own page (TeachExplore, the search)

// icons of the module rows (understand, design)
const MODULE_ICONS: Record<string, Component> = {
  foundations: BookIcon,
  frameworks: NetworkIcon,
  discipline: LinesLeaningIcon,
  course: BookIcon,
  activity: EditIcon
};

const route = useRoute();

const space = computed(() => route.params.space as TeacherSpace);
const colours = computed(() => TEACHER_SPACE_COLOURS[space.value]);
// hidden modules keep their page and route, but get no card here
const modules = computed(() => TEACHER_MODULES[space.value]?.filter((module) => !module.isHidden));
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
      <h1 class="title is-3 is-size-4-mobile mt-3">{{ $t(`${texts}.pageTitle`) }}</h1>
      <p class="subtitle is-6 mt-2">{{ $t(`${texts}.intro`) }}</p>

      <!-- understand, design: a quiet list of features -->
      <ul v-if="modules" class="feature-list">
        <li v-for="module in modules" :key="module.key" :data-testid="`module-${module.key}`">
          <FeatureRow
            :to="moduleLink(module)"
            :icon="MODULE_ICONS[module.key]"
            :tint="colours.tint"
            :title="$t(`${texts}.modules.${module.key}.title`)"
            :description="$t(`${texts}.modules.${module.key}.summary`)"
            :badge="module.route ? undefined : $t('journey.teach.preview')"
          />
        </li>
      </ul>

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

      <!-- only teach keeps the assistant panel; Ask WeLearn is in the top navigation everywhere -->
      <AskWeLearnPanel v-if="space === 'teach'" :space="space" />
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

/* module cards share the row evenly (three or two cards, no empty slot) */
.feature-list {
  margin-top: 1.5rem;
  border-top: 1px solid var(--neutral-20);
  list-style: none;
}

.feature-list li {
  border-bottom: 1px solid var(--neutral-20);
}

.cards.is-modules {
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
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
