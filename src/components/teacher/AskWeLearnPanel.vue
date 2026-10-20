<script setup lang="ts">
import AiLabel from '@/components/AiLabel.vue';
import { useAskWeLearn } from '@/composables/useAskWeLearn';
import { ASK_QUESTIONS, type TeacherSpace } from '@/components/teacher/teacherSpaces';
import i18n from '@/localisation/i18n';

// example questions for the WeLearn assistant, labelled as AI; a click opens the chat with the question
const props = defineProps<{ space: TeacherSpace }>();

const { askWeLearn } = useAskWeLearn();

const handleAsk = (question: string) =>
  askWeLearn(i18n.global.t(`journey.teach.spaces.${props.space}.ask.${question}`));
</script>
<template>
  <section class="ask-panel" data-testid="ask-panel">
    <h2 class="ask-title"><AiLabel :text="$t('journey.teach.ask.title')" /></h2>
    <p class="ask-intro">{{ $t('journey.teach.ask.intro') }}</p>
    <ul class="ask-questions">
      <li v-for="question in ASK_QUESTIONS" :key="question">
        <button
          type="button"
          class="ask-question"
          :data-testid="`ask-${question}`"
          @click="handleAsk(question)"
        >
          {{ $t(`journey.teach.spaces.${space}.ask.${question}`) }} →
        </button>
      </li>
    </ul>
    <p class="ask-note">{{ $t('journey.teach.ask.sourcesNote') }}</p>
  </section>
</template>

<style scoped>
.ask-panel {
  margin-top: 2.5rem;
  padding: 1.25rem;
  border-radius: 8px;
  background: var(--neutral-10);
}

.ask-title {
  font-size: 1.1rem;
  font-weight: 600;
}

.ask-intro {
  margin-top: 0.25rem;
  font-size: 0.9rem;
  color: var(--neutral-70);
}

.ask-questions {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.ask-question {
  padding: 0.5rem 0.9rem;
  border: 1px solid var(--neutral-20);
  border-radius: 8px;
  background: var(--neutral-0);
  font: inherit;
  text-align: left;
  color: var(--neutral-90);
  cursor: pointer;
}

.ask-question:hover,
.ask-question:focus-visible {
  border-color: var(--primary-dark);
  color: var(--primary-dark);
}

.ask-note {
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: var(--neutral-70);
}
</style>
