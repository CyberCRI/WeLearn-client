<script setup lang="ts">
defineProps<{
  action: (message: string) => void;
  messageList: string[];
  shouldDisable: boolean;
}>();
</script>
<template>
  <div class="queues scroll" :class="{ disabled: shouldDisable }">
    <div class="flexy">
      <div
        v-for="message in messageList.slice(-2)"
        :key="message"
        class="card cursor"
        @click="action(message)"
      >
        <div class="card-content">
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.cursor {
  cursor: pointer;
}
.queues.flexy {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  color: var(--neutral-0);
  overflow-x: scroll;
  width: 100%;
  margin: 0.5rem 0rem;
}

.queues.disabled {
  margin: 0;
  height: 1.5em;
  overflow: hidden;
}

.flexy {
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  align-items: flex-start;
  gap: 0.5rem;
}

.queues::-webkit-scrollbar {
  width: 0.3125rem;
  height: 0.25rem;
  background-color: var(--neutral-90);
}

/* Add a thumb */
.queues::-webkit-scrollbar-thumb {
  background: var(--neutral-50);
}

@media screen and (min-width: 768px) {
  .queues {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--neutral-0);
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-color: var(--neutral-50) var(--neutral-90);
    scrollbar-width: thin;
    width: 100%;
    margin: 0.5rem 0rem;
  }

  .flexy {
    display: flex;
    align-self: center;
    align-items: flex-start;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
    margin: 0 10px 0 10px;
    overflow: hidden;
    height: 100%;
    & > div {
      height: 100%;
      width: 100%;
      justify-content: center;
      align-items: center;
      margin: 0;
    }
  }
}
</style>
