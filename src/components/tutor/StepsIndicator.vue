<script setup lang="ts">
import { scrollToAnchor } from '@/utils/navigation';
const props = defineProps<{
  step: number;
  stepsLength: number;
  advancement: number;
  setStep: (step: number) => void;
}>();

const stepsLengthArray = Array.from({ length: props.stepsLength }, (_, i) => i + 1);
</script>
<template>
  <div class="wrapper">
    <a
      href="#"
      class="step-indicator"
      v-for="i in stepsLengthArray"
      :key="i"
      :class="{ active: i === step || advancement >= i, disabled: i > advancement }"
      @click="scrollToAnchor(`target-${i}`)"
    >
      {{ i }}
    </a>
  </div>
</template>
<style scoped>
.wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  background-color: var(--neutral-10);
  padding: 0.5rem;
  border-radius: 1rem;
}

.step-indicator {
  margin: 0 0.5rem;
  padding: 0 0.5rem;
  border-radius: 30%;
  color: var(--neutral-90);
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.step-indicator.active {
  background-color: var(--primary-hover);
  color: var(--neutral-10);
}

.step-indicator.disabled {
  pointer-events: none;
  color: var(--neutral-50);
}

@media screen and (max-width: 768px) {
  .wrapper {
    gap: 0.5rem;
    padding: 0.2rem;
  }
}
</style>
