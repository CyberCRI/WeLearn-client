<script setup lang="ts">
import { computed, onMounted } from 'vue';
import ConnectionCard from '@/components/teacher/ConnectionCard.vue';
import CourseProposalSummary from '@/components/teacher/CourseProposalSummary.vue';
import { useCourseDesignStore } from '@/stores/courseDesign';
import { useCourseConnectionsStore } from '@/stores/courseConnections';

// after the teacher confirmed their course: a one-line reminder of it, then a few sustainability
// connections suggested by WeLearn, each backed by WeLearn resources. only the real steps are
// shown while waiting (ideas, searches, selection); failures and empty results are said plainly
const design = useCourseDesignStore();
const store = useCourseConnectionsStore();
const texts = 'journey.teach.adapt.connections';

// a course from scratch brings its own sustainability opportunities (the ones the teacher kept)
const ideas = () => (design.isScratch ? design.keptIdeas : []);
const find = () =>
  store.findConnections(design.confirmedCourse, design.language === 'en' ? 'en' : 'fr', ideas());

onMounted(() => {
  if (!store.isFor(design.confirmedCourse, ideas())) find();
});

// back to the review; the suggestions are kept and made again only if the course changes
const handleReview = () => {
  design.isConfirmed = false;
};

const shown = computed(() => store.connections.filter((c) => c.decision !== 'setAside'));
const setAside = computed(() => store.connections.filter((c) => c.decision === 'setAside'));
const WAITING_STEPS = ['thinking', 'searching', 'selecting'];
const stepIndex = computed(() => WAITING_STEPS.indexOf(store.status));
const isWaiting = computed(() => stepIndex.value !== -1);
</script>
<template>
  <section class="course-connections" data-testid="connections">
    <p class="course-line" data-testid="course-line">
      <span class="course-label">{{ $t(`${texts}.courseLabel`) }}</span>
      <strong>{{ design.confirmedCourse.title || design.file?.name }}</strong>
      <button
        type="button"
        class="button is-small is-text"
        data-testid="review-course"
        @click="handleReview"
      >
        {{ $t(`${texts}.review`) }}
      </button>
    </p>

    <h2 class="connections-title">{{ $t(`${texts}.title`) }}</h2>
    <p class="connections-intro">{{ $t(`${texts}.intro`) }}</p>

    <ol v-if="isWaiting" class="waiting-steps" aria-live="polite" data-testid="connections-waiting">
      <li
        v-for="(step, index) in WAITING_STEPS"
        :key="step"
        :class="index === stepIndex ? 'is-active' : index < stepIndex ? 'is-done' : 'is-pending'"
      >
        {{
          step === 'searching' && stepIndex > index
            ? $t(`${texts}.found`, { count: store.documents.length })
            : $t(`${texts}.${step}`)
        }}
      </li>
    </ol>

    <div
      v-else-if="store.status === 'unavailable' || store.status === 'error'"
      class="problem"
      role="alert"
      :data-testid="`connections-${store.status}`"
    >
      <p>{{ $t(`${texts}.${store.status}`) }}</p>
      <button type="button" class="button is-small" @click="find">
        {{ $t(`${texts}.retry`) }}
      </button>
    </div>

    <template v-else-if="store.status === 'ready'">
      <p v-if="!store.documents.length" class="empty" data-testid="no-resources">
        {{ $t(`${texts}.noResources`) }}
      </p>
      <p v-else-if="!store.connections.length" class="empty" data-testid="no-connections">
        {{ $t(`${texts}.noConnections`) }}
      </p>
      <div class="connection-list">
        <ConnectionCard v-for="connection in shown" :key="connection.id" :connection="connection" />
      </div>
      <details v-if="setAside.length" class="set-aside" data-testid="set-aside-list">
        <summary>{{ $t(`${texts}.setAsideTitle`, { count: setAside.length }) }}</summary>
        <ul>
          <li v-for="connection in setAside" :key="connection.id">
            <span>{{ connection.title }}</span>
            <button
              type="button"
              class="button is-small is-text"
              @click="store.bringBack(connection.id)"
            >
              {{ $t(`${texts}.undo`) }}
            </button>
          </li>
        </ul>
      </details>
    </template>
    <!-- next step: an activity for this course, its context already filled in -->
    <p v-if="store.status === 'ready'" class="next-step">
      <router-link :to="{ name: 'teach-activity' }" data-testid="design-activity-link">
        {{ $t(`${texts}.designActivity`) }} →
      </router-link>
    </p>

    <!-- a course from scratch ends with the whole proposal, as the teacher shaped it -->
    <CourseProposalSummary v-if="design.isScratch && store.status === 'ready'" />
  </section>
</template>

<style scoped>
.course-connections {
  max-width: 48rem;
}

.course-line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem 0.75rem;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  background: var(--neutral-10);
}

.course-label {
  font-size: 0.85rem;
  color: var(--neutral-70);
}

.connections-title {
  margin-top: 1.5rem;
  font-size: 1.35rem;
  font-weight: 700;
}

.connections-intro {
  margin-top: 0.25rem;
  font-size: 0.9rem;
  color: var(--neutral-70);
}

.waiting-steps {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1.25rem;
  list-style: none;
}

.waiting-steps li {
  padding-left: 1.5rem;
  position: relative;
}

.waiting-steps li::before {
  position: absolute;
  left: 0;
  content: '○';
  color: var(--neutral-70);
}

.waiting-steps li.is-done::before {
  content: '✓';
  color: var(--primary);
}

.waiting-steps li.is-active {
  font-weight: 600;
}

.waiting-steps li.is-active::before {
  content: '●';
  color: var(--lpi-violet);
}

.waiting-steps li.is-pending {
  color: var(--neutral-70);
}

.problem {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.25rem;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  background: var(--lpi-yellow-lighter);
}

.empty {
  margin-top: 1.25rem;
  color: var(--neutral-80);
}

.connection-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.25rem;
}

.next-step {
  margin-top: 1.5rem;
  font-weight: 600;
}

.set-aside {
  margin-top: 1rem;
  font-size: 0.9rem;
}

.set-aside summary {
  font-weight: 600;
  cursor: pointer;
}

.set-aside li {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 0.4rem;
  color: var(--neutral-70);
}
</style>
