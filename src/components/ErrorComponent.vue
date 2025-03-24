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
      <button class="button is-primary" @click="() => router.go(0)">
        {{ $t('errorModalGeneric.action') }}
      </button>
    </template>
  </Modal>
</template>
