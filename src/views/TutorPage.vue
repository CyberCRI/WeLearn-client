<script setup lang="ts">
import { ref } from 'vue';
import FirstStep from '@/components/tutor/FirstStep.vue';
import SecondStep from '@/components/tutor/SecondStep.vue';
import ThirdStep from '@/components/tutor/ThirdStep.vue';
import StepsIndicator from '@/components/tutor/StepsIndicator.vue';

const step = ref(1);
const setStep = (val) => {
  step.value = val;
};

const handleSearch = () => {
  console.log('handle search');
  step.value = step.value + 1;
};

const handleCreateSyllabus = () => {
  console.log('create syllabus');
  step.value = step.value + 1;
};

const stepToAction = {
  1: handleSearch,
  2: handleCreateSyllabus
};
</script>
<template>
  <div class="content-centered-wrapper">
    <StepsIndicator :step="step" :setStep="setStep" stepsLength="3" />
    <div class="layout-flex">
      <div class="flex-wrap" :class="{ shrink: step === 3 }">
        <FirstStep :disabled="step > 1" v-if="step >= 1" />
        <SecondStep :disabled="step > 2" :visible="step >= 2" />
      </div>
      <ThirdStep :visible="step >= 3" />
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
