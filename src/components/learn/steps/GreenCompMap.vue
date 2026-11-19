<script setup lang="ts">
import type { GreenCompStep } from '@/types/learn/modules';
import SourceChip from './SourceChip.vue';
import NumberedCard from '@/components/learn/NumberedCard.vue';
import { useOpenAll } from '@/composables/useOpenAll';

// the 4 GreenComp areas × 3 competences, drawn by us (adapted from the CC BY 4.0 framework, credited below)
const props = defineProps<{ step: GreenCompStep }>();
const emit = defineEmits<{ done: [] }>();

const { openKey, opened, handleToggle } = useOpenAll<string>(
  () => props.step.areas.length,
  () => emit('done')
);
</script>

<template>
  <div>
    <p class="mb-3">{{ step.explanation }} <SourceChip :cites="step.cite" /></p>

    <div class="areas">
      <NumberedCard
        v-for="(area, i) in step.areas"
        :key="area.id"
        :num="i + 1"
        :title="area.name"
        :isOpen="openKey === area.id"
        :isSeen="opened.has(area.id)"
        @toggle="handleToggle(area.id)"
      >
        <ul class="competences" :class="{ open: openKey === area.id }">
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
      </NumberedCard>
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

.competences.open .competence {
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
