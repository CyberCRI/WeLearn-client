import { defineStore } from 'pinia';
type FeatureFlip = {
  [key: string]: boolean;
};
export const useFeatureFlipStore = defineStore('featureFlip', () => {
  // const { VITE_ENVIRONMENT } = import.meta.env;
  // const env = VITE_ENVIRONMENT as 'dev' | 'prod';
  const featureFlip: FeatureFlip = {
    tutor: true
  };

  const isFeatureEnabled = (feature: string) => {
    return featureFlip[feature] || false;
  };

  return {
    featureFlip,
    isFeatureEnabled
  };
});
