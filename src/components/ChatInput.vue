<script setup lang="ts">
import { useChatStore } from '@/stores/chat';
import SendIcon from './icons/SendIcon.vue';
import { ref } from 'vue';

const store = useChatStore();
const parent = ref<HTMLElement | null>(null);
const props = defineProps<{ action: (arg: string) => void }>();

const onSend = (value: string) => {
  if (value.replace(/(\r\n|\n|\r)/gm, '').trim().length === 0) {
    return;
  }
  props.action(value);
  store.clearInput();
};
</script>

<template>
  <div class="chat-input-wrapper">
    <div class="grow-wrap" ref="parent" :style="!store.chatInput.length && { height: '2.75rem' }">
      <textarea
        class="chat-input"
        auto-grow
        type="text-area"
        :row="1"
        :placeholder="$t('chatInputPlaceholder')"
        v-model="store.chatInput"
        @keydown.enter.exact="[onSend(store.chatInput), $event.preventDefault()]"
        @input="parent.dataset.replicatedValue = store.chatInput"
      ></textarea>
    </div>
    <div class="action">
      <SendIcon @click="onSend(store.chatInput)" />
    </div>
  </div>
</template>

<style scoped>
.action {
  cursor: pointer;
  display: flex;
}
.chat-input-wrapper {
  background-color: var(--neutral-0);
  gap: 0.5rem;
}

@media screen and (min-width: 992px) {
  .grow-wrap {
    /* easy way to plop the elements on top of each other and have them both sized based on the tallest one's height */
    display: grid;
    width: 100%;
  }

  .grow-wrap::after {
    /* Note the weird space! Needed to preventy jumpy behavior */
    padding: 0px;
    content: attr(data-replicated-value) ' ';

    /* This is how textarea text behaves */
    white-space: pre-wrap;
    word-break: break-all;

    background-color: yellow;

    min-height: 1.6rem;
    /* Hidden from view, clicks, and screen readers */
    visibility: hidden;
  }

  .grow-wrap > textarea,
  .grow-wrap::after {
    /* Identical styling required!! */
    font: inherit;
    line-height: 1.4;
    font-family: sans-serif;
    overflow: scroll;

    max-height: 300px;
    /* textarea and ::after should occupy the first (and only) cell of the grid: */
    grid-area: 1 / 1 / 2 / 2;
  }

  .grow-wrap > textarea {
    display: block;
    /* You could leave this, but after a user resizes, then it ruins the auto sizing */
    border: none;
    resize: none;
    line-height: 1.4;
    outline: none;
    padding: 0;
    margin: 0;
    height: 100%;
    scroll-padding: 0;

    /* Firefox shows scrollbar on growth, you can hide like this. */
    overflow-x: hidden;
  }
  textarea:focus::-webkit-input-placeholder {
    color: transparent;
  }
  textarea:focus:-moz-placeholder {
    color: transparent;
  } /* FF 4-18 */
  textarea:focus::-moz-placeholder {
    color: transparent;
  } /* FF 19+ */
  textarea:focus:-ms-input-placeholder {
    color: transparent;
  }
}
</style>
