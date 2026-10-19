<script setup lang="ts">
// the small coloured tag naming a space (UNDERSTAND, EXPLORE...); text stays dark for contrast
defineProps<{ text: string; tint?: string }>();
</script>
<template>
  <span class="space-label" :style="{ '--tint': tint }">{{ text }}</span>
</template>

<style scoped>
.space-label {
  align-self: flex-start;
  display: inline-block;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  background: var(--tint, var(--neutral-10));
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--neutral-80);
}
</style>
