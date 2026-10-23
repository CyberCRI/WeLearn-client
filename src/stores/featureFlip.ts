import { defineStore } from 'pinia';
import { IS_DEV_ENVIRONMENT } from '@/utils/env';
type FeatureFlip = {
  [key: string]: boolean;
};
export const useFeatureFlipStore = defineStore('featureFlip', () => {
  const isDevEnvironment = IS_DEV_ENVIRONMENT;
  const featureFlip: FeatureFlip = {
    tutor: true,
    search: true,
    bookmarks: true,
    chat: true,
    about: true,
    microlearning: true
  };

  const isFeatureEnabled = (feature: string) => {
    return featureFlip[feature] || false;
  };

  const isWorkshopFeatureEnabled = () => {
    return isDevEnvironment;
  };

  return {
    featureFlip,
    isFeatureEnabled,
    isWorkshopFeatureEnabled,
    isDevEnvironment
  };
});
