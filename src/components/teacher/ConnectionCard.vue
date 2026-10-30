<script setup lang="ts">
import ConnectionAdaptation from '@/components/teacher/ConnectionAdaptation.vue';
import SupportingResources from '@/components/teacher/SupportingResources.vue';
import { useCourseConnectionsStore, type Connection } from '@/stores/courseConnections';

// one suggested connection: its title, where it fits in the teacher's course and why it matters
// first; its supporting WeLearn resources, each with what it brings, one click away. the teacher
// develops it (editing happens on the adaptation) or sets it aside
defineProps<{ connection: Connection }>();
const store = useCourseConnectionsStore();
const texts = 'journey.teach.adapt.connections';
</script>
<template>
  <article
    class="connection"
    :class="{ 'is-chosen': connection.decision === 'chosen' }"
    data-testid="connection"
  >
    <h3 class="connection-title">{{ connection.title }}</h3>
    <p class="where" data-testid="where">
      <span class="label">{{ $t(`${texts}.where`) }}</span>
      <span v-if="connection.anchor">{{ connection.anchor }}</span>
      <span v-else class="muted">{{ $t(`${texts}.wholeCourse`) }}</span>
    </p>
    <p class="why" data-testid="why">{{ connection.why }}</p>

    <details class="more" data-testid="details">
      <summary>
        {{ $t(`${texts}.resources`) }}
        <span class="count">{{ connection.resources.length }}</span>
      </summary>
      <SupportingResources :resources="connection.resources" />
    </details>

    <div v-if="connection.decision === 'open'" class="actions">
      <button
        type="button"
        class="button is-small is-primary"
        data-testid="develop"
        @click="store.develop(connection.id)"
      >
        {{ $t(`${texts}.develop`) }}
      </button>
      <button
        type="button"
        class="button is-small is-text"
        data-testid="set-aside"
        @click="store.setAside(connection.id)"
      >
        {{ $t(`${texts}.setAside`) }}
      </button>
    </div>

    <ConnectionAdaptation v-if="connection.adaptation" :connection="connection" />
  </article>
</template>

<style scoped>
.connection {
  padding: 1.25rem 1.5rem;
  border: 1px solid var(--neutral-20);
  border-radius: 8px;
  background: var(--neutral-0);
}

.connection.is-chosen {
  border-color: var(--primary);
}

.connection-title {
  font-size: 1.1rem;
  font-weight: 700;
}

.label {
  margin-top: 0.75rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--neutral-70);
}

.where {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.25rem 0.5rem;
  margin-top: 0.25rem;
  font-size: 0.9rem;
}

.where .label {
  margin-top: 0;
}

.muted {
  color: var(--neutral-70);
}

.why {
  margin-top: 0.75rem;
}

.more {
  margin-top: 0.75rem;
  font-size: 0.95rem;
}

.more summary {
  font-weight: 600;
  cursor: pointer;
}

.count {
  margin-left: 0.25rem;
  padding: 0 0.5rem;
  border-radius: 1rem;
  background: var(--neutral-10);
  font-size: 0.85rem;
  color: var(--neutral-70);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}
</style>
