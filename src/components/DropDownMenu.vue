<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import ChevronDownVue from '@/components/icons/ChevronDown.vue';

import { ref } from 'vue';

defineProps<{ title: string; inElement?: boolean; closeOnClick?: boolean }>();
const isVisible = ref(false);
const dropdownElement = ref<HTMLElement>();

const handleClickOutside = ({ target }: MouseEvent) => {
  const targetElement = dropdownElement.value;

  if (targetElement && !targetElement.contains(target as Node) && isVisible.value) {
    isVisible.value = false;
  }
};

const toggleVisibility = () => {
  isVisible.value = !isVisible.value;
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => document.removeEventListener('click', handleClickOutside));
</script>
<template>
  <div class="dropdown" ref="dropdownElement">
    <div
      class="shared"
      :class="inElement ? 'inEl-selection' : 'selection'"
      @click="() => (isVisible = !isVisible)"
    >
      <div class="selection-title">
        <slot name="icon"></slot>
        {{ title }}
      </div>
      <div :class="{ opened: isVisible }">
        <ChevronDownVue />
      </div>
    </div>
    <div class="options" v-if="!!isVisible" @click="closeOnClick && toggleVisibility()">
      <slot name="itemsList"></slot>
    </div>
  </div>
</template>
<style scoped>
.dropdown {
  position: relative;
  width: 100%;
}

.shared {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 0.625rem;
  width: 100%;
  text-align: left;
}

.selection {
  background-color: var(--neutral-0);
  border: 1px solid var(--neutral-20);
  border-radius: 0.25rem;
  box-shadow: 0.25rem 0.25rem 0.25rem var(--neutral-20);
}

.inEl-selection {
  border-bottom: 1px solid var(--neutral-20);
}

.selection-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.opened {
  transform: rotate(180deg);
}

.options {
  position: absolute;
  display: flex;
  flex-direction: column;
  background-color: var(--neutral-0);
  border: 1px solid var(--neutral-20);
  border-radius: 0rem;
  padding: 0.625rem;
  width: 100%;
  z-index: 1;
  box-shadow: 0.25rem 0.25rem 0.25rem var(--neutral-20);
  max-height: 25rem;
  overflow: auto;
}
</style>
