<script setup lang="ts">
// says plainly, in one always visible line, that an AI writes what the feature shows
defineProps<{ feature: 'chat' | 'syllabus' }>();
</script>

<template>
  <p class="ai-notice is-size-7" data-testid="ai-generated-notice">
    {{ $t(`aiNotice.${feature}`) }}
  </p>
</template>

<style scoped>
.ai-notice {
  padding-inline: 1rem;
  color: var(--neutral-80);
  text-align: center;
}
</style>
