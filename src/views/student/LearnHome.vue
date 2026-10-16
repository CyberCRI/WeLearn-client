<script setup lang="ts">
import StudentBar from '@/components/student/StudentBar.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import { SPACE_COLOURS, STUDENT_SPACES } from '@/components/student/spaces';
import { useStudentLanguage } from '@/components/student/useStudentLanguage';

useStudentLanguage();
</script>
<template>
  <div class="learn-page">
    <StudentBar />
    <main class="learn-content">
      <h1 class="title is-3 is-size-4-mobile">{{ $t('student.home.title') }}</h1>
      <p class="subtitle is-6 mt-2 intro">{{ $t('student.home.intro') }}</p>

      <ul class="spaces">
        <li v-for="space in STUDENT_SPACES" :key="space">
          <router-link
            class="space-card"
            :data-testid="`space-card-${space}`"
            :to="{ name: 'learn-space', params: { space } }"
            :style="{
              '--accent': SPACE_COLOURS[space].accent,
              '--tint': SPACE_COLOURS[space].tint
            }"
          >
            <span class="space-label">{{ $t(`student.spaces.${space}.name`) }}</span>
            <span class="space-title">{{ $t(`student.spaces.${space}.title`) }}</span>
            <span class="space-description">{{ $t(`student.spaces.${space}.description`) }}</span>
            <!-- the whole card is the link; this only looks like a button -->
            <span class="get-started">{{ $t('student.home.getStarted') }} →</span>
          </router-link>
        </li>
      </ul>
    </main>
    <FooterComponent class="learn-footer" />
  </div>
</template>

<style scoped>
.learn-page {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.learn-content {
  flex: 1;
  width: 100%;
  max-width: 84rem;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 3rem;
}

.intro {
  max-width: 44rem;
}

.spaces {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  margin-top: 2rem;
}

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
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.space-card:hover,
.space-card:focus-visible {
  border-color: var(--accent);
  box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
}

.space-label {
  align-self: flex-start;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  background: var(--tint);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--neutral-80);
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

.get-started {
  align-self: flex-start;
  margin-top: auto;
  padding: 0.4rem 0.9rem;
  border: 1px solid var(--primary-dark);
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--primary-dark);
}

.space-card:hover .get-started,
.space-card:focus-visible .get-started {
  background: var(--primary-dark);
  color: var(--neutral-0);
}

.learn-footer {
  padding-block: 0.5rem;
  background: var(--neutral-10);
}

@media (max-width: 1100px) {
  .spaces {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .learn-content {
    padding: 1.5rem 1rem 2rem;
  }

  .spaces {
    grid-template-columns: 1fr;
  }
}
</style>
