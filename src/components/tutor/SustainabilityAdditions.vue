<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import ConnectionCard from '@/components/tutor/ConnectionCard.vue';
import { useConnectionsStore } from '@/stores/connections';
import { useTutorStore } from '@/stores/tutor';
import { capitalise } from '@/utils/strings';

// step 3 "sustainability additions", reused from the "design your course" prototype: a few
// sustainability connections WeLearn suggests for the confirmed course, each backed by WeLearn
// resources. only the real steps are shown while waiting (ideas, searches, selection); failures
// and empty results are said plainly. nothing here changes the course
const tutor = useTutorStore();
const store = useConnectionsStore();

const find = () =>
  store.findConnections(
    tutor.confirmedCourse,
    tutor.courseParts,
    tutor.syllabusLanguage === 'en' ? 'en' : 'fr',
    tutor.courseTopics
  );

// suggestions are made once per confirmed course: confirming it again after a correction in
// step 2 makes them again
// once work is done here, a corrected course keeps it: the teacher looks again on request
const refresh = () => {
  if (store.isFor(tutor.confirmedCourse)) return;
  if (store.hasWork) store.keepFor(tutor.confirmedCourse, tutor.courseParts, tutor.courseTopics);
  else find();
};
onMounted(refresh);
watch(() => tutor.confirmations, refresh);

// the course being adapted, in one discreet line (the back link above leads to its review)
const courseLine = computed(() =>
  [
    tutor.confirmedCourse.title,
    capitalise(tutor.confirmedCourse.discipline || ''),
    tutor.confirmedCourse.level
  ]
    .filter(Boolean)
    .join(' · ')
);

const WAITING_STEPS = ['thinking', 'searching', 'selecting'] as const;
const stepIndex = computed(() =>
  WAITING_STEPS.indexOf(store.status as (typeof WAITING_STEPS)[number])
);
const isWaiting = computed(() => stepIndex.value !== -1);

const supported = computed(() =>
  store.connections.filter((c) => c.decision !== 'setAside' && c.resources.length)
);
// an idea whose resources could not be judged (a technical failure): shown with the others, with
// a way to check it again, never among the ideas WeLearn found no support for
const unchecked = computed(() =>
  store.connections.filter((c) => c.decision !== 'setAside' && c.isUnchecked)
);
const unsupported = computed(() =>
  store.connections.filter(
    (c) => c.decision !== 'setAside' && !c.resources.length && !c.isUnchecked
  )
);
const setAside = computed(() => store.connections.filter((c) => c.decision === 'setAside'));
</script>

