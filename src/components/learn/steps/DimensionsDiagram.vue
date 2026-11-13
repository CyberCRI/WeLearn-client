<script setup lang="ts">
import { computed, ref } from 'vue';
import type { DimensionsStep } from '@/types/learn/modules';
import SourceChip from './SourceChip.vue';

const props = defineProps<{ step: DimensionsStep }>();
const emit = defineEmits<{ done: [] }>();

const selectedId = ref<string | null>(null);
const selected = computed(() => props.step.examples.find((e) => e.id === selectedId.value));
const DIMS = ['env', 'soc', 'eco'] as const;

function handlePick(id: string) {
  selectedId.value = id;
  emit('done');
}
</script>

<template>
  <div class="dimensions">
    <div class="examples" role="group">
      <button
        v-for="ex in step.examples"
        :key="ex.id"
        class="example-btn"
        :class="{ active: selectedId === ex.id }"
        :aria-pressed="selectedId === ex.id"
        @click="handlePick(ex.id)"
      >
        {{ ex.label }}
      </button>
    </div>

    <div class="layout">
      <!-- three overlapping circles; they light up and move closer once an example is picked -->
      <svg class="venn" :class="{ lit: selected }" viewBox="0 0 300 270" aria-hidden="true">
        <circle class="c env" cx="150" cy="95" r="80" />
        <circle class="c soc" cx="100" cy="180" r="80" />
        <circle class="c eco" cx="200" cy="180" r="80" />
        <text x="150" y="68" class="t">{{ step.labels.env }}</text>
        <text x="76" y="198" class="t">{{ step.labels.soc }}</text>
        <text x="224" y="198" class="t">{{ step.labels.eco }}</text>
        <circle class="core" cx="150" cy="152" r="10" />
      </svg>

      <Transition name="fade" mode="out-in">
        <div v-if="selected" :key="selected.id" class="details" aria-live="polite">
          <p
            v-for="(d, i) in DIMS"
            :key="d"
            class="dim"
            :class="d"
            :style="{ animationDelay: `${i * 0.15}s` }"
          >
            <strong>{{ step.labels[d] }}</strong> {{ selected[d] }}
          </p>
          <p class="link">{{ selected.link }}</p>
        </div>
        <p v-else class="placeholder">{{ $t('learn.module.pickExample') }}</p>
      </Transition>
    </div>

    <p class="closing">{{ step.closing }} <SourceChip :cites="step.cite" /></p>
  </div>
</template>

<style scoped>
.examples {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.example-btn {
  border: 1px solid var(--neutral-50);
  border-radius: 999px;
  background: var(--neutral-0);
  padding: 0.45rem 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.example-btn.active,
.example-btn:hover {
  border-color: var(--primary);
  background: var(--primary-lighter);
}

.layout {
  display: grid;
  grid-template-columns: minmax(12rem, 18rem) 1fr;
  gap: 1.5rem;
  align-items: center;
}

@media (max-width: 700px) {
  .layout {
    grid-template-columns: 1fr;
  }

  /* stacked: keep the diagram a glance, not a full-width poster */
  .venn {
    max-width: 14rem;
    margin: 0 auto;
  }
}

.c {
  fill-opacity: 0.18;
  stroke-width: 2;
  transition:
    fill-opacity 0.5s,
    transform 0.6s ease;
  transform-origin: 150px 152px;
}

.env {
  fill: var(--learn-green);
  stroke: var(--learn-green);
}
.soc {
  fill: var(--learn-orange);
  stroke: var(--learn-orange);
}
.eco {
  fill: var(--learn-blue);
  stroke: var(--learn-blue);
}

.venn.lit .c {
  fill-opacity: 0.35;
  transform: scale(0.92);
}

.core {
  fill: var(--neutral-90);
  opacity: 0;
  transition: opacity 0.5s 0.3s;
}

.venn.lit .core {
  opacity: 1;
  animation: pulse 1.6s ease-in-out 0.6s infinite;
  transform-origin: 150px 152px;
}

.t {
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  dominant-baseline: middle;
  fill: var(--neutral-90);
  transition: transform 0.6s ease;
  transform-origin: 150px 152px;
}

/* labels follow the circles when they draw together */
.venn.lit .t {
  transform: scale(0.92);
}

@keyframes pulse {
  50% {
    transform: scale(1.4);
  }
}

.details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dim {
  margin: 0;
  padding: 0.5rem 0.75rem;
  border-left: 4px solid;
  border-radius: 4px;
  background: var(--neutral-10);
  opacity: 0;
  animation: slide 0.35s ease forwards;
}

.dim strong {
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.dim.env {
  border-color: var(--learn-green);
}
.dim.soc {
  border-color: var(--learn-orange);
}
.dim.eco {
  border-color: var(--learn-blue);
}

.link {
  margin: 0.25rem 0 0;
  font-weight: 600;
}

.placeholder {
  color: var(--neutral-70);
}

.closing {
  margin-top: 1.25rem;
  color: var(--neutral-80);
}

@keyframes slide {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .c,
  .core {
    transition: none;
    animation: none;
  }
  .dim {
    animation: none;
    opacity: 1;
  }
}
</style>
