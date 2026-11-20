<template>
  <div class="fullPageEvaluation">
    <p class="abadge">{{ $t('autoEvaluation.start.badge') }}</p>
    <!-- one block, so the column gap below doesn't split the title from its subtitle -->
    <div class="eval-heading">
      <p class="title is-4">{{ $t('autoEvaluation.start.title') }}</p>
      <p class="subtitle is-6">
        {{ locked ? $t('autoEvaluation.start.lockedNotice') : $t('autoEvaluation.start.subtitle') }}
      </p>
    </div>
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
      :next-label="locked ? 'next' : 'learn.discipline.briefingScreen.primaryButton'"
      :skippable="!locked"
      @back="$emit('back')"
      @next="$emit('start')"
      @skip="$emit('skip')"
    />
  </div>
</template>

<script setup lang="ts">
import QuestionComponent from '@/components/learn/discipline/QuestionComponent.vue';
import TrailNavigation from '@/components/learn/TrailNavigation.vue';
import type { EvalAnswers } from '@/types/learn/discipline';

defineProps<{
  discipline?: string;
  locked: boolean;
}>();

// reactive object owned by useDisciplineModule, fields are filled in place
const answers = defineModel<EvalAnswers>('answers', { required: true });

defineEmits<{
  (e: 'start'): void;
  (e: 'skip'): void;
  (e: 'back'): void;
}>();
</script>

<style lang="css" scoped>
.fullPageEvaluation {
  padding-top: 5%;
  padding-inline: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  height: 100%;
  width: 100%;
}

.eval-heading {
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
