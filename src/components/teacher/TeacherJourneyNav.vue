<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { TEACHER_SPACES, TEACHER_SPACE_COLOURS } from '@/components/teacher/teacherSpaces';

// top menu of the teacher space: the four spaces instead of the tools, the current one highlighted
// (its space pages and the previews inside it); shown through NavComponent's "tools" slot
const route = useRoute();
const currentSpace = computed(() => route.params.space);
</script>
<template>
  <nav class="journey-nav" :aria-label="$t('journey.teach.journeyNav')">
    <router-link
      v-for="space in TEACHER_SPACES"
      :key="space"
      class="journey-link"
      :class="{ 'is-current': currentSpace === space }"
      :aria-current="currentSpace === space ? 'page' : undefined"
      :data-testid="`journey-${space}`"
      :to="{ name: 'teach-space', params: { space } }"
      :style="{ '--accent': TEACHER_SPACE_COLOURS[space].accent }"
    >
      <span class="journey-dot" aria-hidden="true"></span>
      {{ $t(`journey.teach.spaces.${space}.name`) }}
    </router-link>
  </nav>
</template>

<style scoped>
.journey-nav {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding-top: 0.5rem;
  padding-inline: 0.5rem;
}

.journey-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem 0.4rem;
  border-bottom: 2px solid transparent;
  border-radius: 4px 4px 0 0;
  font-size: 0.9rem;
  color: var(--neutral-90);
}

.journey-link:hover {
  background-color: var(--neutral-15);
}

.journey-link.is-current {
  border-bottom-color: var(--accent);
  background-color: var(--neutral-20);
  font-weight: 600;
}

.journey-dot {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  background: var(--accent);
}

@media (max-width: 640px) {
  .journey-link {
    padding-inline: 0.4rem;
    font-size: 0.8rem;
  }

  .journey-dot {
    display: none;
  }
}
</style>
