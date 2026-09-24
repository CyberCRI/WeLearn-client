import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router';
import SearchSDG from '@/views/SearchSDG.vue';
import QandA from '@/views/QandA.vue';
import Bookmarks from '@/views/BookmarkdSources.vue';
import Tutor from '@/views/TutorPage.vue';
import NotFound from '@/views/NotFound.vue';
import MicrolearningModule from '@/views/MicrolearningModule.vue';
import TestMAS from '@/views/TestMAS.vue';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/q-and-a'
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
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
  ]
});

function hasQueryParams(route: RouteLocationNormalized) {
  return !!Object.keys(route.query).length;
}

router.beforeEach(async (to: RouteLocationNormalized, _from: RouteLocationNormalized) => {
  const authStore = useAuthStore();

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
    next({ name: to.name as string, query: from.query });
  } else {
    next();
  }
});

export default router;
