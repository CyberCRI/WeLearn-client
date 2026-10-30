// function that will save to locale storage data
export const saveToStorage = function (key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
};

// funtion that will allow store to retrieve data from locale storage
export const getFromStorage = function (key: string) {
  if (!localStorage.getItem(key)) {
    return null;
  }

  try {
    return JSON.parse(localStorage.getItem(key) || '');
  } catch (error) {
    console.error('Error parsing JSON from localStorage for key:', key, error);
    return null;
  }
};

// function to clear key from local storage
export const clearFromStorage = function (key: string) {
  localStorage.removeItem(key);
};

// the same for the current browser tab only (sessionStorage): kept across reloads, gone when the
// tab closes; it can be unavailable (private windows, blocked storage), then nothing is kept
export const saveToSession = function (key: string, value: any) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // nothing kept: the page still works for this visit
  }
};

export const getFromSession = function (key: string) {
  try {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

export const clearFromSession = function (key: string) {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // nothing to clear
  }
};
