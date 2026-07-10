<template>
  <section class="flip-cards">
    <div class="cards">
      <FlipCard
        v-for="(card, index) in step.cards"
        :key="index"
        :card="card"
        @flip="markFlipped(index)"
      />
    </div>

    <Transition name="fade">
      <div v-if="completed" class="success">
        <h3>{{ $t('microLearning.flipCards.bravo') }}</h3>

        <p>{{ $t('microLearning.flipCards.completed') }}</p>
      </div>
    </Transition>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import FlipCard from './FlipCard.vue';
import type { FlipStep } from '@/types/microlearning/index.js';

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
  width: 100%;
  height: 100%;
}

.header {
  text-align: center;
  margin: auto;
}

.badge {
  display: inline-flex;
  border-radius: 999px;
  margin-bottom: 1rem;
}

.cards {
  display: grid;

  grid-template-columns: 1fr 1fr;

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
