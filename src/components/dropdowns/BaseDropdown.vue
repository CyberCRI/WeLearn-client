<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import ChevronDownIcon from '@/components/icons/ChevronDown.vue';
import ChevronUpIcon from '@/components/icons/ChevronUp.vue';

const isVisible = ref(false);
const dropdownElement = ref<HTMLElement>();

const handleClickOutside = ({ target }: MouseEvent) => {
  const targetElement = dropdownElement.value;

  if (targetElement && !targetElement.contains(target as Node) && isVisible.value) {
    isVisible.value = false;
  }
};

const toggleVisibility = () => (isVisible.value = !isVisible.value);

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => document.removeEventListener('click', handleClickOutside));

defineProps<{
  isUp?: boolean;
  title: string;
  subtitle?: string;
  radius?: boolean;
  hasCheck?: boolean;
}>();
</script>
<template>
  <div
    class="dropdown is-fullwidth"
    :class="[isVisible && 'is-active', isUp && 'is-up']"
    ref="dropdownElement"
  >
    <div class="dropdown-trigger" @click.stop="toggleVisibility()">
      <button
        class="button"
        :class="radius && 'radius'"
        aria-haspopup="true"
        aria-controls="dropdown-menu"
      >
        <div class="drop-title container is-flex">
          <span>{{ title }}</span>
          <p
            v-if="subtitle"
            class="subtitle is-6 is-flex container is-justify-content-space-between is-capitalized"
          >
            {{ subtitle }}
            <span v-if="!isVisible && hasCheck" class="confirmation-check"></span>
          </p>
        </div>
        <span class="icon is-small">
          <ChevronUpIcon v-if="isUp" />
          <ChevronDownIcon v-else />
        </span>
      </button>
    </div>
    <div class="dropdown-menu" id="dropdown-menu" role="menu">
      <div class="dropdown-content">
        <slot :toggleVisibility="toggleVisibility"></slot>
      </div>
    </div>
  </div>
</template>
<style scoped>
.drop-title:has(.subtitle) {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  &:first-child {
    font-size: 0.75rem;
    color: var(--neutral-80);
  }
}

@keyframes check {
  0% {
    color: transparent;
    border: 1px solid transparent;
  }
  20% {
    color: white;
    border: 1px solid var(--primary-hover);
    border-radius: 50%;
    background-color: var(--primary-hover);
  }

  60% {
    color: white;
    border: 1px solid var(--primary-hover);
    border-radius: 50%;
    background-color: var(--primary-hover);
  }
  100% {
    color: transparent;
    border: 1px solid transparent;
  }
}

.confirmation-check {
  color: transparent;
}

.confirmation-check::after {
  animation-name: check;
  animation-duration: 2s;
  width: 1rem;
  height: 1rem;
  content: '✓';
  padding-inline: 0.25rem;
  padding-block: 0.05rem;
  margin-right: 0.75rem;
}

.selected {
  font-weight: bold;
}

.dropElement {
  padding: 0.5rem;
  cursor: pointer;
  &:hover {
    background-color: var(--neutral-10);
  }
}

.dropdown {
  width: 100%;
  height: 100%;
  & > * {
    width: 100%;
    left: 0;
    right: 0;
  }
}

.dropdown-content {
  height: auto;
  overflow-y: auto;
}
.dropdown-trigger {
  width: 100%;
}

.button {
  height: 100%;
  width: 100%;
  border-radius: 0;
  display: flex;
  justify-content: space-between;
}

.button.radius {
  border-radius: 0.5rem;
}

.button:not(hover) {
  background-color: transparent;
}

.button:hover {
  background-color: var(--neutral-10);
}
</style>
