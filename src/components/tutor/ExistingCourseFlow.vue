<script setup lang="ts">
import { computed } from 'vue';
import i18n from '@/localisation/i18n';
import TutorStepsBar from '@/components/tutor/TutorStepsBar.vue';
import CourseUpload from '@/components/tutor/CourseUpload.vue';
import ReadingProgress from '@/components/tutor/ReadingProgress.vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import GuestQuotaNotice from '@/components/GuestQuotaNotice.vue';
import { useCourseStore } from '@/stores/course';

// syllabus v2, "I have a course": screen 1 reads the teacher's syllabus (SY-09); the next
// screens come with SY-10 → SY-17
const SCREENS = ['course', 'check', 'additions', 'updated'] as const;

const { t } = i18n.global;
const stepLabels = computed(() => SCREENS.map((s) => t(`tutor.steps.${s}`)));

const course = useCourseStore();
</script>
<template>
  <div class="content-centered-wrapper">
    <TutorStepsBar :labels="stepLabels" :step="course.step" />
    <div class="layout-flex">
      <slot name="intro" />
      <GuestQuotaNotice feature="syllabus" class="mb-3" />

      <section id="target-1" class="step-section">
        <ReadingProgress
          v-if="course.isReading && course.file"
          :fileName="course.file.name"
          :phase="course.phase === 'reading' ? 'reading' : 'sending'"
          :uploadProgress="course.uploadProgress"
          :startedAt="course.readingStartedAt"
          @cancel="course.cancelReading"
        />
        <CourseUpload
          v-else-if="course.step === 1"
          :file="course.file"
          :fileError="course.fileError"
          :language="course.language"
          :readError="course.readError"
          :setFile="course.setFile"
          :removeFile="course.removeFile"
          :selectLanguage="course.selectLanguage"
          :action="course.readCourse"
        />
        <div v-else class="recap" data-testid="course-recap">
          <span class="file-name">{{ course.file?.name }}</span>
          <ButtonComponent is-discreet class="is-small" @click="course.setStep(1)">
            {{ $t('tutor.edit') }}
          </ButtonComponent>
        </div>
      </section>

      <section v-if="course.step === 2 && course.reading" id="target-2" class="step-section">
        <h1 class="title is-4 is-size-5-mobile">{{ $t('tutor.steps.check') }}</h1>
        <p
          v-if="course.reading.reading.title"
          class="has-text-weight-semibold"
          data-testid="read-title"
        >
          {{ course.reading.reading.title }}
        </p>
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

.recap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--neutral-20);
  border-radius: 0.5rem;
}

.file-name {
  overflow: hidden;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
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
