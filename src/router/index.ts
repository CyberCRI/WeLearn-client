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
    // student space: no login; the app's header, with Home and Ask WeLearn leading to the learner pages
    {
      path: '/learn',
      name: 'learn',
      component: () => import('@/views/student/LearnHome.vue'),
      meta: { requiresAuth: false }
    },
    // Ask WeLearn for learners: the tutor conversation
    {
      path: '/learn/ask',
      name: 'learn-ask',
      component: () => import('@/views/student/LearnAsk.vue'),
      meta: { requiresAuth: false }
    },
    // the three guided starts are now starters inside the Ask WeLearn conversation
    {
      path: '/learn/start/:start(exploring|question|working)',
      redirect: { name: 'learn-ask' }
    },
    // explore and analyse became investigate: older links still land somewhere useful
    {
      path: '/learn/:space(explore|analyse)',
      redirect: { name: 'learn-space', params: { space: 'investigate' } }
    },
    {
      path: '/learn/:space(understand|investigate|envision|apply)',
      name: 'learn-space',
      component: () => import('@/views/student/LearnSpace.vue'),
      meta: { requiresAuth: false }
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
    // explore is the existing search itself, with a teacher heading (a static path wins over :space)
    {
      path: '/teach/explore',
      name: 'teach-explore',
      component: () => import('@/views/teacher/TeachExplore.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/teach/:space(understand|explore|design|teach)',
      name: 'teach-space',
      component: () => import('@/views/teacher/TeachSpace.vue'),
      meta: { requiresAuth: true },
      // links by name to the explore space (homepage card) open the search page above, and the
      // teach space is the collection of teaching practices below
      beforeEnter: (to) =>
        (to.params.space === 'explore' && { name: 'teach-explore' }) ||
        (to.params.space === 'teach' && { name: 'teach-practices' }) ||
        true
    },
    // TEACH: teaching practices shared by teachers, one practice, sharing one's own
    {
      path: '/teach/practices',
      name: 'teach-practices',
      component: () => import('@/views/teacher/TeachPractices.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/teach/practices/share',
      name: 'teach-share',
      component: () => import('@/views/teacher/SharePractice.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/teach/practices/:id',
      name: 'teach-practice',
      component: () => import('@/views/teacher/TeachPractice.vue'),
      meta: { requiresAuth: true }
    },
    // course design entry: adapt an existing course or plan a new one
    {
      path: '/teach/design/course',
      name: 'teach-course',
      component: () => import('@/views/teacher/CourseStart.vue'),
      meta: { requiresAuth: true }
    },
    // course design prototype, "adapt my existing course", opened from the entry above
    {
      path: '/teach/design/adapt',
      name: 'teach-adapt',
      component: () => import('@/views/teacher/AdaptCourse.vue'),
      meta: { requiresAuth: true }
    },
    // design a learning activity (before the module mock pages below, which it replaces)
    {
      path: '/teach/design/activity',
      name: 'teach-activity',
      component: () => import('@/views/teacher/ActivityDesign.vue'),
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
    // preview: how WeLearn will support TEDS courses (entry line on /teach)
    {
      path: '/teach/teds',
      name: 'teach-teds',
      component: () => import('@/views/teacher/TeachTeds.vue'),
      meta: { requiresAuth: true }
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
