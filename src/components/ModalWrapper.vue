<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{
  isOpen: boolean;
  onClose?: () => void;
}>();

const computedState = computed(() => props.isOpen);

const handleModalClose = () => {
  props.onClose();
  computedState.value = false;
};
</script>

<template>
  <div class="modal" :class="computedState ? 'is-active' : ''">
    <div class="modal-background" @click="handleModalClose"></div>
    <div class="modal-content">
      <slot></slot>
    </div>
    <button
      data-testid="close"
      class="modal-close is-large"
      aria-label="close"
      v-if="onClose"
      @click="handleModalClose"
    ></button>
  </div>
</template>

<style scoped>
.modal {
  --bulma-modal-content-width: 50%;
}
</style>
