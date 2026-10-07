<script setup lang="ts">
import ButtonComponent from './ButtonComponent.vue';

const reload = () => {
  window.location.reload();
};
</script>

<template>
  <div class="chat-error">
    <div>{{ $t('chatError') }}</div>
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
  color: var(--neutral-80);
  width: 80%;
  gap: 1rem;
  margin: 2rem auto;
}

@media (max-width: 950px) {
  .chat-error {
    width: 100%;
    padding-inline: 1rem;
  }
}
</style>
