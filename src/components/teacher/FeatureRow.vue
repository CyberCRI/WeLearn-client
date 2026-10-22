<script setup lang="ts">
import type { Component } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

// a feature as one quiet clickable row: icon, name (with an optional discreet badge),
// one line of description and an arrow; the whole row is the link
defineProps<{
  to: RouteLocationRaw;
  icon: Component;
  title: string;
  description: string;
  badge?: string;
  // background of the round icon; the space's light colour
  tint?: string;
}>();
</script>
<template>
  <router-link class="feature-row" :to="to">
    <span class="feature-icon" aria-hidden="true" :style="{ background: tint }">
      <component :is="icon" />
    </span>
    <span class="feature-text">
      <span class="feature-title">
        {{ title }}
        <span v-if="badge" class="feature-badge">{{ badge }}</span>
      </span>
      <span class="feature-description">{{ description }}</span>
    </span>
    <span class="feature-arrow" aria-hidden="true">→</span>
  </router-link>
</template>

<style scoped>
.feature-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 0.75rem;
  border-radius: 8px;
  color: var(--neutral-90);
  transition: background-color 0.15s;
}

.feature-row:hover {
  background-color: var(--neutral-10);
}

.feature-row:focus-visible {
  outline: 2px solid var(--primary-dark);
  outline-offset: 2px;
  background-color: var(--neutral-10);
}

.feature-icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: var(--lpi-violet-lighter);
  color: var(--neutral-90);
}

/* every icon at the same size, whatever its own svg size */
.feature-icon :deep(svg) {
  width: 1.25rem;
  height: 1.25rem;
}

.feature-text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}

.feature-title {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.05rem;
  font-weight: 600;
}

.feature-badge {
  padding: 0 0.4rem;
  border: 1px solid var(--neutral-20);
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--neutral-70);
}

.feature-description {
  font-size: 0.9rem;
  color: var(--neutral-70);
}

.feature-arrow {
  flex-shrink: 0;
  font-size: 1.25rem;
  color: var(--neutral-70);
  transition: transform 0.15s;
}

.feature-row:hover .feature-arrow,
.feature-row:focus-visible .feature-arrow {
  transform: translateX(3px);
  color: var(--primary-dark);
}

@media (prefers-reduced-motion: reduce) {
  .feature-row,
  .feature-arrow {
    transition: none;
  }
}

@media (max-width: 600px) {
  .feature-row {
    gap: 0.75rem;
    padding: 1rem 0.25rem;
  }
}
</style>
