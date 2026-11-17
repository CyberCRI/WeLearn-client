<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import EditButton from '@/components/tutor/EditButton.vue';
import type { CourseField } from '@/types';

// one checked piece of the course: its text, where it comes from and how sure that is, corrected
// or added by the teacher. without a field it offers to add one
const props = defineProps<{
  field: CourseField | null;
  missingText?: string;
  addLabel?: string;
  canRemove?: boolean;
  // a long text shows a few lines, the rest on demand
  isCollapsible?: boolean;
  // what the pencil edits, for its accessible name ("Edit: Overview")
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

// text read as expected carries no label (the screen says once where it comes from); only what
// the teacher should notice is labelled
const QUIET = ['extracted', 'unchecked'];

// only text found in the syllabus counts as coming from it
const status = computed(() => {
  const field = props.field;
  if (!field || field.origin !== 'extracted') return field?.origin;
  return field.verification === 'unverified' ? 'unverified' : 'extracted';
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
      <!-- ponytail: not TextAreaComponent, which is the search box (its placeholder, minimum
           length and colours are the search's) -->
      <textarea
        ref="editor"
        v-model="draft"
        class="textarea"
        :rows="isCollapsible ? 6 : 3"
        data-testid="field-editor"
        @keydown.esc="isEditing = false"
      />
      <div class="actions">
        <ButtonComponent
          color="primary"
          class="is-small"
          data-testid="save-field"
          @click="handleSave"
        >
          {{ $t('tutor.check.save') }}
        </ButtonComponent>
        <ButtonComponent is-discreet class="is-small" @click="isEditing = false">
          {{ $t('tutor.check.cancel') }}
        </ButtonComponent>
      </div>
    </template>

    <template v-else-if="field">
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
      <ButtonComponent
        v-if="isLong"
        is-discreet
        class="is-small more"
        data-testid="toggle-text"
        @click="isExpanded = !isExpanded"
      >
        {{ isExpanded ? $t('tutor.check.showLess') : $t('tutor.check.showMore') }}
      </ButtonComponent>
      <div class="actions">
        <span
          v-if="status && !QUIET.includes(status)"
          class="origin"
          :class="`is-${status}`"
          data-testid="field-origin"
        >
          {{ $t(`tutor.check.origin.${status}`) }}
        </span>
        <ButtonComponent
          v-if="field.origin === 'edited'"
          is-discreet
          class="is-small"
          data-testid="restore-field"
          @click="emit('restore')"
        >
          {{ $t('tutor.check.restore') }}
        </ButtonComponent>
        <ButtonComponent
          v-if="canRemove"
          is-discreet
          class="is-small"
          data-testid="remove-field"
          @click="emit('remove')"
        >
          {{ $t('tutor.check.remove') }}
        </ButtonComponent>
        <slot name="actions" />
      </div>
    </template>

    <div v-else class="missing">
      <span v-if="missingText" class="has-text-grey" data-testid="field-missing">
        {{ missingText }}
      </span>
      <ButtonComponent is-discreet class="is-small" data-testid="add-field" @click="startEditing">
        {{ addLabel }}
      </ButtonComponent>
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
