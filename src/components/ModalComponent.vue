<script setup lang="ts">
import { ref } from 'vue';
import ModalWrapper from './ModalWrapper.vue';
const props = defineProps<{
  title?: string;
  message?: string;
  isOpen: boolean;
  onClose?: () => void;
  disableCloseOnBackground?: boolean;
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
  <ModalWrapper
    :isOpen="state"
    :onClose="handleModalClose"
    :disableCloseOnBackground="props.disableCloseOnBackground"
  >
    <div class="box">
      <div
        class="is-flex is-flex-direction-column is-justify-content-space-between is-align-items-center"
      >
        <p class="title my-6" v-if="title">{{ title }}</p>
        <p class="subtitle mb-5 px-6" v-if="message" v-html="message" />
        <div class="container px-6">
          <slot name="extraInfo"></slot>
        </div>
        <slot name="actions"> </slot>
      </div>
    </div>
  </ModalWrapper>
</template>
