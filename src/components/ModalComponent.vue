<script setup lang="ts">
import { ref, watch } from 'vue';
import ModalWrapper from './ModalWrapper.vue';
const props = defineProps<{
  title: string;
  message: string;
  isOpen: boolean;
  onClose: () => void;
}>();

const state = ref<boolean>(props.isOpen);

watch(isOpen, (val) => {
  state.value = val;
});

const handleModalClose = () => {
  props.onClose();
  state.value = false;
};
</script>

<template>
  <ModalWrapper :isOpen="state" :onClose="handleModalClose">
    <div class="box">
      <div class="is-flex is-justify-content-space-between is-align-items-center">
        <p class="title">{{ title }}</p>
      </div>
      <p>{{ message }}</p>
      <slot name="actions"> </slot>
    </div>
  </ModalWrapper>
</template>
