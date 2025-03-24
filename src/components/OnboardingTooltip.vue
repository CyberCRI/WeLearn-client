<script setup lang="ts">
import { onMounted } from 'vue';

defineProps<{
  onClose: () => void;
  onNext: () => void;
  header?: string;
  description: string;
  buttonText: string;
  arrowPosition?: 'right' | 'left' | 'middle';
}>();

// get parent position and set tooltip position
onMounted(() => {
  // TODO: make this a function helper
  const tooltip = document.querySelector('.wrapper') as HTMLElement;
  const tooltipRect = tooltip.getBoundingClientRect();
  const parent = tooltip.parentElement as HTMLElement;
  const parentRect = parent.getBoundingClientRect();
  const triangle = document.querySelector('.triangle') as HTMLElement;

  const parentCenter = parentRect.width / 2;

  // set triangle position to the center of the parent
  triangle.style.left = `${parentCenter}px`;
  tooltip.style.top = `-${tooltipRect.height}px`;

  // if parent width is too small, set tooltip to be bigger than parent
  if (parentRect.width < 200) {
    tooltip.style.width = '200px';
  }

  // make sure tooltip is not outside the screen
  if (tooltipRect.right > window.innerWidth) {
    tooltip.style.left = `${window.innerWidth - tooltipRect.width - 10}px`;
  }
  // same for the left side
  if (tooltipRect.left < 0) {
    tooltip.style.left = `0px`;
  }

  // set wrapper bottom on top of the parent if wrapper bigger than parent
  if (tooltipRect.height > parentRect.height) {
    tooltip.style.bottom = `${parentRect.height}px`;
    tooltip.style.top = `-${parentRect.height + tooltipRect.height / 2.25}px`;
  } else {
    tooltip.style.bottom = `-${tooltipRect.height}px`;
  }

  // if parentRect top is close to the top of the screen, set tooltip to the bottom
  if (parentRect.top < 100) {
    tooltip.style.top = `${parentRect.height + 10}px`;
    tooltip.style.bottom = `-${parentRect.height + 10}px`;
    // set triangle to the top
    triangle.style.top = '-10px';
    // turn triangle upside down
    triangle.style.borderTop = '0px';
    triangle.style.borderBottom = '10px solid var(--primary-dark)';
  }
});
</script>
<template>
  <div class="wrapper">
    <div class="relative-pos">
      <div class="card tooltip-container">
        <header
          class="card-header pt-2 pr-2 pb-2 pl-2 tooltip-header is-flex is-align-items-center is-justify-content-space-between"
        >
          <h3 class="tooltip-title is-title is-size-5 has-text-weight-medium">
            {{ header || '' }}
          </h3>
          <h3
            class="button is-outline is-ghost tooltip-title is-align-self-flex-end"
            @click="onClose"
          >
            skip X
          </h3>
        </header>
        <div class="tooltip-content mt-2 pt-2 pr-2 pb-2 pl-2">
          <p>
            {{ description }}
          </p>
        </div>
        <footer class="tooltip-footer is-flex is-justify-content-flex-end mt-2 mr-2 mb-2 ml-2">
          <button class="button tooltip-button" @click="onNext">{{ buttonText }}</button>
        </footer>
      </div>
      <div class="triangle"></div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  /* bottom: 50%; */
}
.relative-pos {
  z-index: 1000;
  position: relative;
}

.tooltip-container {
  z-index: 1000;
  display: flex;
  flex-direction: column;
  background-color: var(--primary-dark);
  color: var(--neutral-0);
}

.triangle {
  position: absolute;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid var(--primary-dark);
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
}
/* effect when appearing and disappearing */
.tooltip-container {
  animation: fadeInAnimation ease 1s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}
@keyframes fadeInAnimation {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.tooltip-header {
  border-bottom: 0.5px solid var(--neutral-50);
}

.tooltip-button {
  background-color: transparent;
  color: #defff6;
  border-color: #defff6;
}
</style>
