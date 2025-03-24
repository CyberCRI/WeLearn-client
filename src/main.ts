import './assets/base.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import i18n from './localisation/i18n';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia).use(router).use(i18n);

app.mount('#app');
