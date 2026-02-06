<script setup lang="ts">
import TooltipComponent from '@/components/TooltipComponent.vue';
import SidePanelIcon from '@/components/icons/SidePanelIcon.vue';

import { ref, type VNodeRef } from 'vue';

const scrollerRef = ref<VNodeRef | null>(null);
const isOpen = ref(true);

const toggleOpen = () => {
  isOpen.value = !isOpen.value;
};
</script>
<template>
  <div class="gridy-template">
    <div class="panely left scroll">
      <slot name="left-panel"></slot>
    </div>
    <div class="outer is-outline">
      <SidePanelIcon class="primary toggle" @click="toggleOpen" />
      <TooltipComponent
        class="tltip"
        :tooltipText="isOpen ? $t('closeSidebar') : $t('openSidebar')"
        isLeft
      />
    </div>
    <div
      class="panely right scroll"
      :class="{ opened: isOpen }"
      ref="scrollerRef"
      @scroll="handleDisplayArrow"
    >
      <slot name="right-panel"></slot>
    </div>
  </div>
</template>

<style scoped>
.left {
  grid-area: left;
  width: 100%;
  height: 100%;
  min-height: 100%;
}

.right {
  grid-area: right;
  width: 100%;
  scroll-behavior: smooth;
}

.gridy-template {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

@media screen and (max-width: 991px) {
  .toggle {
    display: none;
  }

  .right {
    grid-area: right;
    width: 95%;
    margin: auto;
    scroll-behavior: smooth;
  }

  .left {
    height: auto;
  }
}

@media screen and (min-width: 992px) {
  .gridy-template {
    flex-direction: row;
  }
  .left {
    overflow: hidden;
    min-width: 65%;
    max-width: 100%;
    height: 100%;
    margin-left: 2rem;
  }

  .right {
    width: initial;
    overflow-y: auto;
    width: 0;
    height: 100%;
    padding: 0;
    visibility: hidden;
    transition: width 0.5s;
    margin-left: 6rem;
  }

  .gridy-template {
    & > .toggle {
      margin-block: 0.5rem 15rem;
      width: auto;
      display: flex;
      align-items: flex-start;
      transition:
        display ease-in 5s,
        background ease-in 1s;

      & > * {
        display: block;
      }
    }
  }

  .tltip {
    display: none;
  }
  .outer {
    z-index: 1;
    position: absolute;
    top: 1rem;
    right: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--neutral-0);
    &:hover {
      .tltip {
        display: block;
      }
    }
  }

  .right.opened {
    visibility: visible;
    width: 40%;
    margin-left: 1rem;
    padding-left: 0.5rem;
  }
}
</style>
