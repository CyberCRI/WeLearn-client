import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useAccountAccessStore } from '../accountAccess';
import i18n from '@/localisation/i18n';

const auth = vi.hoisted(() => ({
  isAuthenticated: true,
  tokenParsed: { sub: 'user-1' } as { sub?: string } | undefined
}));
vi.mock('@/stores/auth', () => ({ useAuthStore: () => auth }));

const fetchMocks = vi.hoisted(() => ({ getAccountAccess: vi.fn() }));
vi.mock('@/utils/fetch', () => ({ getAccountAccess: fetchMocks.getAccountAccess }));

const LIMITED = { limited: true, access_until: '2027-05-20', days_left: 184 };

describe('account access store', () => {
  beforeEach(() => {
    auth.isAuthenticated = true;
    auth.tokenParsed = { sub: 'user-1' };
    localStorage.clear();
    setActivePinia(createPinia());
    fetchMocks.getAccountAccess.mockResolvedValue(LIMITED);
    i18n.global.locale.value = 'en';
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('opens the notice the first time a limited account comes in', async () => {
    const store = useAccountAccessStore();

    await store.refresh();

    expect(store.isLimited).toBe(true);
    expect(store.daysLeft).toBe(184);
    expect(store.accessUntilLabel).toBe('May 20, 2027');
    expect(store.isNoticeOpen).toBe(true);
  });

  it('does not open it again once closed for this account', async () => {
    const store = useAccountAccessStore();
    await store.refresh();
    store.closeNotice();
    expect(store.isNoticeOpen).toBe(false);

    setActivePinia(createPinia());
    const next = useAccountAccessStore();
    await next.refresh();

    expect(next.isNoticeOpen).toBe(false);
    expect(next.isLimited).toBe(true);
  });

  it('opens it for another limited account of the same browser', async () => {
    const store = useAccountAccessStore();
    await store.refresh();
    store.closeNotice();

    auth.tokenParsed = { sub: 'user-2' };
    setActivePinia(createPinia());
    const next = useAccountAccessStore();
    await next.refresh();

    expect(next.isNoticeOpen).toBe(true);
    expect(JSON.parse(localStorage.getItem('limitedAccessNoticeSeen') || '[]')).toEqual(['user-1']);
  });

  it('says nothing to an institution account', async () => {
    fetchMocks.getAccountAccess.mockResolvedValue({ limited: false });
    const store = useAccountAccessStore();

    await store.refresh();

    expect(store.isLimited).toBe(false);
    expect(store.isNoticeOpen).toBe(false);
    expect(store.accessUntilLabel).toBeNull();
  });

  it('formats the date in the app language', async () => {
    i18n.global.locale.value = 'fr';
    const store = useAccountAccessStore();

    await store.refresh();

    expect(store.accessUntilLabel).toBe('20 mai 2027');
  });

  it('still opens the notice when the end date is not known yet', async () => {
    fetchMocks.getAccountAccess.mockResolvedValue({ limited: true });
    const store = useAccountAccessStore();

    await store.refresh();

    expect(store.isNoticeOpen).toBe(true);
    expect(store.accessUntilLabel).toBeNull();
    expect(store.daysLeft).toBeNull();
  });

  it('does not call the API for a guest', async () => {
    auth.isAuthenticated = false;
    const store = useAccountAccessStore();

    await store.refresh();

    expect(fetchMocks.getAccountAccess).not.toHaveBeenCalled();
    expect(store.access).toBeNull();
  });

  it('keeps quiet when the call fails', async () => {
    fetchMocks.getAccountAccess.mockRejectedValue(new Error('403'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const store = useAccountAccessStore();

    await store.refresh();

    expect(store.isNoticeOpen).toBe(false);
    expect(store.access).toBeNull();
  });
});
