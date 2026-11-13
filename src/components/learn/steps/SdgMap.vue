<script setup lang="ts">
import { computed, ref } from 'vue';
import type { SdgsStep } from '@/types/learn/modules';
import SdgTile from '@/components/SdgTile.vue';
import SourceChip from './SourceChip.vue';

// the 17 goals; "group" re-orders them into the 5 Ps (tiles glide via TransitionGroup), "focus" highlights links.
const props = defineProps<{ step: SdgsStep }>();
const emit = defineEmits<{ done: [] }>();

const isGrouped = ref(false);
const isFocused = ref(false);
const seen = ref({ isGrouped: false, isFocused: false });

type Item =
  | { key: string; kind: 'header'; label: string }
  | { key: string; kind: 'goal'; goal: number };

const items = computed<Item[]>(() =>
  isGrouped.value
    ? props.step.ps.flatMap((p) => [
        { key: `h-${p.id}`, kind: 'header' as const, label: p.label },
        ...p.goals.map((goal) => ({ key: `g-${goal}`, kind: 'goal' as const, goal }))
      ])
    : Array.from({ length: 17 }, (_, i) => ({
        key: `g-${i + 1}`,
        kind: 'goal' as const,
        goal: i + 1
      }))
);

const isLinked = (goal: number) =>
  goal === props.step.focus.goal || props.step.focus.linked.includes(goal);

function mark(key: 'isGrouped' | 'isFocused') {
  seen.value[key] = true;
  if (seen.value.isGrouped && seen.value.isFocused) emit('done');
}

function handleToggleGroup() {
  isGrouped.value = !isGrouped.value;
  mark('isGrouped');
}

function handleToggleFocus() {
  isFocused.value = !isFocused.value;
  mark('isFocused');
}
</script>

<template>
  <div>
    <p class="mb-3">{{ step.explanation }} <SourceChip :cites="step.cite" /></p>

    <div class="buttons mb-3">
      <button class="button is-small" :aria-pressed="isGrouped" @click="handleToggleGroup">
        {{ isGrouped ? step.ungroupLabel : step.groupLabel }}
      </button>
      <button class="button is-small" :aria-pressed="isFocused" @click="handleToggleFocus">
        {{ step.focus.button }}
      </button>
      <SourceChip v-if="isGrouped" :cites="step.psCite" />
    </div>

    <TransitionGroup name="tiles" tag="div" class="grid" :class="{ focusing: isFocused }">
      <template v-for="item in items" :key="item.key">
        <h3 v-if="item.kind === 'header'" class="p-header">{{ item.label }}</h3>
        <div v-else class="tile-wrap" :class="{ linked: isFocused && isLinked(item.goal) }">
          <SdgTile :goal="item.goal" size="92" rounded="8" />
        </div>
      </template>
    </TransitionGroup>

    <Transition name="fade">
      <p v-if="isFocused" class="focus-text" aria-live="polite">
        {{ step.focus.text }} <SourceChip :cites="step.focus.cite" />
      </p>
    </Transition>

    <p class="note">{{ step.note }}</p>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  /* same width as the tiles (SdgTile size below) */
  grid-template-columns: repeat(auto-fill, 92px);
  gap: 8px;
  position: relative;
}

.p-header {
  grid-column: 1 / -1;
  margin: 0.5rem 0 0;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--neutral-70);
}

.tile-wrap {
  transition:
    opacity 0.3s,
    transform 0.3s;
}

.tile-wrap :deep(.sdg-tile) {
  cursor: default;
}

.focusing .tile-wrap:not(.linked) {
  opacity: 0.25;
}

.focusing .tile-wrap.linked {
  transform: scale(1.08);
}

.tiles-move {
  transition: transform 0.5s ease;
}

.tiles-enter-active,
.tiles-leave-active {
  transition: opacity 0.3s;
}

.tiles-enter-from,
.tiles-leave-to {
  opacity: 0;
}

.tiles-leave-active {
  position: absolute;
}

.focus-text {
  margin-top: 0.9rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background: var(--primary-lighter);
}

.note {
  margin-top: 1rem;
  font-weight: 600;
}

.fade-enter-active {
  transition: opacity 0.3s;
}
.fade-enter-from {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .tiles-move,
  .tile-wrap {
    transition: none;
  }
}
</style>
