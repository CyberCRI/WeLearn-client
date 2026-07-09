<template>
  <div class="progress-wrapper">
    <div class="progress-track">
      <div class="progress-fill" :style="{ width: progressWidth }" />
    </div>

    <div class="steps">
      <div v-for="(step, index) in STEP_LABELS" :key="index" class="step" :class="stepClass(index)">
        <div class="circle">
          <svg v-if="index < currentStep" class="check" viewBox="0 0 24 24">
            <path
              d="M5 13l4 4L19 7"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          <span v-else>
            {{ index + 1 }}
          </span>
        </div>

        <span class="label">
          {{ step }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const STEP_LABELS = ['Les apports', 'Les compétences', 'Une activité', 'À votre tour'];

const props = defineProps<{
  currentStep: number;
}>();

const progressWidth = computed(() => {
  return `${(props.currentStep / (STEP_LABELS.length - 1)) * 100}%`;
});

function stepClass(index: number) {
  return {
    active: index === props.currentStep,
    done: index < props.currentStep
  };
}
</script>

<style scoped>
.progress-wrapper {
  margin: 2rem 0;
}

.progress-track {
  position: relative;
  width: 100%;
  height: 4px;
  background: var(--neutral-20);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary-hover);
  transition: width 0.35s ease;
}

.steps {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.circle {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  border: 2px solid #d8d8d8;

  background: white;

  color: #999;

  transition: 0.25s;
}

.label {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  text-align: center;
  color: #999;
  max-width: 80px;
}

.active .circle {
  border-color: #2ec4a0;
  color: #2ec4a0;
  box-shadow: 0 0 0 4px rgba(46, 196, 160, 0.15);
}

.active .label {
  color: #2ec4a0;
  font-weight: 600;
}

.done .circle {
  background: #2ec4a0;
  border-color: #2ec4a0;
  color: white;
}

.done .label {
  color: #444;
}

.check {
  width: 16px;
  height: 16px;
}

@media (max-width: 640px) {
  .label {
    font-size: 0.65rem;
    max-width: 60px;
  }

  .circle {
    width: 30px;
    height: 30px;
  }
}
</style>
