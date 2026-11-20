<script setup lang="ts">
import { computed } from 'vue';
import { sourceLink } from '@/utils/connections';
import type { AdaptationProposal } from '@/types';

// how well a proposed change is supported, in one sentence from the real result of the check,
// always visible before the teacher decides: the level the API gave it (never raised here) and,
// when limited, the first problem the check found, in its own words. "supported" says the
// sources back the wording, not that the science was verified. the sources, the passages behind
// the change and every point of the check are one click away
const props = defineProps<{ proposal: AdaptationProposal }>();

const checks = computed(() => props.proposal.checks);
const isUnchecked = computed(() => checks.value?.status === 'unchecked');
const hasCheckNotes = computed(
  () =>
    !!checks.value &&
    (isUnchecked.value ||
      checks.value.problems.length > 0 ||
      checks.value.unbacked_names.length > 0)
);

const summary = computed(() => {
  if (isUnchecked.value) {
    return {
      level: 'unchecked',
      head: 'tutor.additions.change.evidence.unchecked',
      detail: 'tutor.additions.change.evidence.uncheckedDetail',
      text: null
    };
  }
  const { support } = props.proposal;
  if (support === 'strong') {
    return {
      level: support,
      head: 'tutor.additions.change.evidence.strong',
      detail: 'tutor.additions.change.evidence.strongDetail',
      text: null
    };
  }
  return {
    level: support,
    head: `tutor.additions.change.evidence.${support}`,
    detail: `tutor.additions.change.evidence.${support}Default`,
    text: checks.value?.problems[0] || null
  };
});
</script>

<template>
  <p class="evidence" :class="`is-${summary.level}`" role="status" data-testid="evidence-summary">
    <strong :data-testid="`support-${proposal.support}`">{{ $t(summary.head) }}</strong>
    {{ summary.text ?? $t(summary.detail) }}
  </p>

  <details class="evidence-details" data-testid="change-support">
    <summary>{{ $t('tutor.additions.change.basedOn') }}</summary>
    <ul v-if="proposal.resources.length" class="based-on">
      <li
        v-for="resource in proposal.resources"
        :key="resource.document.payload.document_id"
        data-testid="change-resource"
      >
        <a
          :href="sourceLink(resource.document, resource.quote || resource.evidence)"
          target="_blank"
          rel="noopener"
        >
          {{ resource.document.payload.document_title }}
        </a>
        <span v-if="resource.role === 'context'" class="context-tag" data-testid="context-tag">
          {{ $t('tutor.additions.contextTag') }}
        </span>
        <!-- the sentence of the resource that backs this change, found word for word in it -->
        <q v-if="resource.quote" class="quote" data-testid="change-quote">{{ resource.quote }}</q>
      </li>
    </ul>
    <p v-else class="muted" data-testid="no-resource">
      {{ $t('tutor.additions.change.evidence.noneDefault') }}
    </p>
    <div v-if="checks && hasCheckNotes" class="check-notes" data-testid="check-notes">
      <p class="muted">{{ $t('tutor.additions.change.checkTitle') }}</p>
      <ul>
        <li v-if="isUnchecked" data-testid="check-unchecked">
          {{ $t('tutor.additions.change.unchecked') }}
        </li>
        <li v-for="problem in checks.problems" :key="problem" data-testid="check-problem">
          {{ problem }}
        </li>
        <li v-if="checks.unbacked_names.length" data-testid="check-names">
          {{
            $t('tutor.additions.change.unbackedNames', {
              names: checks.unbacked_names.join(', ')
            })
          }}
        </li>
      </ul>
    </div>
  </details>
</template>

<style scoped>
/* the evidence in one sentence: a quiet line when supported, a clear note when not */
.evidence {
  margin-top: 0.75rem;
  padding: 0.4rem 0.75rem;
  border-left: 3px solid var(--primary);
  font-size: 0.9rem;
  color: var(--neutral-80);
}

.evidence.is-partial,
.evidence.is-none,
.evidence.is-unchecked {
  border-left-color: var(--neutral-70);
  background: var(--lpi-yellow-lighter);
}

.evidence-details {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  summary {
    font-weight: 600;
    color: var(--neutral-80);
    cursor: pointer;
  }
}

.based-on {
  margin-top: 0.4rem;
  padding-left: 1.1rem;
  list-style: disc;
}

.context-tag,
.muted {
  font-size: 0.8rem;
  color: var(--neutral-70);
}

.context-tag {
  margin-left: 0.4rem;
  white-space: nowrap;
}

.quote {
  display: block;
  margin-top: 0.15rem;
  font-size: 0.85rem;
  font-style: italic;
  color: var(--neutral-70);
}

.check-notes {
  margin-top: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-left: 3px solid var(--neutral-40);
  background: var(--neutral-10);
  font-size: 0.85rem;
}

.check-notes ul {
  margin: 0.25rem 0 0 1.1rem;
  list-style: disc;
}
</style>
