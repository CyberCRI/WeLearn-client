<script setup lang="ts">
import { computed } from 'vue';
import FirstStep from '@/components/tutor/FirstStep.vue';
import SecondStep from '@/components/tutor/SecondStep.vue';
import ThirdStep from '@/components/tutor/ThirdStep.vue';
import StepsIndicator from '@/components/tutor/StepsIndicator.vue';
import ModalWrapper from '@/components/ModalWrapper.vue';
import ErrorComponent from '@/components/ErrorComponent.vue';
import ErrorDocumentIcon from '@/components/icons/ErrorDocumentIcon.vue';
import CheckIcon from '@/components/icons/CheckIcon.vue';
import { useTutorStore } from '@/stores/tutor';

const store = useTutorStore();

const vFocus = {
  mounted: (el) => el.focus()
};

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

const nextButtonText = ['next', 'genSyllabus', 'download'];

const stepToAction: Record<0 | 1 | 2 | 3, () => Promise<void>> = {
  1: store.handleSummaryFiles,
  2: store.handleSearch,
  3: store.handleCreateSyllabus,
  4: store.handleDownloadSyllabus
};

const handleValidate = (index: number) => {
  const summary = document.getElementsByTagName('textarea')[index];
  summary.disabled = !summary.disabled;
  summary.style.backgroundColor = summary.disabled ? 'var(--neutral-10)' : 'var(--neutral-0)';
  const action = summary.nextSibling.getElementsByTagName('button')[0];
  action.style.color = summary.disabled ? 'green' : 'black';
};

// TODO: use button to make summary editable
// TODO: use button to validate summary --> make it required to go to the next step
// TODO: send edited summaries to the search request
// TODO: Move summary step to a independent component
// figma URL : https://www.figma.com/design/VU4kFsVKJDOMt3PXwn6Jtj/welearn?node-id=452-2032&t=UKKyq5sAsGyr5Qe0-4
</script>
<template>
  <div class="content-centered-wrapper">
    <StepsIndicator
      :step="store.step"
      :setStep="store.setStep"
      :advancement="store.syllabi?.content.length ? 3 : store.tutorSearch ? 2 : 1"
      :stepsLength="3"
    />
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
      <div class="flex-wrap" :class="{ shrink: store.step === 3 }">
        <FirstStep
          :searchError="store.hasSearchError"
          :fileError="store.fileError"
          v-model:courseTitle="store.courseTitle"
          v-model:level="store.level"
          v-model:duration="store.duration"
          v-model:description="store.description"
          data-test="fist-step"
          :disabled="store.step > 1"
          v-if="store.step === 1"
          :addFile="store.addFile"
          :removeFile="store.removeFile"
        />
        <div class="summaries-section" v-if="store.step >= 2">
          <h2 class="title is-4 mt-4">
            {{ $t('tutor.secondStep.summariesTitle') }}
          </h2>
          <p class="subtitle is-6">
            {{ $t('tutor.secondStep.summariesDescription') }}
          </p>
          <div
            id="summaries"
            class="box"
            :key="index"
            v-for="(summary, index) in store.summaries.summaries"
          >
            <h2 class="title is-6 mt-4">
              {{
                Object.values(store.newFilesToSearch)[index]?.name ||
                $t('tutor.secondStep.noFileName')
              }}
            </h2>
            <div class="is-flex">
              <textarea v-focus class="input summary" v-model="store.summaries.summaries[index]" />
              <div class="mt-2 ml-2">
                <button class="button is-white" @click="handleValidate(index)">
                  <span class="icon is-small">
                    <CheckIcon />
                  </span>
                  <span>validate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <SecondStep
          data-test="second-step"
          :disabled="store.step > 3"
          :visible="store.step >= 3 && !!store.tutorSearch"
          :sources="store.tutorSearch?.documents"
          :appendSource="store.appendSource"
          :selectedSources="store.selectedSources"
        />
      </div>
      <ThirdStep
        data-test="third-step"
        :visible="store.step >= 4 && !!store.syllabi?.content"
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

<style scoped>
.content-centered-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 2rem;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.box {
  overflow: auto;
  width: 100%;
  margin: auto;
}
.summaries-section {
  height: 70vh;
  overflow-y: scroll;
  width: 100%;
}

.summary {
  width: 80%;
  min-height: 200px;
  height: auto;
  resize: none;
  margin-top: 0.5rem;
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
  display: flex;
  gap: 2rem;
  max-height: 85%;
  padding: 1rem 0rem;
}

.flex-wrap {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  min-width: 20%;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 100%;
  transition: flex-grow 0s;
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
