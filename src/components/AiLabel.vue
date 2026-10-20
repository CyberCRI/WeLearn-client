<script setup lang="ts">
// marks what the AI produces ("Ask WeLearn", "AI draft", "AI-adapted from documents"), so teachers
// always see what comes from the AI and what comes from sources; same look everywhere.
// without `text` only the small "AI" mark is shown (inside a button, for example)
defineProps<{ text?: string }>();
</script>
<template>
  <span v-if="text" class="ai-label" data-testid="ai-label">
    <span class="ai-mark" aria-hidden="true">AI</span>
    {{ text }}
  </span>
  <span v-else class="ai-mark" data-testid="ai-label">AI</span>
</template>

<style scoped>
.ai-label {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: 0.35rem;
  padding: 0.1rem 0.5rem 0.1rem 0.15rem;
  border: 1px solid var(--lpi-violet);
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--neutral-80);
  background: var(--lpi-violet-lighter);
  white-space: nowrap;
}

.ai-mark {
  padding: 0 0.35rem;
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: var(--neutral-0);
  background: var(--lpi-violet);
}
</style>
