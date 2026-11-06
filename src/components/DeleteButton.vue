<script setup lang="ts">
import TrashIcon from '@/components/icons/TrashIcon.vue';
import Tooltip from '@/components/TooltipComponent.vue';
defineProps<{ action: () => void; delText: string; toLeft?: boolean; disabled?: boolean }>();
</script>

<template>
  <button
    @click="action"
    :disabled="disabled"
    data-testid="clear-bookmark"
    :aria-label="delText"
    class="delete-button"
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
  color: var(--tertiary);
}

.delete-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.delete-button:hover {
  & > .tltip {
    display: block;
  }
}
</style>
