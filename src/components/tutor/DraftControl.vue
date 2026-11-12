<script setup lang="ts">
import { computed } from 'vue';
import i18n from '@/localisation/i18n';
import { useDraftStore } from '@/stores/draft';

// the teacher's choice to keep a draft in this browser: one discreet "save draft" action at the
// bottom of the workflow, what it keeps one click away. once saved, the draft follows the work
// (as before) until the teacher removes it. nothing is stored before they ask
const draft = useDraftStore();

const savedTime = computed(() =>
  draft.savedAt
    ? new Date(draft.savedAt).toLocaleTimeString(i18n.global.locale.value, {
        hour: '2-digit',
        minute: '2-digit'
      })
    : ''
);
</script>

<template>
  <div class="draft-control" data-testid="draft-control">
    <div class="line">
      <template v-if="draft.isOn">
        <span class="muted" data-testid="draft-saved">
          {{
            savedTime ? $t('tutor.draft.savedAt', { time: savedTime }) : $t('tutor.draft.keptNote')
          }}
        </span>
        <button
          type="button"
          class="button is-small is-text"
          data-testid="remove-draft"
          @click="draft.discard()"
        >
          {{ $t('tutor.draft.remove') }}
        </button>
      </template>
      <button
        v-else
        type="button"
        class="button is-small is-light"
        data-testid="save-draft"
        @click="draft.keep()"
      >
        {{ $t('tutor.draft.save') }}
      </button>
      <details class="what">
        <summary>{{ $t('tutor.draft.what') }}</summary>
        <p>{{ $t('tutor.draft.explain') }}</p>
      </details>
    </div>
    <p v-if="draft.problem" class="problem" role="alert" data-testid="draft-problem">
      {{ $t(`tutor.draft.problem.${draft.problem}`) }}
    </p>
  </div>
</template>

<style scoped>
.draft-control {
  width: 100%;
  max-width: 48rem;
  margin: 2rem auto 0;
  font-size: 0.85rem;
}

.line {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: flex-end;
  gap: 0.25rem 1rem;
}

.muted {
  color: var(--neutral-70);
}

.what {
  color: var(--neutral-70);
  summary {
    cursor: pointer;
  }
  p {
    max-width: 36rem;
    margin-top: 0.25rem;
  }
}

.problem {
  margin-top: 0.4rem;
  padding-left: 0.6rem;
  border-left: 3px solid var(--neutral-70);
  color: var(--neutral-80);
  text-align: right;
}
</style>
