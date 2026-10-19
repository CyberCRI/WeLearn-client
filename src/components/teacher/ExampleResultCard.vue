<script setup lang="ts">
import SpaceLabel from '@/components/SpaceLabel.vue';

// one invented search result, shown to explain a kind of result; always marked as a preview example
defineProps<{
  meta: string;
  title: string;
  description: string;
  sourceNote?: string;
  source?: string;
  sourceUrl?: string;
}>();
</script>
<template>
  <article class="example-result">
    <div class="example-tags">
      <SpaceLabel :text="$t('journey.teach.preview')" tint="var(--lpi-yellow-lighter)" />
      <span class="example-meta">{{ meta }}</span>
    </div>
    <h4 class="example-title">{{ title }}</h4>
    <p class="example-description">{{ description }}</p>
    <p v-if="source" class="example-source">
      {{ sourceNote }}
      <a :href="sourceUrl" target="_blank" rel="noopener">{{ source }}</a
      >.
    </p>
  </article>
</template>

<style scoped>
.example-result {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0.75rem 0.9rem;
  border: 1px dashed var(--neutral-20);
  border-radius: 8px;
  background: var(--neutral-0);
}

.example-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.example-meta {
  font-size: 0.75rem;
  color: var(--neutral-70);
}

.example-title {
  font-size: 0.95rem;
  font-weight: 600;
}

.example-description,
.example-source {
  font-size: 0.85rem;
  color: var(--neutral-70);
}
</style>
