<!-- chat buble, user is blue, machine is grey -->
<script setup lang="ts">
import AssistantAvatar from './AssistantAvatar.vue';
import DescreteButton from './ButtonComponent.vue';
import UserAvatar from './UserAvatar.vue';
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
}>();

const renderer = new marked.Renderer();
const linkRenderer = renderer.link;
renderer.link = (href, title, text) => {
  const html = linkRenderer.call(renderer, href, title, text);
  return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ');
};

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
    <p class="chat-bubble-content" v-html="marked.parse(message, { renderer })" />
    <div class="details">
      <DescreteButton
        class="detail-button"
        :aria-label="$t('copy')"
        isDiscreet
        v-if="!isUSer && !shouldDisable"
        @click="copyMessage(message)"
      >
        <CopyIcon class="icon-action" />
        <TooltipComponent class="tltip" :tooltipText="copied ? $t('copied') : $t('copy')" isLeft />
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
  text-align: left;
}
.chat-bubble.last-message {
  padding-bottom: 5rem;
}

.cahtAvatar {
  flex-shrink: 0;
  height: 1.5rem;
  margin-bottom: 0.9rem;
}

.chat-bubble-content {
  overflow: visible;
  margin: auto 0;
  border-radius: 0;
  flex: 1;
  min-width: 0;
  margin-left: 0;
  & > a {
    color: var(--primary);
  }
  /* markdown comes in via v-html, so lists need :deep to get an indent; otherwise the numbers sit in the margin */
  & :deep(ol),
  & :deep(ul) {
    padding-left: 1.5em;
  }
}

@media (max-width: 1450px) {
  .chat-bubble.last-message {
    padding-bottom: 1rem;
  }
}

@media (max-width: 576px) {
  .chat-bubble-content {
    display: flex;
    flex-direction: column;
  }
}

@media (max-width: 992px) {
  /* keep avatar beside the text; the copy button wraps under the message, aligned with the text */
  .chat-bubble {
    flex-wrap: wrap;
    gap: 0.5rem 0.75rem;
    padding: 1rem 0.5rem;
  }

  .details {
    flex-basis: 100%;
    display: flex;
    padding-left: 2.75rem;
  }

  .chat-bubble.last-message {
    padding-bottom: 5rem;
  }
}
</style>
