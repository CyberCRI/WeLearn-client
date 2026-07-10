<template>
  <footer class="trail-navigation">
    <button v-if="showBack" class="btn btn-secondary" @click="$emit('back')">
      ← {{ $t('previous') }}
    </button>

    <div class="spacer" />

    <button class="btn btn-primary" @click="$emit('next')">
      {{ $t(nextLabel) }}
    </button>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  showBack: boolean;
  canNext: boolean;
  isLast: boolean;
}>();

defineEmits<{
  (e: 'back'): void;
  (e: 'next'): void;
}>();

const nextLabel = computed(() => {
  return props.isLast ? 'finish' : 'next';
});
</script>

<style scoped>
.trail-navigation {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1.5rem 0.5rem;
  border-top: 1px solid var(--primary-light);
}

.spacer {
  flex: 1;
}

.btn {
  min-width: 140px;
  padding: 0.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.btn-primary {
  border: none;
  background: var(--primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-hover);
}

.btn-primary:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  border: 1px solid var(--primary-light);
}

.btn-secondary:hover {
  border-color: var(--primary);
}

@media (max-width: 640px) {
  .trail-navigation {
    flex-direction: column-reverse;
    align-items: stretch;
  }

  .spacer {
    display: none;
  }

  .btn {
    width: 100%;
  }
}
</style>
