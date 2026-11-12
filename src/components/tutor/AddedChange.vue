<script setup lang="ts">
import { nextTick, ref } from 'vue';
import type { ApprovedChange } from '@/utils/updatedSyllabus';

// an approved change inside the updated course: a small label (what kind of change, and the
// session it belongs to when the outline says so), then the exact approved wording. the
// course's own content around it stays neutral
// label: the kind of change in the syllabus's language (the interface's otherwise)
// isEditable: the teacher can reword it in place; the parent saves it the same way as in the
// changes view, so every view and export follows
// sources: the titles of the resources it relies on, as the word document lists them
const props = defineProps<{
  change: ApprovedChange;
  label?: string;
  isEditable?: boolean;
  sources?: string;
}>();
const emit = defineEmits<{ save: [text: string] }>();

const isEditing = ref(false);
const draft = ref('');
const editor = ref<HTMLTextAreaElement | null>(null);
const startEditing = async () => {
  draft.value = props.change.text;
  isEditing.value = true;
  await nextTick();
  editor.value?.focus();
};
const handleSave = () => {
  if (draft.value.trim()) emit('save', draft.value);
  isEditing.value = false;
};
</script>

<template>
  <div class="added" data-testid="added">
    <div class="added-head">
      <p class="added-label">
        {{ label || $t(`tutor.additions.change.kinds.${change.kind}`) }}
        <span v-if="change.session" class="session" data-testid="added-session">
          · {{ change.session }}
        </span>
      </p>
      <button
        v-if="isEditable && !isEditing"
        type="button"
        class="edit-link"
        data-testid="edit-added"
        @click="startEditing"
      >
        {{ $t('tutor.check.edit') }}
      </button>
    </div>
    <template v-if="isEditing">
      <textarea
        ref="editor"
        v-model="draft"
        class="textarea is-small"
        rows="3"
        data-testid="added-editor"
        @keydown.esc="isEditing = false"
      />
      <div class="buttons mt-2">
        <button
          type="button"
          class="button is-small is-primary"
          :disabled="!draft.trim()"
          data-testid="save-added"
          @click="handleSave"
        >
          {{ $t('tutor.check.saveChanges') }}
        </button>
        <button type="button" class="button is-small is-text" @click="isEditing = false">
          {{ $t('tutor.check.cancel') }}
        </button>
      </div>
    </template>
    <p v-else class="added-text" data-testid="added-text">{{ change.text }}</p>
    <p v-if="sources" class="added-sources" data-testid="added-sources">{{ sources }}</p>
  </div>
</template>

<style scoped>
/* an approved change: a subtle WeLearn-green accent, never mixed into the original text */
.added {
  margin-top: 0.35rem;
  padding: 0.25rem 0 0.25rem 0.7rem;
  border-left: 3px solid var(--primary);
}

.added-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--primary-dark);
}

.session {
  font-weight: 400;
  color: var(--neutral-70);
}

.added-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem;
}

.edit-link {
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--neutral-70);
  text-decoration: underline;
  cursor: pointer;
  &:hover {
    color: var(--primary-dark);
  }
  &:focus-visible {
    outline: 2px solid var(--primary-dark);
    outline-offset: 2px;
  }
}

.added-sources {
  margin-top: 0.15rem;
  font-size: 0.8rem;
  font-style: italic;
  color: var(--neutral-70);
}
</style>
