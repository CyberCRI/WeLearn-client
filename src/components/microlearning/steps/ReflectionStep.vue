<template>
  <section class="reflection-step">
    <header class="reflection-header">
      <h2 class="title is-5 reflection-title">
        {{ step.statement }}
      </h2>

      <p class="reflection-subtitle">
        {{ step.sub }}
      </p>
    </header>

    <div v-if="chosenActivity" class="chosen-activity">
      <div>
        <span class="chosen-label">{{ $t('microLearning.reflection.yourPick') }}</span>
        <p class="chosen-title">{{ chosenActivity.title }}</p>
        <p class="chosen-hint">{{ $t('microLearning.reflection.yourPickHint') }}</p>
      </div>
      <button type="button" class="change-link" @click="$emit('changeActivity')">
        {{ $t('microLearning.reflection.changePick') }}
      </button>
    </div>

    <div v-for="(prompt, index) in step.prompts" :key="index" class="reflection-card">
      <label :for="`reflection-${index}`">
        {{ prompt.q }}
      </label>

      <textarea
        :id="`reflection-${index}`"
        v-model="answers[index]"
        :placeholder="placeholderFor(index, prompt.placeholder)"
        rows="5"
      />
    </div>

    <aside class="resource-card">
      <div class="resource-icon">📚</div>

      <div class="resource-content">
        <span class="resource-label">
          {{ step.resource.label }}
        </span>

        <h3>
          {{ step.resource.title }}
        </h3>
        <p class="resource-subtitle">{{ $t('microLearning.reflection.resourceSubtitle') }}</p>

        <a :href="step.resource.href" target="_blank" rel="noopener noreferrer">
          {{ $t('microLearning.reflection.ctaSource') }}
        </a>
      </div>
    </aside>
  </section>
</template>

<script setup lang="ts">
import type { Activity } from '@/types/microlearning';
import i18n from '@/localisation/i18n';

interface Prompt {
  q: string;
  placeholder: string;
}

interface Resource {
  label: string;
  title: string;
  href: string;
}

interface ReflectionStep {
  statement: string;
  sub: string;
  prompts: Prompt[];
  resource: Resource;
}

const props = defineProps<{
  step: ReflectionStep;
  chosenActivity: Activity | null;
}>();

// reactive array owned by useMicrolearning so answers survive going back
const answers = defineModel<string[]>('answers', { required: true });

defineEmits<{
  (e: 'changeActivity'): void;
}>();

// The last prompt asks how to bring it into class: point the example at the chosen activity
function placeholderFor(index: number, fallback: string) {
  if (!props.chosenActivity || index !== props.step.prompts.length - 1) return fallback;
  return i18n.global.t('microLearning.reflection.activityPlaceholder', {
    activity: props.chosenActivity.title
  });
}
</script>

<style scoped>
.reflection-step {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-radius: 8px;
  border: 1px solid var(--neutral-20);
}

.reflection-header {
  margin: 0 2rem;
  text-align: center;
  padding: 1rem;
  border-bottom: 1px solid var(--neutral-10);
}

.reflection-title {
  margin-bottom: 0.5rem;
  text-align: left;
}

.reflection-subtitle {
  line-height: 1.5;
  text-align: left;
  color: var(--neutral-80);
}

.chosen-activity {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin: 0.5rem 1.5rem;
  padding: 1rem;
  border: 1px solid var(--primary);
  border-radius: 8px;
  background: var(--primary-lighter);
}

.chosen-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--primary-dark);
}

.chosen-title {
  margin: 0.25rem 0;
  font-weight: 600;
}

.chosen-hint {
  margin: 0;
  font-size: 0.875rem;
  color: var(--neutral-80);
}

.change-link {
  flex-shrink: 0;
  border: none;
  background: none;
  color: var(--primary-dark);
  font: inherit;
  font-size: 0.875rem;
  cursor: pointer;
  text-decoration: underline;
}

.reflection-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem 1.5rem;
}

.reflection-card label {
  font-weight: 500;
  line-height: 1.5;
}

.reflection-card textarea {
  min-height: 120px;
  padding: 1rem;
  border: 1px solid var(--neutral-20);
  border-radius: 8px;
  resize: vertical;
  font: inherit;
  line-height: 1.6;
  transition: 0.2s;
}

.reflection-card textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-lighter);
}

.resource-card {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: var(--primary-lighter);
}

.resource-icon {
  font-size: 2rem;
}

.resource-content {
  display: flex;
  flex-direction: column;
}

.resource-label {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;

  color: var(--primary-dark);
}

.resource-content h3 {
  margin: 0.25rem;
}

.resource-subtitle {
  margin: 0 0.25rem 0.5rem;
  font-size: 0.875rem;
  opacity: 0.75;
}

.resource-content a {
  color: var(--primary-dark);
  text-decoration: none;
  font-weight: 500;
}

.resource-content a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .resource-card {
    flex-direction: column;
  }
}
</style>
