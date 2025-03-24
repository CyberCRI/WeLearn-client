<script setup lang="ts">
import { ref } from 'vue';
import { useGoTo } from '@/composables/useGoTo';
import GoToComponent from '@/components/GoToTopComponent.vue';

const container = ref(null);
const { handleDisplayArrow, displayArrow } = useGoTo(container);
</script>

<template>
  <div class="layout" ref="container" @scroll="handleDisplayArrow">
    <div class="template-content scroller">
      <GoToComponent :displayArrow="displayArrow" />
      <div class="top scroller">
        <slot name="top"></slot>
      </div>

      <slot name="main"></slot>
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.template-content {
  display: flex;
  flex-direction: column;
  gap: 2em;
  width: 100%;
  height: 100%;
  padding: 0.75rem;
}

@media screen and (min-width: 992px) {
  .template-content {
    width: 100%;
    padding: 0;
    align-items: center;
  }

  .top {
    width: 100%;
    margin-top: 10%;

    transition: margin-top 0.5s ease-in-out;
  }

  .template-content:has(#sourcesAnchor) {
    .top {
      margin-top: 3rem;
    }
  }
}

@media screen and (min-width: 1200px) {
  .template-content {
    width: 70%;
    gap: 3.75rem;
    padding: 0;
  }
}
</style>
