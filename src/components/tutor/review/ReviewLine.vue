<script setup lang="ts">
// one line of the course card: its label on the left, its value on the right
defineProps<{ label: string }>();
</script>

<template>
  <div class="review-line">
    <dt>{{ label }}</dt>
    <dd><slot /></dd>
  </div>
</template>

<style scoped>
.review-line {
  display: grid;
  grid-template-columns: 9rem minmax(0, 1fr);
  gap: 1rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--neutral-20);
}

dt {
  padding-top: 0.2rem;
  font-weight: 600;
}

/* the edit pencil sits quietly beside the value, not on a line of its own */
dd :deep(.line-action) {
  float: right;
  margin-left: 0.5rem;
}

@media (max-width: 600px) {
  .review-line {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.25rem;
  }
}
</style>
