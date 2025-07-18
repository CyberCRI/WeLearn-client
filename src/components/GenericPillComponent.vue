<script setup lang="ts">
defineProps<{ content: string; bgColor: string }>();
</script>

<template>
  <div class="pill" :style="{ 'background-color': `var(--${bgColor})` }">
    {{ content }}
    <slot name="actions"> </slot>
  </div>
</template>

<style scoped>
.tltip {
  display: none;
}

.pill {
  cursor: default;
  text-align: center;
  padding: 0rem 0.5rem;
  border-radius: 0.5rem;
  color: var(--neutral-0);
  font-size: 0.875em;
  font-weight: 900;
  height: 1.5rem;
  &:hover {
    .tltip {
      display: block;
    }
  }
}
</style>
