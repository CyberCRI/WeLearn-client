<script setup lang="ts">
import { computed } from 'vue';
import i18n from '@/localisation/i18n';
import TutorStepsBar from '@/components/tutor/TutorStepsBar.vue';
import CourseUpload from '@/components/tutor/CourseUpload.vue';
import ReadingProgress from '@/components/tutor/ReadingProgress.vue';
import GuestQuotaNotice from '@/components/GuestQuotaNotice.vue';
import CourseReview from '@/components/tutor/review/CourseReview.vue';
import SustainabilityAdditions from '@/components/tutor/SustainabilityAdditions.vue';
import UpdatedSyllabus from '@/components/tutor/updated/UpdatedSyllabus.vue';
import StepRecap from '@/components/tutor/StepRecap.vue';
import DraftControl from '@/components/tutor/draft/DraftControl.vue';
import { useConnectionsStore } from '@/stores/connections';
import { useCourseStore } from '@/stores/course';
import { useCourseDraftStore } from '@/stores/courseDraft';

const SCREENS = ['course', 'check', 'additions', 'updated'] as const;

const { t } = i18n.global;
const stepLabels = computed(() => SCREENS.map((s) => t(`tutor.steps.${s}`)));

const course = useCourseStore();
const connections = useConnectionsStore();
const draft = useCourseDraftStore();

const progressProps = computed(() => ({
  fileName: course.file?.name ?? '',
  phase: course.phase === 'reading' ? ('reading' as const) : ('sending' as const),
  uploadProgress: course.uploadProgress,
  startedAt: course.readingStartedAt
}));

// the confirmed course, folded: its title and what WeLearn will build on
const reviewRecap = computed(() => ({
  title: course.courseToUpdate.title || course.fileName || '',
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
        <StepRecap
          v-else
          :title="course.fileName ?? undefined"
          data-testid="course-recap"
          @edit="course.setStep(1)"
        />
      </section>

      <section v-if="course.step >= 2 && course.reading" id="target-2" class="step-section">
        <!-- one course of several being read again -->
        <ReadingProgress
          v-if="course.isReading"
          v-bind="progressProps"
          @cancel="course.cancelReading"
        />
        <CourseReview v-else-if="course.step === 2" />
        <StepRecap
          v-else
          :title="reviewRecap.title"
          :details="`${$t('tutor.check.recapTopics', reviewRecap.topics)} · ${$t('tutor.check.recap', reviewRecap.objectives)}`"
          data-testid="review-recap"
          @edit="course.setStep(2)"
        />
      </section>

      <section v-if="course.step >= 3 && course.reading" id="target-3" class="step-section">
        <SustainabilityAdditions v-if="course.step === 3" />
        <StepRecap
          v-else
          :details="`${$t('tutor.additions.selectedCount', connections.selectedConnections.length)} · ${$t('tutor.additions.acceptedCount', connections.acceptedChanges.length)}`"
          data-testid="additions-recap"
          @edit="course.setStep(3)"
        />
      </section>

      <section v-if="course.step === 4 && course.reading" id="target-4" class="step-section">
        <UpdatedSyllabus />
      </section>

      <DraftControl v-if="draft.isSavable" />
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
