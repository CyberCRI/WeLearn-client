<script setup lang="ts">
defineProps<{
  defaultMessages: string[];
  action: (message: string) => void;
}>();
</script>
<template>
  <div class="chat-default">
    <div>{{ $t('emptyChatPresentation') }}</div>
    <div class="mt-6">{{ $t('emptyChatAction') }}</div>
  </div>
</template>
<style scoped>
.chat-default {
  margin-top: auto;
  text-align: center;
  color: var(--neutral-80);
  margin-bottom: 2rem;
  width: 50%;
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
    font-size: 1.2rem;
  }
}
</style>
