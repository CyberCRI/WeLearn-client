<script setup lang="ts">
import { ref } from 'vue';
import FirstStep from '@/components/tutor/FirstStep.vue';
import SecondStep from '@/components/tutor/SecondStep.vue';
import ThirdStep from '@/components/tutor/ThirdStep.vue';
import StepsIndicator from '@/components/tutor/StepsIndicator.vue';
import { useTutorStore, type TutorSearch } from '@/stores/tutor';

const store = useTutorStore();

const files: Ref<File[]> = ref([]);
const response: Ref<TutorSearch | null> = ref(null);
const syllabus = ref<string>('');
const step = ref(1);

const formData = new FormData();

const addFile = (e: any) => {
  formData.append('files', e.target.files[0]);
  files.value.push(e.target.files);
};

const handleSearch = async () => {
  response.value = null;

  if (!files.value.length) {
    return;
  }

  const resp = await store.retrieveTutorSearch(formData);

  response.value = resp;
  step.value = step.value + 1;
};

const setStep = (val) => {
  step.value = val;
};

const handleCreateSyllabus = async () => {
  const newSylalbus = await store.retrieveSyllabus();
  syllabus.value = newSylalbus.syllabus;
  step.value = step.value + 1;
};

const stepToAction = {
  1: handleSearch,
  2: handleCreateSyllabus
};

// TODO: add a modal with waiting info
// button to export syllabus
</script>
<template>
  <div class="content-centered-wrapper">
    <StepsIndicator :step="step" :setStep="setStep" :stepsLength="3" />
    <div class="layout-flex">
      <div class="flex-wrap" :class="{ shrink: step === 3 }">
        <FirstStep data-test="fist-step" :disabled="step > 1" v-if="step >= 1" :addFile="addFile" />
        <SecondStep
          data-test="second-step"
          :disabled="step > 2"
          :visible="step >= 2 && response"
          :sources="response ? response?.documents : null"
        />
      </div>
      <ThirdStep data-test="third-step" :visible="step >= 3 && syllabus" :syllabus="syllabus" />
    </div>
    <div class="actions">
      <button class="button" v-if="step > 1" @click="step = step - 1">previous</button>
      <button class="button" v-if="step < 3" @click="stepToAction[step]()">next</button>
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
</style>
