<script setup lang="ts">
import type { GreenCompStep } from '@/types/learn/modules';
import SourceChip from './SourceChip.vue';
import { useOpenAll } from '@/composables/useOpenAll';

// the 4 GreenComp areas × 3 competences, drawn by us (adapted from the CC BY 4.0 framework, credited below)
const props = defineProps<{ step: GreenCompStep }>();
const emit = defineEmits<{ done: [] }>();

const { openKey, opened, handleToggle } = useOpenAll<string>(
  () => props.step.areas.length,
  () => emit('done')
);
const COLORS = ['--learn-green', '--learn-blue', '--learn-violet', '--learn-orange'];
</script>

<template>
  <div>
    <p class="mb-3">{{ step.explanation }} <SourceChip :cites="step.cite" /></p>

    <div class="areas">
      <section
        v-for="(area, i) in step.areas"
        :key="area.id"
        class="area"
        :class="{ open: openKey === area.id }"
        :style="{ '--c': `var(${COLORS[i]})` }"
      >
        <button
          class="area-head"
          :aria-expanded="openKey === area.id"
          @click="handleToggle(area.id)"
        >
          <span class="num">{{ i + 1 }}</span>
          <strong>{{ area.name }}</strong>
          <span aria-hidden="true">{{ opened.has(area.id) ? '✓' : '+' }}</span>
        </button>
        <ul class="competences">
          <li
            v-for="(c, j) in area.competences"
            :key="c.name"
            class="competence"
            :style="{ transitionDelay: openKey === area.id ? `${j * 0.08}s` : '0s' }"
          >
            <span class="code">{{ i + 1 }}.{{ j + 1 }}</span>
            <span>
              <strong>{{ c.name }}</strong>
              <span v-if="openKey === area.id" class="line">{{ c.line }}</span>
            </span>
          </li>
        </ul>
      </section>
    </div>

    <p class="note">{{ step.note }} <SourceChip :cites="step.noteCite" /></p>
    <p class="is-size-7 has-text-grey">{{ step.attribution }}</p>
  </div>
</template>

<style scoped>
.areas {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

@media (max-width: 700px) {
  .areas {
    grid-template-columns: 1fr;
  }
}

.area {
  border: 2px solid color-mix(in srgb, var(--c) 35%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, var(--c) 6%, var(--neutral-0));
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.area.open {
  border-color: var(--c);
  box-shadow: 0 6px 18px rgb(0 0 0 / 8%);
}

.area-head {
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

.area-head:focus-visible {
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

.competences {
  list-style: none;
  margin: 0;
  padding: 0 1rem 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.competence {
  display: grid;
  grid-template-columns: 2rem 1fr;
  gap: 0.25rem;
  font-size: 0.88rem;
  opacity: 0.75;
  transition:
    opacity 0.3s,
    transform 0.3s;
}

.area.open .competence {
  opacity: 1;
  transform: translateX(3px);
}

.code {
  color: var(--c);
  font-weight: 700;
}

.line {
  display: block;
  color: var(--neutral-70);
}

.note {
  margin-top: 1rem;
  font-weight: 600;
}

@media (prefers-reduced-motion: reduce) {
  .competence {
    transition: none;
  }
}
</style>
