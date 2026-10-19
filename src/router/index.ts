import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router';
import SearchSDG from '@/views/SearchSDG.vue';
import QandA from '@/views/QandA.vue';
import Bookmarks from '@/views/BookmarkdSources.vue';
import Tutor from '@/views/TutorPage.vue';
import NotFound from '@/views/NotFound.vue';
import MicrolearningModule from '@/views/MicrolearningModule.vue';
import TestMAS from '@/views/TestMAS.vue';
import { useAuthStore } from '@/stores/auth';
import RegisterPage from '@/views/RegisterPage.vue';
import { isPreviewModule } from '@/components/teacher/teacherSpaces';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/q-and-a'
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage,
      meta: { requiresAuth: false }
    },
    {
      path: '/search',
      name: 'search-sdg',
      component: SearchSDG,
      meta: { requiresAuth: true }
    },
    {
      path: '/q-and-a',
      name: 'q-and-a',
      component: QandA,
      meta: { requiresAuth: true }
    },
    {
      path: '/bookmarks',
      name: 'bookmarks',
      component: Bookmarks,
      meta: { requiresAuth: true }
    },
    {
      path: '/tutor',
      name: 'tutor',
      component: Tutor,
      meta: { requiresAuth: true }
    },
    {
      path: '/tutor_test',
      name: 'tutor_test',
      component: TestMAS,
      meta: { requiresAuth: true }
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('@/views/TermsPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/microlearning',
      name: 'micro-learning',
      component: MicrolearningModule,
      meta: { requiresAuth: true }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutPage.vue')
    },
    // student space: no login, its own bar instead of the teacher header and menu
    {
      path: '/learn',
      name: 'learn',
      component: () => import('@/views/student/LearnHome.vue'),
      meta: { requiresAuth: false, hideTemplate: true }
    },
    {
      path: '/learn/:space(understand|explore|analyse|envision|apply)',
      name: 'learn-space',
      component: () => import('@/views/student/LearnSpace.vue'),
      meta: { requiresAuth: false, hideTemplate: true }
    },
    // entry page: choose "I'm teaching" (/teach) or "I'm learning" (/learn); / stays the chat
    {
      path: '/start',
      name: 'start',
      component: () => import('@/views/StartPage.vue'),
      meta: { requiresAuth: false, hideTemplate: true }
    },
    // teacher space: the four framework spaces, linking to the existing teacher pages
    {
      path: '/teach',
      name: 'teach',
      component: () => import('@/views/teacher/TeachHome.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/teach/:space(understand|explore|design|teach)',
      name: 'teach-space',
      component: () => import('@/views/teacher/TeachSpace.vue'),
      meta: { requiresAuth: true }
    },
    // mock page of a module still being designed; existing features keep their own pages
    {
      path: '/teach/:space(understand|design)/:module',
      name: 'teach-preview',
      component: () => import('@/views/teacher/TeachPreview.vue'),
      meta: { requiresAuth: true },
      beforeEnter: (to) =>
        isPreviewModule(to.params.space, to.params.module) || {
          name: 'teach-space',
          params: { space: to.params.space }
        }
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
  ]
});

function hasQueryParams(route: RouteLocationNormalized) {
  return !!Object.keys(route.query).length;
}

router.beforeEach(async (to: RouteLocationNormalized) => {
  const authStore = useAuthStore();

  if (!authStore.shouldAuthenticate) return true;

  // Wait for Keycloak initialization
  if (authStore.isLoading) {
    await new Promise<void>((resolve) => {
      const unwatch = authStore.$subscribe(() => {
        if (!authStore.isLoading) {
          unwatch();
          resolve();
        }
      });
    });
  }

  const requiresAuth = to.meta.requiresAuth as boolean | undefined;

  if (requiresAuth && !authStore.isAuthenticated) {
    authStore.login(window.location.origin + to.fullPath);
    return false;
  }

  return true;
});

router.beforeEach((to, from, next) => {
  if (!hasQueryParams(to) && hasQueryParams(from)) {
    // keep the full path (route params such as /learn/:space) and only add the query
    next({ path: to.path, hash: to.hash, query: from.query });
  } else {
    next();
  }
});

export default router;
