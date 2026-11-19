<script setup lang="ts">
import TooltipComponent from '@/components/TooltipComponent.vue';

// a short note on where a value comes from or how sure it is ("To check"), its explanation on
// hover or keyboard focus. keeps the AI's part and doubts visible without long sentences
defineProps<{ label: string; detail: string }>();
</script>

<template>
  <span class="ai-note" tabindex="0" :aria-label="`${label}: ${detail}`">
    {{ label }} <span class="info" aria-hidden="true">ⓘ</span>
    <TooltipComponent class="tltip" :tooltipText="detail" />
  </span>
</template>

<style scoped>
.ai-note {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  margin-left: 0.4rem;
  font-size: 0.8rem;
  color: var(--neutral-70);
  white-space: nowrap;
  cursor: help;
  &:hover .tltip,
  &:focus-visible .tltip {
    display: block;
  }
  &:focus-visible {
    outline: 2px solid var(--primary-dark);
    outline-offset: 2px;
  }
}

.tltip {
  display: none;
}

.info {
  font-size: 0.85rem;
}
</style>
