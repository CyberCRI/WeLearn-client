<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

// one placement for every tooltip: above its parent element (below when there's no room above),
// centred and kept inside the window. position: fixed, so scrolling panels never clip it or scroll
// sideways. The parent still decides when it shows (.tltip { display: block } on :hover).
defineProps<{ tooltipText: string }>();

const GAP = 6;
const MARGIN = 8;
const wrapper = ref<HTMLElement | null>(null);
const tip = ref<HTMLElement | null>(null);

const place = () => {
  const el = tip.value;
  const anchor = wrapper.value?.parentElement;
  if (!el || !anchor || getComputedStyle(wrapper.value!).display === 'none') return;

  // wrapped text keeps the box at its max width: shrink it to the longest line
  el.style.width = '';
  const range = document.createRange();
  range.selectNodeContents(el);
  const lines = Array.from(range.getClientRects?.() ?? []);
  if (lines.length > 1) {
    const style = getComputedStyle(el);
    const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    el.style.width = `${Math.ceil(Math.max(...lines.map((line) => line.width)) + padding)}px`;
  }

  const a = anchor.getBoundingClientRect();
  const t = el.getBoundingClientRect();
  const above = a.top - t.height - GAP;
  const left = a.left + a.width / 2 - t.width / 2;
  el.style.top = `${above >= MARGIN ? above : a.bottom + GAP}px`;
  el.style.left = `${Math.min(Math.max(left, MARGIN), window.innerWidth - t.width - MARGIN)}px`;
  el.style.visibility = 'visible';
};

const show = () => {
  requestAnimationFrame(place);
  window.addEventListener('scroll', place, { capture: true, passive: true });
};
const hide = () => {
  if (tip.value) tip.value.style.visibility = '';
  window.removeEventListener('scroll', place, { capture: true });
};

onMounted(() => {
  const anchor = wrapper.value?.parentElement;
  anchor?.addEventListener('mouseenter', show);
  anchor?.addEventListener('focusin', show);
  anchor?.addEventListener('mouseleave', hide);
  anchor?.addEventListener('focusout', hide);
});
onBeforeUnmount(() => {
  const anchor = wrapper.value?.parentElement;
  anchor?.removeEventListener('mouseenter', show);
  anchor?.removeEventListener('focusin', show);
  anchor?.removeEventListener('mouseleave', hide);
  anchor?.removeEventListener('focusout', hide);
  hide();
});
</script>
<template>
  <div ref="wrapper" class="tooltip-wraper">
    <!-- teleported: a parent's stacking context (nav, sidebar divider) would otherwise paint over it -->
    <Teleport to="body">
      <div ref="tip" class="tooltip">{{ tooltipText }}</div>
    </Teleport>
  </div>
</template>
<style scoped>
/* takes no space in the parent's layout */
.tooltip-wraper {
  position: absolute;
  width: 0;
  height: 0;
  display: none;
}
.tooltip {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: max-content;
  max-width: min(20rem, calc(100vw - 16px));
  padding: 0.375rem 0.625rem;
  border-radius: 0.375rem;
  background-color: var(--neutral-90);
  color: var(--neutral-0);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.4;
  text-align: left;
  white-space: normal;
  pointer-events: none;
  /* hidden until placed, so it never flashes at the top-left corner */
  visibility: hidden;
}
</style>
