<script setup lang="ts">
import CourseBrief from '@/components/teacher/CourseBrief.vue';
import CourseReview from '@/components/teacher/CourseReview.vue';
import CourseConnections from '@/components/teacher/CourseConnections.vue';
import { useCourseDesignStore } from '@/stores/courseDesign';

// "create a course from scratch": the brief, WeLearn's proposal (one real request, nothing shown
// while waiting but that), the review of the proposal, then the same connections step as an
// existing course, ending with the course proposal to edit and copy
const store = useCourseDesignStore();

// a warning left from an earlier visit is not shown again: only a request that fails now shows one
store.dismissProblem();
</script>
<template>
  <div class="course-scratch-flow">
    <template v-if="store.isScratch && store.status === 'ready'">
      <CourseReview v-if="!store.isConfirmed" />
      <CourseConnections v-else />
    </template>

    <section
      v-else-if="store.isScratch && store.status === 'reading'"
      class="drafting"
      aria-live="polite"
      data-testid="drafting"
    >
      <span class="loader" aria-hidden="true" />
      {{ $t('journey.teach.scratch.drafting') }}
    </section>

    <template v-else>
      <div
        v-if="store.isScratch && (store.status === 'unavailable' || store.status === 'error')"
        class="problem"
        role="alert"
        :data-testid="`problem-${store.status}`"
      >
        <p class="problem-title">{{ $t(`journey.teach.scratch.${store.status}.title`) }}</p>
        <p>{{ $t(`journey.teach.scratch.${store.status}.text`) }}</p>
      </div>
      <CourseBrief />
    </template>
  </div>
</template>

<style scoped>
.drafting {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  max-width: 36rem;
  padding: 1.5rem;
  border: 1px solid var(--neutral-20);
  border-radius: 8px;
}

.loader {
  width: 1.1rem;
  height: 1.1rem;
  border: 2px solid var(--neutral-20);
  border-top-color: var(--lpi-violet);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.problem {
  max-width: 40rem;
  margin-bottom: 1.25rem;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  background: var(--lpi-yellow-lighter);
}

.problem-title {
  font-weight: 700;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
