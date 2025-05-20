<script setup lang="ts">
const props = defineProps<{
  step: number;
  stepsLength: number;
  advancement: number;
  setStep: () => void;
}>();

const stepsLengthArray = Array.from({ length: props.stepsLength }, (_, i) => i + 1);
</script>
<template>
  <div class="is-flex">
    <p
      class="step-inidicator"
      v-for="i in stepsLengthArray"
      :key="i"
      :class="{ active: i === step || advancement >= i, disabled: i > advancement }"
      @click="setStep(i)"
    >
      {{ i }}
    </p>
  </div>
</template>
<style scoped>
.step-inidicator {
  margin: 0 0.5rem;
  padding: 0 0.5rem;
  border-radius: 30%;
  color: var(--neutral-90);
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.step-inidicator.active {
  background-color: var(--primary-hover);
  color: var(--neutral-10);
}

.step-inidicator.disabled {
  pointer-events: none;
  color: var(--neutral-50);
}

.is-flex {
  gap: 5rem;
  background-color: var(--neutral-10);
  padding: 0.5rem;
  border-radius: 1rem;
}
</style>
