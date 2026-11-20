<template>
  <section class="trail-screen" id="steps-focus">
    <TrailHeader
      :discipline="disciplineMeta"
      :current-step="currentStepIndex"
      :total-steps="discipline.steps.length"
      @restart="$emit('restart')"
    />

    <main class="trail-body">
      <ProgressBar
        :current-step="currentStepIndex"
        :reached="reached"
        :skipped="skipped"
        :progress="progress"
        clickable
        @select="select"
      />

      <div class="content-panel">
        <Transition name="fade" mode="out-in">
          <FlipCards
            v-if="currentStep.type === 'flip'"
            :key="`flip-${currentStepIndex}`"
            :step="currentStep"
            :flipped="flippedCards"
            @flip="$emit('flipCard', $event)"
          />
          <CompetenceCards
            v-else-if="currentStep.type === 'competences'"
            :key="`competences-${currentStepIndex}`"
            :step="currentStep"
          />
          <ActivityCards
            v-else-if="currentStep.type === 'activities'"
            :key="`activities-${currentStepIndex}`"
            :step="currentStep"
            :selected="chosenActivity"
            @selected="$emit('chooseActivity', $event)"
          />
          <ReflectionStep
            v-else
            :key="`reflection-${currentStepIndex}`"
            :step="currentStep"
            :chosenActivity="chosenActivity"
            :answers="reflectionAnswers"
            @change-activity="previous"
          />
        </Transition>

        <TrailNavigation
          :next-label="isLastStep ? 'finish' : 'next'"
          :hint="isDone(currentStepIndex) ? undefined : 'learn.module.nextHint'"
          @back="previous"
          @next="next"
        />
      </div>
    </main>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import TrailHeader from './TrailHeader.vue';
import ProgressBar from '../ProgressBar.vue';
import TrailNavigation from '../TrailNavigation.vue';

import FlipCards from './steps/FlipCards.vue';
import CompetenceCards from './steps/CompetenceCards.vue';
import ActivityCards from './steps/ActivityCards.vue';
import ReflectionStep from './steps/ReflectionStep.vue';

import type {
  Activity,
  ActivityRef,
  Discipline,
  DisciplineMeta,
  Step
} from '@/types/learn/discipline';
import { scrollToAnchor } from '@/utils/navigation.js';

const props = defineProps<{
  disciplineMeta: DisciplineMeta | null;
  discipline: Discipline;
  step: number;
  reached: number;
  flipDone: boolean;
  flippedCards: number[];
  chosenActivity: Activity | null;
  reflectionAnswers: string[];
  progress: number;
}>();

const emit = defineEmits<{
  (e: 'next'): void;
  (e: 'previous'): void;
  (e: 'finish'): void;
  (e: 'restart'): void;
  (e: 'select', index: number): void;
  (e: 'flipCard', index: number): void;
  (e: 'chooseActivity', activity: ActivityRef | null): void;
}>();
const currentStepIndex = computed(() => props.step);

const currentStep = computed<Step>(() => {
  return props.discipline.steps[currentStepIndex.value];
});

// steps with an action can be skipped: they stay unchecked in the steps bar until it is done
function isDone(index: number) {
  const type = props.discipline.steps[index].type;
  if (type === 'flip') return props.flipDone;
  if (type === 'activities') return !!props.chosenActivity;
  return true;
}

const skipped = computed(() =>
  props.discipline.steps.flatMap((_, i) => (i <= props.reached && !isDone(i) ? [i] : []))
);

const isLastStep = computed(() => {
  return currentStepIndex.value === props.discipline.steps.length - 1;
});

function previous() {
  emit('previous');
}

function next() {
  emit('next');
  scrollToAnchor('steps-focus');
}

function select(index: number) {
  emit('select', index);
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
  width: 100%;
  max-width: 960px;
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
