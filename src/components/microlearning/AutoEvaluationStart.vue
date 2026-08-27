<template>
  <div class="fullPageEvaluation">
    <p class="abadge">{{ $t('autoEvaluation.start.badge') }}</p>
    <p class="title is-4">{{ $t('autoEvaluation.start.title') }}</p>
    <p class="subtitle is-6">
      {{ $t('autoEvaluation.start.subtitle') }}
    </p>
    <QuestionComponent :question="$t('autoEvaluation.firstQuestion', { discipline: discipline })" />
    <QuestionComponent :question="$t('autoEvaluation.secondQuestion')" />
    <div class="buttons">
      <button class="btn-primary" @click="$emit('start')">
        {{ $t('microLearning.briefingScreen.primaryButton') }}
      </button>
      <a @click="$emit('start')">{{ $t('skip') }}</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import QuestionComponent from '@/components/microlearning/QuestionComponent.vue';

defineProps<{
  discipline?: string;
}>();

defineEmits<{
  (e: 'start'): void;
}>();
</script>

<style lang="css" scoped>
.fullPageEvaluation {
  padding-top: 5%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  height: 100%;
  width: 100%;
}

.buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.btn-primary {
  padding: 0.9rem;
  border: none;
  border-radius: 10px;
  background: var(--primary-hover);
  color: white;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.abadge {
  background: #edf8e9;
  color: #41825a;
  display: inline-flex;
  align-items: center;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
</style>
