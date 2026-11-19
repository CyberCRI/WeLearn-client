<script setup lang="ts">
// the green "← back" link at the top left of a page: a route link, or a button when the parent
// decides what going back means (e.g. a confirm first)
defineProps<{ to?: string }>();
defineEmits<{ click: [] }>();
</script>

<template>
  <RouterLink v-if="to" :to="to" class="back-link">← <slot /></RouterLink>
  <button v-else type="button" class="back-link" @click="$emit('click')">← <slot /></button>
</template>

<style scoped>
/* no `all: unset`: it would also wipe the margin a parent places the link with */
.back-link {
  align-self: flex-start;
  padding: 0;
  border: 0;
  background: none;
  font-family: inherit;
  display: inline-block;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--primary-dark);
  cursor: pointer;
}

.back-link:hover,
.back-link:focus-visible {
  text-decoration: underline;
}

.back-link:focus-visible {
  outline: 2px solid var(--primary-dark);
  outline-offset: 2px;
}
</style>
