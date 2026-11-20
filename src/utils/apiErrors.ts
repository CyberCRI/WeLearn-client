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

// the seconds a 429 asks to wait: from the body, since a browser on another origin cannot read
// the Retry-After header, else from that header
export const apiRetryAfter = (error: unknown): number | null => {
  const fromBody = apiErrorDetail(error)?.retry_after;
  const fromHeader = (error as { response?: { headers?: Record<string, unknown> } })?.response
    ?.headers?.['retry-after'];
  const seconds = Number(typeof fromBody === 'number' ? fromBody : fromHeader);
  return Number.isFinite(seconds) && seconds > 0 ? Math.ceil(seconds) : null;
};

// 401 for a guest calling an account-only route (bookmarks, bibliography export, download)
export const isAccountRequired = (error: unknown): boolean =>
  apiErrorCode(error) === 'ACCOUNT_REQUIRED';
