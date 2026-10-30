<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import SpaceLabel from '@/components/SpaceLabel.vue';
import { useCourseDesignStore } from '@/stores/courseDesign';
import { useCourseConnectionsStore } from '@/stores/courseConnections';
import i18n from '@/localisation/i18n';

// the end of "create a course from scratch": the proposal as the teacher shaped it (their
// corrections, the connections they did not set aside, with their resources and developed
// activities), as one text to read, edit and copy. nothing is saved or sent
const design = useCourseDesignStore();
const connections = useCourseConnectionsStore();
const texts = 'journey.teach.scratch.summary';

const lines = (value: string | null | undefined) =>
  value ? value.split('\n').filter(Boolean) : [];

const composed = computed(() => {
  const { t } = i18n.global;
  const section = (key: string, items: string[], isNumbered = false) =>
    items.length
      ? `${t(`${texts}.${key}`)}\n${items
          .map((item, index) => (isNumbered ? `${index + 1}. ${item}` : `- ${item}`))
          .join('\n')}`
      : '';
  const course = design.confirmedCourse;
  const kept = connections.connections.filter((c) => c.decision !== 'setAside');
  const sustainability = kept.map((connection) => {
    const where = connection.anchor ? ` (${connection.anchor})` : '';
    const resources = connection.resources.map(
      ({ document }) => `  · ${document.payload.document_title} – ${document.payload.document_url}`
    );
    const adaptation = connection.adaptation;
    const activity =
      adaptation?.editedText ||
      (adaptation?.suggestion
        ? [
            adaptation.suggestion.title,
            adaptation.suggestion.duration,
            ...adaptation.suggestion.steps.map((step, index) => `${index + 1}. ${step}`)
          ]
            .filter(Boolean)
            .join('\n')
        : '');
    return [
      `- ${connection.title}${where} : ${connection.why}`,
      resources.length ? `  ${t(`${texts}.resources`)}\n${resources.join('\n')}` : '',
      activity ? `  ${t(`${texts}.activity`)}\n${activity.replace(/^/gm, '    ')}` : ''
    ]
      .filter(Boolean)
      .join('\n');
  });
  return [
    course.title || '',
    [course.discipline, course.level].filter(Boolean).join(' · '),
    course.description || '',
    section('objectives', course.objectives, true),
    section('topics', course.topics),
    section('structure', course.sessions),
    section('activities', lines(design.activities?.value)),
    section('assessment', lines(design.assessment?.value)),
    sustainability.length ? `${t(`${texts}.sustainability`)}\n${sustainability.join('\n\n')}` : ''
  ]
    .filter(Boolean)
    .join('\n\n');
});

const shownText = computed(() => design.proposalText || composed.value);

const isEditing = ref(false);
const draft = ref('');
const editor = ref<HTMLTextAreaElement | null>(null);
const handleEdit = async () => {
  draft.value = shownText.value;
  isEditing.value = true;
  await nextTick();
  editor.value?.focus();
};
const handleSave = () => {
  design.setProposalText(draft.value);
  isEditing.value = false;
};

const isCopied = ref(false);
const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(shownText.value);
    isCopied.value = true;
    setTimeout(() => (isCopied.value = false), 2000);
  } catch {
    isCopied.value = false;
  }
};
</script>
<template>
  <section class="proposal-summary" data-testid="proposal-summary">
    <h2 class="summary-title">{{ $t(`${texts}.title`) }}</h2>
    <p class="summary-intro">{{ $t(`${texts}.intro`) }}</p>

    <template v-if="isEditing">
      <textarea
        ref="editor"
        v-model="draft"
        class="textarea"
        rows="20"
        data-testid="proposal-editor"
      />
      <div class="actions">
        <button type="button" class="button is-small is-primary" @click="handleSave">
          {{ $t('journey.teach.adapt.review.save') }}
        </button>
        <button type="button" class="button is-small is-text" @click="isEditing = false">
          {{ $t('journey.teach.adapt.review.cancel') }}
        </button>
      </div>
    </template>
    <template v-else>
      <SpaceLabel
        v-if="design.proposalText"
        :text="$t('journey.teach.adapt.review.origin.edited')"
        tint="var(--lpi-yellow-lighter)"
      />
      <p class="summary-text" data-testid="proposal-text">{{ shownText }}</p>
      <div class="actions">
        <button
          type="button"
          class="button is-small"
          data-testid="edit-proposal"
          @click="handleEdit"
        >
          {{ $t(`${texts}.edit`) }}
        </button>
        <button
          type="button"
          class="button is-small"
          data-testid="copy-proposal"
          @click="handleCopy"
        >
          {{ isCopied ? $t(`${texts}.copied`) : $t(`${texts}.copy`) }}
        </button>
        <button
          v-if="design.proposalText"
          type="button"
          class="button is-small is-text"
          data-testid="restore-proposal"
          @click="design.setProposalText(null)"
        >
          {{ $t(`${texts}.restore`) }}
        </button>
      </div>
    </template>
  </section>
</template>

<style scoped>
.proposal-summary {
  margin-top: 2.5rem;
  padding: 1.25rem 1.5rem;
  border: 1px solid var(--neutral-20);
  border-radius: 8px;
}

.summary-title {
  font-size: 1.2rem;
  font-weight: 700;
}

.summary-intro {
  margin: 0.25rem 0 1rem;
  font-size: 0.9rem;
  color: var(--neutral-70);
}

.summary-text {
  margin-top: 0.5rem;
  white-space: pre-wrap;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}
</style>
