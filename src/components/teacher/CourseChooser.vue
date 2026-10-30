<script setup lang="ts">
import { useCourseDesignStore } from '@/stores/courseDesign';

// the document holds several courses: the teacher picks the one to work on, so they are never
// merged into one imaginary course. the titles are copied from the document
const store = useCourseDesignStore();
const texts = 'journey.teach.adapt.choose';
</script>
<template>
  <section class="course-chooser" data-testid="course-chooser">
    <h2 class="chooser-title">{{ $t(`${texts}.title`) }}</h2>
    <p class="chooser-intro">{{ $t(`${texts}.intro`, { name: store.file?.name || '' }) }}</p>
    <ul class="choices">
      <li v-for="title in store.coursesFound" :key="title">
        <button
          type="button"
          class="choice"
          data-testid="course-choice"
          @click="store.chooseCourse(title)"
        >
          {{ title }}
        </button>
      </li>
    </ul>
    <button
      type="button"
      class="button is-small is-text"
      data-testid="one-course"
      @click="store.keepWholeDocument()"
    >
      {{ $t(`${texts}.oneCourse`) }}
    </button>
  </section>
</template>

<style scoped>
.course-chooser {
  max-width: 40rem;
}

.chooser-title {
  font-size: 1.35rem;
  font-weight: 700;
}

.chooser-intro {
  margin-top: 0.25rem;
  color: var(--neutral-80);
}

.choices {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1rem 0 0.75rem;
}

.choice {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--neutral-20);
  border-radius: 8px;
  background: var(--neutral-0);
  font: inherit;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
}

.choice:hover,
.choice:focus-visible {
  border-color: var(--primary);
  background: var(--primary-lighter);
}
</style>
