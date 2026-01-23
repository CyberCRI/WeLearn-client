<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { RouterView } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
import NavComponent from '@/components/NavComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import AppLayout from '@/components/AppLayout.vue';
import SmallScreenPage from '@/views/SmallScreenPage.vue';
import ModalComponent from '@/components/WelcomeModal.vue';
import { useSourcesStore } from '@/stores/sources';
import { useUserStore } from '@/stores/user';
import ErrorComponent from '@/components/ErrorComponent.vue';
import { getQueryParamValue } from '@/utils/urlsUtils';

const { getSourcesList, getInfoPerCorpus } = useSourcesStore();
const userStore = useUserStore();
const screenWidth = computed(() => window.innerWidth);
const fetchError = ref(false);

async function initCalls() {
  try {
    await Promise.all([
      getInfoPerCorpus(),
      getSourcesList(),
      userStore.setUserIdAndSessionId(getQueryParamValue('referer') || '')
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
  <SmallScreenPage v-else-if="screenWidth < 995" />
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
