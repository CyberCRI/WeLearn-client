import { defineStore } from 'pinia';
import { ENVIRONMENTS, ENVIRONMENT_NAME } from '@/utils/env';
import { clearFromStorage, getFromStorage, saveToStorage } from '@/utils/storage';
import type { Environment } from '@/types';

// where each feature is on. a new page gets an entry here and a `meta.feature` on its route;
// remove the entry once the feature is on everywhere and nothing reads it anymore
const FEATURE_ENVIRONMENTS = {
  chat: ENVIRONMENTS,
  tutor: ENVIRONMENTS,
  search: ENVIRONMENTS,
  bookmarks: ENVIRONMENTS,
  about: ENVIRONMENTS,
  microlearning: ENVIRONMENTS,
  workshop: ['dev'],
  // keycloak login is rolled out on dev and staging, not on prod yet
  auth: ['dev', 'staging'],
  // mixpanel + consent banner, dev only until the rollout is validated
  analytics: ['dev']
} satisfies Record<string, readonly Environment[]>;

export type Feature = keyof typeof FEATURE_ENVIRONMENTS;

// `?preview=auth,analytics` turns features on for this browser where their env keeps them off,
// `?preview=off` turns it back off. kept in storage because the param is lost on reload and on
// the keycloak redirects. ponytail: hidden, not secret, anyone who knows the param gets it
const PREVIEW_STORAGE_KEY = 'featurePreview';
const PREVIEW_QUERY_PARAM = 'preview';
const PREVIEW_OFF = 'off';

const isFeature = (value: string): value is Feature =>
  Object.prototype.hasOwnProperty.call(FEATURE_ENVIRONMENTS, value);

function loadPreviewFeatures(): Feature[] {
  const param = new URLSearchParams(window.location.search).get(PREVIEW_QUERY_PARAM);
  const stored: unknown = getFromStorage(PREVIEW_STORAGE_KEY);
  const saved = Array.isArray(stored) ? stored.filter(isFeature) : [];

  if (param === null) return saved;
  if (param === PREVIEW_OFF) {
    clearFromStorage(PREVIEW_STORAGE_KEY);
    return [];
  }

  const requested = param.split(',').map((name) => name.trim());
  const features = [...new Set([...saved, ...requested.filter(isFeature)])];
  saveToStorage(PREVIEW_STORAGE_KEY, features);
  return features;
}

export const useFeatureFlipStore = defineStore('featureFlip', () => {
  const previewFeatures: readonly Feature[] = loadPreviewFeatures();

  const isFeatureEnabled = (feature: Feature) => {
    const environments: readonly Environment[] = FEATURE_ENVIRONMENTS[feature];
    return environments.includes(ENVIRONMENT_NAME) || previewFeatures.includes(feature);
  };

  return {
    previewFeatures,
    isFeatureEnabled
  };
});
