<script setup lang="ts">
import { computed } from 'vue';
import ColumnTemplate from '@/components/ColumnTemplate.vue';
import FirstStep from '@/components/tutor/FirstStep.vue';
import SummariesStep from '@/components/tutor/SummariesStep.vue';
import SecondStep from '@/components/tutor/SecondStep.vue';
import ThirdStep from '@/components/tutor/ThirdStep.vue';
import StepsIndicator from '@/components/tutor/StepsIndicator.vue';
import ModalWrapper from '@/components/ModalWrapper.vue';
import ErrorComponent from '@/components/ErrorComponent.vue';
<<<<<<< HEAD
import ErrorDocumentIcon from '@/components/icons/ErrorDocumentIcon.vue';
import CheckIcon from '@/components/icons/CheckIcon.vue';
||||||| parent of 4780a21 (wip)
import CheckIcon from '@/components/icons/CheckIcon.vue';
=======
>>>>>>> 4780a21 (wip)
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
  <ColumnTemplate>
    <template #left-panel>
      <div class="content-centered-wrapper">
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
          <FirstStep
            :searchError="store.hasSearchError"
            :fileError="store.fileError"
            v-model:courseTitle="store.courseTitle"
            v-model:level="store.level"
            v-model:duration="store.duration"
            v-model:description="store.description"
            data-test="fist-step"
            :addFile="store.addFile"
            :removeFile="store.removeFile"
          />
          <SummariesStep
            :updateSummary="store.updateSummary"
            :summaries="store.summaries"
            :files="store.newFilesToSearch"
          />
          <SecondStep
            data-test="second-step"
            :disabled="store.step > 3"
            :sources="store.tutorSearch?.documents"
            :appendSource="store.appendSource"
            :selectedSources="store.selectedSources"
          />
          <ThirdStep
            data-test="third-step"
            :syllabus="store.syllabi"
            :giveFeedback="store.giveFeedback"
          />
        </div>
        <div class="actions">
          <button
            data-testid="tutor-back-button"
            class="button"
            v-if="store.step > 1"
            @click="store.goBack"
          >
            {{ $t('back') }}
          </button>
          <button
            class="button"
            data-testid="tutor-next-button"
            v-if="store.step <= 3"
            @click="stepToAction[store.step as 1 | 2 | 3]()"
          >
            {{ $t(nextButtonText[store.step - 1]) }}
          </button>
        </div>
      </div>
    </template>
    <template #right-panel>
      <StepsIndicator
        :step="store.step"
        :setStep="store.setStep"
        :advancement="store.syllabi?.content.length ? 3 : store.tutorSearch ? 2 : 1"
        :stepsLength="3"
      />
    </template>
  </ColumnTemplate>
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
  overflow-y: auto;
  padding: 1rem 10%;
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
