<script setup lang="ts">
import { ref, watchEffect, computed } from 'vue';
const props = defineProps<{
  stepsContent?: Record<string, string>[];
  modalState: boolean;
  toggleModal: () => void;
}>();
const step = ref<number>(1);
watchEffect(() => {
  if (props.modalState) {
    step.value = 1;
  }
});
const totalSteps = computed(() => props.stepsContent?.length || 0);

const handleNext = () => {
  if (step.value < totalSteps.value) {
    step.value += 1;
  } else {
    props.toggleModal();
  }
};
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
      <div class="step-content-items">
        <p class="subtitle">{{ `${step} / ${totalSteps}` }}</p>
        <p class="title" v-if="content.title">{{ $t(content.title) }}</p>
        <div class="subtitle-image-wrapper px-6">
          <p class="subtitle" v-if="content.description">{{ $t(content.description) }}</p>
          <img
            v-if="content.image"
            :src="`src/assets/${$t(content.image)}`"
            alt="Step image"
            class="step-image mx-auto"
          />
        </div>
      </div>
    </div>

    <div class="btns">
      <button
        class="button is-secondary"
        @click="handleNext"
        v-if="totalSteps > 1 && step <= totalSteps"
      >
        {{ step < totalSteps ? $t('>') : 'close' }}
      </button>
    </div>
  </div>
</template>
<style scoped>
.help-content-wrapper {
  width: 100%;
  min-height: 465px;
  max-height: 700px;
  margin: auto;
}

.btns {
  min-width: 50px;
}

.step-content {
  height: 100%;
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: flex-start;
  gap: 20px;
  align-self: flex-start;
  overflow: hidden;
  & > div {
    width: 100%;
  }
}

.step-content-items {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: flex-start;
  align-self: flex-start;
  gap: 1rem;
}

.step-content-items p.title {
  white-space: break-spaces;
  text-align: center;
  margin-top: 4rem;
}

.subtitle-image-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  & > p {
    width: auto;
  }
}

img.step-image {
  margin: auto;
  object-fit: cover;
  margin-top: 8px;
  border-radius: 8px;
  padding: 8px;
  border: 1px solid var(--neutral-50);
}
</style>
