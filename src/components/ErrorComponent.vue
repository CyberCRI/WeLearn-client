<script setup lang="ts">
import Modal from '@/components/ModalComponent.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
<template>
  <Modal
    :title="$t('errorModalGeneric.title')"
    :message="$t('errorModalGeneric.message')"
    :onClose="() => router.go(0)"
    isOpen
  >
    <template #actions>
      <div class="is-flex is-flex-direction-column is-align-items-center my-4">
        <button class="button is-warning" @click="() => router.go(0)">
          {{ $t('errorModalGeneric.action') }}
        </button>
      </div>
    </template>
  </Modal>
</template>