<template>
  <section class="additions" data-testid="additions">
    <button type="button" class="back-link" data-testid="back-to-check" @click="tutor.setStep(2)">
      ← {{ $t('tutor.additions.backToCheck') }}
    </button>
    <!-- the confirmed course, one discreet line -->
    <p class="course-line" data-testid="course-line">
      <span>{{ courseLine }}</span>
    </p>
    <h1 class="additions-title">{{ $t('tutor.additions.title') }}</h1>
    <p class="additions-intro">{{ $t('tutor.additions.intro') }}</p>
    <div
      v-if="store.isCourseChanged && store.status === 'ready'"
      class="course-changed"
      role="status"
      data-testid="course-changed"
    >
      <p>{{ $t('tutor.additions.courseChanged') }}</p>
      <button type="button" class="button is-small" data-testid="find-again" @click="find">
        {{ $t('tutor.additions.findAgain') }}
      </button>
    </div>

    <ol v-if="isWaiting" class="waiting-steps" aria-live="polite" data-testid="additions-waiting">
      <li
        v-for="(step, index) in WAITING_STEPS"
        :key="step"
        :class="index === stepIndex ? 'is-active' : index < stepIndex ? 'is-done' : 'is-pending'"
      >
        {{
          step === 'searching' && stepIndex > index
            ? $t('tutor.additions.found', { count: store.candidateCount })
            : $t(`tutor.additions.${step}`)
        }}
      </li>
    </ol>

    <div
      v-else-if="store.status === 'unavailable' || store.status === 'error'"
      class="problem"
      role="alert"
      :data-testid="`additions-${store.status}`"
    >
      <p>{{ $t(`tutor.additions.${store.status}`) }}</p>
      <button type="button" class="button is-small" data-testid="retry" @click="find">
        {{ $t('tutor.additions.retry') }}
      </button>
    </div>

    <template v-else-if="store.status === 'ready'">
      <p v-if="!store.connections.length" class="empty" data-testid="no-connections">
        {{ $t('tutor.additions.noConnections') }}
        <span v-if="store.noneReason" class="none-reason" data-testid="none-reason">
          {{ $t('tutor.additions.noneReason', { reason: store.noneReason }) }}
        </span>
      </p>
      <p v-else-if="!supported.length && !unchecked.length" class="empty" data-testid="no-support">
        {{ $t('tutor.additions.noSupport') }}
      </p>
      <div class="connection-list">
        <ConnectionCard
          v-for="connection in supported"
          :key="connection.id"
          :connection="connection"
        />
        <ConnectionCard
          v-for="connection in unchecked"
          :key="connection.id"
          :connection="connection"
        />
      </div>
      <p v-if="store.leftOut" class="left-out" data-testid="left-out">
        {{ $t('tutor.additions.leftOut', store.leftOut) }}
      </p>

      <!-- ideas WeLearn could not back with a resource: kept apart, never presented as supported -->
      <details v-if="unsupported.length" class="secondary" data-testid="unsupported-list">
        <summary>
          {{ $t('tutor.additions.unsupportedTitle', { count: unsupported.length }) }}
        </summary>
        <div class="connection-list">
          <ConnectionCard
            v-for="connection in unsupported"
            :key="connection.id"
            :connection="connection"
          />
        </div>
      </details>

      <details v-if="setAside.length" class="secondary" data-testid="set-aside-list">
        <summary>{{ $t('tutor.additions.setAsideTitle', { count: setAside.length }) }}</summary>
        <ul class="set-aside">
          <li v-for="connection in setAside" :key="connection.id">
            <span>{{ connection.title }}</span>
            <button
              type="button"
              class="button is-small is-text"
              data-testid="bring-back"
              @click="store.reopen(connection.id)"
            >
              {{ $t('tutor.additions.bringBack') }}
            </button>
          </li>
        </ul>
      </details>

      <div class="next-step">
        <p class="next" data-testid="accepted-count">
          {{ $t('tutor.additions.acceptedCount', store.acceptedChanges.length) }}
          <span class="muted">{{ $t('tutor.additions.change.consequence') }}</span>
        </p>
        <button
          type="button"
          class="button is-primary"
          data-testid="to-updated"
          @click="tutor.setStep(4)"
        >
          {{ $t('tutor.additions.toUpdated') }} →
        </button>
      </div>
    </template>
  </section>
</template>

<style scoped>
.course-changed {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1rem;
  margin-top: 1rem;
  padding: 0.6rem 0.9rem;
  border-left: 3px solid var(--primary);
  background: var(--neutral-10);
  font-size: 0.9rem;
}

.none-reason {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.9rem;
  color: var(--neutral-70);
}

.left-out {
  margin-top: 0.75rem;
  font-size: 0.9rem;
  color: var(--neutral-70);
}

.additions {
  width: 100%;
  max-width: 56rem;
}

/* a plain text link, like the back link of the first steps */
.back-link {
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  font-size: 0.9rem;
  color: var(--primary-dark);
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
  &:focus-visible {
    outline: 2px solid var(--primary-dark);
    outline-offset: 2px;
  }
}

.course-line {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.25rem 0.5rem;
  margin: 0.75rem 0 1.25rem;
  font-size: 0.9rem;
  color: var(--neutral-70);
}

.additions-title {
  font-size: 1.35rem;
  font-weight: 700;
}

.additions-intro {
  margin-top: 0.25rem;
  color: var(--neutral-80);
}

.waiting-steps {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1.25rem;
  list-style: none;
}

.waiting-steps li {
  position: relative;
  padding-left: 1.5rem;
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

.secondary {
  margin-top: 1.25rem;
  font-size: 0.95rem;
}

.secondary summary {
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

.next-step {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.75rem;
}

.next {
  margin-top: 1.5rem;
  font-weight: 600;
}

.muted {
  display: block;
  font-size: 0.85rem;
  font-weight: 400;
  color: var(--neutral-70);
}
</style>
