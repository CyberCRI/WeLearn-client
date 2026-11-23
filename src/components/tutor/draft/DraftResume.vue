<script setup lang="ts">
import { computed } from 'vue';
import i18n from '@/localisation/i18n';
import ButtonComponent from '@/components/ButtonComponent.vue';
import { useCourseDraftStore } from '@/stores/courseDraft';

// on the path question: a draft kept in this browser is offered, to resume it, start a new
// syllabus or remove it. a draft that cannot be restored is said, and can be removed
const draft = useCourseDraftStore();

const summary = computed(() => {
  const saved = draft.found;
  if (!saved) return '';
  const { t, locale } = i18n.global;
  return t('tutor.draft.found', {
    course: saved.course.teachingContext.title || t('tutor.draft.untitled'),
    file: saved.course.fileName || '—',
    time: new Date(saved.savedAt).toLocaleString(locale.value, {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
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
        {{ ' ' }}
        <span data-testid="draft-summary">{{ summary }}</span>
      </p>
      <div class="actions">
        <ButtonComponent
          color="primary"
          class="is-small"
          data-testid="draft-restore"
          @click="draft.restore()"
        >
          {{ $t('tutor.draft.resume') }}
        </ButtonComponent>
        <ButtonComponent
          class="is-small is-text"
          data-testid="draft-start-new"
          @click="draft.startNew()"
        >
          {{ $t('tutor.draft.startNew') }}
        </ButtonComponent>
        <ButtonComponent
          class="is-small is-text"
          data-testid="draft-remove"
          @click="draft.discard()"
        >
          {{ $t('tutor.draft.remove') }}
        </ButtonComponent>
      </div>
    </template>
    <template v-else>
      <p data-testid="draft-unusable">{{ $t('tutor.draft.unusable') }}</p>
      <div class="actions">
        <ButtonComponent class="is-small" data-testid="draft-remove" @click="draft.discard()">
          {{ $t('tutor.draft.remove') }}
        </ButtonComponent>
      </div>
    </template>
  </section>
</template>

<style scoped>
.draft-resume {
  margin-bottom: 1.5rem;
  padding: 0.75rem 1rem;
  border-left: 3px solid var(--lpi-violet);
  background: var(--lpi-violet-lighter);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
</style>
