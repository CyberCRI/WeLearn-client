<script setup lang="ts">
import { computed, type Component } from 'vue';
import { useRoute } from 'vue-router';
import LearningThread from '@/components/student/LearningThread.vue';
import UnderstandSpace from '@/components/student/UnderstandSpace.vue';
import InvestigateSpace from '@/components/student/InvestigateSpace.vue';
import EnvisionSpace from '@/components/student/EnvisionSpace.vue';
import ApplySpace from '@/components/student/ApplySpace.vue';
import { SPACE_COLOURS, STUDENT_SPACES, type StudentSpace } from '@/components/student/spaces';
import { useStudentLanguage } from '@/components/student/useStudentLanguage';

// one learning space: its activity with the shared tutor, the learning thread beside it, and the
// other spaces one click away (the thread follows)
useStudentLanguage();

const ACTIVITIES: Record<StudentSpace, Component> = {
  understand: UnderstandSpace,
  investigate: InvestigateSpace,
  envision: EnvisionSpace,
  apply: ApplySpace
};

const route = useRoute();
const space = computed(() => route.params.space as StudentSpace);
const others = computed(() => STUDENT_SPACES.filter((other) => other !== space.value));
</script>
<template>
  <div class="learn-page">
    <main
      class="learn-content"
      :style="{ '--accent': SPACE_COLOURS[space].accent, '--tint': SPACE_COLOURS[space].tint }"
    >
      <router-link class="back-link" :to="{ name: 'learn' }">
        ← {{ $t('student.space.back') }}
      </router-link>
      <div class="layout">
        <div class="main-column">
          <p class="space-label mt-5">{{ $t(`student.spaces.${space}.name`) }}</p>
          <h1 class="title is-3 is-size-4-mobile mt-3">
            {{ $t(`student.spaces.${space}.title`) }}
          </h1>
          <p class="subtitle is-6 mt-2">{{ $t(`student.spaces.${space}.description`) }}</p>
          <!-- keyed by space: each space starts from the thread, not from another space's inputs -->
          <component :is="ACTIVITIES[space]" :key="space" class="mt-5" />
        </div>
        <div class="side-column">
          <LearningThread />
          <nav class="other-spaces" aria-label="spaces">
            <router-link
              v-for="other in others"
              :key="other"
              class="other-space"
              :data-testid="`go-${other}`"
              :to="{ name: 'learn-space', params: { space: other } }"
              :style="{ '--tint': SPACE_COLOURS[other].tint }"
            >
              {{ $t(`student.spaces.${other}.name`) }} →
            </router-link>
          </nav>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.learn-page {
  height: 100%;
  overflow-y: auto;
}

.learn-content {
  flex: 1;
  width: 100%;
  max-width: 72rem;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
}

.back-link {
  font-size: 0.9rem;
}

.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 18rem;
  gap: 2rem;
}

.side-column {
  margin-top: 1.25rem;
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

.other-spaces {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.other-space {
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  background: var(--tint);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--neutral-90);
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .learn-content {
    padding: 1.5rem 1rem 2rem;
  }
}
</style>
