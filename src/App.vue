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
import AccessEndedModal from '@/components/modals/AccessEndedModal.vue';
import LimitedAccessModal from '@/components/modals/LimitedAccessModal.vue';
import { useSourcesStore } from '@/stores/sources';
import { useBookmarksStore } from '@/stores/bookmarks';
import { getQueryParamValue } from '@/utils/urlsUtils';
import { getUserAndSession } from '@/utils/auth';
import { useAuthStore } from './stores/auth';
import { useChatStore } from '@/stores/chat';
import { useGuestQuotaStore } from '@/stores/guestQuota';
import { useAccountAccessStore } from '@/stores/accountAccess';

const { getSourcesList, getInfoPerCorpus } = useSourcesStore();
const { getBookmarks } = useBookmarksStore();
const chatStore = useChatStore();
const guestQuota = useGuestQuotaStore();
const accountAccess = useAccountAccessStore();
const fetchError = ref(false);

const authStore = useAuthStore();

// guests get a session too: the API links their anonymous user to the account when they sign up
async function initCalls() {
  try {
    await Promise.all([
      getInfoPerCorpus(),
      getSourcesList(),
      // once the session belongs to the account (a guest who logged in gets the account's user):
      // its latest chat is looked up through that session
      // the guest quota is counted per session user, so it is read once the session exists
      getUserAndSession(getQueryParamValue('referer') || '').then(() =>
        Promise.all([chatStore.restoreLatestThread(), guestQuota.refresh()])
      ),
      // bookmarks need an account
      ...(authStore.isGuest ? [] : [getBookmarks()]),
      // a Google or email login is limited in time: says so once, the profile shows what is left
      ...(authStore.isAuthenticated ? [accountAccess.refresh()] : [])
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
    <AccessEndedModal />
    <LimitedAccessModal />

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
