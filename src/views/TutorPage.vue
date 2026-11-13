<script setup lang="ts">
import { onMounted } from 'vue';
import ScratchWizard from '@/components/tutor/ScratchWizard.vue';
import ExistingCourseFlow from '@/components/tutor/ExistingCourseFlow.vue';
import PathChoice from '@/components/tutor/PathChoice.vue';
import GuestQuotaNotice from '@/components/GuestQuotaNotice.vue';
import { useTutorStore } from '@/stores/tutor';
import { useFeatureFlipStore } from '@/stores/featureFlip';
import type { CoursePath } from '@/types';

const store = useTutorStore();
// flag off, the page is the current syllabus creator and nothing else
const isSyllabusV2 = useFeatureFlipStore().isFeatureEnabled('syllabusV2');

const PATH_VIEWS: Record<CoursePath, typeof ScratchWizard | typeof ExistingCourseFlow> = {
  scratch: ScratchWizard,
  existing: ExistingCourseFlow
};

onMounted(() => {
  // back from the login a guest started with the download button (never rejects)
  void store.downloadPendingSyllabus();
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
  <div v-else class="path-question">
    <!-- a guest sees what is left before choosing, as in the creator -->
    <GuestQuotaNotice feature="syllabus" class="mb-3" />
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
