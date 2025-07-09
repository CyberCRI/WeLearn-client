<script setup lang="ts">
import { computed, onBeforeMount } from 'vue';
import { RouterView } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
import NavComponent from '@/components/NavComponent.vue';
import AppLayout from '@/components/AppLayout.vue';
import SmallScreenPage from '@/views/SmallScreenPage.vue';
import ModalComponent from '@/components/WelcomeModal.vue';
import { useSourcesStore } from '@/stores/sources';

const store = useSourcesStore();
const screenWidth = computed(() => window.innerWidth);

onBeforeMount(() => {
  store.getNbDocsInBase();
});
</script>

<template>
  <SmallScreenPage v-if="screenWidth < 995" />
  <div class="fullscreen" v-else>
    <ModalComponent />

    <AppLayout>
      <template #header v-if="!$route.meta.hideTemplate">
        <AppHeader />
        <NavComponent />
      </template>
      <template #main>
        <RouterView />
      </template>
    </AppLayout>
  </div>
</template>

<style scoped>
.fullscreen {
  width: 100vw;
  height: 100vh;
}
</style>
