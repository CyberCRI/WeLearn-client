import { createI18n } from 'vue-i18n';
import { messages } from './messages';
import { getQueryParamValue } from '@/utils/urlsUtils';

const lang = getQueryParamValue('lang');

const i18n = createI18n({
  locale: lang ?? 'fr',
  messages,
  globalInjection: true,
  legacy: false,
  sync: true,
  missingWarn: false,
  fallbackWarn: false
});

export default i18n;
