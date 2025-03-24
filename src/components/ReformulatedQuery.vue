<script setup lang="ts">
defineProps<{ query: string }>();
</script>
<template>
  <div class="reformulated-query">
    <p>{{ query }}</p>
  </div>
</template>
<style scoped>
.reformulated-query {
  font-style: italic;
  margin-bottom: 0.625rem;
  padding-top: 1rem;
}
</style>
