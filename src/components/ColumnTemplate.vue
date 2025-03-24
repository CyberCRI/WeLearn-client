<script setup lang="ts">
import TooltipComponent from '@/components/TooltipComponent.vue';

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
    <div class="toggle">
      <div class="outer">
        <button class="tab primary" @click="toggleOpen">{{ isOpen ? '>>' : '<<' }}</button>
        <TooltipComponent
          class="tltip"
          :tooltipText="isOpen ? $t('hideSources') : $t('showSources')"
          isLeft
        />
      </div>
    </div>
    <div
      class="panely right scroll"
      :class="isOpen && 'opened'"
      ref="scrollerRef"
      @scroll="handleDisplayArrow"
    >
      <slot name="rigth-panel"></slot>
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
}

.toggle {
  border: none;
  width: 2.4rem;
  background: transparent;
  & > * {
    display: none;
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
  }

  .gridy-template:has(.sources-list):has(.reformulated-query) {
    & > .toggle {
      margin-block: 0.5rem 15rem;
      width: auto;
      display: flex;
      align-items: flex-start;
      /* box-shadow: inset -10px 0px 5px -11px var(--neutral-20); */
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
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1rem;
    position: relative;
    background: var(--neutral-0);
    border-radius: 40% 0px 0px 40%;
    border: 1px solid var(--neutral-15);
    border-right: none;
    box-shadow: -5px 0px 16px -4px var(--neutral-20);
    &:hover {
      .tltip {
        display: block;
      }
    }
  }

  .tab {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;
    right: 0;
    padding: 0.75rem;
    padding-right: 0.5rem;
    color: var(--neutral-80);
    border-radius: 40% 0 0 40%;
    font-size: 0.8rem;

    &:hover {
      color: var(--neutral-50);
      background: linear-gradient(to right, var(--neutral-10), var(--neutral-0));
    }
  }

  .right.opened:has(.sources-list):has(.reformulated-query) {
    visibility: visible;
    width: 40%;
    padding-right: 2rem;
    padding-left: 0.5rem;
  }
}
</style>
