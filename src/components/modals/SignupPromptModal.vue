<script setup lang="ts">
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import ModalComponent from '@/components/ModalComponent.vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import { useAuthStore } from '@/stores/auth';
import { track } from '@/utils/analytics';

const router = useRouter();
const authStore = useAuthStore();
const { signupPromptReason } = storeToRefs(authStore);

const handleRegister = () => {
  if (!signupPromptReason.value) return;
  track('Signup Prompt Clicked', { reason: signupPromptReason.value, action: 'register' });
  authStore.closeSignupPrompt();
  router.push('/register');
};

const handleLogin = () => {
  if (!signupPromptReason.value) return;
  track('Signup Prompt Clicked', { reason: signupPromptReason.value, action: 'login' });
  authStore.closeSignupPrompt();
  // back to the same page, so the guest finds their work where they left it
  authStore.login(window.location.href);
};
</script>

<template>
  <!-- v-if: ModalComponent reads isOpen only once, so it is mounted each time it opens -->
  <ModalComponent
    v-if="signupPromptReason"
    data-testid="signup-prompt"
    :title="$t('authentication.signupPrompt.title')"
    :message="$t(`authentication.signupPrompt.reasons.${signupPromptReason}`)"
    :isOpen="true"
    size="small"
    :onClose="authStore.closeSignupPrompt"
  >
    <template #actions>
      <ButtonComponent color="primary" data-testid="signup-prompt-register" @click="handleRegister">
        {{ $t('authentication.signupPrompt.createAccount') }}
      </ButtonComponent>
      <ButtonComponent isDiscreet data-testid="signup-prompt-login" @click="handleLogin">
        {{ $t('authentication.signupPrompt.login') }}
      </ButtonComponent>
    </template>
  </ModalComponent>
</template>
