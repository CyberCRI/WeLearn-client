<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import EditButton from '@/components/tutor/EditButton.vue';
import type { CourseField } from '@/types';

// one checked piece of the course: its text, where it comes from and how sure that is (found in
// the syllabus, not found word for word, or not compared), corrected or added by the teacher.
// without a field it offers to add one. adapted from the "design your course" prototype
const props = defineProps<{
  field: CourseField | null;
  missingText?: string;
  addLabel?: string;
  canRemove?: boolean;
  // a long text shows a few lines, the rest on demand
  isCollapsible?: boolean;
  // what the pencil button edits, for its accessible name ("Edit overview")
  editLabel?: string;
}>();

const emit = defineEmits<{
  save: [value: string];
  restore: [];
  remove: [];
}>();

const isEditing = ref(false);
const isExpanded = ref(false);
const draft = ref('');
const editor = ref<HTMLTextAreaElement | null>(null);

// verification works in the background: text read as expected carries no label (the screen says
// once where it comes from); only what the teacher should notice is labelled
const QUIET = ['extracted', 'unchecked'];

// only text found in the syllabus counts as coming from it
const status = computed(() => {
  const field = props.field;
  if (!field || field.origin !== 'extracted') return field?.origin;
  return field.verification === 'unverified' || field.verification === 'unchecked'
    ? field.verification
    : 'extracted';
});

const isLong = computed(() => props.isCollapsible && (props.field?.value.length || 0) > 700);

const startEditing = async () => {
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
    :class="{ 'is-unverified': status === 'unverified' }"
    data-testid="review-field"
  >
    <template v-if="isEditing">
      <textarea
        ref="editor"
        v-model="draft"
        class="textarea"
        :rows="isCollapsible ? 6 : 3"
        data-testid="field-editor"
        @keydown.esc="isEditing = false"
      />
      <div class="actions">
        <button
          type="button"
          class="button is-small is-primary"
          data-testid="save-field"
          @click="handleSave"
        >
          {{ $t('tutor.check.save') }}
        </button>
        <button type="button" class="button is-small is-text" @click="isEditing = false">
          {{ $t('tutor.check.cancel') }}
        </button>
      </div>
    </template>

    <template v-else-if="field">
      <!-- the text and its pencil on one line, as for the course's other fields -->
      <div class="field-line">
        <p
          class="field-text"
          :class="{ 'is-clamped': isLong && !isExpanded }"
          data-testid="field-text"
        >
          {{ field.value }}
        </p>
        <EditButton
          :label="editLabel || $t('tutor.check.edit')"
          data-testid="edit-field"
          @click="startEditing"
        />
      </div>
      <button
        v-if="isLong"
        type="button"
        class="button is-small is-text more"
        data-testid="toggle-text"
        @click="isExpanded = !isExpanded"
      >
        {{ isExpanded ? $t('tutor.check.showLess') : $t('tutor.check.showMore') }}
      </button>
      <div class="actions">
        <span
          v-if="status && !QUIET.includes(status)"
          class="origin"
          :class="`is-${status}`"
          data-testid="field-origin"
        >
          {{ $t(`tutor.check.origin.${status}`) }}
        </span>
        <button
          v-if="field.origin === 'edited'"
          type="button"
          class="button is-small is-text"
          data-testid="restore-field"
          @click="emit('restore')"
        >
          {{ $t('tutor.check.restore') }}
        </button>
        <button
          v-if="canRemove"
          type="button"
          class="button is-small is-text"
          data-testid="remove-field"
          @click="emit('remove')"
        >
          {{ $t('tutor.check.remove') }}
        </button>
        <slot name="actions" />
      </div>
    </template>

    <div v-else class="missing">
      <span class="has-text-grey" data-testid="field-missing">{{ missingText }}</span>
      <button
        type="button"
        class="button is-small is-text"
        data-testid="add-field"
        @click="startEditing"
      >
        {{ addLabel }}
      </button>
    </div>
  </div>
</template>

<style scoped>
/* not found word for word: a quiet mark for the teacher to check, never a reason to hide it */
.review-field.is-unverified {
  padding-left: 0.75rem;
  border-left: 3px solid var(--lpi-yellow);
}

.field-line {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.field-text {
  flex: 1;
  white-space: pre-line;
  &.is-clamped {
    display: -webkit-box;
    -webkit-line-clamp: 5;
    line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

.more {
  padding-left: 0;
}

.actions,
.missing {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem 0.5rem;
  margin-top: 0.25rem;
}

.origin {
  font-size: 0.75rem;
  color: var(--neutral-70);
  &.is-edited,
  &.is-added {
    color: var(--primary-dark);
  }
  &.is-unverified {
    color: var(--neutral-90);
    font-weight: 600;
  }
}
</style>
