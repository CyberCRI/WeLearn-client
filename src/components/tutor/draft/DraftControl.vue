<script setup lang="ts">
import { computed } from 'vue';
import i18n from '@/localisation/i18n';
import ButtonComponent from '@/components/ButtonComponent.vue';
import { useCourseDraftStore } from '@/stores/courseDraft';

// the teacher's choice to keep a draft in this browser, one discreet action under the path:
// nothing is kept before they ask. once kept, the draft follows the work until they remove it
const draft = useCourseDraftStore();

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
        <ButtonComponent
          class="is-small is-text"
          data-testid="remove-draft"
          @click="draft.discard()"
        >
          {{ $t('tutor.draft.remove') }}
        </ButtonComponent>
      </template>
      <ButtonComponent
        v-else
        isDiscreet
        class="is-small"
        data-testid="save-draft"
        @click="draft.keep()"
      >
        {{ $t('tutor.draft.save') }}
      </ButtonComponent>
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
}

.what summary {
  cursor: pointer;
}

.what p {
  max-width: 36rem;
  margin-top: 0.25rem;
}

.problem {
  margin-top: 0.4rem;
  padding-left: 0.6rem;
  border-left: 3px solid var(--neutral-70);
  color: var(--neutral-80);
  text-align: right;
}
</style>
