<template>
  <section class="complete-screen">
    <div class="complete-inner">
      <div class="complete-icon">🌱</div>

      <h1 class="title">Parcours terminé.</h1>

      <p class="subtitle">
        Vous avez exploré les liens entre
        <strong>{{ discipline.name }}</strong>
        et la transition écologique.
      </p>

      <p class="description">
        La prochaine étape se passe désormais dans votre salle de cours. Choisissez une activité,
        adaptez un exemple ou ouvrez la ressource proposée pour aller plus loin.
      </p>

      <div class="resource" v-if="resource">
        <div class="resource-header">
          <span class="resource-icon">📄</span>

          <div>
            <p class="resource-label">Ressource UVED</p>

            <p class="resource-title">
              {{ resource.title }}
            </p>
          </div>
        </div>

        <a :href="resource.href" target="_blank" rel="noopener" class="resource-button">
          Consulter la ressource →
        </a>
      </div>

      <div class="actions">
        <button class="btn-primary" @click="$emit('restart')">Explorer une autre discipline</button>

        <button class="btn-secondary" @click="$emit('close')">Terminer</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Discipline } from '@/data/types';

const props = defineProps<{
  discipline: Discipline;
}>();

defineEmits<{
  (e: 'restart'): void;
  (e: 'close'): void;
}>();

const resource = computed(() => {
  const lastStep = props.discipline.steps.at(-1);

  if (lastStep && lastStep.type === 'votretour') {
    return lastStep.resource;
  }

  return null;
});
</script>

<style scoped>
.complete-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 3rem 1.5rem;
  background: #fafaf8;
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
  color: #555;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.description {
  color: #666;
  line-height: 1.7;
  margin-bottom: 2rem;
}

.resource {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid #dcefe8;
  background: #f2fbf8;
  border-radius: 12px;
  text-align: left;
}

.resource-header {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
}

.resource-icon {
  font-size: 1.8rem;
}

.resource-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #2ec4a0;
  text-transform: uppercase;
}

.resource-title {
  font-weight: 600;
  color: #222;
}

.resource-button {
  display: inline-flex;
  align-items: center;
  color: #2ec4a0;
  text-decoration: none;
  font-weight: 600;
}

.resource-button:hover {
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
