<template>
  <div class="flip-card" :class="{ flipped, [card.color]: card.color }" @click="flip">
    <div class="inner">
      <div class="front">
        <h3>
          {{ card.verb }}
        </h3>

        <small> Cliquez pour découvrir </small>
      </div>

      <div class="back">
        <h3>
          {{ card.verb }}
        </h3>

        <p>
          {{ card.text }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FlipCard } from '@/types/microlearning';
import { ref } from 'vue';

defineProps<{
  card: FlipCard;
}>();

const emit = defineEmits<{
  (e: 'flip'): void;
}>();

const flipped = ref(false);

function flip() {
  if (flipped.value) return;

  flipped.value = true;
  emit('flip');
}
</script>

<style scoped>
.flip-card {
  cursor: pointer;
  height: 200px;
  perspective: 1000px;
  border-radius: 16px;
  background-color: var(--primary-hover);
  color: var(--neutral-0);
}

.inner {
  position: relative;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.flipped .inner {
  transform: rotateY(180deg);
}

.flipped {
  color: var(--neutral-100);
}

.ct.flipped {
  background-color: var(--primary-lighter);
}

.cp.flipped {
  background-color: var(--secondary-lighter);
}

.cy.flipped {
  background-color: var(--lpi-yellow-lighter);
}

.ck.flipped {
  background-color: var(--tertiary-lighter);
}

.front,
.back {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  border: 1px solid VAR(--neutral-20);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.06);
}

.front:hover {
  border-color: #41825a;
}

.back {
  transform: rotateY(180deg);
}

h3 {
  margin-bottom: 1rem;
}

small {
  opacity: 0.7;
}

p {
  line-height: 1.6;
}
</style>
