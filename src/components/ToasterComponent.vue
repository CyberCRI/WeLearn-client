<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  level: {
    type: String,
    default: 'info'
  }
});
</script>
<template>
  <div class="toaster" :class="level">
    <h1 class="header">{{ title }}</h1>
    <p v-if="description" class="body">{{ description }}</p>
  </div>
</template>
<style scoped>
.toaster {
  border: 1px solid var(--neutral-20);
  border-radius: 0.25rem;
  padding: 0.5rem;
}

.toaster.info {
  background-color: var(--info-10);
  border-color: var(--info-20);
  color: var(--info-100);
}

.toaster.warning {
  background-color: var(--warning-10);
  border-color: var(--warning-20);
  color: var(--warning-100);
}

.toaster.error {
  background-color: var(--error-10);
  border-color: var(--error-20);
  color: var(--error-100);
}

.header {
  width: 100%;
  border-bottom: var(--neutral-20) 1px solid;
}

.body {
  width: 100%;
  padding: 1rem 0;
}
</style>
