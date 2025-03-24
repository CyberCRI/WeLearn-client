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
  scrollToBottom();
});

onMounted(() => {
  setState();
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
  </div>
  <div
    class="scroll-arrow"
    :class="displayArrow ? 'visible' : 'hidden'"
    @click="() => scrollToBottom(true)"
  >
    <ChevronDownVue />
  </div>
</template>

<style scoped>
.bottom-wrapper {
  width: 100%;
  margin-top: auto;
}

.loading:has(#wave) {
  position: relative;
  width: 100%;
  padding-top: 1rem;
  margin-top: auto;
  margin-inline: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-component {
  display: flex;
  overflow-y: auto;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  /* height: 100%; */
  scroll-behavior: auto;
}

.chat-component:has(.empty-chat) {
  flex-direction: column;
}

.chat-area-wrapper {
  /* flex-grow: 1; */
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  overflow: hidden;
  margin-bottom: auto;
}

.chat-area-wrapper.empty-chat {
  margin-bottom: 0;
}

.scroll-arrow {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  z-index: 1;

  margin: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
}

.visible {
  opacity: 1;
  cursor: pointer;
  transition: opacity 0.1s ease-in-out;
}
.hidden {
  opacity: 0;
  cursor: default;
  transition: opacity 0.3s ease-in-out;
}

.empty-chat {
  margin-top: auto;
  justify-content: center;
  align-items: center;
}

@media screen and (min-width: 768px) {
  .scroll-arrow {
    all: unset;
    position: absolute;
    bottom: 10%;
    right: 0;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;

    margin: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
  }

  .visible {
    opacity: 1;
    cursor: pointer;
    transition: opacity 0.1s ease-in-out;
  }
  .hidden {
    opacity: 0;
    cursor: default;
    transition: opacity 0.3s ease-in-out;
  }
}
</style>
