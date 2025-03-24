<script setup lang="ts">
import ChevronDownVue from '@/components/icons/ChevronUp.vue';
defineProps<{
  displayArrow: boolean;
}>();
</script>
<template>
  <div class="scroller is-fullheigh test" id="top">
    <a href="#top" class="go-to" :class="displayArrow ? 'visible' : 'hidden'">
      <div class="scroll-arrow">
        <ChevronDownVue />
      </div>
      <span class="is-underlined">{{ $t('goToTop') }}</span>
    </a>
  </div>
</template>

<style scoped>
a {
  all: unset;
}
.go-to {
  background: var(--neutral-0);
  padding: 0.25rem;
  border-radius: 0.5rem;
  z-index: 1;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  right: 3rem;
  bottom: 2rem;
  opacity: 0;
}
.scroll-arrow {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 1px solid var(--primary);
  padding: 0.5rem;
  z-index: 1;

  display: flex;
  justify-content: center;
  align-items: center;
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
</style>
