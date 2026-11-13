<script setup lang="ts">
import { computed } from 'vue';
import i18n from '@/localisation/i18n';
import TutorStepsBar from '@/components/tutor/TutorStepsBar.vue';

// syllabus v2, "I have a course": an empty shell for now, its screens come with SY-09 → SY-17
const SCREENS = ['course', 'check', 'additions', 'updated'] as const;

const { t } = i18n.global;
const stepLabels = computed(() => SCREENS.map((s) => t(`tutor.steps.${s}`)));
</script>
<template>
  <div class="content-centered-wrapper">
    <TutorStepsBar :labels="stepLabels" :step="1" />
    <div class="layout-flex">
      <slot name="intro" />
      <section id="target-1" class="step-section">
        <h1 class="title is-4 is-size-5-mobile">{{ $t('tutor.steps.course') }}</h1>
        <p class="subtitle is-6">{{ $t('tutor.existingCourse.comingSoon') }}</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.content-centered-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  overflow: hidden;
}

.layout-flex {
  width: 100%;
  overflow-y: auto;
  padding: 1rem 20%;
}

.step-section {
  padding: 1.5rem 0;
}

@media (max-width: 1024px) {
  .layout-flex {
    padding-inline: 10%;
  }
}

@media (max-width: 768px) {
  .layout-flex {
    padding-inline: 1rem;
  }
}
</style>
