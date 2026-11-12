<script setup lang="ts">
import { computed } from 'vue';
import i18n from '@/localisation/i18n';
import ConnectionDevelopment from '@/components/tutor/ConnectionDevelopment.vue';
import ResourceList from '@/components/tutor/ResourceList.vue';
import { useConnectionsStore, type Connection } from '@/stores/connections';
import { useTutorStore } from '@/stores/tutor';
import { placeInCourse } from '@/utils/connections';
import type { Document } from '@/types';
import { idToLabel } from '@/utils/strings';

// one suggested connection, read in four lines: what is suggested (its title), where it connects
// to the course, why it could be useful, and how well it is supported. the sources are one line
// (how many, from where), their details one click away; resources that only give background stay
// apart, folded, as "related reading", never counted as support. an idea WeLearn could not
// support says so plainly. the teacher develops it into one change (step 3b, in the card) or sets
// it aside
const props = defineProps<{ connection: Connection }>();
const store = useConnectionsStore();
const tutor = useTutorStore();

// what the connection is about in the course, and where it would be taught when the outline says
// so reliably: a session's subject and its placement ("CM7 · Semaine du 15/12"); a topic, placed
// only by the one session naming it; an objective or competency named by a few words (its number
// otherwise), its full wording one click away. nothing is placed by guess
const place = computed(() =>
  placeInCourse(props.connection.anchor, {
    topics: tutor.courseTopics.flatMap(({ value, subtopics }) => [value, ...(subtopics || [])]),
    objectives: tutor.courseOnlyObjectives.map(({ value }) => value),
    competencies: tutor.courseCompetencies.map(({ value }) => value),
    sessions: tutor.coursePlan
  })
);
const isNumbered = computed(
  () => place.value?.kind === 'objective' || place.value?.kind === 'competency'
);

// where the supporting sources come from, in a few words: a journal or publisher, else the
// collection ("Wikipedia")
const sourceName = (doc: Document) => {
  const details = (doc.payload.document_details || {}) as Record<string, unknown>;
  const named = [details.journal, details.publisher].find((v) => typeof v === 'string' && v);
  if (named) return named as string;
  const corpus = doc.payload.document_corpus;
  const key = `corpus.${corpus}`;
  return i18n.global.te(key) ? i18n.global.t(key) : idToLabel(corpus);
};
const sourceNames = computed(() =>
  [...new Set(props.connection.resources.map(({ document }) => sourceName(document)))].join(', ')
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
            connection.anchorLabel || $t(`tutor.additions.${place.kind}Ref`, { n: place.index + 1 })
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
      <p class="why" data-testid="why">{{ connection.why }}</p>
    </div>

    <div class="block" data-testid="sources">
      <span class="label">{{ $t('tutor.additions.sources') }}</span>
      <details v-if="connection.resources.length" class="sources" data-testid="resources">
        <summary>
          {{ $t('tutor.additions.sourceCount', connection.resources.length) }}
          <span class="muted">— {{ sourceNames }}</span>
        </summary>
        <ResourceList :resources="connection.resources" />
      </details>
      <!-- a technical failure, said as such, with a way to check again -->
      <div
        v-else-if="connection.isUnchecked"
        class="warning unchecked"
        role="status"
        data-testid="unchecked"
      >
        <span>{{
          $t(connection.isRechecking ? 'tutor.additions.rechecking' : 'tutor.additions.unchecked')
        }}</span>
        <button
          v-if="!connection.isRechecking && connection.queries?.length"
          type="button"
          class="button is-small"
          data-testid="recheck"
          @click="store.recheck(connection.id)"
        >
          {{ $t('tutor.additions.retry') }}
        </button>
      </div>
      <p v-else class="warning" data-testid="unsupported">
        {{ $t('tutor.additions.unsupported') }}
      </p>
      <!-- resources about the broader sustainability issue only: background, never support -->
      <details v-if="connection.background?.length" class="related" data-testid="background">
        <summary>
          {{ $t('tutor.additions.background', { count: connection.background.length }) }}
        </summary>
        <p class="background-hint">{{ $t('tutor.additions.backgroundHint') }}</p>
        <ResourceList :resources="connection.background" />
      </details>
    </div>

    <ConnectionDevelopment v-if="connection.development" :connection="connection" />

    <div v-else class="actions">
      <button
        type="button"
        class="button is-small is-primary is-outlined"
        data-testid="develop"
        @click="store.develop(connection.id)"
      >
        {{ $t('tutor.additions.develop') }}
      </button>
      <button
        type="button"
        class="button is-small is-text"
        data-testid="set-aside"
        @click="store.setAside(connection.id)"
      >
        {{ $t('tutor.additions.setAside') }}
      </button>
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
</style>
