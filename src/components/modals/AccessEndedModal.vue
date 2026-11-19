<script setup lang="ts">
import { storeToRefs } from 'pinia';
import ModalComponent from '@/components/ModalComponent.vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const { isAccessEnded } = storeToRefs(authStore);

const handleLogin = () => {
  authStore.closeAccessEnded();
  // back to the same page, the login page lists the institutions
  authStore.login(window.location.href);
};
</script>

<template>
  <!-- v-if: ModalComponent reads isOpen only once, so it is mounted each time it opens -->
  <ModalComponent
    v-if="isAccessEnded"
    data-testid="access-ended"
    :title="$t('authentication.accessEnded.title')"
    :message="$t('authentication.accessEnded.message')"
    :isOpen="true"
    size="small"
    :onClose="authStore.closeAccessEnded"
  >
    <template #actions>
      <ButtonComponent color="primary" data-testid="access-ended-login" @click="handleLogin">
        {{ $t('authentication.accessEnded.login') }}
      </ButtonComponent>
      <ButtonComponent
        isDiscreet
        data-testid="access-ended-close"
        @click="authStore.closeAccessEnded"
      >
        {{ $t('authentication.accessEnded.continueAsGuest') }}
      </ButtonComponent>
    </template>
  </ModalComponent>
</template>
