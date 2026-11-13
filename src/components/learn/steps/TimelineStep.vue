<script setup lang="ts">
import type { TimelineStep } from '@/types/learn/modules';
import SourceChip from './SourceChip.vue';
import { useOpenAll } from '@/composables/useOpenAll';

const props = defineProps<{ step: TimelineStep }>();
const emit = defineEmits<{ done: [] }>();

const { openKey, opened, handleToggle } = useOpenAll<number>(
  () => props.step.events.length,
  () => emit('done')
);
</script>

<template>
  <div>
    <ol class="timeline">
      <li
        v-for="(ev, i) in step.events"
        :key="ev.year"
        class="event"
        :class="{ open: openKey === i, seen: opened.has(i) }"
        :style="{ animationDelay: `${i * 0.12}s` }"
      >
        <button class="event-head" :aria-expanded="openKey === i" @click="handleToggle(i)">
          <span class="dot" aria-hidden="true" />
          <span class="year">{{ ev.year }}</span>
          <span class="label">{{ ev.label }}</span>
        </button>
        <Transition name="unfold">
          <div v-if="openKey === i" class="detail">
            <p>{{ ev.detail }}</p>
            <SourceChip :cites="ev.cite" />
          </div>
        </Transition>
      </li>
    </ol>

    <div class="closing">
      <p>{{ step.closing }} <SourceChip :cites="step.closingCite" /></p>
      <p class="is-size-7 has-text-grey">{{ step.note }}</p>
    </div>
  </div>
</template>

<style scoped>
.timeline {
  list-style: none;
  margin: 0;
  padding: 0 0 0 1rem;
  border-left: 3px solid var(--primary-light);
}

.event {
  position: relative;
  margin-bottom: 0.5rem;
  opacity: 0;
  animation: rise 0.4s ease forwards;
}

.event-head {
  all: unset;
  box-sizing: border-box;
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
}

.event-head:hover,
.event.open .event-head {
  background: var(--neutral-10);
}

.event-head:focus-visible {
  outline: 2px solid var(--primary);
}

.dot {
  position: absolute;
  left: -1.55rem;
  top: 0.85rem;
  width: 0.9rem;
  height: 0.9rem;
  border-radius: 50%;
  background: var(--neutral-0);
  border: 3px solid var(--primary);
  transition: background-color 0.2s;
}

.event.seen .dot {
  background: var(--primary);
}

.year {
  font-weight: 800;
  color: var(--primary-dark);
  min-width: 3rem;
}

.label {
  font-weight: 600;
}

.detail {
  padding: 0.25rem 0.75rem 0.75rem 4.5rem;
}

.detail p {
  margin: 0 0 0.4rem;
}

.closing {
  margin-top: 1.25rem;
  padding: 1rem;
  border-radius: 10px;
  background: var(--primary-lighter);
}

.closing p {
  margin: 0 0 0.4rem;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.unfold-enter-active,
.unfold-leave-active {
  transition: opacity 0.2s;
}
.unfold-enter-from,
.unfold-leave-to {
  opacity: 0;
}

@media (max-width: 600px) {
  .detail {
    padding-left: 0.75rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .event {
    animation: none;
    opacity: 1;
  }
}
</style>
