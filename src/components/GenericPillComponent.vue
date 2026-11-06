<script setup lang="ts">
defineProps<{ content: string }>();
</script>

<template>
  <div class="pill">
    {{ content.length > 20 ? content.slice(0, 17) + '...' : content }}
    <slot name="actions"> </slot>
  </div>
</template>

<style scoped>
.pill {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  height: 1.625rem;
  padding: 0 0.375rem 0 0.625rem;
  border: 1px solid var(--neutral-15);
  border-radius: 999px;
  background-color: var(--neutral-10);
  color: var(--neutral-90);
  font-size: 0.8rem;
  font-weight: 500;
  line-height: 1;
  cursor: default;
}
</style>
