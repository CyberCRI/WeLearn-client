// function that will save to locale storage data
export const saveToStorage = function (key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
};

// funtion that will allow store to retrieve data from locale storage
export const getFromStorage = function (key: string) {
  if (!localStorage.getItem(key)) {
    return null;
  }

  return JSON.parse(localStorage.getItem(key) || '');
};

// function to clear key from local storage
export const clearFromStorage = function (key: string) {
  localStorage.removeItem(key);
};
