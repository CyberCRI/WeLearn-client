<script setup lang="ts">
import { computed } from 'vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import ResourceList from '@/components/tutor/ResourceList.vue';
import { type Connection, useConnectionsStore } from '@/stores/connections';
import { useCourseStore } from '@/stores/course';
import { evidenceState, placeInCourse, sourceName } from '@/utils/connections';

// one suggested connection, read in four lines: what is suggested (its title), where it connects
// to the course, why it could be useful, and how well it is supported. the sources are one line
// (how many, from where), their details one click away; resources that only give background stay
// apart, folded, never counted as support. an idea WeLearn could not support says so plainly
const props = defineProps<{ connection: Connection }>();
const store = useConnectionsStore();
const course = useCourseStore();

const state = computed(() => evidenceState(props.connection));
const resources = computed(() => props.connection.evidence?.resources ?? []);
const background = computed(() => props.connection.evidence?.background ?? []);
// the judgement's words once the resources are judged, the idea's own until then
const why = computed(() => props.connection.evidence?.why || props.connection.why);

// what the connection is about in the course, and where it is taught when the outline says so
// reliably; an objective or competency is named by a few words (its number otherwise), its full
// wording one click away. nothing is placed by guess
const place = computed(() => {
  const { topics, objectives, competencies, sessions } = course.courseToUpdate;
  return placeInCourse(props.connection.anchor, {
    topics: topics.flatMap(({ title, subtopics }) => [title, ...subtopics]),
    objectives,
    competencies,
    sessions
  });
});
const isNumbered = computed(
  () => place.value?.kind === 'objective' || place.value?.kind === 'competency'
);

const sourceNames = computed(() =>
  [...new Set(resources.value.map(({ document }) => sourceName(document)))].join(', ')
);
</script>

<template>
  <article
    class="connection"
    :class="{ 'is-selected': connection.decision === 'selected' }"
    data-testid="connection"
  >
    <h3 class="connection-title">{{ connection.title }}</h3>
    <div v-if="place" class="where" data-testid="where">
      <span class="label">{{ $t('tutor.additions.connectsTo') }}</span>
      <details v-if="isNumbered" class="full-anchor" data-testid="anchor-ref">
        <summary>
          {{
            connection.anchor_label ||
            $t(`tutor.additions.${place.kind}Ref`, { n: place.index + 1 })
          }}
        </summary>
        <p class="anchor-text" data-testid="anchor-full">{{ place.full }}</p>
      </details>
      <span v-else :title="place.full" data-testid="anchor-topic">{{ place.subject }}</span>
      <span v-if="place.placement" class="muted" data-testid="placement">
        · {{ place.placement }}
      </span>
    </div>

    <div class="block">
      <span class="label">{{ $t('tutor.additions.why') }}</span>
      <p class="why" data-testid="why">{{ why }}</p>
    </div>

    <div class="block" data-testid="sources">
      <span class="label">{{ $t('tutor.additions.sources') }}</span>
      <p v-if="state === 'pending'" class="muted" role="status" data-testid="pending">
        {{ $t('tutor.additions.pending') }}
      </p>
      <details v-else-if="resources.length" class="sources" data-testid="resources">
        <summary>
          {{ $t('tutor.additions.sourceCount', resources.length) }}
          <span class="muted">— {{ sourceNames }}</span>
        </summary>
        <ResourceList :resources="resources" />
      </details>
      <!-- a technical failure, said as such, with a way to check again -->
      <div
        v-else-if="state === 'unchecked'"
        class="warning unchecked"
        role="status"
        data-testid="unchecked"
      >
        <span>{{
          $t(connection.isChecking ? 'tutor.additions.rechecking' : 'tutor.additions.unchecked')
        }}</span>
        <ButtonComponent
          v-if="!connection.isChecking"
          class="is-small"
          data-testid="recheck"
          @click="store.recheck(connection.id)"
        >
          {{ $t('tutor.additions.retry') }}
        </ButtonComponent>
      </div>
      <p v-else class="warning" data-testid="unsupported">
        {{ $t('tutor.additions.unsupported') }}
      </p>
      <!-- resources about the broader sustainability issue only: background, never support -->
      <details v-if="background.length" class="related" data-testid="background">
        <summary>{{ $t('tutor.additions.background', { count: background.length }) }}</summary>
        <p class="background-hint">{{ $t('tutor.additions.backgroundHint') }}</p>
        <ResourceList :resources="background" />
      </details>
    </div>

    <div v-if="connection.decision === 'selected'" class="actions">
      <span class="selected-tag" data-testid="selected">{{ $t('tutor.additions.selected') }}</span>
      <ButtonComponent
        class="is-small is-text"
        data-testid="unselect"
        @click="store.reopen(connection.id)"
      >
        {{ $t('tutor.additions.undo') }}
      </ButtonComponent>
    </div>
    <div v-else class="actions">
      <ButtonComponent
        color="primary"
        is-discreet
        class="is-small"
        data-testid="select"
        @click="store.select(connection.id)"
      >
        {{ $t('tutor.additions.select') }}
      </ButtonComponent>
      <ButtonComponent
        class="is-small is-text"
        data-testid="set-aside"
        @click="store.setAside(connection.id)"
      >
        {{ $t('tutor.additions.setAside') }}
      </ButtonComponent>
    </div>
  </article>
</template>

<style scoped>
.connection {
  padding: 1.25rem 1.5rem;
  border: 1px solid var(--neutral-20);
  border-radius: 8px;
  background: var(--neutral-0);
}

.connection.is-selected {
  border-color: var(--primary);
}

.connection-title {
  font-size: 1.1rem;
  font-weight: 700;
}

.full-anchor summary {
  cursor: pointer;
}

.anchor-text {
  margin-top: 0.25rem;
  color: var(--neutral-80);
}

.where {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.25rem 0.5rem;
  margin-top: 0.35rem;
  font-size: 0.9rem;
}

.block {
  margin-top: 0.75rem;
}

.label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--neutral-70);
}

.where .label {
  display: inline;
}

.why {
  margin-top: 0.1rem;
}

.muted {
  font-size: 0.85rem;
  color: var(--neutral-70);
}

details summary {
  cursor: pointer;
}

.sources summary {
  font-size: 0.95rem;
}

.related {
  margin-top: 0.4rem;
  font-size: 0.9rem;
  summary {
    color: var(--neutral-80);
  }
}

.background-hint {
  margin-top: 0.4rem;
  font-size: 0.85rem;
  color: var(--neutral-70);
}

/* missing support stays visible: a calm but clear note, never folded */
.warning {
  margin-top: 0.1rem;
  padding-left: 0.6rem;
  border-left: 3px solid var(--neutral-70);
  font-size: 0.9rem;
  color: var(--neutral-80);
}

.unchecked {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1rem;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.selected-tag {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--primary-dark);
}
</style>
