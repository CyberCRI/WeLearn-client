<template>
  <div class="fullPageEvaluation">
    <p class="abadge">Avant de commencer</p>
    <p class="title is-4">Une dernière chose</p>
    <p class="subtitle is-6">
      30 secondes, ça nous aide à savoir si ce parcours répond à un vrai besoin.
    </p>
    <QuestionComponent
      type="likert"
      :question="$t('autoEvaluation.firstQuestion', { discipline: discipline })"
    />
    <QuestionComponent type="likert" :question="$t('autoEvaluation.secondQuestion')" />
    <QuestionComponent type="yesMaybeNot" :question="$t('autoEvaluation.willUse')" />
    <QuestionComponent type="openDialogue" :question="$t('autoEvaluation.feedback')" />
    <div class="buttons">
      <button class="btn-primary" @click="$emit('start')">
        {{ $t('finish') }}
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
  padding-top: 1%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
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
