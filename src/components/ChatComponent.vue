<script setup lang="ts">
import { computed } from 'vue';
import ChatArea from '@/components/ChatArea.vue';
import ChatBuble from '@/components/ChatBuble.vue';
import ChatInput from '@/components/ChatInput.vue';
import ChatError from '@/components/ChatError.vue';
import ChatEmptyContent from '@/components/ChatEmptyContent.vue';
import ChatQueuesPills from '@/components/ChatQueuesPills.vue';
import Loading from '@/components/LoadingComponent.vue';
import { useChatStore, CHAT_STATUS } from '@/stores/chat';
import DeleteButton from '@/components/DeleteButton.vue';

const store = useChatStore();
const computedStatus = computed(() => store.chatStatus);
</script>
<template>
  <div class="chat-template">
    <div class="delete-button-wrapper">
      <DeleteButton
        v-if="computedStatus !== CHAT_STATUS.EMPTY"
        :action="store.$reset"
        :delText="$t('clearChat')"
      />
    </div>
    <ChatArea :isEmpty="computedStatus === CHAT_STATUS.EMPTY">
      <template #message-list>
        <ChatEmptyContent
          :defaultMessages="[$t('defaultQueues[0]'), $t('defaultQueues[1]')]"
          v-if="computedStatus === CHAT_STATUS.EMPTY"
          :action="(content: string) => store.onSendMessage(content)"
        />
        <div class="bubbles-wrapper">
          <ChatBuble
            :key="JSON.stringify(content)"
            v-for="({ content, role }, index) in store.chatMessagesList"
            :message="content"
            :isUSer="role === 'user'"
            :rephrase="store.fetchRephrase"
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
        />
      </template>
      <template #queues>
        <div
          v-if="[CHAT_STATUS.EMPTY, CHAT_STATUS.DONE].includes(computedStatus)"
          :shouldDisable="computedStatus === CHAT_STATUS.FORMULATING_ANSWER"
          :messageList="store.questionQueues || [$t('defaultQueues[0]'), $t('defaultQueues[1]')]"
          :action="(content: string) => store.onSendMessage(content)"
          class="queues-wrapper"
        >
          <p v-if="CHAT_STATUS.DONE === computedStatus" class="subtitle is-6 ml-4">
            {{ $t('hintForNewQuestions') }}
          </p>

          <ChatQueuesPills
            v-if="[CHAT_STATUS.EMPTY, CHAT_STATUS.DONE].includes(computedStatus)"
            :shouldDisable="computedStatus === CHAT_STATUS.FORMULATING_ANSWER"
            :messageList="store.questionQueues || [$t('defaultQueues[0]'), $t('defaultQueues[1]')]"
            :action="(content: string) => store.onSendMessage(content)"
          />
        </div>
      </template>
    </ChatArea>
    <a
      v-if="computedStatus !== CHAT_STATUS.DONE"
      class="sourcesListLink phone"
      href="#sourcesAnchor"
      >{{ $t('goToSources') }}</a
    >

    <div class="input-area mx-6">
      <ChatInput
        class="is-flex is-full-width is-flex-grow-1"
        type="text"
        :action="(content: string) => store.onSendMessage(content)"
      />
    </div>
  </div>
</template>
<style scoped>
.desktop {
  display: none;
  & > .trash-icon {
    display: none;
  }
}

.chatIcon {
  height: 1.5rem;
}

.chat-template {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: flex-end; */
  padding-bottom: 0.1rem;
  height: 100%;
}

.sourcesListLink {
  height: 2rem;
  color: var(--tertiary);
}

.delete-button-wrapper {
  position: absolute;
  right: 10%;
  top: 1rem;
  z-index: 1;
}

.chat-delete-button:has(.trash-icon).phone {
  opacity: 0.8;
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

@media screen and (min-width: 992px) {
  .phone {
    display: none;

    & > .trash-icon {
      display: none;
    }
  }
  .chat-template {
    height: 100%;
    padding-bottom: 1rem;
  }
  .bubbles-wrapper {
    width: 80%;
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
}
</style>
