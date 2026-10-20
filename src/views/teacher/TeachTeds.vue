<script setup lang="ts">
import AiLabel from '@/components/AiLabel.vue';
import SpaceLabel from '@/components/SpaceLabel.vue';
import PreviewIntro from '@/components/teacher/PreviewIntro.vue';
import {
  TEACHER_SPACES,
  TEACHER_SPACE_COLOURS,
  TEDS_THEMES
} from '@/components/teacher/teacherSpaces';

// preview: how WeLearn will support a TEDS course, theme by theme, through the four spaces
</script>
<template>
  <div class="teach-page">
    <div class="teach-content">
      <router-link class="back-link" :to="{ name: 'teach' }">
        ← {{ $t('journey.teach.allSpaces') }}
      </router-link>
      <h1 class="title is-3 is-size-4-mobile mt-5">{{ $t('journey.teach.teds.title') }}</h1>
      <p class="subtitle is-6 mt-2 intro">{{ $t('journey.teach.teds.intro') }}</p>
      <PreviewIntro
        :question="$t('journey.teach.teds.question')"
        :objective="$t('journey.teach.teds.objective')"
      />

      <h2 class="section-title">{{ $t('journey.teach.teds.themesTitle') }}</h2>
      <ul class="themes">
        <li v-for="theme in TEDS_THEMES" :key="theme" :data-testid="`teds-theme-${theme}`">
          {{ $t(`journey.teach.teds.themeList.${theme}`) }}
        </li>
      </ul>

      <h2 class="section-title">{{ $t('journey.teach.teds.howTitle') }}</h2>
      <ol class="how">
        <li v-for="space in TEACHER_SPACES" :key="space" :data-testid="`teds-how-${space}`">
          <router-link
            class="how-space"
            :to="{ name: 'teach-space', params: { space } }"
            :style="{ '--accent': TEACHER_SPACE_COLOURS[space].accent }"
          >
            <SpaceLabel
              :text="$t(`journey.teach.spaces.${space}.name`)"
              :tint="TEACHER_SPACE_COLOURS[space].tint"
            />
          </router-link>
          <span>{{ $t(`journey.teach.teds.how.${space}`) }}</span>
          <AiLabel v-if="space === 'design'" :text="$t('journey.teach.ai.draft')" />
        </li>
      </ol>
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

.intro {
  max-width: 44rem;
}

.section-title {
  margin-top: 2rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.themes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.themes li {
  padding: 0.4rem 0.9rem;
  border: 1px solid var(--neutral-20);
  border-left: 4px solid var(--primary);
  border-radius: 8px;
  font-weight: 600;
}

.how {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.75rem;
  list-style: none;
}

.how li {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.how-space {
  min-width: 7.5rem;
}

@media (max-width: 600px) {
  .teach-content {
    padding: 1.5rem 1rem 2rem;
  }
}
</style>
