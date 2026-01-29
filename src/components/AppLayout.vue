<script setup lang="ts">
import { ref } from 'vue';

const content = ref();

const manageNavBarAnimations = () => {
  if (document?.defaultView?.innerWidth && document.defaultView.innerWidth > 992) return;

  const appHeaderName = document.getElementsByClassName('name-only')[0] as HTMLElement;
  const appHeader = document.getElementsByClassName('app-header')[0] as HTMLElement;

  const header = document.getElementsByClassName('appLayout')[0] as HTMLElement;

  const scrollTop = content.value.scrollTop;

  if (!header) return;

  if (scrollTop > 0) {
    appHeaderName.style.display = 'flex';
    appHeader.style.display = 'none';
    header.style.gridTemplateRows = '3rem auto';
  } else {
    appHeaderName.style.display = 'none';
    appHeader.style.display = 'flex';
    header.style.gridTemplateRows = '6.5em auto';
  }
};
</script>
<template>
  <div class="appLayout">
    <div class="header">
      <slot name="header"></slot>
      <slot name="sidebar"> </slot>
    </div>
    <div class="main" ref="content" @scroll="manageNavBarAnimations"><slot name="main"></slot></div>
    <div class="wl-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<style scoped>
.appLayout {
  height: 100%;
  width: 100%;
  overflow: hidden;
  margin: 0;

  display: flex;
  flex-direction: column;
  gap: 0.05rem;
}

.header {
  display: flex;
}

.main {
  width: 100%;
  height: 100%;
  overflow: auto;
  scroll-behavior: smooth;
}

.wl-footer {
  background-color: var(--neutral-10);
  padding: 0.5rem;
}
</style>
