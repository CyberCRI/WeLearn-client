<template>
  <section class="flip-cards">
    <header class="header">
      <span class="badge"> Étape {{ stepNumber }} </span>

      <h2>{{ step.title }}</h2>

      <p>
        {{ step.description }}
      </p>
    </header>

    <div class="cards">
      <FlipCard
        v-for="card in step.cards"
        :key="card.id"
        :card="card"
        @flip="markFlipped(card.id)"
      />
    </div>

    <Transition name="fade">
      <div v-if="completed" class="success">
        <h3>✓ Bravo !</h3>

        <p>Vous avez découvert tous les apports de cette discipline.</p>
      </div>
    </Transition>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import FlipCard from './FlipCard.vue';

interface FlipCardModel {
  id: number;
  title: string;
  icon: string;
  explanation: string;
}

interface FlipStep {
  title: string;

  description: string;

  cards: FlipCardModel[];
}

const props = defineProps<{
  step: FlipStep;

  stepNumber?: number;
}>();

const emit = defineEmits<{
  (e: 'completed'): void;
}>();

const flipped = ref<Set<number>>(new Set());

watch(
  () => props.step,
  () => {
    flipped.value.clear();
  }
);

const completed = computed(() => flipped.value.size === props.step.cards.length);

watch(completed, (value) => {
  if (value) {
    emit('completed');
  }
});

function markFlipped(id: number) {
  flipped.value.add(id);
}
</script>

<style scoped>
.flip-cards {
  display: flex;

  flex-direction: column;

  gap: 2rem;
}

.header {
  text-align: center;

  max-width: 700px;

  margin: auto;
}

.badge {
  display: inline-flex;

  padding: 0.35rem 0.8rem;

  background: #eef7f2;

  border-radius: 999px;

  font-size: 0.8rem;

  font-weight: 600;

  margin-bottom: 1rem;
}

.cards {
  display: grid;

  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));

  gap: 1.5rem;
}

.success {
  padding: 1.5rem;

  background: #eef9f4;

  border-radius: 12px;

  text-align: center;

  border: 1px solid #8cbe87;
}

.fade-enter-active,
.fade-leave-active {
  transition: 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;

  transform: translateY(10px);
}
</style>
