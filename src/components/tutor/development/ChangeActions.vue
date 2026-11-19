<script setup lang="ts">
import ButtonComponent from '@/components/ButtonComponent.vue';
import type { ChangeDecision } from '@/stores/connections';

// the teacher's decision on a proposed change: accept, edit before accepting, or skip it (keep
// the original, for a revised objective); once decided, what it means, with a way back
defineProps<{ decision: ChangeDecision; isRevision: boolean }>();
const emit = defineEmits<{ accept: []; edit: []; keep: []; reconsider: [] }>();
</script>

<template>
  <div class="change-actions">
    <template v-if="decision === 'pending'">
      <ButtonComponent
        color="primary"
        class="is-small"
        data-testid="accept-change"
        @click="emit('accept')"
      >
        {{ $t('tutor.additions.change.accept') }}
      </ButtonComponent>
      <ButtonComponent class="is-small is-text" data-testid="edit-change" @click="emit('edit')">
        {{ $t('tutor.check.edit') }}
      </ButtonComponent>
      <ButtonComponent class="is-small is-text" data-testid="keep-original" @click="emit('keep')">
        {{
          isRevision ? $t('tutor.additions.change.keepOriginal') : $t('tutor.additions.change.skip')
        }}
      </ButtonComponent>
    </template>
    <template v-else>
      <span class="decided" :data-testid="`change-${decision}`">
        {{
          decision === 'accepted'
            ? '✓ ' + $t('tutor.additions.change.accepted')
            : isRevision
              ? $t('tutor.additions.change.kept')
              : $t('tutor.additions.change.skipped')
        }}
      </span>
      <ButtonComponent
        class="is-small is-text"
        data-testid="reconsider"
        @click="emit('reconsider')"
      >
        {{ $t('tutor.additions.undo') }}
      </ButtonComponent>
    </template>
  </div>
</template>

<style scoped>
.change-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.decided {
  font-weight: 600;
  color: var(--primary-dark);
}
</style>
