<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{
  isOpen: boolean;
  onClose?: () => void;
  disableCloseOnBackground?: boolean;
}>();

const computedState = computed(() => props.isOpen);

const handleModalClose = () => {
  if (props.onClose) {
    props.onClose();
  }
  computedState.value = false;
};
</script>

<template>
  <div class="modal" :class="{ 'is-active': computedState }">
    <div
      class="modal-background"
      @click="!disableCloseOnBackground ? handleModalClose() : null"
    ></div>
    <div class="modal-content">
      <slot></slot>
    </div>
    <button
      data-testid="close"
      class="modal-close is-large"
      aria-label="close"
      v-if="onClose"
      @click="!disableCloseOnBackground ? handleModalClose() : null"
    ></button>
  </div>
</template>

<style scoped>
.modal {
  --bulma-modal-content-width: 50%;
}

@media screen and (max-width: 1024px) {
  .modal {
    --bulma-modal-content-width: 90%;
  }
}
</style>
