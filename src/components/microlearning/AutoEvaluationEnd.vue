<template>
  <div class="fullPageEvaluation">
    <p class="abadge">{{ $t('autoEvaluation.end.badge') }}</p>
    <p class="title is-4">{{ $t('autoEvaluation.end.title') }}</p>
    <p class="subtitle is-6">
      {{ $t('autoEvaluation.end.subtitle') }}
    </p>
    <QuestionComponent
      v-model="answers.link"
      type="likert"
      :question="$t('autoEvaluation.firstQuestion', { discipline: discipline })"
    />
    <QuestionComponent
      v-model="answers.confidence"
      type="likert"
      :question="$t('autoEvaluation.secondQuestion')"
    />
    <QuestionComponent
      v-model="answers.willUse"
      type="yesMaybeNot"
      :question="$t('autoEvaluation.willUse')"
    />
    <QuestionComponent
      v-model="answers.feedback"
      type="openDialogue"
      :question="$t('autoEvaluation.feedback')"
    />
    <TrailNavigation
      class="nav"
      next-label="finish"
      skippable
      @back="$emit('back')"
      @next="$emit('start')"
      @skip="$emit('start')"
    />
  </div>
</template>

<script setup lang="ts">
import QuestionComponent from '@/components/microlearning/QuestionComponent.vue';
import TrailNavigation from '@/components/microlearning/TrailNavigation.vue';
import type { EvalAnswers } from '@/composables/useMicrolearning';

defineProps<{
  discipline?: string;
}>();

// reactive object owned by useMicrolearning, fields are filled in place
const answers = defineModel<EvalAnswers>('answers', { required: true });

defineEmits<{
  (e: 'start'): void;
  (e: 'back'): void;
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

.subtitle {
  max-width: 560px;
  text-align: center;
}

.nav {
  width: 100%;
  max-width: 560px;
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
