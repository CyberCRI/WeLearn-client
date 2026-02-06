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
    </router-link>
  </div>
</template>

<script setup lang="ts">
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

.item-name {
  width: auto;
  white-space: nowrap;
  flex-wrap: nowrap;
}

@media screen and (max-width: 1450px) {
  .item-name {
    display: none;
    visibility: hidden;
    opacity: 0;
    width: 0rem;
    white-space: nowrap;
  }
  .router-link {
    gap: 0;
  }
}

@media screen and (max-width: 750px) {
  .router-link {
    padding-inline: 0.5rem;
  }
}

@media screen and (max-width: 650px) {
  .link-wrapper {
    padding-inline: 0.25rem;
  }
}

@media screen and (max-width: 450px) {
  .router-link {
    padding-inline: 0.05rem;
  }
  .link-wrapper {
    padding-inline: 0rem;
  }
}
</style>
