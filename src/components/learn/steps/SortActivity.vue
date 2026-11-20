<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ModuleId, SortStep } from '@/types/learn/modules';
import { emptySort, firstTryCount, isSortDone, placeCard, shuffled } from '@/learn/sort';
import { track } from '@/utils/analytics';
import SourceChip from './SourceChip.vue';

// sort cards into bins: drag with pointer events (mouse, touch, pen), or select a card then a bin
// (tap / keyboard). Native HTML5 drag-and-drop is not used: it doesn't work on touch screens.
const props = defineProps<{ step: SortStep; moduleId: ModuleId }>();
const emit = defineEmits<{ done: [] }>();

const state = ref(emptySort());
const selectedId = ref<string | null>(null);
const dragOverBin = ref<string | null>(null);
const message = ref<{ text: string; correct: boolean } | null>(null);
const shakeId = ref<string | null>(null);

// content lists cards grouped by answer: shuffle once per visit so the order gives nothing away
const order = shuffled(props.step.cards);
const pool = computed(() => order.filter((c) => !state.value.placed[c.id]));
const inBin = (binId: string) => props.step.cards.filter((c) => state.value.placed[c.id] === binId);
const isDone = computed(() => isSortDone(state.value, props.step.cards.length));

function place(cardId: string, binId: string) {
  const card = props.step.cards.find((c) => c.id === cardId);
  if (!card) return;
  const result = placeCard(state.value, card, binId);
  state.value = result.state;
  selectedId.value = null;
  message.value = result.correct
    ? { text: card.feedback, correct: true }
    : { text: card.hint, correct: false };
  if (!result.correct) {
    shakeId.value = card.id;
    setTimeout(() => (shakeId.value = null), 450);
  }
  if (isDone.value) {
    track('Learn Sort Completed', {
      module: props.moduleId,
      stepId: props.step.id,
      firstTryCount: firstTryCount(state.value),
      total: props.step.cards.length
    });
    emit('done');
  }
}

// pointer drag: the card follows the pointer once it moves more than a few pixels; on release over a
// bin it is placed there. A press without movement stays a click (select).
const drag = ref<{ id: string; dx: number; dy: number } | null>(null);
let start: { id: string; x: number; y: number } | null = null;
let shouldSuppressClick = false;

const binAt = (x: number, y: number) =>
  (document.elementFromPoint(x, y)?.closest('[data-bin]') as HTMLElement | null)?.dataset.bin ??
  null;

function handlePointerMove(e: PointerEvent) {
  if (!start) return;
  const dx = e.clientX - start.x;
  const dy = e.clientY - start.y;
  if (!drag.value && Math.hypot(dx, dy) < 6) return;
  drag.value = { id: start.id, dx, dy };
  dragOverBin.value = binAt(e.clientX, e.clientY);
}

function handlePointerUp() {
  window.removeEventListener('pointermove', handlePointerMove);
  if (drag.value && start) {
    const bin = dragOverBin.value;
    // swallow the click the browser may fire right after this pointerup, but only that one
    shouldSuppressClick = true;
    setTimeout(() => (shouldSuppressClick = false), 0);
    drag.value = null;
    dragOverBin.value = null;
    if (bin) place(start.id, bin);
  }
  start = null;
}

function handlePointerDown(e: PointerEvent, id: string) {
  if (e.button !== 0) return;
  start = { id, x: e.clientX, y: e.clientY };
  window.addEventListener('pointermove', handlePointerMove);
  window.addEventListener('pointerup', handlePointerUp, { once: true });
}

function handleCardClick(id: string) {
  if (shouldSuppressClick) {
    shouldSuppressClick = false;
    return;
  }
  selectedId.value = selectedId.value === id ? null : id;
}

function handleBinClick(binId: string) {
  if (selectedId.value) place(selectedId.value, binId);
}
</script>

