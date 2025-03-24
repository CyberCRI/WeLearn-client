<script setup lang="ts">
defineProps<{
  tooltipText: string;
  isLeft?: boolean;
  isRight?: boolean;
  isOnTop?: boolean;
}>();
</script>
<template>
  <div class="tooltip-wraper">
    <div class="tooltip" :class="{ isleft: isLeft, isright: isRight, top: isOnTop }">
      {{ tooltipText }}
    </div>
  </div>
</template>
<style scoped>
.tooltip-wraper {
  position: relative;
  display: none;
  z-index: 100;
}
.tooltip {
  position: absolute;

  top: 0rem;
  z-index: 100;

  padding: 0.5rem;
  background-color: var(--neutral-90);
  color: var(--neutral-0);
  border-radius: 0.5rem;
  font-size: 0.75rem;
  white-space: nowrap;
}

.top.isright {
  top: -60px;
  border-bottom-left-radius: 0;
  left: 0.5rem;
}

.tooltip.isleft {
  right: 1.5rem;
  border-top-right-radius: 0;
}

.tooltip.isright.not(.top) {
  left: 0.5rem;
  border-top-left-radius: 0;
}
</style>
