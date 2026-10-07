<template>
  <ModalWrapper v-if="isLoading" :isOpen="isLoading">
    <div v-if="shouldRetryAction" class="box has-text-centered status" role="alert">
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
    <div v-else class="box has-text-centered status" role="status">
      <button
        class="delete close"
        :aria-label="$t('tutor.error.cancel')"
        data-testid="tutor-close-button"
        @click="stopAction()"
      />
      <h1 class="title is-size-4 is-size-5-mobile">{{ $t(`tutor.loading.${kind}.title`) }}</h1>
      <progress class="progress is-primary" max="100" />
      <p>{{ $t(`tutor.loading.${kind}.description`) }}</p>
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
  kind: 'extract' | 'search' | 'syllabus' | 'feedback';
}>();
</script>

<style scoped>
.status {
  position: relative;
  padding: 2rem;
  max-width: 26rem;
  margin-inline: auto;
}

@media (max-width: 576px) {
  .status {
    max-width: 20rem;
    padding: 1.5rem 1.25rem;
  }
}

.close {
  position: absolute;
  top: 1rem;
  right: 1rem;
}
</style>
