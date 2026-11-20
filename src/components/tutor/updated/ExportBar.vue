<script setup lang="ts">
import { ref } from 'vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import CheckboxCompnent from '@/components/CheckboxCompnent.vue';

// one word download: the complete syllabus when its text is verified, the outline otherwise.
// the pedagogical appendix is off unless asked for, and offered only when a change has notes
defineProps<{
  isCompleteReady: boolean;
  toPlaceCount: number;
  hasNotes: boolean;
  isExporting: boolean;
  hasExportError: boolean;
}>();
const emit = defineEmits<{ download: [kind: 'complete' | 'outline', withAppendix: boolean] }>();

const appendixChoice = ref<string[]>([]);
const withAppendix = () => appendixChoice.value.includes('notes');
</script>

<template>
  <div class="export-bar">
    <ButtonComponent
      color="primary"
      class="is-small"
      :class="{ 'is-loading': isExporting }"
      :data-testid="isCompleteReady ? 'download-complete' : 'download-word'"
      @click="emit('download', isCompleteReady ? 'complete' : 'outline', withAppendix())"
    >
      {{ isCompleteReady ? $t('tutor.updated.complete.download') : $t('tutor.updated.download') }}
    </ButtonComponent>
    <div v-if="hasNotes" class="appendix-choice" data-testid="appendix-choice">
      <CheckboxCompnent
        id="pedagogical-appendix"
        v-model="appendixChoice"
        name="pedagogical-appendix"
        value="notes"
        :label="$t('tutor.updated.appendix.choice')"
        :checked="appendixChoice.includes('notes')"
      />
    </div>
    <p class="muted" data-testid="complete-note">
      {{
        isCompleteReady
          ? $t('tutor.updated.complete.layoutNote', toPlaceCount)
          : $t('tutor.updated.complete.unavailable')
      }}
    </p>
    <p v-if="hasExportError" class="error" role="alert" data-testid="export-error">
      {{ $t('tutor.updated.downloadError') }}
    </p>
  </div>
</template>

<style scoped>
.export-bar {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.4rem;
}

.appendix-choice :deep(.checkbox-label) {
  font-size: 0.85rem;
}

.muted {
  font-size: 0.85rem;
  color: var(--neutral-70);
  text-align: right;
}

.error {
  font-size: 0.85rem;
  color: var(--error-100);
}
</style>
