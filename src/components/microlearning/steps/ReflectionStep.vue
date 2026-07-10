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

    <div v-for="(prompt, index) in step.prompts" :key="index" class="reflection-card">
      <label :for="`reflection-${index}`">
        {{ prompt.q }}
      </label>

      <textarea
        :id="`reflection-${index}`"
        v-model="answers[index]"
        :placeholder="prompt.placeholder"
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

        <a :href="step.resource.href" target="_blank" rel="noopener noreferrer">
          {{ $t('microLearning.reflection.ctaSource') }}
        </a>
      </div>
    </aside>
  </section>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';

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

defineProps<{
  step: ReflectionStep;
}>();

const emit = defineEmits<{
  (e: 'completed'): void;
  (e: 'answers', value: string[]): void;
}>();

const answers = reactive<string[]>([]);

watch(
  answers,
  () => {
    emit('answers', [...answers]);
    emit('completed');
  },
  { deep: true }
);
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
