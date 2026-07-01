<template>
  <section class="trail-screen">
    <TrailHeader
      :discipline="discipline"
      :current-step="currentStepIndex"
      :total-steps="discipline.steps.length"
      @restart="$emit('restart')"
    />

    <main class="trail-body">
      <ProgressBar :steps="discipline.steps" :current-step="currentStepIndex" />

      <div class="content-panel">
        <Transition name="fade" mode="out-in">
          <component
            :is="currentComponent"
            :key="currentStepIndex"
            :step="currentStep"
            @completed="stepCompleted = true"
          />
        </Transition>

        <TrailNavigation
          :show-back="currentStepIndex > 0"
          :is-last="isLastStep"
          :can-next="stepCompleted"
          @back="previous"
          @next="next"
        />
      </div>
    </main>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import TrailHeader from './TrailHeader.vue';
import ProgressBar from './ProgressBar.vue';
import TrailNavigation from './TrailNavigation.vue';

import FlipCards from './steps/FlipCards.vue';
import CompetenceCards from './steps/CompetenceCards.vue';
import ActivityCards from './steps/ActivityCards.vue';
import ReflectionStep from './steps/ReflectionStep.vue';

import type { Discipline, Step } from '@/types/microlearning';

const props = defineProps<{
  discipline: Discipline;
  step: number;
}>();

const emit = defineEmits<{
  (e: 'next'): void;
  (e: 'previous'): void;
  (e: 'finish'): void;
  (e: 'restart'): void;
}>();

const stepCompleted = ref(false);

watch(
  () => props.step,
  () => {
    stepCompleted.value = false;

    // Competence step never blocks navigation
    if (currentStep.value.type === 'competences') {
      stepCompleted.value = true;
    }
  },
  {
    immediate: true
  }
);

const currentStepIndex = computed(() => props.step);

const currentStep = computed<Step>(() => {
  return props.discipline.steps[currentStepIndex.value];
});

const isLastStep = computed(() => {
  return currentStepIndex.value === props.discipline.steps.length - 1;
});

const currentComponent = computed(() => {
  switch (currentStep.value.type) {
    case 'flip':
      return FlipCards;

    case 'competences':
      return CompetenceCards;

    case 'activities':
      return ActivityCards;

    case 'votretour':
      return ReflectionStep;

    default:
      return FlipCards;
  }
});

function previous() {
  emit('previous');
}

function next() {
  if (!stepCompleted.value) {
    return;
  }

  if (isLastStep.value) {
    emit('finish');
    return;
  }

  emit('next');
}
</script>

<style scoped>
.trail-screen {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #fafaf8;
}

.trail-body {
  flex: 1;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.content-panel {
  margin-top: 2rem;
  background: white;
  border-radius: 16px;
  border: 1px solid #e6e6e6;
  padding: 2rem;
  min-height: 420px;

  display: flex;
  flex-direction: column;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .trail-body {
    padding: 1rem;
  }

  .content-panel {
    padding: 1.25rem;
  }
}
</style>
