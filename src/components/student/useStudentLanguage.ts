import { onBeforeRouteLeave } from 'vue-router';
import i18n from '@/localisation/i18n';
import { getQueryParamValue } from '@/utils/urlsUtils';
import { isStudentRoute } from './spaces';

// same default as src/localisation/i18n.ts, which teacher pages rely on
const TEACHER_DEFAULT_LOCALE = 'fr';

// a ?lang= link or a language picked with the selector wins everywhere
const hasChosenLanguage = () => !!getQueryParamValue('lang') || !!localStorage.getItem('language');

// student pages default to English; leaving them gives teacher pages their usual default back
export const useStudentLanguage = () => {
  if (!hasChosenLanguage()) {
    i18n.global.locale.value = 'en';
  }

  onBeforeRouteLeave((to) => {
    if (!isStudentRoute(to.name) && !hasChosenLanguage()) {
      i18n.global.locale.value = TEACHER_DEFAULT_LOCALE;
    }
  });
};
