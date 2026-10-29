<script setup lang="ts">
import { computed, nextTick, onUnmounted, reactive, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import ButtonComponent from '@/components/ButtonComponent.vue';
import TextInputComponent from '@/components/TextInputComponent.vue';
import ToasterComponent from '@/components/ToasterComponent.vue';
import EmailIcon from '@/components/icons/EmailIcon.vue';
import UserIcon from '@/components/icons/UserIcon.vue';
import { isValidEmail } from '@/utils/validation';
import type { UserRegisterData } from '@/types';

type FieldName = keyof UserRegisterData;
const FIELDS: FieldName[] = ['firstName', 'lastName', 'email'];
const KNOWN_ERROR_CODES = ['EMAIL_ALREADY_EXISTS', 'KEYCLOAK_UNAVAILABLE', 'SIGNUP_DISABLED'];

const authStore = useAuthStore();
const { isRegistering, hasRegistered, registerErrorCode } = storeToRefs(authStore);

const form = reactive<UserRegisterData>({ firstName: '', lastName: '', email: '' });
// i18n keys, empty when the field is valid
const errors = reactive<Record<FieldName, string>>({ firstName: '', lastName: '', email: '' });
const hasTriedSubmit = ref(false);
const submittedEmail = ref('');

const firstNameInput = ref<InstanceType<typeof TextInputComponent> | null>(null);
const lastNameInput = ref<InstanceType<typeof TextInputComponent> | null>(null);
const emailInput = ref<InstanceType<typeof TextInputComponent> | null>(null);
const inputs = { firstName: firstNameInput, lastName: lastNameInput, email: emailInput };
const successToaster = ref<InstanceType<typeof ToasterComponent> | null>(null);

// a bad email is shown on its field, not in the banner
const serverErrorKey = computed(() => {
  const code = registerErrorCode.value;
  if (!code || code === 'INVALID_EMAIL') return '';
  return `authentication.errors.${KNOWN_ERROR_CODES.includes(code) ? code : 'UNKNOWN'}`;
});

const validateField = (field: FieldName) => {
  if (field === 'email') {
    errors.email = isValidEmail(form.email) ? '' : 'authentication.emailInvalid';
  } else {
    errors[field] = form[field].trim() ? '' : `authentication.${field}Required`;
  }
};

// errors appear on submit, then follow the user's corrections field by field
const handleBlur = (field: FieldName) => {
  if (hasTriedSubmit.value) validateField(field);
};

const handleSubmit = async () => {
  hasTriedSubmit.value = true;
  FIELDS.forEach(validateField);
  const firstInvalid = FIELDS.find((field) => errors[field]);
  if (firstInvalid) {
    inputs[firstInvalid].value?.focus();
    return;
  }

  submittedEmail.value = form.email.trim();
  await authStore.register({ ...form });

  if (hasRegistered.value) {
    // the form is gone: move focus to the message so it is read
    await nextTick();
    successToaster.value?.$el.focus();
  } else if (registerErrorCode.value === 'INVALID_EMAIL') {
    errors.email = 'authentication.emailInvalid';
    emailInput.value?.focus();
  }
};

onUnmounted(() => authStore.resetRegister());
</script>

<template>
  <h1 class="title is-3 is-size-5-mobile">{{ $t('authentication.registerTitle') }}</h1>
  <div class="box">
    <!-- live regions stay in the DOM so screen readers announce what appears in them -->
    <div role="status">
      <ToasterComponent
        v-if="hasRegistered"
        ref="successToaster"
        tabindex="-1"
        heading-tag="h2"
        level="info"
        :title="$t('authentication.successTitle')"
        :description="$t('authentication.successMessage', { email: submittedEmail })"
      />
    </div>
    <div role="alert">
      <ToasterComponent
        v-if="serverErrorKey"
        heading-tag="h2"
        level="error"
        :title="$t('authentication.errorTitle')"
        :description="$t(serverErrorKey)"
      >
        <ButtonComponent
          v-if="registerErrorCode === 'EMAIL_ALREADY_EXISTS' && authStore.shouldAuthenticate"
          type="button"
          color="primary"
          data-testid="register-login"
          @click="authStore.login()"
        >
          {{ $t('authentication.loginButton') }}
        </ButtonComponent>
      </ToasterComponent>
    </div>

    <form v-if="!hasRegistered" novalidate @submit.prevent="handleSubmit">
      <p class="mb-2">{{ $t('authentication.requiredFieldsNote') }}</p>
      <TextInputComponent
        ref="firstNameInput"
        id="register-first-name"
        v-model="form.firstName"
        :label="$t('authentication.firstNameLabel')"
        autocomplete="given-name"
        required
        :error="errors.firstName && $t(errors.firstName)"
        @blur="handleBlur('firstName')"
      >
        <template #icon><UserIcon width="20" height="20" /></template>
      </TextInputComponent>
      <TextInputComponent
        ref="lastNameInput"
        id="register-last-name"
        v-model="form.lastName"
        :label="$t('authentication.lastNameLabel')"
        autocomplete="family-name"
        required
        :error="errors.lastName && $t(errors.lastName)"
        @blur="handleBlur('lastName')"
      >
        <template #icon><UserIcon width="20" height="20" /></template>
      </TextInputComponent>
      <TextInputComponent
        ref="emailInput"
        id="register-email"
        v-model="form.email"
        type="email"
        :label="$t('authentication.emailLabel')"
        :hint="$t('authentication.emailHint')"
        autocomplete="email"
        required
        :error="errors.email && $t(errors.email)"
        @blur="handleBlur('email')"
      >
        <template #icon><EmailIcon /></template>
      </TextInputComponent>

      <div class="action-buttons">
        <router-link class="button" to="/">{{ $t('authentication.cancelButton') }}</router-link>
        <!-- stays enabled: a disabled button can't be focused nor tell why it is disabled -->
        <ButtonComponent
          type="submit"
          color="primary"
          data-testid="register-submit"
          :aria-busy="isRegistering || undefined"
        >
          {{
            isRegistering ? $t('authentication.submitting') : $t('authentication.registerButton')
          }}
        </ButtonComponent>
      </div>
    </form>
  </div>
</template>

<style lang="css" scoped>
h1 {
  margin: auto;
  margin-top: 8rem;
  text-align: center;
}

.box {
  width: 25%;
  min-width: 420px;
  margin: auto;
  margin-top: 1rem;
  padding: 4rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.action-buttons {
  margin-top: 1rem;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

@media (max-width: 750px) {
  .box {
    width: 100%;
    min-width: unset;
    padding: 1rem 2rem;
  }

  form {
    gap: 0.2rem;
  }

  h1 {
    margin-top: 1rem;
  }

  .action-buttons {
    margin-top: 0.5rem;
  }
}
</style>
