<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterView } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
import NavComponent from '@/components/nav/NavComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import AppLayout from '@/components/AppLayout.vue';
import WelcomeModal from '@/components/modals/WelcomeModal.vue';
import { useSourcesStore } from '@/stores/sources';
import { useBookmarksStore } from '@/stores/bookmarks';
import { getQueryParamValue } from '@/utils/urlsUtils';
import { getUserAndSession } from '@/utils/auth';
import { useAuthStore } from './stores/auth';
import TeacherJourneyNav from '@/components/teacher/TeacherJourneyNav.vue';
import { isTeacherSpaceRoute } from '@/components/teacher/teacherSpaces';

const { getSourcesList, getInfoPerCorpus } = useSourcesStore();
const { getBookmarks } = useBookmarksStore();
const fetchError = ref(false);

const authStore = useAuthStore();

async function initCalls() {
  try {
    await Promise.all([
      getInfoPerCorpus(),
      getSourcesList(),
      getUserAndSession(getQueryParamValue('referer') || ''),
      getBookmarks()
    ]);
  } catch (err) {
    console.error(err);
  }
}

onMounted(async () => {
  try {
    if (authStore.isAuthenticated || !authStore.shouldAuthenticate) {
      await initCalls();
    }
  } catch (error) {
    fetchError.value = true;
  }
});
</script>

<template>
  <div class="fullscreen">
    <WelcomeModal />

    <!-- pages with hideTemplate (student space) bring their own bar and footer -->
    <div v-if="$route.meta.hideTemplate" class="own-layout">
      <RouterView />
    </div>
    <AppLayout v-else>
      <template #header v-if="!$route.meta.hideTemplate">
        <AppHeader />
        <NavComponent>
          <!-- teacher space: the four spaces replace the tool links (tools stay inside the spaces) -->
          <template v-if="isTeacherSpaceRoute($route.name)" #tools>
            <TeacherJourneyNav />
          </template>
        </NavComponent>
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

.own-layout {
  height: 100%;
  overflow: auto;
}
</style>
