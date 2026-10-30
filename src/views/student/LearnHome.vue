<script setup lang="ts">
import SpaceCard from '@/components/SpaceCard.vue';
import { SPACE_COLOURS, STUDENT_SPACES } from '@/components/student/spaces';
import { useStudentLanguage } from '@/components/student/useStudentLanguage';

// the learner homepage, built like the teachers' (/teach): a title, a short intro and one card per
// learning space. the conversation with the tutor is in the header's Ask WeLearn
useStudentLanguage();
</script>
<template>
  <div class="learn-page">
    <div class="learn-content">
      <h1 class="title is-3 is-size-4-mobile">{{ $t('student.home.title') }}</h1>
      <p class="subtitle is-6 mt-2 intro">{{ $t('student.home.intro') }}</p>

      <ul class="spaces">
        <li v-for="space in STUDENT_SPACES" :key="space" :data-testid="`space-card-${space}`">
          <SpaceCard
            :label="$t(`student.spaces.${space}.name`)"
            :title="$t(`student.spaces.${space}.title`)"
            :description="$t(`student.spaces.${space}.description`)"
            :accent="SPACE_COLOURS[space].accent"
            :tint="SPACE_COLOURS[space].tint"
            :to="{ name: 'learn-space', params: { space } }"
            :actionText="$t('student.home.getStarted')"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* the layout of the teachers' homepage (TeachHome) */
.learn-page {
  height: 100%;
  overflow-y: auto;
}

.learn-content {
  width: 100%;
  max-width: 84rem;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 3rem;
}

.intro {
  max-width: 44rem;
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
  .learn-content {
    padding: 1.5rem 1rem 2rem;
  }

  .spaces {
    grid-template-columns: 1fr;
  }
}
</style>
