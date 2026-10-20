<script setup lang="ts">
import SpaceCard from '@/components/SpaceCard.vue';
import FastLane from '@/components/teacher/FastLane.vue';
import { TEACHER_SPACES, TEACHER_SPACE_COLOURS } from '@/components/teacher/teacherSpaces';
</script>
<template>
  <div class="teach-page">
    <div class="teach-content">
      <p class="identity" data-testid="identity">{{ $t('journey.teach.identity') }}</p>

      <FastLane class="mt-4" />

      <p class="teds-entry" data-testid="teds-entry">
        <span class="has-text-weight-semibold">{{ $t('journey.teach.teds.entry') }}</span>
        {{ $t('journey.teach.teds.themes') }} ·
        <router-link :to="{ name: 'teach-teds' }"
          >{{ $t('journey.teach.teds.start') }} →</router-link
        >
      </p>

      <h2 class="choose-title">{{ $t('journey.teach.chooseTitle') }}</h2>
      <ul class="spaces">
        <li v-for="space in TEACHER_SPACES" :key="space" :data-testid="`teacher-space-${space}`">
          <SpaceCard
            :label="$t(`journey.teach.spaces.${space}.name`)"
            :title="$t(`journey.teach.spaces.${space}.cardQuestion`)"
            :description="$t(`journey.teach.spaces.${space}.cardOutcome`)"
            :accent="TEACHER_SPACE_COLOURS[space].accent"
            :tint="TEACHER_SPACE_COLOURS[space].tint"
            :to="{ name: 'teach-space', params: { space } }"
            :actionText="$t('journey.teach.getStarted')"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.teach-page {
  height: 100%;
  overflow-y: auto;
}

.teach-content {
  max-width: 84rem;
  margin: 0 auto;
  padding: 1.5rem 1.5rem 3rem;
}

.identity {
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--primary-dark);
}

.teds-entry {
  margin-top: 1rem;
  padding: 0.6rem 1rem;
  border-left: 4px solid var(--primary);
  border-radius: 4px;
  background: var(--primary-lighter);
  font-size: 0.95rem;
}

.choose-title {
  margin-top: 2.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.spaces {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

@media (max-width: 1100px) {
  .spaces {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .teach-content {
    padding: 1rem 1rem 2rem;
  }

  .spaces {
    grid-template-columns: 1fr;
  }
}
</style>
