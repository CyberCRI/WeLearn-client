export const secondsToMinAndHours = (seconds: number): string => {
  const modSec = seconds % 60;
  const minutes = Math.floor(seconds / 60);
  if (minutes === 0) return `${modSec}s`;
  if (minutes <= 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const modMin = minutes % 60;
  return `${hours}h${modMin.toString().padStart(2, '0')}m`;
};

// a calendar day (yyyy-mm-dd) in words, read as UTC so a timezone west of UTC does not show the
// day before
export const formatDay = (day: string, locale: string): string =>
  new Date(`${day}T00:00:00Z`).toLocaleDateString(locale, { dateStyle: 'long', timeZone: 'UTC' });
