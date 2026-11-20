<script setup lang="ts">
import { computed, onMounted } from 'vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import ConnectionCard from '@/components/tutor/ConnectionCard.vue';
import { useConnectionsStore } from '@/stores/connections';
import { useCourseStore } from '@/stores/course';
import { evidenceState } from '@/utils/connections';

// screen 3a "sustainability additions": a few sustainability connections WeLearn suggests for
// the confirmed course, each backed by WeLearn resources and shown as soon as they are judged.
// failures and empty results are said plainly. nothing here changes the course
const course = useCourseStore();
const store = useConnectionsStore();

const find = () => store.findConnections(course.confirmedCourse, course.language);

// suggestions are made once per confirmed course: confirming a corrected one makes them again,
// unless the teacher already worked on them; then they are kept and the change is said
onMounted(() => {
  if (store.isFor(course.confirmedCourse)) return;
  if (store.hasWork) store.keepFor(course.confirmedCourse);
  else find();
});

const isListed = computed(() => store.status === 'searching' || store.status === 'ready');

const shown = computed(() => store.connections.filter((c) => c.decision !== 'setAside'));
// supported, still being judged, or not judged (a technical failure, with a way to check again)
const main = computed(() =>
  shown.value.filter((c) => ['supported', 'pending', 'unchecked'].includes(evidenceState(c)))
);
// ideas WeLearn could not back with a resource: kept apart, never presented as supported
const unsupported = computed(() => shown.value.filter((c) => evidenceState(c) === 'unsupported'));
const setAside = computed(() => store.connections.filter((c) => c.decision === 'setAside'));
// forced ideas are only counted
const total = computed(() => store.connections.length - store.leftOut);
</script>

<template>
  <section class="additions" data-testid="additions">
    <h1 class="title is-4 is-size-5-mobile">{{ $t('tutor.additions.title') }}</h1>
    <p class="subtitle is-6">{{ $t('tutor.additions.intro') }}</p>

    <div
      v-if="store.isCourseChanged && isListed"
      class="course-changed"
      role="status"
      data-testid="course-changed"
    >
      <p>{{ $t('tutor.additions.courseChanged') }}</p>
      <ButtonComponent class="is-small" data-testid="find-again" @click="find">
        {{ $t('tutor.additions.findAgain') }}
      </ButtonComponent>
    </div>

    <p v-if="store.status === 'thinking'" class="waiting" aria-live="polite" data-testid="thinking">
      {{ $t('tutor.additions.thinking') }}
    </p>

    <div
      v-else-if="store.status === 'unavailable' || store.status === 'error'"
      class="problem"
      role="alert"
      :data-testid="`additions-${store.status}`"
    >
      <p>{{ $t(`tutor.additions.${store.status}`) }}</p>
      <ButtonComponent class="is-small" data-testid="retry" @click="find">
        {{ $t('tutor.additions.retry') }}
      </ButtonComponent>
    </div>

    <template v-else-if="isListed">
      <p
        v-if="store.status === 'searching'"
        class="waiting"
        aria-live="polite"
        data-testid="searching"
      >
        {{
          $t('tutor.additions.searching', {
            done: store.checkedCount,
            total: store.connections.length
          })
        }}
      </p>
      <p v-if="!store.connections.length" class="empty" data-testid="no-connections">
        {{ $t('tutor.additions.noConnections') }}
        <span v-if="store.noneReason" class="none-reason" data-testid="none-reason">
          {{ $t('tutor.additions.noneReason', { reason: store.noneReason }) }}
        </span>
      </p>
      <p
        v-else-if="store.status === 'ready' && total && !main.length && unsupported.length"
        class="empty"
        data-testid="no-support"
      >
        {{ $t('tutor.additions.noSupport') }}
      </p>

      <div class="connection-list">
        <ConnectionCard v-for="connection in main" :key="connection.id" :connection="connection" />
      </div>
      <p v-if="store.leftOut" class="left-out" data-testid="left-out">
        {{ $t('tutor.additions.leftOut', store.leftOut) }}
      </p>

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
            <ButtonComponent
              class="is-small is-text"
              data-testid="bring-back"
              @click="store.reopen(connection.id)"
            >
              {{ $t('tutor.additions.bringBack') }}
            </ButtonComponent>
          </li>
        </ul>
      </details>

      <p v-if="store.status === 'ready'" class="next" data-testid="selected-count">
        {{ $t('tutor.additions.selectedCount', store.selectedConnections.length) }}
        <template v-if="store.selectedConnections.some((c) => c.development)">
          ·
          <span data-testid="accepted-count">{{
            $t('tutor.additions.acceptedCount', store.acceptedChanges.length)
          }}</span>
        </template>
      </p>
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

.waiting {
  margin-top: 1.25rem;
  font-weight: 600;
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

.none-reason {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.9rem;
  color: var(--neutral-70);
}

.connection-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.25rem;
}

.left-out {
  margin-top: 0.75rem;
  font-size: 0.9rem;
  color: var(--neutral-70);
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

.next {
  margin-top: 1.5rem;
  font-weight: 600;
}
</style>
