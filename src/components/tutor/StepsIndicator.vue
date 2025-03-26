<script setup lang="ts">
const props = defineProps({
  step: Number,
  stepsLength: Number
});

const stepsLengthArray = Array.from({ length: props.stepsLength }, (_, i) => i + 1);
</script>
<template>
  <div class="is-flex">
    <p
      class="step-inidicator"
      v-for="i in stepsLengthArray"
      :key="i"
      :class="{ step: true, active: i === step }"
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
  background-color: #f0f0f0;
  color: #333;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.step-inidicator.active {
  background-color: #333;
  color: #f0f0f0;
}

.is-flex {
  gap: 5rem;
  background-color: var(--neutral-10);
  padding: 0.5rem;
  border-radius: 1rem;
}
</style>
