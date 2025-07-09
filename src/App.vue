<script setup lang="ts">
import { computed } from 'vue';
import { RouterView } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
import NavComponent from '@/components/NavComponent.vue';
import AppLayout from '@/components/AppLayout.vue';
import SmallScreenPage from '@/views/SmallScreenPage.vue';
import ModalComponent from '@/components/ModalComponent.vue';
import { useUserStore } from '@/stores/user';

const user = useUserStore();
const screenWidth = computed(() => window.innerWidth);
</script>

<template>
  <SmallScreenPage v-if="screenWidth < 995" />
  <ModalComponent
    v-if="!user.onboardingState.hasSeenWelcome"
    :title="$t('onboarding.welcome.title')"
    :message="$t('onboarding.welcome.description')"
    :isOpen="true"
    :onClose="() => user.setHasSeenWelcome(true)"
  >
    <template #actions>
      <button class="button is-primary" @click="user.setHasSeenWelcome(true)">
        {{ $t('ok') }}
      </button>
    </template>
  </ModalComponent>

  <AppLayout v-else>
    <template #header v-if="!$route.meta.hideTemplate">
      <AppHeader />
      <NavComponent />
    </template>
    <template #main>
      <RouterView />
    </template>
  </AppLayout>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
