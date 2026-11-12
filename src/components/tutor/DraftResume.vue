<script setup lang="ts">
import { computed } from 'vue';
import i18n from '@/localisation/i18n';
import { useDraftStore } from '@/stores/draft';

// on opening the syllabus tool: a draft saved in this browser is offered, to resume it, start a
// new syllabus, or remove it. a draft that cannot be restored is said, and can be removed
const draft = useDraftStore();

const when = (iso: string) =>
  new Date(iso).toLocaleString(i18n.global.locale.value, {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
const summary = computed(() => {
  const saved = draft.found;
  if (!saved) return '';
  return i18n.global.t('tutor.draft.found', {
    course: saved.tutor.teachingContext.title || i18n.global.t('tutor.draft.untitled'),
    file: saved.tutor.fileName || '—',
    time: when(saved.savedAt)
  });
});
</script>

<template>
  <section
    v-if="draft.found || draft.isUnusable"
    class="draft-resume"
    role="status"
    data-testid="draft-resume"
  >
    <template v-if="draft.found">
      <p>
        <strong>{{ $t('tutor.draft.foundTitle') }}</strong>
        <span data-testid="draft-summary">{{ summary }}</span>
      </p>
      <div class="actions">
        <button
          type="button"
          class="button is-small is-primary"
          data-testid="draft-restore"
          @click="draft.restore()"
        >
          {{ $t('tutor.draft.resume') }}
        </button>
        <button
          type="button"
          class="button is-small is-text"
          data-testid="draft-start-new"
          @click="draft.startNew()"
        >
          {{ $t('tutor.draft.startNew') }}
        </button>
        <button
          type="button"
          class="button is-small is-text"
          data-testid="draft-remove"
          @click="draft.discard()"
        >
          {{ $t('tutor.draft.remove') }}
        </button>
      </div>
    </template>
    <template v-else>
      <p data-testid="draft-unusable">{{ $t('tutor.draft.unusable') }}</p>
      <div class="actions">
        <button
          type="button"
          class="button is-small"
          data-testid="draft-remove"
          @click="draft.discard()"
        >
          {{ $t('tutor.draft.remove') }}
        </button>
      </div>
    </template>
  </section>
</template>

<style scoped>
.draft-resume {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem 1rem;
  width: 100%;
  max-width: 48rem;
  margin: 1rem auto 0;
  padding: 0.75rem 1rem;
  border-left: 3px solid var(--primary);
  background: var(--neutral-10);
  font-size: 0.9rem;
}

.draft-resume strong {
  margin-right: 0.4rem;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}
</style>
