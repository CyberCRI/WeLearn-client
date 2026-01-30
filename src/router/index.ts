import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router';
import SearchSDG from '@/views/SearchSDG.vue';
import QandA from '@/views/QandA.vue';
import Bookmarks from '@/views/BookmarkdSources.vue';
import Tutor from '@/views/TutorPage.vue';
import NotFound from '@/views/NotFound.vue';
import MicroLearning from '@/views/MicroLearning.vue';

const isDevEnvironment = (import.meta.env.VITE_ENVIRONMENT || '').trim().includes('dev');

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
      path: '/tutor',
      name: 'tutor',
      component: Tutor
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('@/views/TermsPage.vue')
    },
    {
      ...(isDevEnvironment && {
        path: '/microlearning',
        name: 'micro-learning',
        component: MicroLearning
      })
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

router.beforeEach((to, from, next) => {
  if (!hasQueryParams(to) && hasQueryParams(from)) {
    next({ name: to.name as string, query: from.query });
  } else {
    next();
  }
});

export default router;
