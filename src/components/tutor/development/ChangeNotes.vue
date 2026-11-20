<script setup lang="ts">
import { computed } from 'vue';
import type { AdaptationProposal } from '@/types';

// optional pedagogical notes for the teacher, folded under the change: they help to weigh it,
// are not part of it and are never added to the syllabus. GreenComp comes last
const props = defineProps<{ guidance: AdaptationProposal['guidance'] }>();

const hasNotes = computed(() => {
  const { learning, teaching, check, greencomp } = props.guidance;
  return !!(learning || teaching || check || greencomp);
});
</script>

<template>
  <details v-if="hasNotes" class="notes" data-testid="pedagogical-notes">
    <summary>{{ $t('tutor.additions.change.notes.title') }}</summary>
    <p class="muted">{{ $t('tutor.additions.change.notes.hint') }}</p>
    <dl class="notes-list">
      <template v-if="guidance.learning">
        <dt>{{ $t('tutor.additions.change.notes.learning') }}</dt>
        <dd data-testid="note-learning">{{ guidance.learning }}</dd>
      </template>
      <template v-if="guidance.teaching">
        <dt>{{ $t('tutor.additions.change.notes.teaching') }}</dt>
        <dd data-testid="note-teaching">{{ guidance.teaching }}</dd>
      </template>
      <template v-if="guidance.check">
        <dt>{{ $t('tutor.additions.change.notes.check') }}</dt>
        <dd data-testid="note-check">{{ guidance.check }}</dd>
      </template>
      <template v-if="guidance.greencomp">
        <dt>{{ $t('tutor.additions.change.notes.greencomp') }}</dt>
        <dd data-testid="note-greencomp">
          <strong>{{ $t(`tutor.greencomp.${guidance.greencomp.id}`) }}</strong> —
          {{ guidance.greencomp.how }}
        </dd>
      </template>
    </dl>
  </details>
</template>

<style scoped>
.notes {
  margin-top: 0.75rem;
  font-size: 0.9rem;
  summary {
    font-weight: 600;
    color: var(--neutral-80);
    cursor: pointer;
  }
}

.muted {
  font-size: 0.8rem;
  color: var(--neutral-70);
}

.notes-list {
  display: grid;
  grid-template-columns: 10rem minmax(0, 1fr);
  gap: 0.35rem 1rem;
  margin-top: 0.4rem;
}

.notes-list dt {
  font-size: 0.85rem;
  color: var(--neutral-70);
}

@media (max-width: 600px) {
  .notes-list {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
