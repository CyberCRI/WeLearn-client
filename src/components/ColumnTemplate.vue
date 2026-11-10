<script setup lang="ts">
import TooltipComponent from '@/components/TooltipComponent.vue';
import ChevronDown from '@/components/icons/ChevronDown.vue';

import { ref } from 'vue';

// filtersFirst: on narrow screens put the right panel above the content instead of below it
defineProps<{ filtersFirst?: boolean }>();

const isOpen = ref(true);

const toggleOpen = () => {
  isOpen.value = !isOpen.value;
};
</script>
<template>
  <div class="gridy-template" :class="{ 'filters-first': filtersFirst }">
    <div class="panely left scroll">
      <slot name="left-panel"></slot>
    </div>
    <!-- a thin divider between content and panel, with a small chevron handle on it -->
    <div class="divider" :class="{ 'is-collapsed': !isOpen }">
      <button
        class="sidebar-toggle"
        :aria-label="isOpen ? $t('closeSidebar') : $t('openSidebar')"
        :aria-expanded="isOpen"
        @click="toggleOpen"
      >
        <ChevronDown class="toggle-chevron" :class="{ 'is-collapsed': !isOpen }" />
        <TooltipComponent
          class="tltip"
          :tooltipText="isOpen ? $t('closeSidebar') : $t('openSidebar')"
        />
      </button>
    </div>
    <div class="panely right scroll" :class="{ opened: isOpen }">
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

.divider {
  display: none;
}

@media (max-width: 991px) {
  .right {
    grid-area: right;
    width: 95%;
    margin: auto;
    scroll-behavior: smooth;
  }

  .left {
    height: auto;
  }

  .filters-first > .right {
    order: -1;
  }
}

@media (min-width: 992px) {
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
    overflow-y: auto;
    width: 0;
    height: 100%;
    padding: 0;
    visibility: hidden;
    transition: width 0.3s ease;
  }

  .right.opened {
    visibility: visible;
    width: 40%;
    padding: 0 1rem 0 1.5rem;
  }

  /* zero-width, full-height line; the handle straddles it */
  .divider {
    display: block;
    position: relative;
    flex-shrink: 0;
    align-self: stretch;
    width: 0;
    margin-left: auto;
    border-left: 1px solid var(--neutral-50);
    z-index: 1;
    /* collapsed: no line (it separates nothing), handle kept clear of the window edge */
    &.is-collapsed {
      margin-right: 1.25rem;
      border-left-color: transparent;
    }
    .sidebar-toggle:hover .tltip,
    .sidebar-toggle:focus-visible .tltip {
      display: block;
    }
  }

  .sidebar-toggle {
    position: absolute;
    top: 1.25rem;
    left: -0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    padding: 0;
    border: 1px solid var(--neutral-50);
    border-radius: 50%;
    background-color: var(--neutral-0);
    color: var(--neutral-70);
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.06);
    cursor: pointer;
    transition:
      color 0.15s,
      border-color 0.15s;
    &:hover {
      color: var(--neutral-100);
      border-color: var(--neutral-70);
    }
    &:focus-visible {
      outline: 2px solid var(--primary-dark);
      outline-offset: 2px;
    }
  }

  /* chevron points right (hide the panel) when open, left (show it) when closed */
  .toggle-chevron {
    width: 0.75rem;
    height: 0.75rem;
    transform: rotate(-90deg);
    transition: transform 0.2s;
    &.is-collapsed {
      transform: rotate(90deg);
    }
  }

  .tltip {
    display: none;
  }
}
</style>
