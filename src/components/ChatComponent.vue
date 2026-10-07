<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import ChatArea from '@/components/ChatArea.vue';
import ChatBuble from '@/components/ChatBuble.vue';
import ChatInput from '@/components/ChatInput.vue';
import ChatError from '@/components/ChatError.vue';
import ChatEmptyContent from '@/components/ChatEmptyContent.vue';
import ChatQueuesPills from '@/components/ChatQueuesPills.vue';
import Loading from '@/components/LoadingComponent.vue';
import { useChatStore, CHAT_STATUS } from '@/stores/chat';
import DeleteButton from '@/components/DeleteButton.vue';
import ModalComponent from '@/components/ModalComponent.vue';

const store = useChatStore();

onMounted(() => store.getRandomQuestionNumber());

const computedStatus = computed(() => store.chatStatus);

// plain hash jumps get lost in the nested scroll containers on phones, so scroll explicitly
const scrollToSources = () =>
  document.getElementById('sourcesAnchor')?.scrollIntoView({ behavior: 'smooth' });

const confirmClear = ref(false);
const clearChat = () => {
  store.$reset();
  confirmClear.value = false;
};
</script>
<template>
  <div class="chat-template">
    <div class="chat-toolbar" v-if="computedStatus !== CHAT_STATUS.EMPTY">
      <DeleteButton :action="() => (confirmClear = true)" :delText="$t('clearChat')" />
    </div>
    <!-- v-if: ModalComponent only reads isOpen on mount -->
    <ModalComponent
      v-if="confirmClear"
      isOpen
      :title="$t('confirmClearChat')"
      :onClose="() => (confirmClear = false)"
    >
      <template #actions>
        <div class="buttons my-4">
          <button class="button" @click="confirmClear = false">{{ $t('cancel') }}</button>
          <button class="button is-danger" @click="clearChat">{{ $t('clearChat') }}</button>
        </div>
      </template>
    </ModalComponent>
    <ChatArea :isEmpty="computedStatus === CHAT_STATUS.EMPTY">
      <template #message-list>
        <ChatEmptyContent
          :defaultMessages="[$t('defaultQueues[0]'), $t('defaultQueues[1]')]"
          v-if="computedStatus === CHAT_STATUS.EMPTY"
          :action="(content: string) => store.onSendMessage(content)"
        />
        <div class="bubbles-wrapper">
          <ChatBuble
            :key="`${index}-${role}`"
            v-for="({ content, role }, index) in store.chatMessagesList"
            :message="content"
            :isUSer="role === 'user'"
            :isLast="index === store.chatMessagesList.length - 1"
            :shouldDisable="computedStatus !== CHAT_STATUS.DONE"
          />
        </div>
        <ChatError v-if="store.hasChatAnswerError" />
      </template>
      <template #loading>
        <Loading
          v-if="
            [
              CHAT_STATUS.REFORMULATING,
              CHAT_STATUS.SEARCHING,
              CHAT_STATUS.SEARCHED,
              CHAT_STATUS.FORMULATING_ANSWER
            ].includes(computedStatus)
          "
          :label="store.processingStatusLabel"
        />
      </template>
      <template #queues>
        <div
          v-if="CHAT_STATUS.EMPTY === computedStatus && store.questionNumbers"
          class="queues-wrapper"
        >
          <ChatQueuesPills
            :shouldDisable="computedStatus === CHAT_STATUS.FORMULATING_ANSWER"
            :messageList="[
              $t(`defaultQueues[${store.questionNumbers[0]}]`),
              $t(`defaultQueues[${store.questionNumbers[1]}]`)
            ]"
            :action="(content: string) => store.onSendMessage(content)"
          />
        </div>
      </template>
    </ChatArea>
    <a
      v-if="computedStatus === CHAT_STATUS.DONE && store.sourcesList.length"
      class="sourcesListLink phone"
      href="#sourcesAnchor"
      @click.prevent="scrollToSources"
      >{{ $t('goToSources') }}</a
    >

    <div class="input-area">
      <ChatInput
        class="is-flex is-full-width is-flex-grow-1"
        type="text"
        :action="(content: string) => store.onSendMessage(content)"
      />
    </div>
  </div>
</template>
<style scoped>
.chat-template {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 1rem;
  height: 100%;
}

.chat-toolbar {
  width: 80%;
  display: flex;
  justify-content: flex-end;
  padding: 0.5rem 0;
  margin-bottom: 0.5rem;
}

.trash-icon {
  color: var(--tertiary);
  height: 1.4em;
  &:hover {
    color: var(--tertiary-hover);
  }
}

.input-area {
  height: auto;
  width: 80%;
  box-shadow: inset 0 0.0625em 0.125em hsla(221, 14%, 4%, 0.05);
  border-style: solid;
  border-width: 1px;
  border-color: var(--neutral-50);
  padding: calc(0.5em - 1px) calc(0.75em - 1px);
  border-radius: 0.375rem;

  line-height: 1.5;
  height: fit-content;
}

.input-area:has(div div textarea:focus) {
  border-color: var(--primary);
}
.bubbles-wrapper {
  width: 80%;
  overflow-x: auto;
}

.phone {
  display: none;

  & > .trash-icon {
    display: none;
  }
}

.chat-delete-button:has(.trash-icon) {
  width: auto;
  background-color: transparent;
}

.queues-wrapper {
  width: 80%;
  display: block;
  padding-top: 0.5rem;
  margin: auto;
  margin-top: auto;
}

@media (max-width: 950px) {
  .chat-toolbar {
    width: 100%;
    padding-inline: 0.5rem;
  }

  .queues-wrapper {
    width: 95%;
    display: block;
    padding-top: 0.5rem;
    margin: auto;
    margin-top: auto;
  }

  .input-area {
    width: calc(100% - 1rem);
    padding: 0.25rem 0.25rem;
    border-radius: 0.375rem;
    margin: 0 0.5rem;

    line-height: 1;
    height: fit-content;
  }

  .sourcesListLink {
    height: 2rem;
    color: var(--tertiary);
  }

  .phone {
    display: inline-block;

    & > .trash-icon {
      display: inline-block;
    }
  }

  .chat-delete-button:has(.trash-icon).phone {
    opacity: 0.8;
  }

  .bubbles-wrapper {
    width: 100%;
  }
}
</style>
