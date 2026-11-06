<script setup lang="ts">
import { ref } from 'vue';
import ModalWrapper from './ModalWrapper.vue';
import LanguageSelector from './nav/LanguageSelector.vue';
const props = defineProps<{
  title?: string;
  message?: string;
  isOpen: boolean;
  onClose?: () => void;
  displayLang?: boolean;
  size?: 'small' | 'medium' | 'large';
}>();

const state = ref<boolean>(props.isOpen);

const handleModalClose = () => {
  if (props.onClose) {
    props.onClose();
  }
  state.value = false;
};
</script>

<template>
  <ModalWrapper :isOpen="state" :onClose="onClose && handleModalClose" :size="size">
    <!-- small dialogs (confirmations, errors) are centred with equal-width buttons -->
    <div class="dialog" :class="{ 'is-compact': size === 'small' }">
      <div class="dialog-header">
        <h2 class="dialog-title" v-if="title">{{ title }}</h2>
        <LanguageSelector v-if="displayLang" class="ml-auto" />
      </div>
      <p class="dialog-message" v-if="message">{{ message }}</p>
      <slot name="extraInfo"></slot>
      <div class="buttons">
        <slot name="actions"></slot>
      </div>
    </div>
  </ModalWrapper>
</template>

<style scoped>
.dialog-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.dialog-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.35;
  color: var(--neutral-90);
}

.dialog-message {
  margin-bottom: 1rem;
  color: var(--neutral-70);
}

.buttons {
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.is-compact {
  text-align: center;
  .dialog-header {
    justify-content: center;
    padding-inline: 1rem;
  }
  .dialog-title {
    font-size: 1.125rem;
  }
  .dialog-message {
    margin-bottom: 0;
    font-size: 0.95rem;
  }
  .buttons {
    flex-wrap: nowrap;
    justify-content: center;
    gap: 0.75rem;
  }
  .buttons :deep(.button) {
    flex: 1;
    margin: 0;
  }
}
</style>
