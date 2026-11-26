// values are kept as json, in localStorage (kept until removed) or in sessionStorage (gone when
// the tab is closed)
const read = (storage: Storage, key: string) => {
  const raw = storage.getItem(key);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error parsing JSON from storage for key:', key, error);
    return null;
  }
};

const write = (storage: Storage, key: string, value: any) => {
  storage.setItem(key, JSON.stringify(value));
};

export const saveToStorage = (key: string, value: any) => write(localStorage, key, value);

export const getFromStorage = (key: string) => read(localStorage, key);

export const clearFromStorage = (key: string) => localStorage.removeItem(key);

export const saveToSessionStorage = (key: string, value: any) => write(sessionStorage, key, value);

export const getFromSessionStorage = (key: string) => read(sessionStorage, key);

export const clearFromSessionStorage = (key: string) => sessionStorage.removeItem(key);

// removes every localStorage key that matches, for keys built from a prefix
export const clearFromStorageWhere = (matches: (key: string) => boolean) => {
  const keys = Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i));
  keys.filter((key): key is string => !!key && matches(key)).forEach(clearFromStorage);
};

// a saved date (iso string) too old to be used; a date that can't be read counts as too old
export const isOlderThan = (savedAt: unknown, maxAgeMs: number, now = Date.now()) => {
  const time = typeof savedAt === 'string' ? Date.parse(savedAt) : NaN;
  return Number.isNaN(time) || now - time > maxAgeMs;
};

// written by older versions and no longer used: the chat and search text now stays in memory or
// in the tab, the TestMAS form and the welcome form answers are not kept at all
const LEGACY_KEYS = [
  'chat',
  'chatSources',
  'reformulatedQuery',
  'chatMessageId',
  'searchInput',
  'searchResults',
  'searchMessageId',
  'courseMetadaRef',
  'userMetricsData'
];

export const clearLegacyKeys = () => LEGACY_KEYS.forEach(clearFromStorage);
