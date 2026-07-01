<template>
  <section class="welcome-screen">
    <div class="welcome-inner">
      <span class="badge">Microlearning</span>

      <h1 class="title">Votre discipline contribue déjà à la transition écologique.</h1>

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

const props = defineProps<{
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
  min-height: 100vh;
  padding: 3rem 1.5rem;
  background: #fafaf8;
}

.welcome-inner {
  width: 100%;
  max-width: 680px;
  text-align: center;
}

.badge {
  display: inline-block;
  padding: 4px 12px;
  margin-bottom: 1.5rem;
  border-radius: 999px;
  background: #e8faf6;
  color: #2ec4a0;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.title {
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.2;
  margin-bottom: 1rem;
}

.subtitle {
  max-width: 520px;
  margin: auto;
  margin-bottom: 2.5rem;
  line-height: 1.7;
  color: #666;
}

.label {
  text-align: left;
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.discipline-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 2rem;
}

.discipline-card {
  border: 1px solid #ddd;
  border-radius: 12px;
  background: white;
  padding: 1rem;
  cursor: pointer;
  transition: 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.discipline-card:hover {
  border-color: #2ec4a0;
  transform: translateY(-2px);
}

.discipline-card.selected {
  background: #e8faf6;
  border-color: #2ec4a0;
}

.icon {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.name {
  font-size: 0.9rem;
  font-weight: 500;
}

.btn-primary {
  padding: 0.9rem 2rem;
  border: none;
  border-radius: 10px;
  background: #2ec4a0;
  color: white;
  font-size: 0.95rem;
  cursor: pointer;
}

.btn-primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.hint {
  margin-top: 1rem;
  color: #888;
  font-size: 0.8rem;
}

@media (max-width: 640px) {
  .discipline-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
