<template>
  <ModalWrapper v-if="isLoading" :isOpen="isLoading" :onClose="stopAction">
    <div v-if="shouldRetryAction" class="box">
      <div class="is-flex is-flex-direction-column is-align-items-center is-justify-content-center">
        <h1 class="title is-size-4 is-size-5-mobile has-text-centered">
          <span class="mr-4"><ErrorDocumentIcon /></span>
          {{ $t('tutor.retry.title') }}
        </h1>

        <p class="loader-text is-title is-size-4 is-size-5-mobile mx-6 px-6">
          {{ $t('tutor.retry.description') }}
        </p>
        <div class="is-flex is-gap-4">
          <button data-testid="tutor-back-button" class="button mt-6" @click="action">
            {{ $t('tutor.retry.button') }}
          </button>
          <button data-testid="tutor-back-button" class="button mt-6" @click="stopAction()">
            {{ $t('tutor.retry.stop') }}
          </button>
        </div>
      </div>
    </div>
    <div v-else class="box loading-modal has-text-centered">
      <h1 class="title is-size-4 is-size-5-mobile">
        {{ title }}
      </h1>
      <progress class="progress is-large is-primary mb-6" max="100">60%</progress>
      <p class="is-title is-size-5 is-size-6-mobile">{{ $t('tutor.loading.wait') }}</p>
      <p class="is-title is-size-5 is-size-6-mobile">
        {{ description }}
      </p>
    </div>
  </ModalWrapper>
</template>

<script setup lang="ts">
import ModalWrapper from '@/components/ModalWrapper.vue';
import ErrorDocumentIcon from '@/components/icons/ErrorDocumentIcon.vue';

defineProps<{
  isLoading: boolean;
  shouldRetryAction: boolean;
  action: () => Promise<void>;
  stopAction: () => void;
  title: string;
  description: string;
}>();
</script>

<style scoped>
.loading-modal {
  padding: 2rem;
  width: 100%;
  height: 100%;
}
</style>
