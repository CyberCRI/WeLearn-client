<script setup lang="ts">
import ModalComponent from './ModalComponent.vue';
import { useUserStore } from '@/stores/user';

const user = useUserStore();
const handleImgPath = (imgPath: string) => new URL(`../assets/${imgPath}`, import.meta.url).href;
</script>

<template>
  <ModalComponent
    v-if="!user.onboardingState.hasSeenWelcome"
    :title="$t('onboarding.welcome.title')"
    :message="$t('onboarding.welcome.description')"
    :isOpen="true"
    :onClose="() => user.setHasSeenWelcome(true)"
  >
    <template #extraInfo>
      <div
        class="container is-flex mb-6 is-align-items-center is-align-content-center is-justify-content-center"
      >
        <p class="mr-6 is-size-6" v-html="$t('onboarding.welcome.help')" />

        <img
          :src="handleImgPath(`welcome/help_${$i18n.locale}.png`)"
          alt="Welcome Image"
          class="image is-2-by-1"
        />
      </div>
    </template>
    <template #actions>
      <button class="button is-primary is-medium" @click="user.setHasSeenWelcome(true)">
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
