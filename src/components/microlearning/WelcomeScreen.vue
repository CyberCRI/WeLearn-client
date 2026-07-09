<template>
  <section class="welcome-screen">
    <div class="welcome-inner">
      <h1 class="title is-size-3">Votre discipline contribue déjà à la transition écologique.</h1>

      <p class="subtitle">
        Un parcours d'apprentissage pour les enseignants du supérieur. Choisissez votre domaine et
        découvrez comment la transition écologique et le développement soutenable s'intègrent
        naturellement à ce que vous enseignez déjà.
      </p>

      <p class="label">Choisissez votre discipline</p>

      <div class="discipline-grid">
        <button
          v-for="discipline in disciplines"
          :key="discipline.id"
          class="discipline-card"
          :class="{ selected: selected === discipline.id }"
          @click="select(discipline.id)"
        >
          <span class="icon">
            {{ discipline.icon }}
          </span>

          <span class="name">
            {{ discipline.name }}
          </span>
        </button>
      </div>

      <button class="btn-primary" :disabled="!selected" @click="start">Voir le parcours</button>

      <p class="hint">4 étapes · environ 5 minutes</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

export interface Discipline {
  id: string;
  name: string;
  icon: string;
}

defineProps<{
  disciplines: Discipline[];
}>();

const emit = defineEmits<{
  (e: 'select', disciplineId: string): void;
}>();

const selected = ref<string>();

function select(id: string) {
  selected.value = id;
}

function start() {
  if (!selected.value) return;

  emit('select', selected.value);
}
</script>

<style scoped>
.welcome-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 1.5rem;
}

.welcome-inner {
  width: 100%;
  max-width: 50%;
  text-align: center;
}

.title {
  margin-bottom: 1rem;
}

.subtitle {
  max-width: 80%;
  margin: auto;
  margin-bottom: 2.5rem;
  line-height: 1.7;
  color: var(--neutral-80);
}

.label {
  text-align: left;
  margin-bottom: 0.75rem;
}

.discipline-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 2rem;
}

.discipline-card {
  border: 1px solid var(--neutral-10);
  border-radius: 12px;
  background: var(neutral-0);
  padding: 1rem;
  cursor: pointer;
  transition: 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.discipline-card:hover {
  border-color: var(--primary-hover);
  transform: translateY(-2px);
}

.discipline-card.selected {
  background: var(--primary-light);
  border-color: var(--primary-hover);
}

.icon {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.name {
  font-size: 0.9rem;
}

.btn-primary {
  padding: 0.9rem 2rem;
  border: none;
  border-radius: 10px;
  background: var(--primary-hover);
  color: var(--neutral-0);
  font-size: 0.95rem;
  cursor: pointer;
}

.btn-primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.hint {
  margin-top: 1rem;
  color: var(--neutral-80);
  font-size: 0.8rem;
}

@media (max-width: 640px) {
  .discipline-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
