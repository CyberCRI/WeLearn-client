import { defineStore } from 'pinia';
type FeatureFlip = {
  [key: string]: boolean;
};
export const useFeatureFlipStore = defineStore('featureFlip', () => {
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
