<script setup lang="ts">
import { ref } from 'vue';
import { COURSE_FILE_TYPES } from '@/utils/courseFiles';

// a box to drop files on, or click to browse. used by both syllabus paths: CursusInfo (up to 3
// course materials) and CourseUpload (one syllabus); each decides what to keep of the files
withDefaults(
  defineProps<{
    // already translated: each path has its own wording
    label: string;
    limits: string;
    multiple?: boolean;
    inputTestId?: string;
  }>(),
  { multiple: false, inputTestId: 'file-input' }
);

const emit = defineEmits<{ pick: [files: File[]] }>();

const ACCEPT = COURSE_FILE_TYPES.join(', ');

const isDragging = ref(false);

const onPick = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files?.length) emit('pick', Array.from(input.files));
  // allows picking the same file again after removing it
  input.value = '';
};

const onDrop = (e: DragEvent) => {
  isDragging.value = false;
  if (e.dataTransfer?.files?.length) emit('pick', Array.from(e.dataTransfer.files));
};
</script>

<template>
  <label
    class="dropzone"
    :class="{ dragging: isDragging }"
    @dragover.prevent="isDragging = true"
    @dragleave="isDragging = false"
    @drop.prevent="onDrop"
  >
    <input
      class="is-sr-only"
      type="file"
      :multiple="multiple"
      :accept="ACCEPT"
      :data-testid="inputTestId"
      @change="onPick"
    />
    <span>
      {{ label }}
      <span class="browse">{{ $t('tutor.documentsStep.browse') }}</span>
    </span>
    <span class="is-size-7 has-text-grey">{{ limits }}</span>
  </label>
</template>

<style scoped>
.dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 1.5rem 1rem;
  border: 2px dashed var(--neutral-20);
  border-radius: 0.5rem;
  text-align: center;
  cursor: pointer;
  transition:
    border-color 0.2s,
    background-color 0.2s;
  &:hover,
  &.dragging,
  &:focus-within {
    border-color: var(--primary);
    background-color: var(--neutral-10);
  }
}

.browse {
  color: var(--primary-dark);
  text-decoration: underline;
}
</style>
