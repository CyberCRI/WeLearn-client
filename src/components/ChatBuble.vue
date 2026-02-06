<!-- chat buble, user is blue, machine is grey -->
<script setup lang="ts">
import AssistantAvatar from './AssistantAvatar.vue';
import DescreteButton from './ButtonComponent.vue';
import UserAvatar from './UserAvatar.vue';
import ReloadIcon from './icons/ReloadIcon.vue';
import CopyIcon from './icons/CopyIcon.vue';
import TooltipComponent from './TooltipComponent.vue';
import { marked } from 'marked';
import { ref, type Ref } from 'vue';

const copied = ref(false);
const timeOut: Ref<null | number> = ref(null);

defineProps<{
  message: string;
  isUSer: boolean;
  isLast: boolean;
  shouldDisable: boolean;
  rephrase?: () => void;
}>();

const copyMessage = (msg: string) => {
  if (timeOut.value) {
    window.clearTimeout(timeOut.value);
  }

  copied.value = true;
  navigator.clipboard.writeText(msg);
  timeOut.value = window.setTimeout(() => {
    copied.value = false;
  }, 1000);
};
</script>
<template>
  <div v-if="message" class="chat-bubble" :class="{ 'last-message': isLast }">
    <div class="cahtAvatar">
      <UserAvatar v-if="isUSer" />
      <AssistantAvatar v-else />
    </div>
    <p class="chat-bubble-content" v-html="marked.parse(message)" />
    <div class="details">
      <DescreteButton
        class="detail-button"
        :aria-label="$t('copy')"
        isDiscreet
        v-if="!isUSer && !shouldDisable"
        @click="copyMessage(message)"
      >
        <CopyIcon class="icon-action" />
        <TooltipComponent class="tltip" :tooltipText="copied ? $t('copied') : $t('copy')" isRight />
      </DescreteButton>
      <DescreteButton
        class="detail-button"
        :aria-label="$t('rephrase')"
        isDiscreet
        v-if="!isUSer && isLast && !shouldDisable"
        @click="rephrase && rephrase()"
      >
        <ReloadIcon class="icon-action" />
        <TooltipComponent class="tltip" :tooltipText="$t('rephrase')" isRight />
      </DescreteButton>
    </div>
  </div>
</template>

<style scoped>
.tltip {
  display: none;
}

.detail-button {
  position: relative;
  &:hover {
    .tltip {
      display: block;
    }
  }
}
.icon-action {
  width: 1rem;
  color: var(--neutral-80);
  height: 1rem;
}
.chat-bubble {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: auto;
  color: var(--neutral-80);
  padding: 1.25rem 1rem;
  gap: 1rem;
  text-align: justify;
}
.chat-bubble.last-message {
  padding-bottom: 15rem;
}

.cahtAvatar {
  height: 1.5rem;
  margin-bottom: 0.9rem;
}

.chat-bubble-content {
  overflow: visible;
  margin: auto 0;
  border-radius: 0;
  margin-left: 0.5rem;
  width: 100%;
  margin-left: 0;
  & > a {
    color: var(--primary);
  }
}

@media screen and (max-width: 576px) {
  .chat-bubble-content {
    display: flex;
    flex-direction: column;
  }
}

@media screen and (max-width: 992px) {
  .chat-bubble {
    font-size: 0.9em;
    flex-direction: column;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
  }

  .chat-bubble-content {
    width: 100%;
    margin-left: 0;
  }

  .details {
    width: 10%;
    height: 100%;
    display: flex;
    align-self: flex-end;
    gap: 0.5rem;

    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
  }

  .chat-bubble.last-message {
    padding-bottom: 5rem;
  }
}
</style>
