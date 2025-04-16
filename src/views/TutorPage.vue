<script setup lang="ts">
import { ref, type Ref } from 'vue';
import FirstStep from '@/components/tutor/FirstStep.vue';
import SecondStep from '@/components/tutor/SecondStep.vue';
import ThirdStep from '@/components/tutor/ThirdStep.vue';
import StepsIndicator from '@/components/tutor/StepsIndicator.vue';
import ModalWrapper from '@/components/ModalWrapper.vue';
import { useTutorStore, type TutorSearch } from '@/stores/tutor';
import { convertMarkdownToDocx, downloadDocx } from '@/utils/md-to-docx';
import i18n from '@/localisation/i18n';
const store = useTutorStore();

const files: Ref<File[]> = ref([]);
const response: Ref<TutorSearch | null> = ref(null);
const syllabus = ref<[]>([]);
const step = ref(1);
const isLoading = ref(false);
const searchError = ref(false);

const formData = new FormData();

const addFile = (e: any) => {
  if (e.target.files[0].size > 5 * 1024 * 1024) {
    alert(i18n.global.t('tutor.fileSizeExceeded'));
    return;
  }
  searchError.value = false;
  formData.append('files', e.target.files[0]);
  files.value.push(e.target.files);
};

const handleSearch = async () => {
  response.value = null;
  searchError.value = false;

  if (!files.value.length) {
    return;
  }
  isLoading.value = true;

  try {
    const resp = await store.retrieveTutorSearch(formData);
    response.value = resp;
  } catch (error) {
    isLoading.value = false;
    response.value = { documents: [] };
    searchError.value = true;
    return;
  } finally {
    isLoading.value = false;
  }

  step.value = step.value + 1;
};

const setStep = (val) => {
  step.value = val;
};

const handleCreateSyllabus = async () => {
  isLoading.value = true;
  const newSylalbus = await store.retrieveSyllabus();
  isLoading.value = false;
  syllabus.value = newSylalbus.syllabus;

  step.value = step.value + 1;
};

const loaderI18nPathText = {
  1: {
    title: 'tutor.loading.search.title',
    description: 'tutor.loading.search.description'
  },
  2: {
    title: 'tutor.loading.syllabus.title',
    description: 'tutor.loading.syllabus.description'
  }
};

const handleDownload = async () => {
  const blob = await convertMarkdownToDocx(syllabus.value[2].content);
  downloadDocx(blob, 'syllabus.docx');
};

const stepToAction = {
  1: handleSearch,
  2: handleCreateSyllabus,
  3: handleDownload
};
</script>
<template>
  <div class="content-centered-wrapper">
    <StepsIndicator :step="step" :setStep="setStep" :stepsLength="3" />

    <ModalWrapper v-if="isLoading" :isOpen="isLoading">
      <div class="box loading-modal">
        <h1 class="title is-size-4 has-text-centered">
          {{ $t(loaderI18nPathText[step]?.title) }}
        </h1>
        <progress class="progress is-large is-primary mb-6" max="100">60%</progress>
        <p class="loader-text is-title is-size-5">{{ $t('tutor.loading.wait') }}</p>
        <p class="loader-text is-title is-size-5">
          {{ $t(loaderI18nPathText[step]?.description) }}
        </p>
      </div>
    </ModalWrapper>
    <div class="layout-flex">
      <div class="flex-wrap" :class="{ shrink: step === 3 }">
        <FirstStep
          :searchError="searchError"
          data-test="fist-step"
          :disabled="step > 1"
          v-if="step >= 1"
          :addFile="addFile"
        />
        <SecondStep
          data-test="second-step"
          :disabled="step > 2"
          :visible="step >= 2 && !!response"
          :sources="response ? response?.documents : null"
        />
      </div>
      <ThirdStep data-test="third-step" :visible="step >= 3 && !!syllabus" :syllabus="syllabus" />
    </div>
    <div class="actions">
      <button class="button" v-if="step > 1" @click="step = step - 1">{{ $t('previous') }}</button>
      <button class="button" v-if="step <= 3" @click="stepToAction[step]()">
        {{ step < 3 ? $t('next') : $t('download') }}
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
