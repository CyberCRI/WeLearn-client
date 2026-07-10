<template>
  <section class="welcome-screen">
    <div class="welcome-inner">
      <h1 class="title is-size-3">{{ $t('microLearning.welcomeScreen.title') }}</h1>

      <p class="subtitle">
        {{ $t('microLearning.welcomeScreen.subtitle') }}
      </p>

      <p class="label">{{ $t('microLearning.welcomeScreen.label') }}</p>

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
            {{ $t(`microLearning.disciplineNames.${discipline.id}`) }}
          </span>
        </button>
      </div>

      <button class="btn-primary" :disabled="!selected" @click="start">
        {{ $t('microLearning.welcomeScreen.primaryButton') }}
      </button>

      <p class="hint">{{ $t('microLearning.hint') }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { DisciplineMeta } from '@/types/microlearning';
import { ref } from 'vue';

defineProps<{
  disciplines: DisciplineMeta[];
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
