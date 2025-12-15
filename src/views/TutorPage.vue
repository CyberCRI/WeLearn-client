<script setup lang="ts">
import { computed } from 'vue';
import ColumnTemplate from '@/components/ColumnTemplate.vue';
import CursusInfo from '@/components/tutor/FirstStep.vue';
import SummariesStep from '@/components/tutor/SummariesStep.vue';
import SourcesList from '@/components/tutor/SecondStep.vue';
import EditableSyllabus from '@/components/tutor/ThirdStep.vue';
import StepsIndicator from '@/components/tutor/StepsIndicator.vue';
import ModalWrapper from '@/components/ModalWrapper.vue';
import ErrorComponent from '@/components/ErrorComponent.vue';
import ErrorDocumentIcon from '@/components/icons/ErrorDocumentIcon.vue';
// import CheckIcon from '@/components/icons/CheckIcon.vue';
import { useTutorStore } from '@/stores/tutor';

const store = useTutorStore();

const getI18nText = computed(() => {
  if (store.step === 1) {
    return {
      title: 'tutor.loading.search.title',
      description: 'tutor.loading.search.description'
    };
  }
  return {
    title: 'tutor.loading.syllabus.title',
    description: 'tutor.loading.syllabus.description'
  };
});

const nextButtonText = ['next', 'search', 'genSyllabus', 'download'];

const stepToAction: Record<0 | 1 | 2 | 3, () => Promise<void>> = {
  1: store.handleSummaryFiles,
  2: store.retrieveTutorSearch,
  3: store.handleCreateSyllabus,
  4: store.handleDownloadSyllabus
};
</script>
<template>
  <div class="content-centered-wrapper">
    <div class="is-flex is-justify-content-center is-align-items-center">
      <p class="subtitle has-text-weight-bold is-5 mr-4 my-auto">Syllabus steps:</p>

      <StepsIndicator
        :step="store.step"
        :setStep="store.setStep"
        :advancement="store.step"
        :stepsLength="4"
      />
    </div>
    <ErrorComponent v-if="store.reloadError" />

    <ModalWrapper v-if="store.isLoading" :isOpen="store.isLoading" :onClose="() => {}">
      <div v-if="store.shouldRetryAction" class="box">
        <div
          class="is-flex is-flex-direction-column is-align-items-center is-justify-content-center"
        >
          <h1 class="title is-size-4 has-text-centered">
            <span class="mr-4"><ErrorDocumentIcon /></span>
            {{ $t('tutor.retry.title') }}
          </h1>

          <p class="loader-text is-title is-size-4 mx-6 px-6">
            {{ $t('tutor.retry.description') }}
          </p>
          <button
            data-testid="tutor-back-button"
            class="button mt-6"
            @click="stepToAction[store.step]()"
          >
            {{ $t('tutor.retry.button') }}
          </button>
          <button data-testid="tutor-back-button" class="button mt-6" @click="store.stopAction()">
            {{ $t('tutor.retry.stop') }}
          </button>
        </div>
      </div>
      <div v-else class="box loading-modal">
        <h1 class="title is-size-4 has-text-centered">
          {{ $t(getI18nText.title) }}
        </h1>
        <progress class="progress is-large is-primary mb-6" max="100">60%</progress>
        <p class="loader-text is-title is-size-5">{{ $t('tutor.loading.wait') }}</p>
        <p class="loader-text is-title is-size-5">
          {{ $t(getI18nText.description) }}
        </p>
      </div>
    </ModalWrapper>
    <div class="layout-flex">
      <CursusInfo
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
        :action="stepToAction[3]"
        actionText="genSyllabus"
      />
      <EditableSyllabus
        v-if="store.step >= 3"
        :disabled="store.step < 4"
        data-test="third-step"
        :syllabus="store.syllabi"
        :updateSyllabus="store.updateSyllabus"
        :giveFeedback="store.giveFeedback"
        :action="stepToAction[4]"
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

.box {
  overflow: auto;
  width: 100%;
  margin: auto;
}

.content {
  height: 100%;
  width: 80%;
}

.actions {
  display: flex;
  gap: 1rem;
}

.layout-flex {
  width: 100%;
  overflow-y: auto;
  padding: 1rem 20%;
}

.flex-wrap {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 100%;
}

.flex-wrap.shrink {
  flex-grow: 0.7;
  flex-basis: 10%;
  & > * {
    flex-basis: 100%;
    transition: flex-grow 0s;
  }
}

.loading-modal {
  padding: 2rem;
  width: 100%;
  height: 100%;
}

.loader-text {
  text-align: center;
}
</style>
