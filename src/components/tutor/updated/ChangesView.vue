<script setup lang="ts">
import { computed } from 'vue';
import ConnectionDevelopment from '@/components/tutor/development/ConnectionDevelopment.vue';
import { useConnectionsStore } from '@/stores/connections';
import { useCourseStore } from '@/stores/course';
import { groupChanges } from '@/utils/updatedSyllabus';
import type { ApprovedChange } from '@/types';

// the accepted changes only, grouped by where they belong in the course, the unplaced last.
// each one is the same change as on the connection's card: edited, placed or taken back here,
// it changes everywhere
const props = defineProps<{ changes: ApprovedChange[] }>();

const course = useCourseStore();
const store = useConnectionsStore();
// each change with the connection it belongs to, whose card shows it
const groups = computed(() =>
  groupChanges(course.courseToUpdate, props.changes).map(({ placement, changes }) => ({
    placement,
    items: changes.map((change) => ({
      change,
      connection: store.connections.find(({ id }) => id === change.connectionId)
    }))
  }))
);
</script>

<template>
  <div data-testid="changes">
    <section
      v-for="group in groups"
      :key="group.placement || 'unplaced'"
      class="group"
      data-testid="change-group"
    >
      <h2 class="group-title" :class="{ 'is-unplaced': !group.placement }">
        {{ group.placement || $t('tutor.updated.placementUnknown') }}
      </h2>
      <article
        v-for="{ change, connection } in group.items"
        :key="change.connectionId"
        class="change"
        data-testid="approved-change"
      >
        <p class="kind">
          {{ $t(`tutor.additions.change.kinds.${change.kind}`) }}
          <span class="from">· {{ change.connection }}</span>
        </p>
        <ConnectionDevelopment v-if="connection" :connection="connection" class="development" />
      </article>
    </section>
  </div>
</template>

<style scoped>
.group {
  margin-top: 1.25rem;
}

.group-title {
  font-size: 1rem;
  font-weight: 700;
}

.group-title.is-unplaced {
  color: var(--neutral-70);
}

.change {
  margin-top: 0.6rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--neutral-20);
  border-radius: 8px;
}

.kind {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--neutral-70);
}

.from {
  font-weight: 400;
}

/* the card's own separator is not needed inside its frame */
.development {
  margin-top: 0.25rem;
  padding-top: 0;
  border-top: none;
}
</style>
