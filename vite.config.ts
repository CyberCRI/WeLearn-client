import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

// `yarn dev:prod-api` runs the local app against the production API through this proxy:
// the browser only talks to localhost, so prod CORS never has to allow it
const PROD_API_PREFIX = '/prod-api';
const PROD_API_URL = 'https://api.welearn.k8s.lp-i.org';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      // only used when VITE_API_BASE is set to /prod-api (see .env.prodapi.local in the README)
      [PROD_API_PREFIX]: {
        target: PROD_API_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(new RegExp(`^${PROD_API_PREFIX}`), ''),
        // the API sets the session cookie for its own domain: keep it on localhost instead
        cookieDomainRewrite: ''
      }
    }
  }
});
