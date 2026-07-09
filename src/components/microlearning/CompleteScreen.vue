<template>
  <section class="complete-screen">
    <div class="complete-inner">
      <div class="complete-icon">🌱</div>

      <h1 class="title">Parcours terminé.</h1>

      <p class="subtitle">
        Vous avez exploré les liens entre votre discipline et la transition écologique.
      </p>

      <p class="description">
        La prochaine étape se passe désormais dans votre salle de cours. Choisissez une activité,
        adaptez un exemple ou ouvrez la ressource proposée pour aller plus loin.
      </p>

      <div class="actions">
        <router-link class="btn-primary" to="/tutor"> Creer un syllabus avec WeLearn </router-link>
        <button class="btn-secondary" @click="$emit('restart')">
          Explorer une autre discipline
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
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
