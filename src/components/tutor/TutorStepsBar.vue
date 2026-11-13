<script setup lang="ts">
import ProgressBar from '@/components/microlearning/ProgressBar.vue';
import { scrollToAnchor } from '@/utils/navigation';
import { calculateProgress } from '@/utils/progress';

// the step bar on top of each syllabus path; a step scrolls to its `target-<n>` section
defineProps<{
  labels: string[];
  // 1-based, like the tutor store's step
  step: number;
}>();
</script>
<template>
  <div class="steps-bar">
    <ProgressBar
      :currentStep="step - 1"
      :labels="labels"
      :progress="calculateProgress(step - 1, labels.length)"
      clickable
      @select="(i: number) => scrollToAnchor(`target-${i + 1}`)"
    />
  </div>
</template>

<style scoped>
.steps-bar {
  width: 100%;
  padding: 0 20%;
  border-bottom: 1px solid var(--neutral-20);
}

/* compact version of the micro-learning progress bar */
.steps-bar :deep(.progress-wrapper) {
  margin: 0.75rem 0 0.5rem;
}
.steps-bar :deep(.steps) {
  margin-top: 0.5rem;
}
.steps-bar :deep(.step) {
  flex-direction: row;
  justify-content: center;
  gap: 0.5rem;
}
.steps-bar :deep(.circle) {
  width: 1.5rem;
  height: 1.5rem;
  font-size: 0.75rem;
  border-width: 1.5px;
}
.steps-bar :deep(.check) {
  width: 0.8rem;
  height: 0.8rem;
}
.steps-bar :deep(.label) {
  margin-top: 0;
  max-width: none;
  font-size: 0.8rem;
}
@media (max-width: 640px) {
  /* only the current step keeps its name */
  .steps-bar :deep(.step:not(.active) .label) {
    display: none;
  }
}

@media (max-width: 1024px) {
  .steps-bar {
    padding-inline: 10%;
  }
}

@media (max-width: 768px) {
  .steps-bar {
    padding-inline: 1rem;
  }
}
</style>