<template>
  <div class="sort">
    <TransitionGroup name="card" tag="div" class="pool" :aria-label="$t('learn.module.sortPool')">
      <button
        v-for="card in pool"
        :key="card.id"
        class="sort-card"
        :class="{
          selected: selectedId === card.id,
          shake: shakeId === card.id,
          dragging: drag?.id === card.id
        }"
        :style="
          drag?.id === card.id ? { transform: `translate(${drag.dx}px, ${drag.dy}px)` } : undefined
        "
        :aria-pressed="selectedId === card.id"
        @pointerdown="(e: PointerEvent) => handlePointerDown(e, card.id)"
        @click="handleCardClick(card.id)"
      >
        {{ card.text }}
      </button>
    </TransitionGroup>

    <p
      v-if="message"
      class="sort-message"
      :class="message.correct ? 'ok' : 'retry'"
      role="status"
      aria-live="polite"
    >
      {{ message.correct ? message.text : `${$t('learn.module.notQuite')} ${message.text}` }}
    </p>

    <div class="bins" :style="{ '--cols': Math.min(step.bins.length, 3) }">
      <button
        v-for="bin in step.bins"
        :key="bin.id"
        class="bin"
        :data-bin="bin.id"
        :class="{ over: dragOverBin === bin.id, armed: !!selectedId || !!drag }"
        :aria-label="selectedId ? $t('learn.module.sortPlaceIn', { bin: bin.label }) : bin.label"
        @click="handleBinClick(bin.id)"
      >
        <strong class="bin-label">{{ bin.label }}</strong>
        <TransitionGroup name="land" tag="span" class="placed">
          <span v-for="card in inBin(bin.id)" :key="card.id" class="placed-card"
            >✓ {{ card.text }}</span
          >
        </TransitionGroup>
      </button>
    </div>

    <Transition name="fade">
      <p v-if="isDone" class="done">
        {{ $t('learn.module.sortDone', { n: firstTryCount(state), total: step.cards.length }) }}
        <template v-if="step.closing"><br />{{ step.closing }}</template>
      </p>
    </Transition>
    <SourceChip :cites="step.cite" />
  </div>
</template>

<style scoped>
.pool {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  gap: 0.5rem;
  min-height: 2.5rem;
  margin: 0.5rem 0 1rem;
}

/* nothing left to sort: no blank gap above the bins */
.pool:empty {
  display: none;
}

.sort-card {
  border: 1px solid var(--neutral-50);
  border-radius: 8px;
  background: var(--neutral-0);
  padding: 0.5rem 0.75rem;
  font-size: 0.88rem;
  text-align: left;
  cursor: grab;
  touch-action: none; /* pointer drag instead of page scroll when dragging a card */
  user-select: none;
  box-shadow: 0 2px 4px rgb(0 0 0 / 6%);
  transition:
    transform 0.15s,
    border-color 0.15s,
    box-shadow 0.15s;
  max-width: 100%;
}

.sort-card:hover {
  transform: translateY(-2px);
}

.sort-card.dragging {
  position: relative;
  z-index: 10;
  pointer-events: none; /* lets elementFromPoint see the bin under the card */
  cursor: grabbing;
  box-shadow: 0 10px 24px rgb(0 0 0 / 18%);
  transition: none;
}

.sort-card.selected {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-light);
}

.sort-card.shake {
  animation: shake 0.4s;
  border-color: var(--learn-orange);
}

.bins {
  display: grid;
  grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
  gap: 0.6rem;
}

@media (max-width: 700px) {
  .bins {
    grid-template-columns: 1fr;
  }
}

.bin {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.4rem;
  min-height: 5rem;
  padding: 0.75rem;
  border: 2px dashed var(--neutral-20);
  border-radius: 10px;
  background: var(--neutral-10);
  text-align: left;
  cursor: default;
  transition:
    border-color 0.15s,
    background-color 0.15s;
}

.bin.armed {
  cursor: pointer;
  border-color: var(--primary-light);
}

.bin.over,
.bin.armed:hover {
  border-color: var(--primary);
  background: var(--primary-lighter);
}

.bin-label {
  font-size: 0.9rem;
}

.placed {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.placed-card {
  font-size: 0.8rem;
  padding: 0.3rem 0.5rem;
  border-radius: 6px;
  background: var(--neutral-0);
  color: var(--primary-dark);
}

.sort-message {
  margin: 0 0 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
}

.sort-message.ok {
  background: var(--primary-lighter);
}

.sort-message.retry {
  background: var(--warning-10);
}

.done {
  margin-top: 0.75rem;
  font-weight: 600;
}

@keyframes shake {
  25% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-3px);
  }
}

.card-leave-active,
.land-enter-active {
  transition: all 0.3s ease;
}

.card-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.land-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}

.card-move {
  transition: transform 0.3s;
}

.fade-enter-active {
  transition: opacity 0.3s;
}
.fade-enter-from {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .sort-card.shake {
    animation: none;
  }
}
</style>
