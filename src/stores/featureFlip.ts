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

  const isWorkshopFeatureEnabled = () => {
    const isDevEnvironment = import.meta.env.VITE_ENVIRONMENT.trim().includes('dev');
    console.log(import.meta.env.VITE_ENVIRONMENT);

    // it should be active if url includes 'workshop'
    console.log(isDevEnvironment);
    console.log(isDevEnvironment || window.location.href.includes('workshop'));
    return isDevEnvironment || window.location.href.includes('workshop');
  };

  return {
    featureFlip,
    isFeatureEnabled,
    isWorkshopFeatureEnabled
  };
});
