<script setup lang="ts">
import { ref, type Ref } from 'vue';
import SpaceLabel from '@/components/SpaceLabel.vue';
import CourseAdaptFlow from '@/components/teacher/CourseAdaptFlow.vue';
import { useCourseDesignStore } from '@/stores/courseDesign';
import { TEACHER_SPACE_COLOURS } from '@/components/teacher/teacherSpaces';

// "design your course" as one workspace: a single question, then the matching route right below.
// "yes" shows the existing-course flow (upload, example, paste, review); "no" is still being
// designed, so it says so instead of pretending to work
const store = useCourseDesignStore();
const colours = TEACHER_SPACE_COLOURS.design;
const texts = 'journey.teach.courseStart';

// some work on the existing course (a file, an example, a review) that changing path would lose
const hasWork = () => store.status !== 'idle' || !!store.source || !!store.file;

// coming back to a course already started: show it again
const choice: Ref<'yes' | 'no' | null> = ref(hasWork() ? 'yes' : null);

// "yes" folds the question into one line; changing path asks first when work would be lost
const isConfirmingChange = ref(false);
const handleChange = () => {
  if (hasWork()) isConfirmingChange.value = true;
  else choice.value = null;
};
const handleDiscard = () => {
  store.$reset();
  isConfirmingChange.value = false;
  choice.value = null;
};
</script>
<template>
  <div class="course-start">
    <div class="course-start-content">
      <router-link class="back-link" :to="{ name: 'teach-space', params: { space: 'design' } }">
        ← {{ $t('journey.teach.spaces.design.pageTitle') }}
      </router-link>
      <div class="mt-5">
        <SpaceLabel :text="$t('journey.teach.spaces.design.name')" :tint="colours.tint" />
      </div>
      <h1 class="title is-3 is-size-4-mobile mt-3">
        {{ $t('journey.teach.spaces.design.modules.course.title') }}
      </h1>

      <!-- once on the existing-course path, the question is one discreet line -->
      <div v-if="choice === 'yes'" class="chosen-path" data-testid="chosen-path">
        <p v-if="!isConfirmingChange" class="chosen-line">
          {{ $t(`${texts}.working`) }}
          <button
            type="button"
            class="button is-small is-text"
            data-testid="change-path"
            @click="handleChange"
          >
            {{ $t(`${texts}.change`) }}
          </button>
        </p>
        <div v-else class="change-warning" role="alert" data-testid="change-warning">
          <p>{{ $t(`${texts}.changeWarning`) }}</p>
          <div class="change-actions">
            <button
              type="button"
              class="button is-small"
              data-testid="discard-change"
              @click="handleDiscard"
            >
              {{ $t(`${texts}.discard`) }}
            </button>
            <button
              type="button"
              class="button is-small is-text"
              data-testid="keep-working"
              @click="isConfirmingChange = false"
            >
              {{ $t(`${texts}.keepWorking`) }}
            </button>
          </div>
        </div>
      </div>

      <div v-else class="question" role="group" aria-labelledby="course-question">
        <p id="course-question" class="question-text">{{ $t(`${texts}.question`) }}</p>
        <div class="options">
          <button
            type="button"
            class="option"
            aria-pressed="false"
            data-testid="option-yes"
            @click="choice = 'yes'"
          >
            {{ $t(`${texts}.yes`) }}
          </button>
          <button
            type="button"
            class="option"
            :class="{ 'is-selected': choice === 'no' }"
            :aria-pressed="choice === 'no'"
            data-testid="option-no"
            @click="choice = 'no'"
          >
            {{ $t(`${texts}.no`) }}
          </button>
        </div>
      </div>

      <Transition name="reveal" mode="out-in">
        <div v-if="choice === 'yes'" key="yes" class="route" data-testid="route-existing">
          <CourseAdaptFlow />
        </div>
        <p
          v-else-if="choice === 'no'"
          key="no"
          class="not-yet"
          role="status"
          data-testid="route-new"
        >
          {{ $t(`${texts}.newCourse`) }}
        </p>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.course-start {
  height: 100%;
  overflow-y: auto;
}

.course-start-content {
  max-width: 72rem;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
}

.back-link {
  font-size: 0.9rem;
}

.question {
  margin-top: 1.25rem;
}

.question-text {
  font-size: 1.1rem;
  font-weight: 600;
}

.options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.option {
  padding: 0.55rem 1.1rem;
  border: 1px solid var(--neutral-20);
  border-radius: 999px;
  background: var(--neutral-0);
  font: inherit;
  color: var(--neutral-90);
  cursor: pointer;
  transition:
    border-color 0.15s,
    background-color 0.15s;
}

.option:hover {
  border-color: var(--primary-dark);
}

.option:focus-visible {
  outline: 2px solid var(--primary-dark);
  outline-offset: 2px;
}

.option.is-selected {
  border-color: var(--primary-dark);
  background: var(--primary-lighter);
  font-weight: 600;
}

.route {
  margin-top: 1.5rem;
}

.chosen-path {
  margin-top: 1rem;
}

.chosen-line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--neutral-70);
}

.change-warning {
  max-width: 40rem;
  padding: 0.75rem 1rem;
  border-left: 4px solid var(--lpi-yellow);
  border-radius: 4px;
  background: var(--lpi-yellow-lighter);
}

.change-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.not-yet {
  max-width: 40rem;
  margin-top: 1.5rem;
  padding: 0.75rem 1rem;
  border-left: 4px solid var(--lpi-yellow);
  border-radius: 4px;
  background: var(--lpi-yellow-lighter);
}

/* a short fade when the option changes; none for people who prefer reduced motion */
.reveal-enter-active,
.reveal-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.reveal-enter-from,
.reveal-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

@media (prefers-reduced-motion: reduce) {
  .option,
  .reveal-enter-active,
  .reveal-leave-active {
    transition: none;
  }
}

@media (max-width: 600px) {
  .course-start-content {
    padding: 1.5rem 1rem 2rem;
  }
}
</style>
