import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import http, { getAuthHeaders, handleUnauthorized } from './api';
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

export const getSDGsFromQuery = async (query: string): Promise<string[]> => {
  try {
    // external classifier, not part of the WeLearn API contract
    const result = await axios.post<{
      predictions: { prediction: number; sdg: { code: string } }[];
    }>(`https://aurora-sdg.labs.vu.nl/classifier/classify/aurora-sdg-multi`, {
      text: query
    });

    if (!result) return [];

    const sdgs = result.data.predictions
      .sort((a, b) => b.prediction - a.prediction)
      .slice(0, 3)
      .map(({ sdg }) => sdg.code)
      .filter((sdg) => Number(sdg) > 0.1);

    return sdgs;
  } catch (error) {
    console.error(error);
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
    handleUnauthorized(response.status);
    throw new StreamResponseError(response.status, await readErrorBody(response));
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

export const getBookmarks = async () => {
  const bookmarksIds = await baseGetAxios<ApiResponse<'/user/bookmarks'>>(`/user/bookmarks`);
  const ids = bookmarksIds.bookmarks.map((bookmark) => bookmark.document_id);
  const docsPayloads = await basePostAxios<ApiResponse<'/search/documents/by_ids', 'post'>>(
    '/search/documents/by_ids',
    ids
  );
  return docsPayloads;
};

export const exportBibliography = async (documentsIds: string[]) => {
  if (!documentsIds.length) throw new Error('No document ids provided');

  const body: ApiRequestBody<'/bibliography/export_bibliography'> = {
    documents_ids: documentsIds
  };
  return basePostAxios<Blob>('/bibliography/export_bibliography', body, {
    responseType: 'blob'
  });
};
