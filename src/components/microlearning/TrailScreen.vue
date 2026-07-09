<template>
  <section class="trail-screen" id="steps-focus">
    <TrailHeader
      :discipline="disciplineMeta"
      :current-step="currentStepIndex"
      :total-steps="discipline.steps.length"
      @restart="$emit('restart')"
    />

    <main class="trail-body">
      <ProgressBar :current-step="currentStepIndex" />

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

import type { Discipline, DisciplineMeta, Step } from '@/types/microlearning';
import { scrollToAnchor } from '@/utils/navigation.js';

const props = defineProps<{
  disciplineMeta: DisciplineMeta | null;
  discipline: Discipline;
  step: number;
}>();

const emit = defineEmits<{
  (e: 'next'): void;
  (e: 'previous'): void;
  (e: 'finish'): void;
  (e: 'restart'): void;
}>();
const currentStepIndex = computed(() => props.step);

const stepCompleted = ref(false);
const currentStep = computed<Step>(() => {
  return props.discipline.steps[currentStepIndex.value];
});

const requiresInteraction = ['flip', 'activities'];

watch(
  () => props.step,
  () => {
    stepCompleted.value = !requiresInteraction.includes(currentStep.value.type);
  },
  { immediate: true }
);

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

  emit('next');
  scrollToAnchor('steps-focus');
}
</script>

<style scoped>
.trail-screen {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.trail-body {
  flex: 1;
  width: 50%;
  margin: 0 auto;
  padding: 0rem 1.5rem;
}

.content-panel {
  padding: 1rem;
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
