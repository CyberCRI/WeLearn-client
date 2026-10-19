<script setup lang="ts">
import SpaceCard from '@/components/SpaceCard.vue';
import { TEACHER_SPACES, TEACHER_SPACE_COLOURS } from '@/components/teacher/teacherSpaces';
</script>
<template>
  <div class="teach-page">
    <div class="teach-content">
      <h1 class="title is-3 is-size-4-mobile">{{ $t('journey.teach.title') }}</h1>
      <p class="subtitle is-6 mt-2">{{ $t('journey.teach.intro') }}</p>

      <ul class="spaces">
        <li v-for="space in TEACHER_SPACES" :key="space" :data-testid="`teacher-space-${space}`">
          <SpaceCard
            :label="$t(`journey.teach.spaces.${space}.name`)"
            :title="$t(`journey.teach.spaces.${space}.title`)"
            :description="$t(`journey.teach.spaces.${space}.description`)"
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
  padding: 2.5rem 1.5rem 3rem;
}

.spaces {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-top: 2rem;
}

@media (max-width: 1100px) {
  .spaces {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .teach-content {
    padding: 1.5rem 1rem 2rem;
  }

  .spaces {
    grid-template-columns: 1fr;
  }
}
</style>
