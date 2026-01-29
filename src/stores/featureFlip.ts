import { defineStore } from 'pinia';
type FeatureFlip = {
  [key: string]: boolean;
};
export const useFeatureFlipStore = defineStore('featureFlip', () => {
  const isDevEnvironment = (import.meta.env.VITE_ENVIRONMENT || '').trim().includes('dev');
  const featureFlip: FeatureFlip = {
    tutor: true,
    search: true,
    bookmarks: true,
    chat: true,
    about: true,
    microlearning: isDevEnvironment
  };

  const isFeatureEnabled = (feature: string) => {
    return featureFlip[feature] || false;
  };

  const isWorkshopFeatureEnabled = () => {
    return isDevEnvironment || window.location.href.includes('workshop');
  };

  return {
    featureFlip,
    isFeatureEnabled,
    isWorkshopFeatureEnabled
  };
});
