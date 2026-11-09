<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import CloseIcon from '@/components/icons/CloseIcon.vue';

const props = withDefaults(
  defineProps<{
    isOpen: boolean;
    onClose?: () => void;
    // small: confirmations and status, medium: forms and documents, large: rich content
    size?: 'small' | 'medium' | 'large';
    // false: only the close button closes it, not a backdrop click or Escape (e.g. a running request)
    isDismissable?: boolean;
  }>(),
  { size: 'medium', isDismissable: true }
);

const panelRef = ref<HTMLElement | null>(null);

// focus the dialog on open so Escape and Tab start inside it
watch(
  () => props.isOpen,
  async (isOpen) => {
    if (!isOpen) return;
    await nextTick();
    panelRef.value?.focus();
  },
  { immediate: true }
);

const handleModalClose = () => props.onClose?.();
const handleDismiss = () => props.isDismissable && handleModalClose();
</script>

<template>
  <div
    class="modal"
    :class="[{ 'is-active': isOpen }, `size-${size}`]"
    @keydown.esc="handleDismiss"
  >
    <div class="modal-background" @click="handleDismiss"></div>
    <div
      ref="panelRef"
      class="modal-content modal-panel"
      role="dialog"
      aria-modal="true"
      tabindex="-1"
    >
      <button
        v-if="onClose"
        data-testid="close"
        class="modal-x"
        :aria-label="$t('close')"
        @click="handleModalClose"
      >
        <CloseIcon />
      </button>
      <div class="modal-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal.size-small {
  --bulma-modal-content-width: 28rem;
}
.modal.size-medium {
  --bulma-modal-content-width: 40rem;
}
.modal.size-large {
  --bulma-modal-content-width: 56rem;
}

/* keeps the size's width at every screen size (Bulma makes .modal-content full width below 769px);
   the panel clips and the body scrolls, so the close button stays visible on long content */
.modal-panel {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
  max-width: min(var(--bulma-modal-content-width), calc(100vw - 2rem));
  margin-inline: auto;
  background-color: var(--neutral-0);
  border-radius: 0.75rem;
  box-shadow: 0 0.5rem 2rem rgb(0 0 0 / 0.15);
  &:focus {
    outline: none;
  }
}

.modal-body {
  min-height: 0;
  overflow-y: auto;
  padding: 2.5rem 2rem 2rem;
}

.modal-x {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 1;
  display: flex;
  padding: 0.25rem;
  border: none;
  border-radius: 0.375rem;
  background: none;
  color: var(--neutral-70);
  cursor: pointer;
  &:hover {
    background-color: var(--neutral-10);
    color: var(--neutral-100);
  }
  &:focus-visible {
    outline: 2px solid var(--primary-dark);
  }
}

@media (max-width: 576px) {
  .modal-body {
    padding: 2.5rem 1.25rem 1.25rem;
  }
}
</style>
