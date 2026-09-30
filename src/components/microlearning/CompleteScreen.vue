<template>
  <section class="complete-screen">
    <div class="complete-inner">
      <div class="complete-icon">🌱</div>

      <h1 class="title">{{ $t('microLearning.completeScreen.title') }}</h1>

      <p class="subtitle">
        {{ $t('microLearning.completeScreen.subtitle') }}
      </p>

      <p class="description">
        {{ $t('microLearning.completeScreen.description') }}
      </p>

      <div class="takeaways">
        <article v-if="chosenActivity" class="takeaway">
          <span class="takeaway-label">{{ $t('microLearning.reflection.yourPick') }}</span>
          <h3>{{ chosenActivity.title }}</h3>
          <p>{{ chosenActivity.desc }}</p>
        </article>

        <article v-if="resource" class="takeaway resource">
          <span class="takeaway-label">📚 {{ resource.label }}</span>
          <h3>{{ resource.title }}</h3>
          <p>{{ $t('microLearning.reflection.resourceSubtitle') }}</p>
          <a :href="resource.href" target="_blank" rel="noopener noreferrer">
            {{ $t('microLearning.reflection.ctaSource') }}
          </a>
        </article>
      </div>

      <div class="actions">
        <router-link class="btn-primary" to="/tutor">
          {{ $t('microLearning.completeScreen.primaryButton') }}</router-link
        >
        <button class="btn-secondary" @click="$emit('restart')">
          {{ $t('microLearning.completeScreen.secondaryButton') }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Activity, Discipline, VotretourStep } from '@/types/microlearning';

const props = defineProps<{
  discipline: Discipline;
  chosenActivity: Activity | null;
}>();

const resource = computed(
  () =>
    (props.discipline.steps.find((s) => s.type === 'votretour') as VotretourStep | undefined)
      ?.resource
);

defineEmits<{
  (e: 'restart'): void;
}>();
</script>

<style scoped>
.complete-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 3rem 1.5rem;
}

.complete-inner {
  width: 100%;
  max-width: 620px;
  text-align: center;
}

.complete-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.title {
  font-size: 2.4rem;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.1rem;
  color: var(--neutral-80);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.description {
  color: #666;
  line-height: 1.7;
  margin-bottom: 2rem;
}

.takeaways {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  text-align: left;
}

.takeaway {
  padding: 1.25rem 1.5rem;
  border: 1px solid var(--primary);
  border-radius: 12px;
  background: var(--neutral-0);
}

.takeaway.resource {
  border-color: transparent;
  background: var(--primary-lighter);
}

.takeaway-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--primary-dark);
}

.takeaway h3 {
  margin: 0.35rem 0;
  font-size: 1.05rem;
  font-weight: 600;
}

.takeaway p {
  margin: 0;
  color: var(--neutral-80);
  line-height: 1.6;
}

.takeaway a {
  display: inline-block;
  margin-top: 0.5rem;
  color: var(--primary-dark);
  font-weight: 500;
  text-decoration: none;
}

.takeaway a:hover {
  text-decoration: underline;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-primary,
.btn-secondary {
  width: 100%;
  padding: 1rem;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
}

.btn-primary {
  border: none;
  background: #2ec4a0;
  color: white;
}

.btn-primary:hover {
  background: #24b18f;
}

.btn-secondary {
  border: 1px solid #ddd;
  background: white;
}

.btn-secondary:hover {
  border-color: #2ec4a0;
}

@media (max-width: 768px) {
  .complete-inner {
    max-width: 100%;
  }

  .title {
    font-size: 2rem;
  }
}
</style>
