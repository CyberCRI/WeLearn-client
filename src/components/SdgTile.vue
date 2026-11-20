<script setup lang="ts">
import { computed } from 'vue';
import i18n from '@/localisation/i18n';

const props = defineProps<{
  goal: number;
  size?: string;
  rounded?: string;
  // number only, for small tiles where the name is written next to the tile
  compact?: boolean;
}>();

const px = computed(() => Number(props.size) || 120);
</script>

<template>
  <!-- lang: lets the browser hyphenate long goal names instead of overflowing the tile -->
  <div
    class="sdg-tile"
    :class="{ compact }"
    :lang="i18n.global.locale.value"
    :style="{
      width: px + 'px',
      height: px + 'px',
      'border-radius': rounded + 'px',
      backgroundColor: `var(--sdg-${goal})`,
      '--tile': px + 'px'
    }"
  >
    <span class="num">{{ goal }}</span>
    <span v-if="!compact" class="name">{{ $t(`sdgs.${goal}`) }}</span>
  </div>
</template>

<style scoped>
.sdg-tile {
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* numbers on one line across a row of tiles, whatever the name length */
  justify-content: flex-start;
  gap: calc(var(--tile) * 0.04);
  padding: calc(var(--tile) * 0.1) calc(var(--tile) * 0.06) calc(var(--tile) * 0.06);
  box-sizing: border-box;
  text-align: center;
  color: white;
  text-shadow: 0 1px 2px rgb(0 0 0 / 35%);
}

.num {
  font-size: calc(var(--tile) * 0.26);
  font-weight: 800;
  line-height: 1;
}

.compact {
  justify-content: center;
  padding: 0;
}

.compact .num {
  font-size: calc(var(--tile) * 0.42);
}

.name {
  width: 100%;
  font-size: calc(var(--tile) * 0.095);
  font-weight: 600;
  line-height: 1.12;
  hyphens: auto;
  overflow-wrap: anywhere;
  /* very long names: clip after 5 lines rather than spill out of the tile */
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
