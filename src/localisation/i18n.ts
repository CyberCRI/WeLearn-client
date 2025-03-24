import { createI18n } from 'vue-i18n';
import { messages } from './messages';

const i18n = createI18n({
  locale: 'en',
  messages,
  globalInjection: true,
  legacy: false,
  sync: true,
  missingWarn: import.meta.env.NODE_ENV === 'dev' ? true : false
});

export default i18n;
