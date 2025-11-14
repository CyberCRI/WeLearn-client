import { defineStore } from 'pinia';
type FeatureFlip = {
  [key: string]: boolean;
};
export const useFeatureFlipStore = defineStore('featureFlip', () => {
  const isDevEnvironment = import.meta.env.VITE_ENVIRONMENT === 'dev';
  const featureFlip: FeatureFlip = {
    tutor: true,
    microlearning: isDevEnvironment
  };

  const isFeatureEnabled = (feature: string) => {
    return featureFlip[feature] || false;
  };

  return {
    featureFlip,
    isFeatureEnabled
  };
});
