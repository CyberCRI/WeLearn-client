<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import CursusInfo from '@/components/tutor/CursusInfo.vue';
import SummariesStep from '@/components/tutor/SummariesStep.vue';
import OpenDatasetsIdeas from '@/components/tutor/OpenDatasetsIdeas.vue';
import SourcesList from '@/components/tutor/SecondStep.vue';
import EditableSyllabus from '@/components/tutor/ThirdStep.vue';
import StepsIndicator from '@/components/tutor/StepsIndicator.vue';
import ChevronDown from '@/components/icons/ChevronDown.vue';
import ErrorComponent from '@/components/ErrorComponent.vue';
import { useTutorStore } from '@/stores/tutor';
import StatusModal from '@/components/tutor/StatusModal.vue';
import { scrollToAnchor } from '@/utils/navigation';

const store = useTutorStore();
const selectedSuggestionIds = ref<string[]>([]);

const toggleSuggestionSelection = (datasetId: string) => {
  const isAlreadySelected = selectedSuggestionIds.value.includes(datasetId);

  if (isAlreadySelected) {
    selectedSuggestionIds.value = selectedSuggestionIds.value.filter((id) => id !== datasetId);
    return;
  }

  selectedSuggestionIds.value = [...selectedSuggestionIds.value, datasetId];
};

const getI18nText = computed(() => {
  // switch case for step 1, 2, 3
  switch (store.step) {
    case 1:
      return {
        title: 'tutor.loading.extract.title',
        description: 'tutor.loading.extract.description'
      };
    case 2:
      return {
        title: 'tutor.loading.search.title',
        description: 'tutor.loading.search.description'
      };
    case 3:
      return {
        title: 'tutor.loading.syllabus.title',
        description: 'tutor.loading.syllabus.description'
      };
    default:
      return {
        title: 'tutor.loading.default.title',
        description: 'tutor.loading.default.description'
      };
  }
});

const stepToAction: Record<1 | 2 | 3 | 4, (arg?: any) => Promise<void>> = {
  1: store.handleSummaryFiles,
  2: store.retrieveTutorSearch,
  3: store.handleCreateSyllabus,
  4: store.handleDownloadSyllabus
};

onMounted(() => {
  scrollToAnchor(`target-${store.step}`);
});
</script>
<template>
  <div class="content-centered-wrapper">
    <div class="is-flex is-flex-wrap-wrap is-justify-content-center is-align-items-center mt-4">
      <p class="subtitle has-text-weight-bold is-5 is-size-6-mobile mr-4 my-auto">
        {{ $t('tutor.syllabusSteps') }}
      </p>

      <StepsIndicator
        :step="store.step"
        :setStep="store.setStep"
        :advancement="store.step"
        :stepsLength="4"
      />
    </div>
    <ErrorComponent v-if="store.reloadError" />
    <StatusModal
      :isLoading="store.isLoading"
      :shouldRetryAction="store.shouldRetryAction"
      :action="stepToAction[store.step]"
      :stopAction="store.stopAction"
      :title="$t(getI18nText.title)"
      :description="$t(getI18nText.description)"
    />

    <div class="layout-flex">
      <CursusInfo
        :selectLang="store.selectSyllabusLanguage"
        :storedLanguage="store.syllabusLanguage"
        :searchError="store.hasSearchError"
        :fileError="store.fileError"
        v-model:courseTitle="store.courseTitle"
        v-model:level="store.level"
        v-model:duration="store.duration"
        v-model:description="store.description"
        data-test="fist-step"
        :addFile="store.addFile"
        :removeFile="store.removeFile"
        :action="stepToAction[1]"
        actionText="next"
      />
      <SummariesStep
        :updateSummary="store.updateSummary"
        :summaries="store.summaries"
        :files="store.newFilesToSearch"
        :action="stepToAction[2]"
        :disabled="store.step < 2"
        actionText="search"
      />
      <SourcesList
        v-if="store.step >= 2"
        data-test="second-step"
        :disabled="store.step < 3"
        :sources="store.tutorSearch?.documents"
        :appendSource="store.appendSource"
        :selectedSources="store.selectedSources"
      />
      <OpenDatasetsIdeas
        v-if="store.step >= 3"
        :summaries="store.summaries"
        :selectedSuggestionIds="selectedSuggestionIds"
        :toggleSuggestionSelection="toggleSuggestionSelection"
      />
      <div v-if="store.step === 3" class="is-flex is-justify-content-end mt-4">
        <a class="button is-primary" href="#" @click="stepToAction[3]()">
          <ChevronDown />
          {{ $t('genSyllabus') }}
        </a>
      </div>
      <EditableSyllabus
        v-if="store.step >= 3"
        :disabled="store.step < 4"
        data-test="third-step"
        :syllabus="store.syllabi"
        :updateSyllabus="store.updateSyllabus"
        :giveFeedback="store.giveFeedback"
        :action="stepToAction[4]"
        :restart="store.restart"
        :updateSyllabusInDB="store.updateSyllabusInDB"
      />
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

@media screen and (max-width: 1024px) {
  .layout-flex {
    padding-inline: 10%;
  }
}

@media screen and (max-width: 768px) {
  .layout-flex {
    padding-inline: 5%;
  }
}
</style>
