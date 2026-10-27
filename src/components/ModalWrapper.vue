<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean;
  onClose?: () => void;
}>();

const handleModalClose = () => {
  if (props.onClose) {
    props.onClose();
  }
};
</script>

<template>
  <div class="modal" :class="{ 'is-active': isOpen }">
    <div class="modal-background" @click="onClose ? handleModalClose() : null"></div>
    <div class="modal-content">
      <slot></slot>
    </div>
    <button
      data-testid="close"
      class="modal-close is-large"
      aria-label="close"
      v-if="onClose"
      @click="handleModalClose()"
    ></button>
  </div>
</template>

<style scoped>
.modal {
  --bulma-modal-content-width: 50%;
}

@media (max-width: 1024px) {
  .modal {
    --bulma-modal-content-width: 90%;
  }
}
</style>
