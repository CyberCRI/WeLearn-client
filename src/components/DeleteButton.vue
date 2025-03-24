<script setup lang="ts">
import TrashIcon from '@/components/icons/TrashIcon.vue';
import Tooltip from '@/components/TooltipComponent.vue';
defineProps<{ action: () => void; delText: string; toLeft?: boolean }>();
</script>

<template>
  <button
    @click="action"
    data-testid="clear-bookmark"
    :aria-label="delText"
    class="delete-button button is-outlined is-danger"
    :class="{ 'to-left': toLeft }"
  >
    <TrashIcon class="trash-icon" />
    <Tooltip class="tltip" isLeft :tooltipText="delText" />
  </button>
</template>
<style scoped>
.delete-button {
  display: flex;

  align-items: center;
  & > .tltip {
    display: none;
  }
}

.delete-button:hover {
  & > .tltip {
    display: block;
  }
}

.button.is-outlined.is-danger {
  border-color: var(--tertiary);
  color: var(--tertiary);
  background-color: transparent;
  --bulma-button-border-width: max(1px, 0.0625em);
}
</style>
