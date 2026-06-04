<script setup lang="ts">
import ModalComponent from '../ModalComponent.vue';
import { useUserStore } from '@/stores/user';
import { computed, ref } from 'vue';

const user = useUserStore();

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
    v-if="!user.onboardingState.hasSeenWelcome || !user.onboardingState.hasSeenMetricsData"
    :title="$t('onboarding.welcome.title')"
    :message="$t('onboarding.welcome.description')"
    :isOpen="true"
    :onClose="modalActions"
    :disableCloseOnBackground="isDisabledCloseModal"
  >
    <template #extraInfo>
      <div class="user-metrics-wrapper mb-5">
        <p class="mb-4 subtitle is-size-6">
          {{ $t('onboarding.metricsData.explanation') }}
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
          <input type="checkbox" v-model="consentRefused" id="consent" />
          {{ $t('onboarding.metricsData.consentLabel') }}
        </label>
      </div>
    </template>
    <template #actions>
      <button
        class="button is-primary is-medium"
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
  background-color: var(--primary-light);
  border-radius: 0.4rem;
  padding: 2rem;
}
</style>
