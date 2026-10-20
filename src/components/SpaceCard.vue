<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';
import SpaceLabel from '@/components/SpaceLabel.vue';
import AiLabel from '@/components/AiLabel.vue';

// a learning space, module or choice: coloured top border, optional label, title, line.
// with `to` the whole card is one link (as on the student homepage) and `actionText` is shown
// as its button; without it, the slot holds the card's own buttons or links.
// `aiLabel` marks a card whose result is written by the AI (for example "AI draft")
defineProps<{
  label?: string;
  title: string;
  description: string;
  accent: string;
  tint?: string;
  to?: RouteLocationRaw;
  actionText?: string;
  aiLabel?: string;
}>();
</script>
<template>
  <router-link
    v-if="to"
    class="space-card is-link"
    :to="to"
    :style="{ '--accent': accent, '--tint': tint }"
  >
    <div v-if="label || aiLabel" class="space-tags">
      <SpaceLabel v-if="label" :text="label" :tint="tint" />
      <AiLabel v-if="aiLabel" :text="aiLabel" />
    </div>
    <span class="space-title">{{ title }}</span>
    <span class="space-description">{{ description }}</span>
    <!-- ponytail: the whole card is the link, so this only looks like a button (no button inside a link) -->
    <span v-if="actionText" class="space-action">{{ actionText }} →</span>
  </router-link>
  <div v-else class="space-card" :style="{ '--accent': accent, '--tint': tint }">
    <div v-if="label || aiLabel" class="space-tags">
      <SpaceLabel v-if="label" :text="label" :tint="tint" />
      <AiLabel v-if="aiLabel" :text="aiLabel" />
    </div>
    <h2 class="space-title">{{ title }}</h2>
    <p class="space-description">{{ description }}</p>
    <div class="space-actions">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.space-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  height: 100%;
  padding: 1.25rem;
  border: 1px solid var(--neutral-20);
  border-top: 4px solid var(--accent);
  border-radius: 8px;
  color: var(--neutral-90);
}

.space-card.is-link {
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.space-card.is-link:hover,
.space-card.is-link:focus-visible {
  border-color: var(--accent);
  box-shadow: 0 2px 8px var(--neutral-20);
}

.space-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.space-title {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.3;
}

.space-description {
  font-size: 0.9rem;
  color: var(--neutral-70);
}

.space-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
}

/* the student homepage's "Get started" button, also used for links placed in the slot */
.space-action,
.space-actions :slotted(.space-action) {
  align-self: flex-start;
  margin-top: auto;
  padding: 0.4rem 0.9rem;
  border: 1px solid var(--primary-dark);
  border-radius: 999px;
  background: none;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--primary-dark);
  cursor: pointer;
}

.space-card.is-link:hover .space-action,
.space-card.is-link:focus-visible .space-action,
.space-actions :slotted(.space-action:hover),
.space-actions :slotted(.space-action:focus-visible) {
  background: var(--primary-dark);
  color: var(--neutral-0);
}
</style>
