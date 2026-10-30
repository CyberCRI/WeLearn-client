import mixpanel from 'mixpanel-browser';
import type { AnalyticsEvents } from '@/types';

// share of consenting sessions that get a (fully masked) replay
export const ANALYTICS_REPLAY_PERCENT = 10;
// CNIL: trackers live at most 13 months
const COOKIE_EXPIRATION_DAYS = 390;
// what mixpanel leaves in local/session storage (persistence, opt-in flag, replay tab id)
const MIXPANEL_STORAGE_PREFIXES = ['mp_', '__mp_opt_in_out_'];

let isConfigured = false;
let hasStarted = false;
let hasConsent = false;
let userId: string | null = null;

// read at call time: docker builds keep the $DOCKER_INJECT_ placeholder until nginx starts
const getToken = () => (import.meta.env.VITE_MIXPANEL_TOKEN || '').trim();
const getEnvironment = () => (import.meta.env.VITE_ENVIRONMENT || '').trim();

// analytics must never break a user action
const safely = (fn: () => void) => {
  if (!isConfigured) return;
  try {
    fn();
  } catch (error) {
    console.error('Analytics error:', error);
  }
};

const clearMixpanelStorage = () => {
  for (const storage of [localStorage, sessionStorage]) {
    Object.keys(storage)
      .filter((key) => MIXPANEL_STORAGE_PREFIXES.some((prefix) => key.startsWith(prefix)))
      .forEach((key) => storage.removeItem(key));
  }
};

// the sdk writes to storage as soon as it is initialized, so it only starts after consent
const startMixpanel = () => {
  if (hasStarted) return;
  const environment = getEnvironment();
  mixpanel.init(getToken(), {
    api_host: 'https://api-eu.mixpanel.com',
    debug: environment.includes('dev'),
    persistence: 'localStorage',
    cookie_expiration: COOKIE_EXPIRATION_DAYS,
    opt_out_tracking_persistence_type: 'localStorage',
    ip: false,
    // pages are tracked by route name, the url can carry query params
    track_pageview: false,
    // sampled by hand in grantAnalyticsConsent
    record_sessions_percent: 0,
    record_mask_all_text: true,
    record_mask_all_inputs: true,
    record_block_selector: 'img, video, audio, input[type="file"]',
    record_console: false,
    record_heatmap_data: true
  });
  hasStarted = true;
};

// no token, placeholder left by an unconfigured container, or test runs: analytics stays off
export const initAnalytics = () => {
  const token = getToken();
  isConfigured = !!token && !token.startsWith('$') && getEnvironment() !== 'test';
};

export const grantAnalyticsConsent = (superProperties: Record<string, string | boolean> = {}) =>
  safely(() => {
    startMixpanel();
    // clears an opt-out stored by a previous refusal
    mixpanel.opt_in_tracking();
    hasConsent = true;
    mixpanel.register({ environment: getEnvironment(), ...superProperties });
    if (userId) mixpanel.identify(userId);
    if (Math.random() * 100 < ANALYTICS_REPLAY_PERCENT) mixpanel.start_session_recording();
  });

// also wipes what an earlier acceptance left on the device
export const revokeAnalyticsConsent = () =>
  safely(() => {
    hasConsent = false;
    if (hasStarted) {
      mixpanel.stop_session_recording();
      mixpanel.opt_out_tracking();
    }
    clearMixpanelStorage();
  });

export const track = <E extends keyof AnalyticsEvents>(event: E, props: AnalyticsEvents[E]) =>
  safely(() => {
    if (hasConsent) mixpanel.track(event, props);
  });

export const setAnalyticsProperties = (props: Record<string, string | boolean>) =>
  safely(() => {
    if (hasConsent) mixpanel.register(props);
  });

// pseudonymous API user id only, never an email or a name
export const identifyUser = (id: string) => {
  userId = id;
  safely(() => {
    if (hasConsent) mixpanel.identify(id);
  });
};

// the next user on this device must not be merged with the previous one
export const resetAnalytics = () => {
  userId = null;
  safely(() => {
    if (!hasConsent) return;
    mixpanel.reset();
    mixpanel.register({ environment: getEnvironment() });
  });
};
