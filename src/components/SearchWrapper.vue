<template>
  <div class="search-container">
    <div class="text-area">
      <slot name="textArea"></slot>
    </div>
    <div class="filters">
      <slot name="filters"> </slot>
    </div>
  </div>
</template>
<style scoped>
.search-container {
  position: relative;
  border: 1px solid var(--neutral-50);
  border-radius: 0.5rem;
  width: 100%;
}

.filters {
  position: relative;
  display: flex;
  height: 4rem;
  justify-content: space-between;
  border-top: 1px solid var(--neutral-50);
  display: flex;
}
</style>
