<script setup lang="ts">
import { ref } from 'vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import ChangeWording from '@/components/tutor/development/ChangeWording.vue';
import type { ApprovedChange } from '@/types';

// an approved change inside the updated syllabus: a small label (the kind of change, and the
// session it belongs to when the outline says so), then its wording, editable in place. the
// course's own content around it stays neutral
// label: the kind of change in the syllabus's language
// sources: the resources it relies on, as the word document lists them
const props = defineProps<{ change: ApprovedChange; label: string; sources?: string }>();
const emit = defineEmits<{ save: [connectionId: string, text: string] }>();

const isEditing = ref(false);
const handleSave = (text: string) => {
  emit('save', props.change.connectionId, text);
  isEditing.value = false;
};
</script>

<template>
  <div class="added" data-testid="added">
    <div class="added-head">
      <p class="added-label">
        {{ label }}
        <span v-if="change.session" class="session" data-testid="added-session">
          · {{ change.session }}
        </span>
      </p>
      <ButtonComponent
        v-if="!isEditing"
        class="is-small is-text"
        data-testid="edit-added"
        @click="isEditing = true"
      >
        {{ $t('tutor.check.edit') }}
      </ButtonComponent>
    </div>
    <ChangeWording
      :suggested="change.suggested"
      :edited="change.text !== change.suggested ? change.text : null"
      :is-editing="isEditing"
      save-label="tutor.check.saveChanges"
      @save="handleSave"
      @cancel="isEditing = false"
    />
    <p v-if="sources" class="added-sources" data-testid="added-sources">{{ sources }}</p>
  </div>
</template>

<style scoped>
/* an approved change: a WeLearn-green accent, never mixed into the original text */
.added {
  margin-top: 0.35rem;
  padding: 0.25rem 0 0.25rem 0.7rem;
  border-left: 3px solid var(--primary);
}

.added-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem;
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

.added-sources {
  margin-top: 0.15rem;
  font-size: 0.8rem;
  font-style: italic;
  color: var(--neutral-70);
}
</style>
