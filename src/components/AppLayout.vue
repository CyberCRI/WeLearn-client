<template>
  <div class="appLayout">
    <div class="header">
      <slot name="header"></slot>
      <slot name="sidebar"> </slot>
    </div>
    <div class="main"><slot name="main"></slot></div>
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
  overscroll-behavior: contain;
  scroll-behavior: smooth;
}

.wl-footer {
  background-color: var(--neutral-10);
  padding: 0.5rem;
}
</style>
