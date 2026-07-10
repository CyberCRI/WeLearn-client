<template>
  <header class="trail-header">
    <div class="left">
      <button class="back-button" @click="$emit('restart')">
        <span class="'is-flex'">← </span>{{ $t('microLearning.restart') }}
      </button>
    </div>

    <div class="center">
      <div v-if="discipline?.icon" class="discipline-icon">
        {{ discipline?.icon }}
        <h1 class="title">
          {{ $t(`microLearning.disciplineNames.${discipline.id}`) }}
        </h1>
      </div>
    </div>

    <div class="right">
      <div class="step-indicator">
        {{ $t('microLearning.step') }} {{ currentStep + 1 }} / {{ totalSteps }}
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { DisciplineMeta } from '@/types/microlearning';

defineProps<{
  discipline: DisciplineMeta | null;
  currentStep: number;
  totalSteps: number;
}>();

defineEmits<{
  (e: 'restart'): void;
}>();
</script>

<style scoped lang="css">
.trail-header {
  display: grid;
  grid-template-columns: 180px 1fr 180px;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--neutral-10);
  background-color: var(--neutral-0);
  position: sticky;
  top: 0;
  z-index: 20;
}

.left {
  display: flex;
}

.center {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.right {
  display: flex;
  justify-content: flex-end;
}

.back-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.55rem 1rem;
  border: 1px solid var(--neutral-20);
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}

.back-button:hover {
  border-color: var(--primary);
}

.discipline-icon {
  height: 56px;
  border-radius: 12px;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: var(--primary-lighter);
  font-size: 1.5rem;
}

.title {
  margin: 0.15rem 0 0;
  font-size: 1rem;
}

.step-indicator {
  padding: 0.45rem 0.85rem;

  border-radius: 999px;

  background: var(--neutral-10);

  color: var(--text-secondary);

  font-size: 0.85rem;

  font-weight: 500;
}

@media (max-width: 900px) {
  .trail-header {
    grid-template-columns: 1fr;

    text-align: center;

    padding: 1rem;
  }

  .left,
  .right {
    justify-content: center;
  }

  .center {
    flex-direction: column;
  }
}
</style>
