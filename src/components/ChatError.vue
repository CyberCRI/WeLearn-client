<script setup lang="ts">
import ButtonComponent from './ButtonComponent.vue';

const reload = () => {
  window.location.reload();
};
</script>

<template>
  <div class="chat-error">
    <div>Oops something wrong hapened. Please try again later.</div>
    <ButtonComponent color="secondary" @click="reload()">
      {{ $t('reload') }}
    </ButtonComponent>
  </div>
</template>

<style scoped>
.chat-error {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  text-align: center;
  font-size: 1.125em;
  color: var(--neutral-20);
}
</style>
