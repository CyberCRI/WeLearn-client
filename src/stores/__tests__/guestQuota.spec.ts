import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { GUEST_LIMITS, useGuestQuotaStore } from '../guestQuota';
import i18n from '@/localisation/i18n';

const auth = vi.hoisted(() => ({ isGuest: true, askToSignUp: vi.fn() }));
vi.mock('@/stores/auth', () => ({ useAuthStore: () => auth }));

describe('guest quota store', () => {
  beforeEach(() => {
    auth.isGuest = true;
    localStorage.clear();
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('gives a guest 5 chat questions and 1 syllabus', () => {
    const store = useGuestQuotaStore();

    expect(GUEST_LIMITS).toEqual({ chat: 5, syllabus: 1 });
    expect(store.remaining('chat')).toBe(5);
    expect(store.remaining('syllabus')).toBe(1);
  });

  it('counts each use and keeps it in storage', () => {
    const store = useGuestQuotaStore();

    store.consume('chat');
    store.consume('chat');

    expect(store.remaining('chat')).toBe(3);
    expect(JSON.parse(localStorage.getItem('guestUsage')!)).toEqual({ chat: 2, syllabus: 0 });
  });

  it('starts from the stored usage', () => {
    localStorage.setItem('guestUsage', JSON.stringify({ chat: 4 }));

    const store = useGuestQuotaStore();

    expect(store.remaining('chat')).toBe(1);
    expect(store.remaining('syllabus')).toBe(1);
  });

  it('asks to sign up once the quota is used, with the reason of the feature', () => {
    const store = useGuestQuotaStore();

    expect(store.checkQuota('syllabus')).toBe(true);
    store.consume('syllabus');

    expect(store.remaining('syllabus')).toBe(0);
    expect(store.checkQuota('syllabus')).toBe(false);
    expect(auth.askToSignUp).toHaveBeenCalledWith('syllabusLimit');
  });

  it('never goes below zero', () => {
    localStorage.setItem('guestUsage', JSON.stringify({ chat: 12, syllabus: 0 }));

    expect(useGuestQuotaStore().remaining('chat')).toBe(0);
  });

  it('does not limit nor count a logged in user', () => {
    auth.isGuest = false;
    localStorage.setItem('guestUsage', JSON.stringify({ chat: 10, syllabus: 1 }));
    const store = useGuestQuotaStore();

    store.consume('chat');

    expect(store.checkQuota('chat')).toBe(true);
    expect(store.usage.chat).toBe(10);
    expect(auth.askToSignUp).not.toHaveBeenCalled();
  });

  it('resets the usage', () => {
    const store = useGuestQuotaStore();
    store.consume('chat');

    store.$reset();

    expect(store.remaining('chat')).toBe(5);
    expect(localStorage.getItem('guestUsage')).toBeNull();
  });

  it('tells whether a use was counted', () => {
    const store = useGuestQuotaStore();

    expect(store.consume('chat')).toBe(true);
    auth.isGuest = false;
    expect(store.consume('chat')).toBe(false);
  });

  it('gives a use back, without going below zero', () => {
    const store = useGuestQuotaStore();
    store.consume('chat');

    store.refund('chat');
    store.refund('chat');

    expect(store.usage.chat).toBe(0);
    expect(JSON.parse(localStorage.getItem('guestUsage')!)).toEqual({ chat: 0, syllabus: 0 });
  });

  // the notice relies on the plural forms: none left | 1 left | n left
  describe('notice text', () => {
    const initialLocale = i18n.global.locale.value;
    afterEach(() => {
      i18n.global.locale.value = initialLocale;
    });

    it.each([
      [0, 'you have used your 5 free questions'],
      [1, '1 free question left out of 5'],
      [3, '3 free questions left out of 5']
    ])('shows %i chat questions left', (n, text) => {
      i18n.global.locale.value = 'en';

      expect(i18n.global.t('authentication.guestQuota.chat', { n, limit: 5 }, n)).toContain(text);
    });

    it.each([
      [0, 'vous avez utilisé votre syllabus gratuit'],
      [1, 'vous pouvez créer 1 syllabus gratuit']
    ])('shows %i syllabus left in french', (n, text) => {
      i18n.global.locale.value = 'fr';

      expect(i18n.global.t('authentication.guestQuota.syllabus', { n, limit: 1 }, n)).toContain(
        text
      );
    });
  });
});
