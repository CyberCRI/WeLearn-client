<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import SpaceLabel from '@/components/SpaceLabel.vue';
import type { CourseField } from '@/types';

// one piece of the reviewed course: its text, where it comes from (read from the document,
// corrected or added by the teacher) and the teacher's actions on it. without a field it offers
// to add one (a missing description, a new objective). `isPlain` drops the box (overview lines),
// `isCollapsible` shows a long text as a short preview that can be expanded
const props = defineProps<{
  field: CourseField | null;
  isExample?: boolean;
  isMultiline?: boolean;
  missingText?: string;
  addLabel?: string;
  isPlain?: boolean;
  isCollapsible?: boolean;
}>();

const emit = defineEmits<{
  save: [value: string];
  restore: [];
  remove: [];
}>();

const ORIGIN_TINTS = {
  extracted: 'var(--secondary-lighter)',
  edited: 'var(--lpi-yellow-lighter)',
  added: 'var(--tertiary-lighter)'
};

const isEditing = ref(false);
const draft = ref('');
const isOriginalShown = ref(false);
const isExpanded = ref(false);
// a collapsible text shows its first lines; "show full text" only when something is really cut
const textEl = ref<HTMLElement | null>(null);
const isCut = ref(false);
const measure = async () => {
  await nextTick();
  isCut.value = !!textEl.value && textEl.value.scrollHeight > textEl.value.clientHeight + 1;
};
watch(() => props.field?.value, measure);
onMounted(() => {
  if (!props.isCollapsible) return;
  measure();
  window.addEventListener('resize', measure);
});
onBeforeUnmount(() => window.removeEventListener('resize', measure));
const editor = ref<HTMLTextAreaElement | null>(null);

const originKey = computed(() =>
  props.field?.origin === 'extracted' && props.isExample ? 'extractedExample' : props.field?.origin
);

const handleEdit = async () => {
  draft.value = props.field?.value || '';
  isEditing.value = true;
  await nextTick();
  editor.value?.focus();
};

const handleSave = () => {
  emit('save', draft.value);
  isEditing.value = false;
};
</script>
<template>
  <div
    class="review-field"
    :class="{ 'is-missing': !field && !isEditing, 'is-plain': isPlain }"
    data-testid="review-field"
  >
    <template v-if="isEditing">
      <textarea
        ref="editor"
        v-model="draft"
        class="textarea"
        :rows="isMultiline ? 5 : 2"
        @keydown.esc="isEditing = false"
      />
      <div class="field-actions mt-2">
        <button type="button" class="button is-small is-primary" @click="handleSave">
          {{ $t('journey.teach.adapt.review.save') }}
        </button>
        <button type="button" class="button is-small is-text" @click="isEditing = false">
          {{ $t('journey.teach.adapt.review.cancel') }}
        </button>
      </div>
    </template>

    <template v-else-if="field">
      <div class="field-head">
        <SpaceLabel
          :text="$t(`journey.teach.adapt.review.origin.${originKey}`)"
          :tint="ORIGIN_TINTS[field.origin]"
          :data-testid="`origin-${field.origin}`"
        />
        <div class="field-actions">
          <button type="button" class="button is-small is-text" @click="handleEdit">
            {{ $t('journey.teach.adapt.review.edit') }}
          </button>
          <template v-if="field.origin === 'edited'">
            <button
              type="button"
              class="button is-small is-text"
              @click="isOriginalShown = !isOriginalShown"
            >
              {{
                isOriginalShown
                  ? $t('journey.teach.adapt.review.hideOriginal')
                  : $t('journey.teach.adapt.review.showOriginal')
              }}
            </button>
            <button type="button" class="button is-small is-text" @click="emit('restore')">
              {{ $t('journey.teach.adapt.review.restore') }}
            </button>
          </template>
          <button
            v-if="field.origin === 'added'"
            type="button"
            class="button is-small is-text"
            @click="emit('remove')"
          >
            {{ $t('journey.teach.adapt.review.remove') }}
          </button>
          <!-- extra actions of the parent (for example, marking a programme objective) -->
          <slot name="actions" />
        </div>
      </div>
      <p
        ref="textEl"
        class="field-text"
        :class="{ 'is-preview': isCollapsible && !isExpanded }"
        data-testid="field-text"
      >
        {{ field.value }}
      </p>
      <button
        v-if="isCollapsible && (isCut || isExpanded)"
        type="button"
        class="button is-small is-text expand"
        :aria-expanded="isExpanded"
        data-testid="expand"
        @click="isExpanded = !isExpanded"
      >
        {{
          isExpanded
            ? $t('journey.teach.adapt.review.showLess')
            : $t('journey.teach.adapt.review.showMore')
        }}
      </button>
      <p v-if="field.origin === 'edited' && isOriginalShown" class="field-original">
        {{ field.original }}
      </p>
    </template>

    <div v-else class="field-missing">
      <span v-if="missingText" class="missing-text">{{ missingText }}</span>
      <button type="button" class="button is-small is-text" @click="handleEdit">
        + {{ addLabel || $t('journey.teach.adapt.review.add') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.review-field {
  padding: 0.75rem 1rem;
  border: 1px solid var(--neutral-20);
  border-radius: 8px;
  background: var(--neutral-0);
}

.review-field.is-missing {
  border-style: dashed;
  background: var(--neutral-10);
}

/* overview lines: no box, the page stays light */
.review-field.is-plain {
  padding: 0;
  border: none;
  background: none;
}

.review-field.is-plain .field-missing {
  min-height: 1.75rem;
}

.field-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.field-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.field-text {
  margin-top: 0.5rem;
  white-space: pre-line;
}

.is-plain .field-text {
  margin-top: 0.25rem;
}

/* the first lines of a long text; the rest one click away */
.field-text.is-preview {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  line-clamp: 4;
}

.expand {
  margin-top: 0.25rem;
  padding-left: 0;
}

.field-original {
  margin-top: 0.5rem;
  padding-left: 0.75rem;
  border-left: 3px solid var(--neutral-20);
  font-size: 0.9rem;
  color: var(--neutral-70);
}

.field-missing {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.missing-text {
  font-size: 0.9rem;
  color: var(--neutral-70);
}
</style>
