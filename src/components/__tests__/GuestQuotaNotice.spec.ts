import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import GuestQuotaNotice from '../GuestQuotaNotice.vue';
import { track } from '@/utils/analytics';

const push = vi.fn();
vi.mock('vue-router', () => ({ useRouter: () => ({ push }) }));
vi.mock('@/utils/analytics', () => ({ track: vi.fn() }));

const auth = vi.hoisted(() => ({ isGuest: true, askToSignUp: vi.fn() }));
vi.mock('@/stores/auth', () => ({ useAuthStore: () => auth }));

describe('GuestQuotaNotice', () => {
  beforeEach(() => {
    auth.isGuest = true;
    localStorage.clear();
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('is hidden for a logged in user', () => {
    auth.isGuest = false;

    const wrapper = mount(GuestQuotaNotice, { props: { feature: 'chat' } });

    expect(wrapper.find('[data-testid="guest-quota-notice"]').exists()).toBe(false);
  });

  it('tells a guest what the feature allows', () => {
    const wrapper = mount(GuestQuotaNotice, { props: { feature: 'syllabus' } });

    expect(wrapper.get('[data-testid="guest-quota-text"]').text()).toBe(
      'authentication.guestQuota.syllabus'
    );
    expect(wrapper.get('[data-testid="guest-quota-notice"]').classes()).not.toContain('is-used-up');
  });

  it('stands out once the quota is used', () => {
    localStorage.setItem('guestUsage', JSON.stringify({ chat: 5, syllabus: 0 }));

    const wrapper = mount(GuestQuotaNotice, { props: { feature: 'chat' } });

    expect(wrapper.get('[data-testid="guest-quota-notice"]').classes()).toContain('is-used-up');
  });

  it('sends the guest to the register page', async () => {
    localStorage.setItem('guestUsage', JSON.stringify({ chat: 3, syllabus: 0 }));
    const wrapper = mount(GuestQuotaNotice, { props: { feature: 'chat' } });

    await wrapper.get('a').trigger('click');

    expect(push).toHaveBeenCalledWith('/register');
    expect(track).toHaveBeenCalledWith('Guest Quota Notice Clicked', {
      feature: 'chat',
      remaining: 2
    });
  });
});
