import { describe, it, expect, vi, beforeEach } from 'vitest';
import i18n from '@/localisation/i18n';
import { useStudentLanguage } from '../useStudentLanguage';

let leaveGuard: (to: { name: string }) => void;
vi.mock('vue-router', () => ({
  onBeforeRouteLeave: (guard: typeof leaveGuard) => (leaveGuard = guard)
}));

describe('useStudentLanguage', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, '', '/learn');
    i18n.global.locale.value = 'fr';
  });

  it('shows student pages in English and gives teacher pages French back', () => {
    useStudentLanguage();
    expect(i18n.global.locale.value).toBe('en');

    leaveGuard({ name: 'learn-space' });
    expect(i18n.global.locale.value).toBe('en');

    leaveGuard({ name: 'q-and-a' });
    expect(i18n.global.locale.value).toBe('fr');
  });

  it('keeps a language picked with the selector, everywhere', () => {
    localStorage.setItem('language', 'fr');

    useStudentLanguage();
    expect(i18n.global.locale.value).toBe('fr');

    i18n.global.locale.value = 'en';
    localStorage.setItem('language', 'en');
    leaveGuard({ name: 'q-and-a' });
    expect(i18n.global.locale.value).toBe('en');
  });

  it('keeps the language of a ?lang= link', () => {
    window.history.replaceState({}, '', '/learn?lang=fr');

    useStudentLanguage();
    expect(i18n.global.locale.value).toBe('fr');
  });
});
