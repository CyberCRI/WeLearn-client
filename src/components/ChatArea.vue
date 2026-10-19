<script setup lang="ts">
import { onUpdated, onMounted, ref, type VNodeRef } from 'vue';
import ChevronDownVue from '@/components/icons/ChevronDown.vue';

defineProps({
  isEmpty: {
    type: Boolean,
    default: true
  }
});

onUpdated(() => {
  setState();
  scrollToBottom();
});

onMounted(() => {
  setState();
  scrollToBottom();
});

const scrollerRef = ref<VNodeRef | null>(null);
const shouldScroll = ref(true);
const displayArrow = ref(false);
const setState = () => {
  if (
    scrollerRef.value.scrollTop + scrollerRef.value.clientHeight <
    scrollerRef.value.scrollHeight
  ) {
    displayArrow.value = true;
  } else {
    displayArrow.value = false;
  }
};

const scrollToBottom = (isSmooth?: boolean) => {
  const el = scrollerRef.value;

  if (isSmooth) {
    el.style.scrollBehavior = 'smooth';
  } else {
    el.style.scrollBehavior = 'auto';
  }

  if (el && shouldScroll.value) {
    el.scrollTop = scrollerRef.value.scrollHeight;
  }
};

const handleOnWheel = () => {
  shouldScroll.value = false;
  setState();
};
</script>
<template>
  <div
    ref="scrollerRef"
    class="chat-component hidden-scroll"
    @scroll="setState"
    @wheel="handleOnWheel"
    @touchstart="shouldScroll = false"
    @touchend="shouldScroll = true"
    @mouseleave="shouldScroll = true"
  >
    <div class="chat-area-wrapper" :class="isEmpty ? 'empty-chat' : ''">
      <slot name="message-list"> </slot>
    </div>
    <div class="bottom-wrapper">
      <div class="loading">
        <slot name="loading"></slot>
      </div>
      <slot name="queues"></slot>
    </div>
    <!-- zero-height sticky anchor: the button floats at the bottom of the scroller without taking layout space -->
    <div class="scroll-arrow-anchor">
      <button
        v-show="displayArrow"
        class="scroll-arrow"
        :aria-label="$t('goToBottom')"
        @click="() => scrollToBottom(true)"
      >
        <ChevronDownVue />
      </button>
    </div>
  </div>
</template>

<style scoped>
.bottom-wrapper {
  width: 100%;
  padding-bottom: 1rem;
}

.loading:has(#wave) {
  position: relative;
}

.chat-component {
  overflow-y: auto;
  width: 100%;
  height: 100%;
}

.chat-area-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  overflow: hidden;
  margin-top: auto;
}

.scroll-arrow-anchor {
  position: sticky;
  bottom: 0.75rem;
  height: 0;
  display: flex;
  justify-content: center;
}

.scroll-arrow {
  all: unset;
  box-sizing: border-box;
  transform: translateY(-100%);
  width: 2.25rem;
  height: 2.25rem;
  padding: 0.4rem;
  border-radius: 50%;
  border: 1px solid var(--neutral-20);
  background-color: var(--neutral-0);
  color: var(--neutral-80);
  box-shadow: 0 2px 8px rgb(0 0 0 / 12%);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: var(--neutral-10);
  }
  &:focus-visible {
    outline: 2px solid var(--primary);
  }
}

.empty-chat {
  margin-top: auto;
  justify-content: center;
  height: 50%;
  align-items: center;
}
</style>
