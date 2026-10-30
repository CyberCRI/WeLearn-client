import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import mixpanel from 'mixpanel-browser';

vi.mock('mixpanel-browser', () => ({
  default: {
    init: vi.fn(),
    opt_in_tracking: vi.fn(),
    opt_out_tracking: vi.fn(),
    register: vi.fn(),
    identify: vi.fn(),
    track: vi.fn(),
    reset: vi.fn(),
    start_session_recording: vi.fn(),
    stop_session_recording: vi.fn()
  }
}));

// the module keeps its enabled/consent state, so each test gets a fresh copy
const loadAnalytics = async (token = 'token', environment = 'dev') => {
  vi.stubEnv('VITE_MIXPANEL_TOKEN', token);
  vi.stubEnv('VITE_ENVIRONMENT', environment);
  vi.resetModules();
  return import('../analytics');
};

describe('analytics', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetAllMocks();
    vi.restoreAllMocks();
  });

  it.each([
    ['no token', '', 'dev'],
    ['the docker placeholder', '$DOCKER_INJECT_VITE_MIXPANEL_TOKEN', 'dev'],
    ['the test environment', 'token', 'test']
  ])('stays off with %s', async (_label, token, environment) => {
    const analytics = await loadAnalytics(token, environment);

    analytics.initAnalytics();
    analytics.grantAnalyticsConsent();
    analytics.track('Chat Reset', {});

    expect(mixpanel.init).not.toHaveBeenCalled();
    expect(mixpanel.opt_in_tracking).not.toHaveBeenCalled();
    expect(mixpanel.track).not.toHaveBeenCalled();
  });

  it('does not start mixpanel nor touch storage before consent', async () => {
    const analytics = await loadAnalytics();

    analytics.initAnalytics();
    analytics.track('Chat Reset', {});
    analytics.identifyUser('user-1');
    analytics.setAnalyticsProperties({ language: 'en' });
    analytics.resetAnalytics();

    expect(mixpanel.init).not.toHaveBeenCalled();
    expect(mixpanel.track).not.toHaveBeenCalled();
    expect(mixpanel.identify).not.toHaveBeenCalled();
    expect(mixpanel.register).not.toHaveBeenCalled();
    expect(mixpanel.reset).not.toHaveBeenCalled();
  });

  it('starts once, in the EU, without ip and fully masked, on consent', async () => {
    const analytics = await loadAnalytics();
    analytics.initAnalytics();

    analytics.grantAnalyticsConsent();
    analytics.grantAnalyticsConsent();

    expect(mixpanel.init).toHaveBeenCalledOnce();
    expect(mixpanel.init).toHaveBeenCalledWith(
      'token',
      expect.objectContaining({
        api_host: 'https://api-eu.mixpanel.com',
        ip: false,
        track_pageview: false,
        record_sessions_percent: 0,
        record_mask_all_text: true,
        record_mask_all_inputs: true
      })
    );
  });

  it('opts in, registers the super properties and identifies a known user on consent', async () => {
    const analytics = await loadAnalytics();
    analytics.initAnalytics();
    analytics.identifyUser('user-1');

    analytics.grantAnalyticsConsent({ language: 'fr' });

    expect(mixpanel.opt_in_tracking).toHaveBeenCalled();
    expect(mixpanel.register).toHaveBeenCalledWith({ environment: 'dev', language: 'fr' });
    expect(mixpanel.identify).toHaveBeenCalledWith('user-1');
  });

  it('starts a replay for the sampled sessions only', async () => {
    const analytics = await loadAnalytics();
    analytics.initAnalytics();

    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    analytics.grantAnalyticsConsent();
    expect(mixpanel.start_session_recording).not.toHaveBeenCalled();

    vi.spyOn(Math, 'random').mockReturnValue(0);
    analytics.grantAnalyticsConsent();
    expect(mixpanel.start_session_recording).toHaveBeenCalledTimes(1);
  });

  it('tracks, identifies and resets once consent is given', async () => {
    const analytics = await loadAnalytics();
    analytics.initAnalytics();
    analytics.grantAnalyticsConsent();

    analytics.track('Bookmark Removed', { bookmarksCount: 2 });
    analytics.identifyUser('user-2');
    analytics.setAnalyticsProperties({ language: 'en' });
    analytics.resetAnalytics();

    expect(mixpanel.track).toHaveBeenCalledWith('Bookmark Removed', { bookmarksCount: 2 });
    expect(mixpanel.identify).toHaveBeenCalledWith('user-2');
    expect(mixpanel.register).toHaveBeenCalledWith({ language: 'en' });
    expect(mixpanel.reset).toHaveBeenCalled();
    // the environment survives the reset
    expect(mixpanel.register).toHaveBeenLastCalledWith({ environment: 'dev' });
  });

  it('stops the replay, opts out and wipes the mixpanel storage when consent is revoked', async () => {
    const analytics = await loadAnalytics();
    analytics.initAnalytics();
    analytics.grantAnalyticsConsent();
    localStorage.setItem('mp_token_mixpanel', '{}');
    sessionStorage.setItem('mp_tab_id_token', 'tab');
    localStorage.setItem('language', 'en');

    analytics.revokeAnalyticsConsent();
    analytics.track('Chat Reset', {});

    expect(mixpanel.stop_session_recording).toHaveBeenCalled();
    expect(mixpanel.opt_out_tracking).toHaveBeenCalled();
    expect(mixpanel.track).not.toHaveBeenCalled();
    expect(localStorage.getItem('mp_token_mixpanel')).toBeNull();
    expect(sessionStorage.getItem('mp_tab_id_token')).toBeNull();
    expect(localStorage.getItem('language')).toBe('en');
  });

  it('wipes what a previous acceptance left without starting mixpanel', async () => {
    const analytics = await loadAnalytics();
    analytics.initAnalytics();
    localStorage.setItem('__mp_opt_in_out_token', '1');

    analytics.revokeAnalyticsConsent();

    expect(mixpanel.init).not.toHaveBeenCalled();
    expect(mixpanel.opt_out_tracking).not.toHaveBeenCalled();
    expect(localStorage.getItem('__mp_opt_in_out_token')).toBeNull();
  });

  it('never throws when the sdk fails', async () => {
    const analytics = await loadAnalytics();
    analytics.initAnalytics();
    analytics.grantAnalyticsConsent();
    vi.mocked(mixpanel.track).mockImplementation(() => {
      throw new Error('blocked');
    });

    expect(() => analytics.track('Chat Reset', {})).not.toThrow();
    expect(console.error).toHaveBeenCalled();
  });

  it('does not opt in when the sdk fails to start', async () => {
    const analytics = await loadAnalytics();
    analytics.initAnalytics();
    vi.mocked(mixpanel.init).mockImplementation(() => {
      throw new Error('blocked');
    });

    analytics.grantAnalyticsConsent();
    analytics.track('Chat Reset', {});

    expect(mixpanel.opt_in_tracking).not.toHaveBeenCalled();
    expect(mixpanel.track).not.toHaveBeenCalled();
  });
});
