import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router';
import SearchSDG from '@/views/SearchSDG.vue';
import QandA from '@/views/QandA.vue';
import Bookmarks from '@/views/BookmarkdSources.vue';
import Tutor from '@/views/TutorPage.vue';
import NotFound from '@/views/NotFound.vue';
import MicrolearningModule from '@/views/MicrolearningModule.vue';
import TestMAS from '@/views/TestMAS.vue';
import { useAuthStore } from '@/stores/auth';
import { useFeatureFlipStore, type Feature } from '@/stores/featureFlip';
import RegisterPage from '@/views/RegisterPage.vue';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    // the page is reachable only where this feature is on (stores/featureFlip.ts)
    feature?: Feature;
  }
}

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
    // the chat comes first: the first enabled feature route is where a disabled one redirects
    {
      path: '/q-and-a',
      name: 'q-and-a',
      component: QandA,
      meta: { requiresAuth: true, feature: 'chat' }
    },
    {
      path: '/search',
      name: 'search-sdg',
      component: SearchSDG,
      meta: { requiresAuth: true, feature: 'search' }
    },
    {
      path: '/bookmarks',
      name: 'bookmarks',
      component: Bookmarks,
      meta: { requiresAuth: true, feature: 'bookmarks' }
    },
    {
      path: '/tutor',
      name: 'tutor',
      component: Tutor,
      meta: { requiresAuth: true, feature: 'tutor' }
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
      meta: { requiresAuth: true, feature: 'microlearning' }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfilePage.vue'),
      meta: { requiresAuth: true },
      // no accounts outside dev
      beforeEnter: () => (useAuthStore().shouldAuthenticate ? true : '/')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutPage.vue'),
      meta: { feature: 'about' }
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
  ]
});

function hasQueryParams(route: RouteLocationNormalized) {
  return !!Object.keys(route.query).length;
}

// before the auth guard: no login for a page that is off anyway
router.beforeEach((to: RouteLocationNormalized) => {
  const { isFeatureEnabled } = useFeatureFlipStore();
  if (!to.meta.feature || isFeatureEnabled(to.meta.feature)) return true;

  // not '/': it redirects to the chat, which may be the disabled page
  const fallback = router.options.routes.find(
    (route) => route.meta?.feature && isFeatureEnabled(route.meta.feature)
  );
  return fallback ? fallback.path : false;
});

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

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
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
