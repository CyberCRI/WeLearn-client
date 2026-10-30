import './assets/base.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import i18n from './localisation/i18n';
import { useAuthStore } from './stores/auth';
import { useUserStore } from './stores/user';
import { initAnalytics, track } from './utils/analytics';

// mixpanel only starts once the user accepts in the consent banner
initAnalytics();

const pinia = createPinia();
const app = createApp(App);

app.use(pinia).use(router).use(i18n);

useUserStore().applyAnalyticsConsent();
// route name only: the full path can carry query params
router.afterEach((to) => track('Page Viewed', { routeName: String(to.name ?? 'unknown') }));

const authStore = useAuthStore();

authStore.init().then(() => {
  app.mount('#app');
});
