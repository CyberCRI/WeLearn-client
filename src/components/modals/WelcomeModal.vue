<script setup lang="ts">
import ModalComponent from '../ModalComponent.vue';
import { useUserStore } from '@/stores/user';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const user = useUserStore();
const route = useRoute();

// auth pages (register, login redirect) skip it: the form shows on the next normal page.
// no matched route = the first navigation hasn't landed yet (or /login aborted it to go to keycloak)
const isShown = computed(
  () =>
    route.matched.length > 0 &&
    !route.meta.hideWelcome &&
    (!user.onboardingState.hasSeenWelcome || !user.onboardingState.hasSeenMetricsData)
);

const institution = ref('');
const role = ref('');
const consentRefused = ref(false);

const modalActions = async () => {
  user.setHasSeenWelcome(true);
  await user.userMetricsDataAction(true, {
    institution: institution.value,
    role: role.value,
    consentRefused: consentRefused.value
  });
};

const onCheckboxChange = () => {
  consentRefused.value = !consentRefused.value;
  if (consentRefused.value) {
    institution.value = '';
    role.value = '';
  }
};

const isDisabledCloseModal = computed(() => {
  if (consentRefused.value) {
    return false;
  }
  if (institution.value.trim().length > 0 && role.value.trim().length > 0) {
    return false;
  }
  return true;
});
</script>

<template>
  <ModalComponent
    v-if="isShown"
    :title="$t('onboarding.welcome.title')"
    :message="$t('onboarding.welcome.description')"
    :isOpen="true"
    displayLang
  >
    <template #extraInfo>
      <div class="user-metrics-wrapper mb-5">
        <p class="metrics-explanation mb-4 subtitle is-size-6">
          {{ $t('onboarding.metricsData.explanation.1') }}
          <strong>{{ $t('onboarding.metricsData.explanation.2') }}</strong>
          {{ $t('onboarding.metricsData.explanation.3') }}
        </p>
        <label for="institution" class="label i"
          >{{ $t('onboarding.metricsData.institutionLabel') }}
          <input
            type="text"
            id="institution"
            class="input"
            :placeholder="$t('onboarding.metricsData.institutionPlaceholder')"
            v-model="institution"
        /></label>
        <label for="role" class="label"
          >{{ $t('onboarding.metricsData.roleLabel') }}
          <input
            type="text"
            id="role"
            v-model="role"
            class="input"
            :placeholder="$t('onboarding.metricsData.rolePlaceholder')"
          />
        </label>
        <label for="consent" class="checkbox mt-4 mb-4">
          <input
            data-testid="consent-checkbox"
            type="checkbox"
            @change="onCheckboxChange"
            id="consent"
          />
          {{ $t('onboarding.metricsData.consentLabel') }}
        </label>
      </div>
    </template>
    <template #actions>
      <button
        class="button is-primary"
        data-testid="welcome-action"
        :disabled="isDisabledCloseModal"
        @click="modalActions"
      >
        {{ $t('onboarding.welcome.action') }}
      </button>
    </template>
  </ModalComponent>
</template>

<style scoped>
.user-metrics-wrapper {
  background-color: var(--primary-lighter);
  border-radius: 0.4rem;
  padding: 2rem;
}
</style>
