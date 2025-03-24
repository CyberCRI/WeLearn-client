export const getQueryParamValue = (query: string) => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  return urlSearchParams.get(query);
};

export const getPagePath = () => {
  return window.location.pathname;
};
