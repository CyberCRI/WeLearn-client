<script setup lang="ts">
import SearchSDG from '@/views/SearchSDG.vue';
import SpaceLabel from '@/components/SpaceLabel.vue';
import { TEACHER_SPACE_COLOURS } from '@/components/teacher/teacherSpaces';

// teacher explore: the existing search page itself (same search, results, source and sdg filters),
// with the teacher heading in its header slot; /search is unchanged
const colours = TEACHER_SPACE_COLOURS.explore;
const texts = 'journey.teach.spaces.explore';
</script>
<template>
  <SearchSDG>
    <template #header>
      <header class="explore-header" data-testid="explore-header">
        <router-link class="back-link" :to="{ name: 'teach' }">
          ← {{ $t('journey.teach.allSpaces') }}
        </router-link>
        <div class="mt-4">
          <SpaceLabel :text="$t(`${texts}.name`)" :tint="colours.tint" />
        </div>
        <h1 class="title is-3 is-size-4-mobile mt-3">{{ $t(`${texts}.pageTitle`) }}</h1>
        <p class="subtitle is-6 mt-2">{{ $t(`${texts}.intro`) }}</p>
      </header>
    </template>
  </SearchSDG>
</template>

<style scoped>
.explore-header {
  flex-shrink: 0;
  margin-bottom: 1.25rem;
}

.back-link {
  font-size: 0.9rem;
}
</style>
