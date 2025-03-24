<script setup lang="ts">
defineProps<{
  defaultMessages: string[];
  action: (message: string) => void;
}>();
</script>
<template>
  <div class="chat-default">
    <div>{{ $t('emptyChatPresentation') }}</div>
    <div>{{ $t('emptyChatAction') }}</div>
  </div>
</template>
<style scoped>
.chat-default {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 0.25rem;
  height: 100%;
  text-align: center;
  color: var(--neutral-90);
  margin-bottom: 2rem;
  width: 75%;
}

.chat-default li {
  list-style-type: square;
  cursor: pointer;
  margin-bottom: 0.5rem;
  text-align: left;
}

@media screen and (min-width: 576px) {
  .chat-default {
    text-align: center;
    font-size: 1.5rem;
  }
}
</style>
