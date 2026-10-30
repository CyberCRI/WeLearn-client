import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import ConsentBanner from '../ConsentBanner.vue';
import FooterComponent from '../FooterComponent.vue';
import { useUserStore } from '@/stores/user';
import { grantAnalyticsConsent, revokeAnalyticsConsent } from '@/utils/analytics';

vi.mock('@/utils/analytics', () => ({
  grantAnalyticsConsent: vi.fn(),
  identifyUser: vi.fn(),
  resetAnalytics: vi.fn(),
  revokeAnalyticsConsent: vi.fn(),
  track: vi.fn()
}));

const mountWithRouter = (component: typeof ConsentBanner) =>
  mount(component, { global: { stubs: { RouterLink: RouterLinkStub } } });

describe('ConsentBanner', () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('shows accept and refuse side by side until a choice is made', () => {
    const wrapper = mountWithRouter(ConsentBanner);

    expect(wrapper.find('[data-testid="consent-banner"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="consent-accept"]').classes()).toEqual(
      wrapper.find('[data-testid="consent-refuse"]').classes()
    );
    expect(wrapper.findComponent(RouterLinkStub).props('to')).toBe('/terms');
  });

  it('is hidden when a choice is stored', () => {
    localStorage.setItem(
      'analyticsConsent',
      JSON.stringify({ status: 'denied', date: new Date().toISOString() })
    );

    expect(mountWithRouter(ConsentBanner).find('[data-testid="consent-banner"]').exists()).toBe(
      false
    );
  });

  it('opts in and hides on accept', async () => {
    const wrapper = mountWithRouter(ConsentBanner);

    await wrapper.find('[data-testid="consent-accept"]').trigger('click');

    expect(grantAnalyticsConsent).toHaveBeenCalled();
    expect(wrapper.find('[data-testid="consent-banner"]').exists()).toBe(false);
  });

  it('opts out and hides on refuse', async () => {
    const wrapper = mountWithRouter(ConsentBanner);

    await wrapper.find('[data-testid="consent-refuse"]').trigger('click');

    expect(revokeAnalyticsConsent).toHaveBeenCalled();
    expect(useUserStore().analyticsConsent?.status).toBe('denied');
    expect(wrapper.find('[data-testid="consent-banner"]').exists()).toBe(false);
  });

  it('reopens from the footer link', async () => {
    const store = useUserStore();
    store.setAnalyticsConsent(false);
    const footer = mountWithRouter(FooterComponent);

    await footer.find('[data-testid="consent-settings"]').trigger('click');

    expect(store.shouldAskAnalyticsConsent).toBe(true);
  });
});
