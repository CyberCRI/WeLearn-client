<template>
  <div class="link-wrapper">
    <router-link
      class="router-link"
      :to="to"
      :class="{ 'router-link-not-active': neverActive }"
      :data-testid="`nav-${name}`"
    >
      <div class="icon">
        <component :is="icon" />
      </div>
      <span class="item-name">{{ $t(`nav.${name}`) }}</span>
      <!-- aria-hidden: screen readers already get the name from .item-name -->
      <TooltipComponent class="tltip" isBelow aria-hidden="true" :tooltipText="$t(`nav.${name}`)" />
    </router-link>
  </div>
</template>

<script setup lang="ts">
import TooltipComponent from '@/components/TooltipComponent.vue';

defineProps<{
  to: string;
  name: string;
  icon: object;
  neverActive?: boolean;
}>();
</script>

<style scoped>
.link-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-inline: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.25rem;
  & > * {
    display: flex;
  }
}

.link-wrapper:not(:has(.router-link-not-active)):has(.router-link-active) {
  border-bottom: 2px solid var(--tertiary);
}

.router-link {
  all: unset;
  border-radius: 4px;
  padding: 0.25rem 0.75rem;
  display: flex;
  font-size: 0.9rem;

  gap: 1rem;
  cursor: pointer;
  margin: 0 0.5rem;
  width: auto;
  &:hover {
    background-color: var(--neutral-15);
  }
}

.router-link-active:not(.router-link-not-active) {
  background-color: var(--neutral-20);
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* icons ship at different native sizes (15–24px); force one box so they read as a set */
.icon :deep(svg) {
  width: 1.375rem;
  height: 1.375rem;
}

.item-name {
  width: auto;
  white-space: nowrap;
  flex-wrap: nowrap;
}

@media (max-width: 1450px) {
  .link-wrapper {
    padding-inline: 0.25rem;
  }
  router-link {
    padding: 0.25rem 0.5rem;
    display: flex;
    font-size: 0.5rem;

    gap: 0rem;
    margin: 0 0.05rem;
  }
}

/* icon-only nav: the label is visually hidden (still read by screen readers) and shown as a tooltip on hover/focus */
@media (max-width: 1330px) {
  .router-link {
    position: relative;
  }
  .item-name {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }
  .router-link:hover .tltip,
  .router-link:focus-visible .tltip {
    display: block;
  }
}

@media (max-width: 750px) {
  .router-link {
    padding-inline: 0.5rem;
  }
}

@media (max-width: 650px) {
  .link-wrapper {
    padding-inline: 0.25rem;
  }
}

/* phones (iPhone SE 375px and up): logo + 6 icons + language must fit on one row */
@media (max-width: 640px) {
  .router-link {
    margin: 0;
    padding-inline: 0.25rem;
  }
  .link-wrapper {
    padding-inline: 0rem;
  }
}
</style>
