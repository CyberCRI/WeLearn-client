<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import StudentBar from '@/components/student/StudentBar.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import { SPACE_COLOURS, type StudentSpace } from '@/components/student/spaces';
import { useStudentLanguage } from '@/components/student/useStudentLanguage';

useStudentLanguage();

// placeholder until each space gets its activity (build step 2)
const route = useRoute();
const space = computed(() => route.params.space as StudentSpace);
</script>
<template>
  <div class="learn-page">
    <StudentBar />
    <main
      class="learn-content"
      :style="{ '--accent': SPACE_COLOURS[space].accent, '--tint': SPACE_COLOURS[space].tint }"
    >
      <router-link class="back-link" :to="{ name: 'learn' }">
        ← {{ $t('student.space.back') }}
      </router-link>
      <p class="space-label mt-5">{{ $t(`student.spaces.${space}.name`) }}</p>
      <h1 class="title is-3 is-size-4-mobile mt-3">
        {{ $t(`student.spaces.${space}.title`) }}
      </h1>
      <p class="subtitle is-6 mt-2">{{ $t(`student.spaces.${space}.description`) }}</p>
      <p class="coming-soon mt-5">{{ $t('student.space.comingSoon') }}</p>
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
  max-width: 48rem;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
}

.back-link {
  font-size: 0.9rem;
}

.space-label {
  display: inline-block;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  background: var(--tint);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--neutral-80);
}

.coming-soon {
  padding: 1rem 1.25rem;
  border-left: 4px solid var(--accent);
  border-radius: 8px;
  background: var(--neutral-10);
  color: var(--neutral-70);
}

.learn-footer {
  padding-block: 0.5rem;
  background: var(--neutral-10);
}

@media (max-width: 600px) {
  .learn-content {
    padding: 1.5rem 1rem 2rem;
  }
}
</style>
