<script setup lang="ts">
import TooltipComponent from './TooltipComponent.vue';

defineProps<{ content: string; hasGrayScale?: boolean }>();
</script>

<template>
  <div
    class="pill"
    :class="hasGrayScale && 'gray-scale'"
    :style="{ 'background-color': `var(--sdg-${content})` }"
  >
    {{ content }}
    <TooltipComponent class="tltip" isRight isOnTop :tooltipText="$t(`sdgs.${content}`)" />
  </div>
</template>

<style scoped>
.tltip {
  display: none;
}

.pill {
  cursor: default;
  text-align: center;
  padding: 0rem 0rem;
  border-radius: 0.5rem;
  color: var(--neutral-0);
  font-size: 0.875em;
  font-weight: 900;
  height: 1.5rem;
  width: 1.5rem;
  &:hover {
    .tltip {
      display: block;
    }
  }
}

.pill.gray-scale {
  filter: grayscale(40%);
  opacity: 0.9;
}
</style>
