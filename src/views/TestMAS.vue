<script lang="ts" setup>
import SourcesList from '@/components/tutor/SecondStep.vue';
import UserInputMas from '@/components/MAS_tutor/userInputMas.vue';
import FeaturePresentation from '@/components/MAS_tutor/featurePresentation.vue';

import SyllabusMas from '@/components/MAS_tutor/SyllabusMas.vue';
import AddFileMas from '@/components/MAS_tutor/AddFileMas.vue';
import ExistingSyllabusData from '@/components/MAS_tutor/ExistingSyllabusData.vue';
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import { useMAsTutorStore } from '@/stores/mas_tutor';
import { computed, type Component } from 'vue';

const store = useMAsTutorStore();

interface ComponentMapping {
  introduction: Component;
  courseInformation: Component;
  search: Component;
  newSyllabus: Component;
  addFile: Component;
  syllabusData: Component;
}

const componentMapping: ComponentMapping = {
  introduction: FeaturePresentation,
  courseInformation: UserInputMas,
  search: SourcesList,
  newSyllabus: SyllabusMas,
  addFile: AddFileMas,
  syllabusData: ExistingSyllabusData
};

const CurrentVisibleStep = computed(() => {
  return componentMapping[store.currentStep];
});
</script>

<template>
  <div class="test-mas">
    <LoadingOverlay v-if="store.isLoading" />
    <header class="actions">
      <button class="button" @click="store.previousStepOnFlow()">previous</button>
      <button class="button" @click="store.nextStepOnFlow()">next</button>
    </header>
    <div class="body">
      <CurrentVisibleStep />
    </div>
  </div>
</template>

<style lang="css" scoped>
.test-mas {
  width: 100%;
  height: 100%;
}

.actions {
  display: flex;
  width: 100%;
  justify-content: center;
  gap: 2rem;
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
