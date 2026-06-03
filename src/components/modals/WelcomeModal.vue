<script setup lang="ts">
import ModalComponent from '../ModalComponent.vue';
import { useUserStore } from '@/stores/user';
import { ref } from 'vue';

const user = useUserStore();

const institution = ref('');
const role = ref('');
const consentGiven = ref(false);

const modalActions = async () => {
  user.setHasSeenWelcome(true);
  await user.userMetricsDataAction(true, {
    institution: institution.value,
    role: role.value,
    consentGiven: consentGiven.value
  });
};
</script>

<template>
  <ModalComponent
    v-if="!user.onboardingState.hasSeenWelcome || !user.onboardingState.hasSeenMetricsData"
    :title="$t('onboarding.welcome.title')"
    :message="$t('onboarding.welcome.description')"
    :isOpen="true"
    :onClose="modalActions"
  >
    <template #extraInfo>
      <div
        class="container is-flex mb-2 is-align-items-center is-align-content-center is-justify-content-center"
      >
        <p class="mr-6 is-size-6" v-html="$t('onboarding.metricsData.explanation')" />
      </div>

      <label for="institution" class="label is-small"
        >{{ $t('onboarding.metricsData.institutionLabel') }}
        <input
          type="text"
          id="institution"
          class="input is-small"
          :placeholder="$t('onboarding.metricsData.institutionPlaceholder')"
          v-model="institution"
      /></label>
      <label for="role" class="label is-small"
        >{{ $t('onboarding.metricsData.roleLabel') }}
        <input
          type="text"
          id="role"
          v-model="role"
          class="input is-small"
          :placeholder="$t('onboarding.metricsData.rolePlaceholder')"
        />
      </label>
      <label for="consent" class="checkbox mt-4 mb-4">
        <input type="checkbox" v-model="consentGiven" id="consent" />
        {{ $t('onboarding.metricsData.consentLabel') }}
      </label>
    </template>
    <template #actions>
      <button class="button is-primary is-medium" @click="modalActions">
        {{ $t('onboarding.welcome.action') }}
      </button>
    </template>
  </ModalComponent>
</template>

<style scoped>
img.image.is-2-by-1 {
  width: 30%;
  height: auto;
}
</style>
