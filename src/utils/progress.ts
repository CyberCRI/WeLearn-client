// Percentage of a step-based progress bar, with a small head start so step 0 isn't empty
export const calculateProgress = (step: number, totalSteps: number): number => {
  if (totalSteps <= 1) return 100;
  return (step / (totalSteps - 1) + 0.05) * 100;
};
