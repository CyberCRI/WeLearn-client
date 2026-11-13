<script setup lang="ts">
import ClockIcon from '@/components/icons/ClockIcon.vue';

// ponytail: not CardComponent, which is built for documents (corpus, sdgs, bookmark)
defineProps<{
  index: number;
  to: string;
  title: string;
  subtitle: string;
  duration: string;
  isDone: boolean;
}>();
</script>

<template>
  <RouterLink :to="to" class="module-card" :data-testid="`learn-card-${index}`">
    <span class="number" aria-hidden="true">{{ index }}</span>
    <span class="body">
      <span class="title is-6">{{ title }}</span>
      <span class="subtitle">{{ subtitle }}</span>
      <span class="meta">
        <span class="duration"><ClockIcon class="clock" /> {{ duration }}</span>
        <span v-if="isDone" class="tag is-success is-light"
          >✓ {{ $t('learn.module.completed') }}</span
        >
      </span>
    </span>
  </RouterLink>
</template>

<style scoped>
.module-card {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  border: 1px solid var(--neutral-20);
  border-radius: 12px;
  background: var(--neutral-0);
  color: inherit;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
}

.module-card:hover,
.module-card:focus-visible {
  border-color: var(--primary);
  box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
}

.number {
  flex: none;
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--primary-lighter);
  color: var(--primary-dark);
  font-weight: 700;
}

.body {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.title {
  display: block;
}

.subtitle {
  color: var(--neutral-70);
  font-size: 0.9rem;
  /* the duration line below sets its own space */
  margin-bottom: 0;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: var(--neutral-70);
}

.duration {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.clock {
  width: 1rem;
  height: 1rem;
}
</style>
