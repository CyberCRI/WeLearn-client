<script setup lang="ts">
defineProps<{ stepDescription: string }>();
</script>
<template>
  <div class="steps-description">
    <p>{{ $t(`${stepDescription}`) }}</p>
  </div>
</template>
