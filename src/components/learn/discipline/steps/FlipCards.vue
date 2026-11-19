<template>
  <section class="flip-cards">
    <h2 class="step-title">{{ $t('learn.discipline.contributions.title') }}</h2>
    <p class="step-intro">
      {{ $t('learn.discipline.contributions.subtitle') }}
    </p>
    <div class="cards">
      <!-- one-way: a revealed card stays open so its text can be read and selected -->
      <NumberedCard
        v-for="(card, index) in step.cards"
        :key="index"
        :num="index + 1"
        :title="card.verb"
        :isOpen="isFlipped(index)"
        :isSeen="isFlipped(index)"
        @toggle="$emit('flip', index)"
      >
        <p v-if="isFlipped(index)" class="card-text">{{ card.text }}</p>
      </NumberedCard>
    </div>

    <Transition name="fade">
      <div v-if="completed" class="success">
        <h3>{{ $t('learn.discipline.flipCards.bravo') }}</h3>

        <p>{{ $t('learn.discipline.flipCards.completed') }}</p>
      </div>
    </Transition>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import NumberedCard from '@/components/learn/NumberedCard.vue';
import type { FlipStep } from '@/types/learn/discipline';

const props = defineProps<{
  step: FlipStep;
  stepNumber?: number;
  flipped: number[];
}>();

defineEmits<{
  (e: 'flip', index: number): void;
}>();

const isFlipped = (index: number) => props.flipped.includes(index);

const completed = computed(() => props.flipped.length === props.step.cards.length);
</script>

<style scoped>
.flip-cards {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  height: 100%;
}
.step-title {
  margin: 0 0 0.75rem;
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--neutral-100);
  text-align: center;
}

.step-intro {
  margin: 0;
  color: var(--neutral-80);
  line-height: 1.7;
  text-align: center;
}

.cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: start;
  gap: 0.75rem;
}

@media (max-width: 700px) {
  .cards {
    grid-template-columns: 1fr;
  }
}

.card-text {
  margin: 0;
  padding: 0 1rem 0.9rem;
  font-size: 0.88rem;
  color: var(--neutral-70);
}

.success {
  padding: 1.5rem;
  background: var(--primary-lighter);
  border-radius: 12px;
  text-align: center;
  border: 1px solid var(--primary-light);
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
