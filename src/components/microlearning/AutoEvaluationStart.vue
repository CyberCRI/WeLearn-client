<template>
  <div class="fullPageEvaluation">
    <p class="abadge">{{ $t('autoEvaluation.start.badge') }}</p>
    <p class="title is-4">{{ $t('autoEvaluation.start.title') }}</p>
    <p class="subtitle is-6">
      {{ locked ? $t('autoEvaluation.start.lockedNotice') : $t('autoEvaluation.start.subtitle') }}
    </p>
    <QuestionComponent
      v-model="answers.link"
      :disabled="locked"
      :question="$t('autoEvaluation.firstQuestion', { discipline: discipline })"
    />
    <QuestionComponent
      v-model="answers.confidence"
      :disabled="locked"
      :question="$t('autoEvaluation.secondQuestion')"
    />
    <TrailNavigation
      class="nav"
      :next-label="locked ? 'next' : 'microLearning.briefingScreen.primaryButton'"
      :skippable="!locked"
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
  locked: boolean;
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
  padding-top: 5%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
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
