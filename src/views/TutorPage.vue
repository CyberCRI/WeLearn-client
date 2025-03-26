<script setup lang="ts">
import { ref } from 'vue';
import FirstStep from '@/components/tutor/FirstStep.vue';
import SecondStep from '@/components/tutor/SecondStep.vue';
import ThirdStep from '@/components/tutor/ThirdStep.vue';
import StepsIndicator from '@/components/tutor/StepsIndicator.vue';

const step = ref(1);
</script>
<template>
  <div class="content-centered-wrapper">
    <!-- Three steps page 
first step: input to add files short form
second step: shows search result and allows to select the sources of interes
third step: show the syllabus produced by the agents
-->
    <StepsIndicator :step="step" stepsLength="3" />
    <div class="layout-flex">
      <div class="flex-wrap" :class="{ shrink: step === 3 }">
        <FirstStep :disabled="step > 1" v-if="step >= 1" />
        <SecondStep :disabled="step > 2" :visible="step >= 2" />
      </div>
      <ThirdStep :visible="step >= 3" />
    </div>
    <div class="actions">
      <button class="button" v-if="step > 1" @click="step = step - 1">previous</button>
      <button class="button" v-if="step < 3" @click="step = step + 1">next</button>
    </div>
  </div>
</template>

<style scoped>
.content-centered-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
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
  max-height: 80%;
}

.flex-wrap {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  min-width: 20%;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0;
  transition: flex-grow 1.5s;
}

.flex-wrap.shrink {
  flex-grow: 0.5;
}
</style>
