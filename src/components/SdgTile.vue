<script setup lang="ts">
defineProps<{
  goal: number;
  size?: string;
  rounded?: string;
}>();
</script>

<template>
  <div
    class="sdg-tile"
    :style="{
      width: size + 'px',
      height: size + 'px',
      'border-radius': rounded + 'px',
      backgroundColor: `var(--sdg-${goal})`
    }"
    role="button"
  >
    <div class="content">
      <div class="label">{{ goal }}. {{ $t(`sdgs.${goal}`) }}</div>
    </div>
  </div>
</template>

<style scoped>
.sdg-tile {
  overflow: hidden;
  cursor: pointer;
  display: grid;
  place-items: center;
}

.content {
  position: relative;
  display: grid;
  place-items: center;
  text-align: center;
  gap: 6px;
  padding: 10px;
}

.label {
  position: relative;
  font-size: 25px;
  font-weight: 600;
  line-height: 1.2;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
}
</style>
