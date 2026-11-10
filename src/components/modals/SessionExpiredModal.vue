<script setup lang="ts">
import { storeToRefs } from 'pinia';
import ModalComponent from '@/components/ModalComponent.vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const { isSessionExpired } = storeToRefs(authStore);

const handleLogin = () => {
  authStore.closeSessionExpired();
  // back to the same page
  authStore.login(window.location.href);
};
</script>

<template>
  <!-- v-if: ModalComponent reads isOpen only once, so it is mounted each time it opens -->
  <ModalComponent
    v-if="isSessionExpired"
    data-testid="session-expired"
    :title="$t('authentication.sessionExpired.title')"
    :message="$t('authentication.sessionExpired.message')"
    :isOpen="true"
    size="small"
    :onClose="authStore.closeSessionExpired"
  >
    <template #actions>
      <ButtonComponent color="primary" data-testid="session-expired-login" @click="handleLogin">
        {{ $t('authentication.sessionExpired.login') }}
      </ButtonComponent>
      <ButtonComponent
        isDiscreet
        data-testid="session-expired-close"
        @click="authStore.closeSessionExpired"
      >
        {{ $t('authentication.sessionExpired.continueAsGuest') }}
      </ButtonComponent>
    </template>
  </ModalComponent>
</template>
