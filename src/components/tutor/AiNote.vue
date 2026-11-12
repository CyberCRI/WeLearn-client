<script setup lang="ts">
// a short note on where a value comes from or how sure it is ("Suggested by WeLearn"), its full
// explanation on hover or keyboard focus. keeps AI origin and doubts visible without long sentences
defineProps<{ label: string; detail: string }>();
</script>

<template>
  <span class="ai-note" tabindex="0" :title="detail" :aria-label="`${label}: ${detail}`">
    {{ label }} <span class="info" aria-hidden="true">ⓘ</span>
  </span>
</template>

<style scoped>
.ai-note {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  margin-left: 0.4rem;
  font-size: 0.8rem;
  color: var(--neutral-70);
  white-space: nowrap;
  cursor: help;
}

.ai-note:focus-visible {
  outline: 2px solid var(--primary-dark);
  outline-offset: 2px;
}

.info {
  font-size: 0.85rem;
}
</style>
