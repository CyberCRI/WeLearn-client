<template>
  <section class="briefing-screen">
    <div class="briefing-inner">
      <div class="discipline-icon">
        {{ discipline.icon }}
      </div>

      <span class="badge">
        {{ discipline.name }}
      </span>

      <h2>Votre parcours est prêt.</h2>

      <p class="intro">En quelques minutes, vous allez :</p>

      <div class="objectives">
        <article v-for="(objective, index) in obj" :key="index" class="objective">
          <span class="number">
            {{ String(index + 1).padStart(2, '0') }}
          </span>

          <span class="text">
            {{ objective }}
          </span>
        </article>
      </div>

      <div class="meta">
        <span>4 étapes</span>
        <span>•</span>
        <span>environ 5 minutes</span>
      </div>

      <button class="btn-primary" @click="$emit('start')">Commencer</button>

      <button class="btn-ghost" @click="$emit('back')">Changer de discipline</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { DisciplineMeta } from '@/types/microlearning';

const obj = [
  'Comprendre comment votre discipline contribue à la transition écologique et au développement soutenable',
  'Identifier les compétences que vos étudiant·es développent lorsque vous reliez votre discipline à la TEDS',
  'Découvrir des activités concrètes à intégrer dans une séance existante'
];
defineProps<{
  discipline: DisciplineMeta;
}>();

defineEmits<{
  (e: 'start'): void;
  (e: 'back'): void;
}>();
</script>

<style scoped>
.briefing-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 1rem 1rem;
}

.briefing-inner {
  width: 100%;
  max-width: 560px;
  text-align: center;
}

.discipline-icon {
  font-size: 2rem;
}

.badge {
  display: inline-block;
  padding: 2px 12px;
  border-radius: 8px;
  background: var(--primary-lighter);
  color: var(--primary-hover);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.5rem;
}

.intro {
  color: #666;
  margin-bottom: 1rem;
}

.objectives {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.objective {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--neutral-20);
  border-radius: 12px;
  text-align: left;
}

.number {
  color: var(--primary-hover);
  font-weight: 700;
  min-width: 24px;
}

.text {
  flex: 1;
  line-height: 1.6;
}

.meta {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  color: var(--neutral-70);
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.btn-primary {
  width: 100%;
  padding: 0.9rem;
  border: none;
  border-radius: 10px;
  background: var(--primary-hover);
  color: white;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.btn-primary:hover {
  background: var(--primary-dark);
}

.btn-ghost {
  border: none;
  background: transparent;
  color: var(--neutral-80);
  cursor: pointer;
}

.btn-ghost:hover {
  color: var(--neutral-100);
}
</style>
