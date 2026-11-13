<script setup lang="ts">
import { computed } from 'vue';
import type { ConceptsStep } from '@/types/learn/modules';
import SourceChip from './SourceChip.vue';
import { useOpenAll } from '@/composables/useOpenAll';

const props = defineProps<{ step: ConceptsStep }>();
const emit = defineEmits<{ done: [] }>();

const { openKey, opened, isAllOpened, handleToggle } = useOpenAll<string>(
  () => props.step.items.length,
  () => emit('done')
);
const byId = computed(() => Object.fromEntries(props.step.items.map((i) => [i.id, i])));
const openItem = computed(() => (openKey.value ? byId.value[openKey.value] : null));
</script>

<template>
  <div>
    <div class="cards">
      <article
        v-for="item in step.items"
        :key="item.id"
        class="concept"
        :class="{ open: openKey === item.id, seen: opened.has(item.id) }"
      >
        <button
          class="concept-head"
          :aria-expanded="openKey === item.id"
          @click="handleToggle(item.id)"
        >
          <span class="role">{{ item.role }}</span>
          <strong>{{ item.term }}</strong>
          <span class="seen-mark" aria-hidden="true">{{ opened.has(item.id) ? '✓' : '+' }}</span>
        </button>
      </article>
    </div>

    <!-- one panel under the cards: the grid never re-flows when a card opens -->
    <Transition name="unfold" mode="out-in">
      <div v-if="openItem" :key="openItem.id" class="concept-body" aria-live="polite">
        <p>{{ openItem.explanation }}</p>
        <p class="example">
          <span class="label">{{ $t('learn.module.inHigherEd') }}</span> {{ openItem.example }}
        </p>
        <p class="relation">↔ {{ openItem.relation }}</p>
        <SourceChip :cites="openItem.cite" />
      </div>
    </Transition>

    <Transition name="fade">
      <section v-if="isAllOpened" class="map" aria-live="polite">
        <h3 class="map-title">{{ step.mapTitle }}</h3>
        <div v-for="(row, r) in step.map" :key="r" class="map-row">
          <template v-for="(id, i) in row.ids" :key="id">
            <span class="node" :style="{ animationDelay: `${(r * 3 + i) * 0.25}s` }">
              {{ byId[id]?.term }}
            </span>
            <span
              v-if="row.arrows[i]"
              class="arrow"
              :style="{ animationDelay: `${(r * 3 + i) * 0.25 + 0.12}s` }"
            >
              {{ row.arrows[i] }} →
            </span>
          </template>
        </div>
      </section>
    </Transition>
  </div>
</template>

<style scoped>
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
  gap: 0.75rem;
  align-items: start;
}

.concept {
  border: 1px solid var(--neutral-20);
  border-radius: 10px;
  background: var(--neutral-0);
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    transform 0.2s;
}

.concept:hover {
  transform: translateY(-2px);
}

.concept.open {
  border-color: var(--primary);
  background: var(--primary-lighter);
}

.concept-head {
  all: unset;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.15rem 0.5rem;
  width: 100%;
  padding: 0.9rem 1rem;
  cursor: pointer;
}

.concept-head:focus-visible {
  outline: 2px solid var(--primary);
  border-radius: 10px;
}

.role {
  grid-column: 1;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--primary-dark);
}

.concept-head strong {
  grid-column: 1;
}

.seen-mark {
  grid-column: 2;
  grid-row: 1 / span 2;
  align-self: center;
  color: var(--primary-dark);
  font-weight: 700;
}

.concept-body {
  margin-top: 0.75rem;
  padding: 1rem;
  border: 1px solid var(--primary);
  border-radius: 10px;
  background: var(--neutral-0);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.concept-body p {
  margin: 0;
}

.example {
  padding: 0.6rem 0.8rem;
  border-radius: 6px;
  background: var(--primary-lighter);
}

.label {
  font-weight: 600;
}

.relation {
  color: var(--neutral-70);
}

.map {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 10px;
  background: var(--neutral-10);
}

.map-title {
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.map-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.6rem;
}

.node,
.arrow {
  opacity: 0;
  animation: pop 0.4s ease forwards;
}

.node {
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: var(--neutral-0);
  border: 1px solid var(--primary);
  font-weight: 600;
  font-size: 0.85rem;
}

.arrow {
  font-size: 0.8rem;
  color: var(--neutral-70);
}

@keyframes pop {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.unfold-enter-active,
.unfold-leave-active,
.fade-enter-active {
  transition:
    opacity 0.25s,
    transform 0.25s;
}

.unfold-enter-from,
.unfold-leave-to,
.fade-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
  .node,
  .arrow {
    animation: none;
    opacity: 1;
  }
}
</style>
