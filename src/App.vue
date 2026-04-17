<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterView } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
import NavComponent from '@/components/nav/NavComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import AppLayout from '@/components/AppLayout.vue';
import ModalComponent from '@/components/WelcomeModal.vue';
import { useSourcesStore } from '@/stores/sources';
import ErrorComponent from '@/components/ErrorComponent.vue';
import { getQueryParamValue } from '@/utils/urlsUtils';
import { getUserAndSession } from '@/utils/auth';

const { getSourcesList, getInfoPerCorpus } = useSourcesStore();
const fetchError = ref(false);

async function initCalls() {
  try {
    await Promise.all([
      getInfoPerCorpus(),
      getSourcesList(),
      getUserAndSession(getQueryParamValue('referer') || '')
    ]);
  } catch (err) {
    console.error(err);
  }
}

onMounted(async () => {
  try {
    await initCalls();
  } catch (error) {
    fetchError.value = true;
  }
});
</script>

<template>
  <ErrorComponent v-if="fetchError" />
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
      <template #footer>
        <FooterComponent />
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
