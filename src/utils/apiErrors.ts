// the `detail` of an API error. Axios errors and fetchStream's StreamResponseError share
// `error.response.data`; domain errors answer { detail: { message, code, ... } }
export const apiErrorDetail = (error: unknown): Record<string, unknown> | undefined => {
  const detail = (error as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
  return detail && typeof detail === 'object' && !Array.isArray(detail)
    ? (detail as Record<string, unknown>)
    : undefined;
};

// 403 for an account whose time-limited access (Google or email login) has ended
export const ACCESS_EXPIRED_CODE = 'ACCESS_EXPIRED';

export const apiErrorCode = (error: unknown): string | undefined => {
  const code = apiErrorDetail(error)?.code;
  return typeof code === 'string' ? code : undefined;
};

// 401 for a guest calling an account-only route (bookmarks, bibliography export, download)
export const isAccountRequired = (error: unknown): boolean =>
  apiErrorCode(error) === 'ACCOUNT_REQUIRED';
