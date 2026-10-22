<script setup lang="ts">
import SpaceLabel from '@/components/SpaceLabel.vue';
import CourseAdaptFlow from '@/components/teacher/CourseAdaptFlow.vue';
import { TEACHER_SPACE_COLOURS } from '@/components/teacher/teacherSpaces';

// direct page of the course design prototype, "adapt my existing course"; the same flow is also
// shown inside "design your course" (/teach/design/course). /tutor is unchanged
const colours = TEACHER_SPACE_COLOURS.design;
</script>
<template>
  <div class="adapt-page">
    <div class="adapt-content">
      <router-link class="back-link" :to="{ name: 'teach-course' }">
        ← {{ $t('journey.teach.spaces.design.modules.course.title') }}
      </router-link>
      <div class="mt-5">
        <SpaceLabel :text="$t('journey.teach.spaces.design.name')" :tint="colours.tint" />
      </div>
      <h1 class="title is-3 is-size-4-mobile mt-3">{{ $t('journey.teach.adapt.title') }}</h1>
      <p class="subtitle is-6 mt-2 intro">{{ $t('journey.teach.adapt.intro') }}</p>

      <CourseAdaptFlow />
    </div>
  </div>
</template>

<style scoped>
.adapt-page {
  height: 100%;
  overflow-y: auto;
}

.adapt-content {
  max-width: 72rem;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
}

.back-link {
  font-size: 0.9rem;
}

.intro {
  max-width: 44rem;
  margin-bottom: 1.5rem;
}

@media (max-width: 600px) {
  .adapt-content {
    padding: 1.5rem 1rem 2rem;
  }
}
</style>
