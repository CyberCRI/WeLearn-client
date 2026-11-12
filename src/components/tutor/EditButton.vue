<script setup lang="ts">
import EditIcon from '@/components/icons/EditIcon.vue';

// a small pencil button for a secondary inline edit (step 2): what it edits is its accessible
// name and its tooltip. important decisions keep their text buttons
// ponytail: not ButtonComponent, which has no icon-only form; a plain button keeps this one small
defineProps<{ label: string }>();
</script>

<template>
  <button type="button" class="edit-button" :aria-label="label" :title="label">
    <EditIcon aria-hidden="true" />
  </button>
</template>

<style scoped>
.edit-button {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: none;
  border-radius: 4px;
  background: none;
  color: var(--neutral-70);
  cursor: pointer;
  &:hover {
    background: var(--neutral-10);
    color: var(--primary-dark);
  }
  &:focus-visible {
    outline: 2px solid var(--primary-dark);
    outline-offset: 1px;
  }
  :deep(svg) {
    width: 1rem;
    height: 1rem;
  }
}
</style>
