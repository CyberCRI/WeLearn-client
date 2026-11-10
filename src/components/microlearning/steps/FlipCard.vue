<template>
  <!-- a native button: focusable, and Enter/Space flip it like a click -->
  <button
    type="button"
    class="flip-card"
    :class="{ flipped, [card.color]: card.color }"
    :aria-pressed="flipped"
    @click="!flipped && $emit('flip')"
  >
    <!-- spans, not h3/p: a button only takes phrasing content -->
    <span class="inner">
      <!-- only the visible face is read, so the verb is not announced twice -->
      <span class="front" :aria-hidden="flipped || undefined">
        <span class="verb">{{ card.verb }}</span>

        <small> {{ $t('microLearning.flipCards.clickToDiscover') }} </small>
      </span>

      <span class="back" :aria-hidden="!flipped || undefined">
        <span class="verb">{{ card.verb }}</span>

        <span class="text">{{ card.text }}</span>
      </span>
    </span>
  </button>
</template>

<script setup lang="ts">
import type { FlipCard } from '@/types/microlearning';

defineProps<{
  card: FlipCard;
  flipped: boolean;
}>();

defineEmits<{
  (e: 'flip'): void;
}>();
</script>

<style scoped>
.flip-card {
  /* reset the native button look, the card keeps its own */
  appearance: none;
  border: none;
  margin: 0;
  padding: 0;
  width: 100%;
  font: inherit;
  letter-spacing: inherit;
  text-align: inherit;

  cursor: pointer;
  display: grid;
  min-height: 18rem;
  perspective: 1000px;
  border-radius: 16px;
  background-color: var(--primary-hover);
  color: var(--neutral-0);
}

.flip-card:focus-visible {
  outline: 3px solid var(--primary-dark);
  outline-offset: 3px;
}

/* Both faces share one grid cell: the card grows to fit the longest face, no overflow */
.inner {
  display: grid;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.flip-card.flipped {
  cursor: auto;
  /* buttons default to unselectable text, the revealed text stays selectable */
  user-select: text;
}

.flipped .inner {
  transform: rotateY(180deg);
}

.flipped {
  color: var(--neutral-100);

  .front {
    opacity: 0;
    transition: all 0.2s ease-in;
  }
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
  opacity: 1;
  grid-area: 1 / 1;
  backface-visibility: hidden;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  border: 1px solid var(--neutral-20);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.06);
}

.front:hover {
  border-color: #41825a;
}

.back {
  transform: rotateY(180deg);
}

.verb {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 700;
}
</style>
