<script setup lang="ts">
import { onMounted } from 'vue';
import ScratchWizard from '@/components/tutor/ScratchWizard.vue';
import ExistingCourseFlow from '@/components/tutor/ExistingCourseFlow.vue';
import PathChoice from '@/components/tutor/PathChoice.vue';
import GuestQuotaNotice from '@/components/GuestQuotaNotice.vue';
import AutoEvaluationStart from '@/components/learn/discipline/AutoEvaluationStart.vue';
import DraftResume from '@/components/tutor/draft/DraftResume.vue';
import { useTutorStore } from '@/stores/tutor';
import { useFeatureFlipStore } from '@/stores/featureFlip';
import { useSyllabusEvalStore } from '@/stores/syllabusEval';
import { useCourseDraftStore } from '@/stores/courseDraft';
import { downloadPendingSyllabus } from '@/utils/syllabusDownload';
import type { CoursePath } from '@/types';

const store = useTutorStore();
const evaluation = useSyllabusEvalStore();
// flag off, the page is the current syllabus creator and nothing else
const isSyllabusV2 = useFeatureFlipStore().isFeatureEnabled('syllabusV2');

const PATH_VIEWS: Record<CoursePath, typeof ScratchWizard | typeof ExistingCourseFlow> = {
  scratch: ScratchWizard,
  existing: ExistingCourseFlow
};

const draft = useCourseDraftStore();

onMounted(() => {
  // back from the login a guest started with the download button (never rejects)
  void downloadPendingSyllabus();
  // a draft kept in this browser is offered on the path question
  if (isSyllabusV2 && !store.path) draft.check();
});
</script>
<template>
  <ScratchWizard v-if="!isSyllabusV2" />
  <component :is="PATH_VIEWS[store.path]" v-else-if="store.path">
    <template #intro>
      <PathChoice
        :path="store.path"
        :hasStarted="store.hasStartedCourse"
        @reset="store.resetPath"
      />
    </template>
  </component>
  <!-- the first time only: where the teacher stands before using the tool -->
  <div v-else-if="evaluation.isPreDue" class="path-question" data-testid="syllabus-eval-start">
    <AutoEvaluationStart
      :answers="evaluation.preAnswers"
      :locked="false"
      :linkQuestion="$t('autoEvaluation.syllabus.linkQuestion')"
      nextLabel="next"
      :showBack="false"
      @start="evaluation.submitPre"
      @skip="evaluation.skipPre"
    />
  </div>
  <div v-else class="path-question">
    <!-- a guest sees what is left before choosing, as in the creator -->
    <GuestQuotaNotice feature="syllabus" class="mb-3" />
    <DraftResume />
    <PathChoice :path="null" :hasStarted="false" @choose="store.choosePath" />
  </div>
</template>

<style scoped>
.path-question {
  width: 100%;
  padding: 1rem 20%;
}

@media (max-width: 1024px) {
  .path-question {
    padding-inline: 10%;
  }
}

@media (max-width: 768px) {
  .path-question {
    padding-inline: 1rem;
  }
}
</style>
