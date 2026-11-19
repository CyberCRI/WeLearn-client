<script setup lang="ts">
import { computed, ref } from 'vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import ChangeActions from '@/components/tutor/development/ChangeActions.vue';
import ChangeEvidence from '@/components/tutor/development/ChangeEvidence.vue';
import ChangeNotes from '@/components/tutor/development/ChangeNotes.vue';
import ChangePlacement from '@/components/tutor/development/ChangePlacement.vue';
import ChangeWording from '@/components/tutor/development/ChangeWording.vue';
import { type Connection, useConnectionsStore } from '@/stores/connections';

// the one syllabus change WeLearn suggests for a connection, inside its card, read in four parts:
// where it fits, the suggested wording, why it could be useful, and one sentence on how well it
// is supported. the sources and the check are one click away. the teacher accepts it, edits it
// before accepting, or skips it; the course itself is not changed here
const props = defineProps<{ connection: Connection }>();
const store = useConnectionsStore();

const development = computed(() => props.connection.development);
const proposal = computed(() => development.value?.proposal || null);

const isEditing = ref(false);
const handleSave = (text: string) => {
  store.acceptChange(props.connection.id, text);
  isEditing.value = false;
};
</script>

<template>
  <section v-if="development" class="development" data-testid="development">
    <p v-if="development.status === 'thinking'" class="waiting" role="status">
      <span class="dot" aria-hidden="true" />
      {{ $t('tutor.additions.change.thinking') }}
    </p>

    <div v-else-if="development.status !== 'ready'" class="problem" role="alert">
      <span data-testid="development-problem">{{
        $t(`tutor.additions.change.${development.status}`)
      }}</span>
      <ButtonComponent
        class="is-small"
        data-testid="retry-develop"
        @click="store.develop(connection.id)"
      >
        {{ $t('tutor.additions.retry') }}
      </ButtonComponent>
    </div>

    <template v-else-if="proposal">
      <h4 class="change-title">{{ $t('tutor.additions.change.title') }}</h4>

      <dl class="change">
        <dt>{{ $t('tutor.additions.change.placement') }}</dt>
        <dd data-testid="change-placement">
          <ChangePlacement :connection="connection" />
        </dd>

        <dt>{{ $t('tutor.additions.change.suggested') }}</dt>
        <dd data-testid="change-suggested">
          <ChangeWording
            :suggested="proposal.suggested"
            :edited="development.edited"
            :is-editing="isEditing"
            @save="handleSave"
            @cancel="isEditing = false"
          />
        </dd>

        <dt>{{ $t('tutor.additions.change.why') }}</dt>
        <dd data-testid="change-why">{{ proposal.why }}</dd>
      </dl>

      <ChangeEvidence :proposal="proposal" />
      <ChangeNotes :guidance="proposal.guidance" />

      <ChangeActions
        v-if="!isEditing"
        :decision="development.decision"
        :is-revision="proposal.kind === 'objective'"
        @accept="store.acceptChange(connection.id)"
        @edit="isEditing = true"
        @keep="store.keepOriginal(connection.id)"
        @reconsider="store.reconsider(connection.id)"
      />
    </template>
  </section>
</template>

<style scoped>
.development {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--neutral-20);
}

.waiting {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--neutral-80);
}

.dot {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  background: var(--lpi-violet);
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
  50% {
    opacity: 0.3;
  }
}

.problem {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  background: var(--lpi-yellow-lighter);
}

.change-title {
  font-size: 1rem;
  font-weight: 700;
}

.change {
  display: grid;
  grid-template-columns: 10rem minmax(0, 1fr);
  gap: 0.5rem 1rem;
  margin-top: 0.75rem;
}

.change dt {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--neutral-70);
}

@media (max-width: 600px) {
  .change {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.25rem;
  }
}
</style>
