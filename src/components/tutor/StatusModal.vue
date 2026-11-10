<template>
  <ModalWrapper
    v-if="isLoading"
    :isOpen="isLoading"
    :onClose="shouldRetryAction ? undefined : stopAction"
    :isDismissable="false"
    size="small"
  >
    <div v-if="shouldRetryAction" class="has-text-centered" role="alert">
      <ErrorDocumentIcon class="mb-3" />
      <h1 class="title is-size-4 is-size-5-mobile">{{ $t('tutor.error.title') }}</h1>
      <p>{{ $t(`tutor.error.${kind}`) }} {{ $t('tutor.error.kept') }}</p>
      <div class="buttons is-centered mt-5">
        <button data-testid="tutor-cancel-button" class="button" @click="stopAction()">
          {{ $t('tutor.error.cancel') }}
        </button>
        <button data-testid="tutor-retry-button" class="button is-primary" @click="action()">
          {{ $t('tutor.error.retry') }}
        </button>
      </div>
    </div>
    <div v-else class="has-text-centered" role="status">
      <h1 class="title is-size-4 is-size-5-mobile">{{ $t(`tutor.loading.${kind}.title`) }}</h1>
      <progress class="progress is-primary" max="100" />
      <p>{{ $t(`tutor.loading.${kind}.description`) }}</p>
    </div>
  </ModalWrapper>
</template>

<script setup lang="ts">
// not dismissable: a stray click or Escape must not cancel a running request, only the close button does
import ModalWrapper from '@/components/ModalWrapper.vue';
import ErrorDocumentIcon from '@/components/icons/ErrorDocumentIcon.vue';

defineProps<{
  isLoading: boolean;
  shouldRetryAction: boolean;
  action: () => Promise<void>;
  stopAction: () => void;
  kind: 'extract' | 'search' | 'syllabus' | 'feedback';
}>();
</script>
