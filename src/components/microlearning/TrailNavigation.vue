<template>
  <footer class="trail-navigation">
    <button v-if="showBack" class="btn btn-secondary" @click="$emit('back')">
      ← {{ $t('previous') }}
    </button>

    <div class="spacer" />

    <div class="next-group">
      <button class="btn btn-primary" :disabled="!canNext" @click="$emit('next')">
        {{ $t(nextLabel) }}
      </button>
      <p v-if="!canNext && hint" class="next-hint">{{ $t(hint) }}</p>
      <a v-if="skippable" class="skip-link" @click="$emit('skip')">{{ $t('skip') }}</a>
    </div>
  </footer>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    showBack?: boolean;
    canNext?: boolean;
    nextLabel?: string;
    hint?: string;
    skippable?: boolean;
  }>(),
  { showBack: true, canNext: true, nextLabel: 'next' }
);

defineEmits<{
  (e: 'back'): void;
  (e: 'next'): void;
  (e: 'skip'): void;
}>();
</script>

<style scoped>
.trail-navigation {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1.5rem 0.5rem;
  border-top: 1px solid var(--primary-light);
}

.spacer {
  flex: 1;
}

.next-group {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.next-hint {
  margin: 0;
  font-size: 0.85rem;
  color: var(--neutral-80);
}

.skip-link {
  font-size: 0.85rem;
  color: var(--neutral-80);
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

  .next-group {
    align-items: stretch;
    text-align: center;
  }
}
</style>
