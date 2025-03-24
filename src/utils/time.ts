export const secondsToMinAndHours = (seconds: number): string => {
  const modSec = seconds % 60;
  const minutes = Math.floor(seconds / 60);
  if (minutes === 0) return `${modSec}s`;
  if (minutes <= 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const modMin = minutes % 60;
  return `${hours}h${modMin.toString().padStart(2, '0')}m`;
};
