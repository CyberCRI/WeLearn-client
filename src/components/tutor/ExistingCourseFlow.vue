<script setup lang="ts">
import { computed } from 'vue';
import i18n from '@/localisation/i18n';
import TutorStepsBar from '@/components/tutor/TutorStepsBar.vue';
import CourseUpload from '@/components/tutor/CourseUpload.vue';
import ReadingProgress from '@/components/tutor/ReadingProgress.vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import GuestQuotaNotice from '@/components/GuestQuotaNotice.vue';
import CourseReview from '@/components/tutor/review/CourseReview.vue';
import SustainabilityAdditions from '@/components/tutor/SustainabilityAdditions.vue';
import { useCourseStore } from '@/stores/course';

const SCREENS = ['course', 'check', 'additions', 'updated'] as const;

const { t } = i18n.global;
const stepLabels = computed(() => SCREENS.map((s) => t(`tutor.steps.${s}`)));

const course = useCourseStore();

const progressProps = computed(() => ({
  fileName: course.file?.name ?? '',
  phase: course.phase === 'reading' ? ('reading' as const) : ('sending' as const),
  uploadProgress: course.uploadProgress,
  startedAt: course.readingStartedAt
}));

// the confirmed course, folded: its title and what WeLearn will build on
const reviewRecap = computed(() => ({
  title: course.courseToUpdate.title || course.file?.name || '',
  topics: course.courseToUpdate.topics.length,
  objectives: course.courseToUpdate.objectives.length + course.courseToUpdate.competencies.length
}));
</script>
<template>
  <div class="content-centered-wrapper">
    <TutorStepsBar :labels="stepLabels" :step="course.step" @select="course.setStep" />
    <div class="layout-flex">
      <slot name="intro" />
      <GuestQuotaNotice feature="syllabus" class="mb-3" />

      <section id="target-1" class="step-section">
        <ReadingProgress
          v-if="course.isReading && course.step === 1"
          v-bind="progressProps"
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

      <section v-if="course.step >= 2 && course.reading" id="target-2" class="step-section">
        <!-- one course of several being read again -->
        <ReadingProgress
          v-if="course.isReading"
          v-bind="progressProps"
          @cancel="course.cancelReading"
        />
        <CourseReview v-else-if="course.step === 2" />
        <div v-else class="recap" data-testid="review-recap">
          <span>
            <span class="file-name">{{ reviewRecap.title }}</span>
            <span class="muted">
              {{ $t('tutor.check.recapTopics', reviewRecap.topics) }} ·
              {{ $t('tutor.check.recap', reviewRecap.objectives) }}
            </span>
          </span>
          <ButtonComponent is-discreet class="is-small" @click="course.setStep(2)">
            {{ $t('tutor.edit') }}
          </ButtonComponent>
        </div>
      </section>

      <section v-if="course.step === 3" id="target-3" class="step-section">
        <SustainabilityAdditions />
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

.muted {
  margin-left: 0.5rem;
  font-size: 0.85rem;
  color: var(--neutral-70);
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
