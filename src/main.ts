import './assets/base.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import i18n from './localisation/i18n';
//Import Mixpanel SDK (only required for npm and yarn)
import mixpanel from 'mixpanel-browser';

// mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN, {
//   debug: import.meta.env.VITE_ENVIRONMENT === 'dev', // Enable debug mode for development
//   track_pageview: true,
//   persistence: 'localStorage',
//   record_sessions_percent: 100, //records 100% of all sessions
//   record_heatmap_data: true
// });
const pinia = createPinia();
const app = createApp(App);

app.use(pinia).use(router).use(i18n);

app.mount('#app');
