<script setup lang="ts">
defineProps<{
  text: string;
  action: () => void;
}>();
</script>
<template>
  <a class="clickable-test" @click="action">{{ text }}</a>
</template>

<style scoped>
.clickable-test {
  color: var(--tertiary-hover);
  text-decoration: underline;
  cursor: pointer;
  padding: 0.5rem;
  width: 100%;
}
</style>
