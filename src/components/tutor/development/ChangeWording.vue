<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import ButtonComponent from '@/components/ButtonComponent.vue';

// the wording of a proposed change: the teacher's own when edited, the suggestion otherwise. in
// edit mode, saving accepts it with the new wording
const props = defineProps<{ suggested: string; edited: string | null; isEditing: boolean }>();
const emit = defineEmits<{ save: [text: string]; cancel: [] }>();

const draft = ref('');
const editor = ref<HTMLTextAreaElement | null>(null);

watch(
  () => props.isEditing,
  async (isEditing) => {
    if (!isEditing) return;
    draft.value = props.edited || props.suggested;
    await nextTick();
    editor.value?.focus();
  },
  { immediate: true }
);
</script>

<template>
  <div class="wording">
    <template v-if="isEditing">
      <textarea
        ref="editor"
        v-model="draft"
        class="textarea is-small"
        rows="3"
        data-testid="change-editor"
        @keydown.esc="emit('cancel')"
      />
      <div class="buttons mt-2">
        <ButtonComponent
          color="primary"
          class="is-small"
          :disabled="!draft.trim()"
          data-testid="save-change"
          @click="emit('save', draft)"
        >
          {{ $t('tutor.additions.change.saveAndAccept') }}
        </ButtonComponent>
        <ButtonComponent class="is-small is-text" data-testid="cancel-edit" @click="emit('cancel')">
          {{ $t('tutor.check.cancel') }}
        </ButtonComponent>
      </div>
    </template>
    <template v-else>
      <span data-testid="change-text">{{ edited || suggested }}</span>
      <span v-if="edited" class="muted" data-testid="change-edited">
        ({{ $t('tutor.check.origin.edited') }})
      </span>
    </template>
  </div>
</template>

<style scoped>
.wording {
  font-weight: 500;
}

.muted {
  margin-left: 0.4rem;
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--neutral-70);
  white-space: nowrap;
}
</style>
