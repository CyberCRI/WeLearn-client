<script setup lang="ts">
import { computed } from 'vue';
import FirstStep from '@/components/tutor/FirstStep.vue';
import SecondStep from '@/components/tutor/SecondStep.vue';
import ThirdStep from '@/components/tutor/ThirdStep.vue';
import StepsIndicator from '@/components/tutor/StepsIndicator.vue';
import ModalWrapper from '@/components/ModalWrapper.vue';
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

const stepToAction = {
  1: store.handleSearch,
  2: store.handleCreateSyllabus,
  3: store.handleDownloadSyllabus
};
</script>
<template>
  <div class="content-centered-wrapper">
    <StepsIndicator
      :step="store.step"
      :setStep="setStep"
      :advancement="store.syllabi?.content.length ? 3 : store.tutorSearch ? 2 : 1"
      :stepsLength="3"
    />

    <ModalWrapper v-if="store.isLoading" :isOpen="store.isLoading" :onClose="() => {}">
      <div class="box loading-modal">
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
          data-test="fist-step"
          :disabled="store.step > 1"
          v-if="store.step >= 1"
          :addFile="store.addFile"
          :removeFile="store.removeFile"
        />
        <SecondStep
          data-test="second-step"
          :disabled="store.step > 2"
          :visible="store.step >= 2 && !!store.tutorSearch"
          :sources="store.tutorSearch ? store.tutorSearch?.documents : null"
        />
      </div>
      <ThirdStep
        data-test="third-step"
        :visible="store.step >= 3 && !!store.syllabi.content"
        :syllabus="store.syllabi"
        :giveFeedback="store.giveFeedback"
      />
    </div>
    <div class="actions">
      <button class="button" v-if="store.step > 1" @click="sotre.goBack">
        {{ $t('previous') }}
      </button>
      <button class="button" v-if="store.step <= 3" @click="stepToAction[store.step]()">
        {{ store.step < 3 ? $t('next') : $t('download') }}
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
  overflow: hidden;
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
  widh: 100%;
  height: 100%;
}

.loader-text {
  text-align: center;
}
</style>
