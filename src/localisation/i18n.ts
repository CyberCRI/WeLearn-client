import { createI18n } from 'vue-i18n';
import { messages } from './messages';
import { getQueryParamValue } from '@/utils/urlsUtils';

const lang = getQueryParamValue('lang');

const i18n = createI18n({
  locale: lang ?? 'en',
  messages,
  globalInjection: true,
  legacy: false,
  sync: true,
  missingWarn: import.meta.env.NODE_ENV === 'dev' ? true : false
});

export default i18n;
