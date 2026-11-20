<script setup lang="ts">
import { computed } from 'vue';
import AddedChange from '@/components/tutor/updated/AddedChange.vue';
import {
  looksLikeHeading,
  sourcesLine,
  type CompleteLabels,
  type CompletePlan
} from '@/utils/completeSyllabus';
import type { AdaptationKind } from '@/types';

// the complete updated syllabus on screen: the very plan the word document is written from, so
// what the teacher sees is what they download. the syllabus's own lines in their order (a
// revised objective struck through), each approved change where the document puts it, the
// changes without a reliable place at the end. only the approved wording can be edited
const props = defineProps<{ plan: CompletePlan; labels: CompleteLabels }>();
const emit = defineEmits<{ save: [connectionId: string, text: string] }>();

// a run of empty lines shows as one gap, as a paragraph break does
const entries = computed(() =>
  props.plan.entries.filter((entry, index, all) => {
    if (entry.type !== 'line' || entry.text.trim()) return true;
    const previous = all[index - 1];
    return index > 0 && (previous.type !== 'line' || !!previous.text.trim());
  })
);
const label = (kind: AdaptationKind) => `${props.labels.change} · ${props.labels.kinds[kind]}`;
</script>

<template>
  <div class="document" data-testid="complete-document">
    <template v-for="(entry, index) in entries" :key="index">
      <template v-if="entry.type === 'line'">
        <p v-if="!entry.text.trim()" class="gap" aria-hidden="true" />
        <p
          v-else
          class="line"
          :class="{ heading: looksLikeHeading(entry.text) }"
          data-testid="document-line"
        >
          <del v-if="entry.isReplaced" data-testid="document-replaced">{{ entry.text }}</del>
          <template v-else>{{ entry.text }}</template>
        </p>
      </template>
      <AddedChange
        v-else
        :change="entry.change"
        :label="label(entry.change.kind)"
        :sources="sourcesLine(entry.change, labels)"
        @save="(id, text) => emit('save', id, text)"
      />
    </template>

    <template v-if="plan.toPlace.length">
      <p class="line heading to-place" data-testid="document-to-place">{{ labels.toPlace }}</p>
      <p class="note">{{ labels.toPlaceNote }}</p>
      <AddedChange
        v-for="change in plan.toPlace"
        :key="change.connectionId"
        :change="change"
        :label="label(change.kind)"
        :sources="sourcesLine(change, labels)"
        @save="(id, text) => emit('save', id, text)"
      />
    </template>
  </div>
</template>

<style scoped>
/* the syllabus's text as plain paragraphs: one line of the file, one paragraph */
.document {
  font-size: 0.95rem;
  overflow-wrap: anywhere;
}

.line {
  white-space: pre-wrap;
}

.heading {
  margin-top: 0.75rem;
  font-weight: 700;
}

.gap {
  height: 0.6rem;
}

del {
  color: var(--neutral-70);
}

.to-place {
  margin-top: 1.5rem;
}

.note {
  font-size: 0.85rem;
  font-style: italic;
  color: var(--neutral-70);
}
</style>
