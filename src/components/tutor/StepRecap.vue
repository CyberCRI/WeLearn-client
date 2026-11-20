<script setup lang="ts">
import ButtonComponent from '@/components/ButtonComponent.vue';

// a finished step of the path, folded into one line: what it holds, and a way back into it
defineProps<{ title?: string; details?: string }>();
const emit = defineEmits<{ edit: [] }>();
</script>

<template>
  <div class="recap">
    <span>
      <span v-if="title" class="title-text">{{ title }}</span>
      <span v-if="details" class="details" :class="{ 'after-title': title }">{{ details }}</span>
    </span>
    <ButtonComponent is-discreet class="is-small" @click="emit('edit')">
      {{ $t('tutor.edit') }}
    </ButtonComponent>
  </div>
</template>

<style scoped>
.recap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--neutral-20);
  border-radius: 0.5rem;
}

.title-text {
  overflow: hidden;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.details {
  font-size: 0.85rem;
  color: var(--neutral-70);
}

.details.after-title {
  margin-left: 0.5rem;
}
</style>
