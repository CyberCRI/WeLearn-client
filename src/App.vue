<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { RouterView } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
import NavComponent from '@/components/NavComponent.vue';
import AppLayout from '@/components/AppLayout.vue';
import SmallScreenPage from '@/views/SmallScreenPage.vue';
import ModalComponent from '@/components/WelcomeModal.vue';
import { useSourcesStore } from '@/stores/sources';
import { useUserStore } from '@/stores/user';
import ErrorComponent from '@/components/ErrorComponent.vue';
import { getQueryParamValue } from '@/utils/urlsUtils';

const { getNbDocsInBase, getSourcesList, getInfoPerCorpus } = useSourcesStore();
const userStore = useUserStore();
const screenWidth = computed(() => window.innerWidth);
const fetchError = ref(false);
onMounted(async () => {
  try {
    await getInfoPerCorpus();
    await userStore.setUserIdAndSessionId(getQueryParamValue('referer'));
    await getSourcesList();
    await getNbDocsInBase();
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
    </AppLayout>
  </div>
</template>

<style scoped>
.fullscreen {
  width: 100vw;
  height: 100vh;
}
</style>
