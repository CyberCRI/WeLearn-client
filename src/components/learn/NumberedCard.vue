<script setup lang="ts">
import { computed } from 'vue';

// a numbered, colored card that opens on click: the GreenComp areas and the discipline
// contributions share it so the learn modules look and behave the same
const props = defineProps<{
  num: number;
  title: string;
  isOpen: boolean;
  // shows a check instead of the "+" once the card has been opened
  isSeen: boolean;
}>();
defineEmits<{ toggle: [] }>();

const COLORS = ['--learn-green', '--learn-blue', '--learn-violet', '--learn-orange'];
const color = computed(() => `var(${COLORS[(props.num - 1) % COLORS.length]})`);
</script>

<template>
  <section class="numbered-card" :class="{ open: isOpen }" :style="{ '--c': color }">
    <button type="button" class="card-head" :aria-expanded="isOpen" @click="$emit('toggle')">
      <span class="num">{{ num }}</span>
      <strong>{{ title }}</strong>
      <span aria-hidden="true">{{ isSeen ? '✓' : '+' }}</span>
    </button>
    <slot />
  </section>
</template>

<style scoped>
.numbered-card {
  border: 2px solid color-mix(in srgb, var(--c) 35%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, var(--c) 6%, var(--neutral-0));
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.numbered-card.open {
  border-color: var(--c);
  box-shadow: 0 6px 18px rgb(0 0 0 / 8%);
}

.card-head {
  all: unset;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.85rem 1rem;
  cursor: pointer;
}

.card-head:focus-visible {
  outline: 2px solid var(--c);
  border-radius: 12px;
}

.num {
  display: grid;
  place-items: center;
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 50%;
  background: var(--c);
  color: #fff;
  font-weight: 700;
}
</style>
