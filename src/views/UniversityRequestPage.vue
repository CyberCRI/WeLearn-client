<script setup lang="ts">
import { computed, nextTick, onUnmounted, reactive, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import AuthPageLayout from '@/components/AuthPageLayout.vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import TextInputComponent from '@/components/TextInputComponent.vue';
import ToasterComponent from '@/components/ToasterComponent.vue';
import EmailIcon from '@/components/icons/EmailIcon.vue';
import { isValidEmail } from '@/utils/validation';
import type { UniversityRequestData } from '@/types';

type FieldName = keyof UniversityRequestData;
const FIELDS: FieldName[] = ['university', 'city', 'email'];
const KNOWN_ERROR_CODES = ['RATE_LIMITED', 'EMAIL_UNAVAILABLE', 'EMAIL_DISABLED'];

const authStore = useAuthStore();
const { isRequestingUniversity, hasRequestedUniversity, universityRequestErrorCode } =
  storeToRefs(authStore);

const form = reactive<UniversityRequestData>({ university: '', city: '', email: '' });
// i18n keys, empty when the field is valid
const errors = reactive<Record<FieldName, string>>({ university: '', city: '', email: '' });
const hasTriedSubmit = ref(false);
const submittedUniversity = ref('');

const universityInput = ref<InstanceType<typeof TextInputComponent> | null>(null);
const cityInput = ref<InstanceType<typeof TextInputComponent> | null>(null);
const emailInput = ref<InstanceType<typeof TextInputComponent> | null>(null);
const inputs = { university: universityInput, city: cityInput, email: emailInput };
const successToaster = ref<InstanceType<typeof ToasterComponent> | null>(null);

const serverErrorKey = computed(() => {
  const code = universityRequestErrorCode.value;
  if (!code) return '';
  return `authentication.errors.${KNOWN_ERROR_CODES.includes(code) ? code : 'UNKNOWN'}`;
});

const validateField = (field: FieldName) => {
  if (field === 'email') {
    // optional: only checked when given
    errors.email =
      !form.email.trim() || isValidEmail(form.email) ? '' : 'authentication.emailInvalid';
  } else {
    errors[field] = form[field].trim() ? '' : `authentication.universityRequest.${field}Required`;
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

  submittedUniversity.value = form.university.trim();
  await authStore.requestUniversity({ ...form });

  if (hasRequestedUniversity.value) {
    // the form is gone: move focus to the message so it is read
    await nextTick();
    successToaster.value?.$el.focus();
  }
};

onUnmounted(() => authStore.resetUniversityRequest());
</script>

<template>
  <AuthPageLayout :title="$t('authentication.universityRequest.title')">
    <!-- live regions stay in the DOM so screen readers announce what appears in them -->
    <div role="status">
      <ToasterComponent
        v-if="hasRequestedUniversity"
        ref="successToaster"
        tabindex="-1"
        heading-tag="h2"
        level="info"
        :title="$t('authentication.universityRequest.successTitle')"
        :description="
          $t('authentication.universityRequest.successMessage', {
            university: submittedUniversity
          })
        "
      />
    </div>
    <div role="alert">
      <ToasterComponent
        v-if="serverErrorKey"
        heading-tag="h2"
        level="error"
        :title="$t('authentication.universityRequest.errorTitle')"
        :description="$t(serverErrorKey)"
      />
    </div>

    <form v-if="!hasRequestedUniversity" novalidate @submit.prevent="handleSubmit">
      <p class="mb-2">{{ $t('authentication.universityRequest.intro') }}</p>
      <p class="mb-2">{{ $t('authentication.requiredFieldsNote') }}</p>
      <TextInputComponent
        ref="universityInput"
        id="university-request-university"
        v-model="form.university"
        :label="$t('authentication.universityRequest.universityLabel')"
        autocomplete="organization"
        required
        :error="errors.university && $t(errors.university)"
        @blur="handleBlur('university')"
      />
      <TextInputComponent
        ref="cityInput"
        id="university-request-city"
        v-model="form.city"
        :label="$t('authentication.universityRequest.cityLabel')"
        autocomplete="address-level2"
        required
        :error="errors.city && $t(errors.city)"
        @blur="handleBlur('city')"
      />
      <TextInputComponent
        ref="emailInput"
        id="university-request-email"
        v-model="form.email"
        type="email"
        :label="$t('authentication.universityRequest.emailLabel')"
        :hint="$t('authentication.universityRequest.emailHint')"
        autocomplete="email"
        :error="errors.email && $t(errors.email)"
        @blur="handleBlur('email')"
      >
        <template #icon><EmailIcon /></template>
      </TextInputComponent>

      <div class="action-buttons">
        <!-- back to the keycloak login, where the "Other" entry is -->
        <router-link class="button" to="/login" data-testid="university-request-cancel">{{
          $t('authentication.cancelButton')
        }}</router-link>
        <!-- stays enabled: a disabled button can't be focused nor tell why it is disabled -->
        <ButtonComponent
          type="submit"
          color="primary"
          data-testid="university-request-submit"
          :aria-busy="isRequestingUniversity || undefined"
        >
          {{
            isRequestingUniversity
              ? $t('authentication.universityRequest.submitting')
              : $t('authentication.universityRequest.submitButton')
          }}
        </ButtonComponent>
      </div>
    </form>
    <router-link v-else class="button mt-4" to="/login">{{
      $t('authentication.universityRequest.backToLogin')
    }}</router-link>
  </AuthPageLayout>
</template>

<style lang="css" scoped>
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
  form {
    gap: 0.2rem;
  }

  .action-buttons {
    margin-top: 0.5rem;
  }
}
</style>
