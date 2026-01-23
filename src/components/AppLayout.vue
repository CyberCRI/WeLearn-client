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

  display: grid;
  grid-template-rows: 6.5rem auto;
  grid-template-areas:
    'header '
    'main ';
  transition: grid-template-rows 0.5s;
}

.header {
  grid-area: header;
  display: flex;
}

.main {
  grid-area: main;
  width: 100%;
  height: 100%;
  overflow: auto;
  scroll-behavior: smooth;
}
@media screen and (min-width: 576px) {
  .appLayout {
    grid-template-rows: 7rem auto;
    grid-gap: 0.05rem;
  }
}

@media screen and (min-width: 768px) {
  .appLayout {
    grid-template-rows: auto 1fr;
  }
}

.wl-footer {
  background-color: var(--neutral-10);
  padding: 0.5rem;
}
</style>
