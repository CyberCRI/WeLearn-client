<script setup lang="ts">
import TooltipComponent from './TooltipComponent.vue';

defineProps<{ content: string }>();
</script>

<template>
  <div class="pill" :style="{ 'background-color': `var(--sdg-${content})` }">
    {{ content }}
    <TooltipComponent class="tltip" :tooltipText="$t(`sdgs.${content}`)" />
  </div>
</template>

<style scoped>
.tltip {
  display: none;
}

/* flex-centred number with tabular digits, so 1 and 13 both sit dead centre */
.pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: default;
  padding: 0;
  border-radius: 0.375rem;
  color: var(--neutral-0);
  font-size: 0.75rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  height: 1.5rem;
  width: 1.5rem;
  &:hover {
    .tltip {
      display: block;
    }
  }
}

@media (max-width: 768px) {
  .pill {
    font-size: 0.7rem;
    height: 1.25rem;
    width: 1.25rem;
  }
}
</style>
