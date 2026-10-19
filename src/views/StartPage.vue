<script setup lang="ts">
import StudentBar from '@/components/student/StudentBar.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import SpaceCard from '@/components/SpaceCard.vue';

// the two ways in: each choice opens its own space
const CHOICES = [
  { key: 'teaching', route: 'teach', accent: 'var(--primary)' },
  { key: 'learning', route: 'learn', accent: 'var(--secondary)' }
] as const;
</script>
<template>
  <div class="start-page">
    <StudentBar isEntry />
    <main class="start-content">
      <h1 class="title is-3 is-size-4-mobile">{{ $t('journey.entry.title') }}</h1>
      <p class="subtitle is-6 mt-2">{{ $t('journey.entry.intro') }}</p>

      <ul class="choices">
        <li v-for="choice in CHOICES" :key="choice.key" :data-testid="`choice-${choice.key}`">
          <SpaceCard
            :title="$t(`journey.entry.${choice.key}.title`)"
            :description="$t(`journey.entry.${choice.key}.description`)"
            :accent="choice.accent"
            :to="{ name: choice.route }"
            :actionText="$t(`journey.entry.${choice.key}.action`)"
          />
        </li>
      </ul>
    </main>
    <FooterComponent class="start-footer" />
  </div>
</template>

<style scoped>
.start-page {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.start-content {
  flex: 1;
  width: 100%;
  max-width: 56rem;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 3rem;
}

.choices {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 2rem;
}

.start-footer {
  padding-block: 0.5rem;
  background: var(--neutral-10);
}

@media (max-width: 600px) {
  .start-content {
    padding: 1.5rem 1rem 2rem;
  }

  .choices {
    grid-template-columns: 1fr;
  }
}
</style>
