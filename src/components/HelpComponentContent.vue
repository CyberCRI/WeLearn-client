<script setup lang="ts">
import { ref, watchEffect } from 'vue';
const props = defineProps<{
  stepsContent?: Record<string, string>[];
  modalState: boolean;
}>();
const step = ref<number>(1);
watchEffect(() => {
  if (props.modalState) {
    step.value = 1;
  }
});
const totalSteps = ref(props.stepsContent?.length);
</script>
<template>
  <div
    class="box is-flex is-align-items-center is-justify-content-space-between help-content-wrapper"
  >
    <div class="btns">
      <button
        class="button is-secondary"
        @click="step = step - 1"
        v-if="totalSteps > 1 && step > 1"
      >
        {{ $t('<') }}
      </button>
    </div>
    <div
      class="step-content"
      v-for="(content, index) in stepsContent"
      :key="index"
      v-show="step === index + 1"
    >
      <div class="step-content is-flex is-flex-direction-column is-gap-10 is-align-items-center">
        <p class="title" v-if="content.title">{{ $t(content.title) }}</p>
        <p class="subtitle" v-if="content.description">{{ $t(content.description) }}</p>
        <img v-if="content.image" :src="content.image" alt="Step image" class="step-image" />
      </div>
    </div>

    <div class="btns">
      <button
        class="button is-secondary"
        @click="step = step + 1"
        v-if="totalSteps > 1 && step < totalSteps"
      >
        >
      </button>
    </div>
  </div>
</template>
<style scoped>
.help-content-wrapper {
  width: 100%;
  height: 500px;
  margin: auto;
}

.btns {
  min-width: 50px;
}

.step-content {
  height: 100%;
  gap: 100px;
}
</style>
