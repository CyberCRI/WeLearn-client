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
        <article v-for="(objective, index) in discipline.objectives" :key="index" class="objective">
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

        <span>•</span>

        <span>aucune inscription</span>
      </div>

      <button class="btn-primary" @click="$emit('start')">Commencer</button>

      <button class="btn-ghost" @click="$emit('back')">Changer de discipline</button>
    </div>
  </section>
</template>

<script setup lang="ts">
export interface Discipline {
  id: string;

  name: string;

  icon: string;

  objectives: string[];
}

defineProps<{
  discipline: Discipline;
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
  min-height: 100vh;
  padding: 3rem 1.5rem;
  background: #fafaf8;
}

.briefing-inner {
  width: 100%;
  max-width: 560px;
  text-align: center;
}

.discipline-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  background: #e8faf6;
  color: #2ec4a0;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

h2 {
  margin-bottom: 0.75rem;
  font-size: 2rem;
}

.intro {
  color: #666;
  margin-bottom: 2rem;
}

.objectives {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.objective {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  text-align: left;
}

.number {
  color: #2ec4a0;
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
  color: #888;
  font-size: 0.85rem;
  margin-bottom: 2rem;
}

.btn-primary {
  width: 100%;
  padding: 0.9rem;
  border: none;
  border-radius: 10px;
  background: #2ec4a0;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.btn-primary:hover {
  background: #24b18f;
}

.btn-ghost {
  border: none;
  background: transparent;
  color: #666;
  cursor: pointer;
}

.btn-ghost:hover {
  color: black;
}
</style>
