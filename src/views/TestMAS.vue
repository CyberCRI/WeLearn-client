<script lang="ts" setup>
// TODO:
/*
make sure its responsive
check syllabus data
check references
*/

import SourcesList from '@/components/tutor/SecondStep.vue';
import { CreateSyllabusStepsId } from '@/types';
import UserInputMas from '@/components/MAS_tutor/userInputMas.vue';
import FeaturePresentation from '@/components/MAS_tutor/featurePresentation.vue';
import UserDataDisplay from '@/components/MAS_tutor/UserDataDisplay.vue';
import SyllabusMas from '@/components/MAS_tutor/SyllabusMas.vue';
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import { useMAsTutorStore } from '@/stores/mas_tutor';

const store = useMAsTutorStore();

// const loadingMessageMap: Record<string, string> = {
//   userData: 'loadingUserData',
//   search: 'searchingForSimilardocs',
//   syllabus: 'creatingSyllabus'
// };
</script>

<template>
  <div class="test-mas">
    <LoadingOverlay v-if="store.isLoading" />
    <div class="side-form">
      <UserInputMas @submit="store.setCourseMetadata" :fileHandler="store.addFile" />
    </div>

    <div class="body">
      <FeaturePresentation :id_number="1" />

      <div id="target-2">
        <UserDataDisplay
          :courseMetadaRef="store.courseMetadaRef"
          :summaries="store.summaries"
          :filesRef="store.filesRef"
          :hasUserInputData="store.hasUserInputData"
          :nextAction="
            () =>
              store.handleActionFromStep(
                store.hasSummaries
                  ? store.stepToActionMap[CreateSyllabusStepsId.search]
                  : store.stepToActionMap[CreateSyllabusStepsId.syllabus]
              )
          "
          :updateSummary="store.updateSummary"
        />
      </div>

      <div id="target-3">
        <SourcesList
          :id_number="3"
          v-if="store.searchResults.length > 0"
          data-test="second-step"
          :sources="store.searchResults"
          actionText="genSyllabus"
          :appendSource="store.appendSource"
          :selectedSources="store.selectedSources"
          :action="
            () => store.handleActionFromStep(store.stepToActionMap[CreateSyllabusStepsId.syllabus])
          "
        />
      </div>

      <div id="target-4">
        <SyllabusMas :syllabusData="store.syllabus" />
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.test-mas {
  display: flex;
  width: 100%;
  height: 100%;
}

.side-form {
  flex: 1;
  height: 100%;
  min-width: 350px;
  border-right: 1px solid var(--neutral-50);
  margin: 0 2rem;
  padding-top: 0.5rem;
  overflow-y: hidden;
}

.body {
  flex: 4;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  height: 100%;
  overflow-y: auto;
  padding: 2rem;
}
</style>
