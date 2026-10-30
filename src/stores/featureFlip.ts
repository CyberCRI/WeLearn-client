import { defineStore } from 'pinia';
import { ENVIRONMENTS, ENVIRONMENT_NAME } from '@/utils/env';
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
  auth: ['dev', 'staging']
} satisfies Record<string, readonly Environment[]>;

export type Feature = keyof typeof FEATURE_ENVIRONMENTS;

export const useFeatureFlipStore = defineStore('featureFlip', () => {
  const isFeatureEnabled = (feature: Feature) => {
    const environments: readonly Environment[] = FEATURE_ENVIRONMENTS[feature];
    return environments.includes(ENVIRONMENT_NAME);
  };

  return {
    isFeatureEnabled
  };
});
