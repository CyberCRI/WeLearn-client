import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import http, { getAuthHeaders, handleUnauthorized } from './api';
import { apiErrorCode } from './apiErrors';
import type { ApiRequestBody, ApiResponse } from '@/types/api';

// pass the response type from `@/types/api`, e.g. baseGetAxios<ApiResponse<'/user/bookmarks'>>
export const baseGetAxios = async <T = any>(endpoint: string): Promise<T> => {
  const response = await http.get<T>(`${endpoint}`);

  if (response.status !== 200) throw new Error('Error fetching data');

  return response.data;
};

export const basePostAxios = async <T = any>(
  endpoint: string,
  options: Record<string, any> = {},
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  try {
    const response = await http.post<T>(`${endpoint}`, options, config);

    if (!(response.status >= 200) && !(response.status <= 300)) {
      throw new Error('Error fetching data');
    }

    return response;
  } catch (error) {
    console.error('Error in basePostAxios:', error);
    throw error;
  }
};

export const baseDeleteAxios = async <T = any>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  try {
    const response = await http.delete<T>(`${endpoint}`, config);

    if (!(response.status >= 200) && !(response.status <= 300)) {
      throw new Error('Error deleting data');
    }

    return response;
  } catch (error) {
    console.error('Error in baseDeleteAxios:', error);
    throw error;
  }
};

// the API calls the classifier (VU Amsterdam), so it gets the text but not the user's IP or
// browser. it keeps the 3 best SDGs above its confidence threshold, best first
export const getSDGsFromQuery = async (
  query: string
): Promise<ApiResponse<'/search/sdg_classify', 'post'>['sdgs']> => {
  try {
    const body: ApiRequestBody<'/search/sdg_classify'> = { query };
    const result = await basePostAxios<ApiResponse<'/search/sdg_classify', 'post'>>(
      '/search/sdg_classify',
      body
    );

    return result.data.sdgs;
  } catch {
    // the sdgs are a hint next to the results: without them the search goes on
    return [];
  }
};

export const getSearch = async (
  nbResults: number,
  options: ApiRequestBody<'/search/by_document'>,
  { subject, relevanceFactor }: { subject?: string; relevanceFactor?: number } = {}
) => {
  // the API reads these from the query string, not the body
  const result = await basePostAxios<ApiResponse<'/search/by_document', 'post'>>(
    '/search/by_document',
    options,
    { params: { nb_results: nbResults, subject, relevance_factor: relevanceFactor } }
  );

  if (!result) throw new Error('oopss');

  return result;
};

const API_BASE = import.meta.env.VITE_API_BASE;
const API_VERSION = import.meta.env.VITE_API_VERSION || '/api/v1';
const WL_API_KEY = import.meta.env.VITE_WL_API_KEY;

// same shape as an AxiosError, so stores read `error.response.data.detail.code` the usual way
export class StreamResponseError extends Error {
  response: { status: number; data: unknown };

  constructor(status: number, data: unknown) {
    super(`Stream request failed with status ${status}`);
    this.name = 'StreamResponseError';
    this.response = { status, data };
  }
}

// the API answers errors in json ({ detail: { code } }), a proxy may answer plain text
const readErrorBody = async (response: Response): Promise<unknown> => {
  const text = await response.text().catch(() => '');
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const fetchStream = async (
  endpoint: string,
  body: { bodyContent: string },
  { signal }: { signal?: AbortSignal } = {}
): Promise<Response['body']> => {
  if (!API_BASE) throw new Error('API_BASE not defined');

  const response = await fetch(`${API_BASE}${API_VERSION}${endpoint}`, {
    method: 'POST',
    body: body.bodyContent,
    credentials: 'include',
    signal,
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json',
      'X-API-Key': WL_API_KEY,
      ...(await getAuthHeaders())
    }
  });

  // an error body must never be streamed as the answer
  if (!response.ok) {
    const error = new StreamResponseError(response.status, await readErrorBody(response));
    handleUnauthorized(response.status, apiErrorCode(error));
    throw error;
  }

  if (!response.body) throw new Error('Error fetching data');

  return response.body;
};

export const postBookmark = async (documentId: string) => {
  const resp = await basePostAxios<ApiResponse<'/user/bookmarks/{document_id}', 'post'>>(
    `/user/bookmarks/${documentId}`
  );
  return resp;
};

export const deleteBookmark = async (documentId: string) => {
  const resp = await http.delete<ApiResponse<'/user/bookmarks/{document_id}', 'delete'>>(
    `/user/bookmarks/${documentId}`
  );
  return resp;
};

export const deleteAllBookmarks = async () => {
  await http.delete(`/user/bookmarks`);
};

// the daily guest quotas left; `limited` is false for an account
export const getGuestQuota = () =>
  baseGetAxios<ApiResponse<'/user/guest_quota'>>('/user/guest_quota');

export const getAccountAccess = () => baseGetAxios<ApiResponse<'/user/access'>>('/user/access');

export const getBookmarks = async () => {
  const bookmarksIds = await baseGetAxios<ApiResponse<'/user/bookmarks'>>(`/user/bookmarks`);
  const ids = bookmarksIds.bookmarks.map((bookmark) => bookmark.document_id);
  const docsPayloads = await basePostAxios<ApiResponse<'/search/documents/by_ids', 'post'>>(
    '/search/documents/by_ids',
    ids
  );
  return docsPayloads;
};

// 404 THREAD_NOT_FOUND when the thread is already gone or not the caller's
export const deleteChatThread = async (threadId: string) =>
  baseDeleteAxios<ApiResponse<'/qna/chat/threads/{thread_id}', 'delete'>>(
    `/qna/chat/threads/${encodeURIComponent(threadId)}`
  );

export const exportBibliography = async (documentsIds: string[]) => {
  if (!documentsIds.length) throw new Error('No document ids provided');

  const body: ApiRequestBody<'/bibliography/export_bibliography'> = {
    documents_ids: documentsIds
  };
  return basePostAxios<Blob>('/bibliography/export_bibliography', body, {
    responseType: 'blob'
  });
};
