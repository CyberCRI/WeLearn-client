import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router';
import SearchSDG from '@/views/SearchSDG.vue';
import QandA from '@/views/QandA.vue';
import Bookmarks from '@/views/BookmarkdSources.vue';
import Tutor from '@/views/TutorPage.vue';
import LandingPage from '@/views/LandingPage.vue';
import NotFound from '@/views/NotFound.vue';

const mapEnv = {
  dev: 'dev',
  prod: 'prod'
};
const { VITE_ENVIRONMENT } = import.meta.env as 'dev' | 'prod';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingPage,
      meta: { hideTemplate: true }
    },
    {
      path: '/search',
      name: 'search-sdg',
      component: SearchSDG
    },
    {
      path: '/q-and-a',
      name: 'q-and-a',
      component: QandA
    },
    {
      path: '/bookmarks',
      name: 'bookmarks',
      component: Bookmarks
    },
    {
      ...(mapEnv[VITE_ENVIRONMENT] !== 'prod' && {
        path: '/tutor',
        name: 'tutor',
        component: Tutor
      })
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
  ]
});

function hasQueryParams(route: RouteLocationNormalized) {
  return !!Object.keys(route.query).length;
}

router.beforeEach((to, from, next) => {
  if (!hasQueryParams(to) && hasQueryParams(from)) {
    next({ name: to.name as string, query: from.query });
  } else {
    next();
  }
});

export default router;
