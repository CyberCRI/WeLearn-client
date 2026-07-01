<template>
  <div class="flip-card" :class="{ flipped }" @click="flip">
    <div class="inner">
      <div class="front">
        <div class="icon">
          {{ card.icon }}
        </div>

        <h3>
          {{ card.title }}
        </h3>

        <small> Cliquez pour découvrir </small>
      </div>

      <div class="back">
        <h3>
          {{ card.title }}
        </h3>

        <p>
          {{ card.explanation }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface FlipCardModel {
  id: number;

  title: string;

  icon: string;

  explanation: string;
}

const props = defineProps<{
  card: FlipCardModel;
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

  height: 240px;

  perspective: 1000px;
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

  background: white;

  border: 1px solid #ddd;

  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.06);
}

.front:hover {
  border-color: #41825a;
}

.back {
  background: #41825a;

  color: white;

  transform: rotateY(180deg);
}

.icon {
  font-size: 3rem;

  margin-bottom: 1rem;
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
