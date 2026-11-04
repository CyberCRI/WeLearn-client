<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterView } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
import NavComponent from '@/components/nav/NavComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import AppLayout from '@/components/AppLayout.vue';
import WelcomeModal from '@/components/modals/WelcomeModal.vue';
import ConsentBanner from '@/components/ConsentBanner.vue';
import SignupPromptModal from '@/components/modals/SignupPromptModal.vue';
import SessionExpiredModal from '@/components/modals/SessionExpiredModal.vue';
import { useSourcesStore } from '@/stores/sources';
import { useBookmarksStore } from '@/stores/bookmarks';
import { getQueryParamValue } from '@/utils/urlsUtils';
import { getUserAndSession } from '@/utils/auth';
import { useAuthStore } from './stores/auth';

const { getSourcesList, getInfoPerCorpus } = useSourcesStore();
const { getBookmarks } = useBookmarksStore();
const fetchError = ref(false);

const authStore = useAuthStore();

// guests get a session too: the API links their anonymous user to the account when they sign up
async function initCalls() {
  try {
    await Promise.all([
      getInfoPerCorpus(),
      getSourcesList(),
      getUserAndSession(getQueryParamValue('referer') || ''),
      // bookmarks need an account
      ...(authStore.isGuest ? [] : [getBookmarks()])
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
  <div class="fullscreen">
    <WelcomeModal />
    <ConsentBanner />
    <SignupPromptModal />
    <SessionExpiredModal />

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
  /* dvh = height actually visible on phones (address bar shown); 100vh is taller there and lets the page scroll the nav away */
  height: 100dvh;
}
</style>
