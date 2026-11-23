import { defineStore } from 'pinia';
import { ENVIRONMENTS, ENVIRONMENT_NAME } from '@/utils/env';
import featureEnvironments from '@/featureEnvironments.json';
import { clearFromStorage, getFromStorage, saveToStorage } from '@/utils/storage';
import type { Environment } from '@/types';

// where each feature is on, with what docs/features.md says about it (`yarn docs:features` writes
// that page from this file). a new page gets an entry there and a `meta.feature` on its route;
// remove the entry once the feature is on everywhere and nothing reads it anymore
export type Feature = keyof typeof featureEnvironments;

const isEnvironment = (value: string): value is Environment =>
  (ENVIRONMENTS as readonly string[]).includes(value);

// a name that is not an environment is left out here, and refused by the docs script
export const environmentsOf = (feature: Feature): readonly Environment[] =>
  featureEnvironments[feature].environments.filter(isEnvironment);

// `?preview=auth,analytics` turns features on for this browser where their env keeps them off,
// `?preview=off` turns it back off. kept in storage because the param is lost on reload and on
// the keycloak redirects. hidden, not secret, anyone who knows the param gets it
const PREVIEW_STORAGE_KEY = 'featurePreview';
const PREVIEW_QUERY_PARAM = 'preview';
const PREVIEW_OFF = 'off';

const isFeature = (value: string): value is Feature =>
  Object.prototype.hasOwnProperty.call(featureEnvironments, value);

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
    return environmentsOf(feature).includes(ENVIRONMENT_NAME) || previewFeatures.includes(feature);
  };

  return {
    previewFeatures,
    isFeatureEnabled
  };
});
