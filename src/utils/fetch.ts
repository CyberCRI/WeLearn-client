import axios, { type AxiosRequestConfig } from 'axios';

export const API_BASE = import.meta.env.VITE_API_BASE;
const API_VERSION = import.meta.env.VITE_API_VERSION || '/api/v1';
export const WL_API_KEY = import.meta.env.VITE_WL_API_KEY;

export const getAxios = async (endpoint: string) => {
  if (!API_BASE) throw new Error('API_BASE not defined');

  const response = await axios.get(`${API_BASE}${API_VERSION}${endpoint}`, {
    headers: {
      'X-API-Key': WL_API_KEY
    }
  });

  if (response.status !== 200) throw new Error('Error fetching data');

  return response.data;
};

export const postAxios = async (
  endpoint: string,
  options: Record<string, any> = {},
  config?: AxiosRequestConfig
) => {
  if (!API_BASE) throw new Error('API_BASE not defined');
  console.log(options);

  const enhancedConfig = {
    ...config,
    headers: {
      'X-Session-id': localStorage.getItem('sessionId') || null,
      'X-API-Key': WL_API_KEY
    }
  };

  try {
    const response = await axios.post(
      `${API_BASE}${API_VERSION}${endpoint}`,
      options,
      enhancedConfig
    );

    if (!(response.status >= 200) && !(response.status <= 300)) {
      throw new Error('Error fetching data');
    }

    return response;
  } catch (error) {
    console.error('Error in postAxios:', error);
    throw error;
  }
};

export const getSDGsFromQuery = async (query: string): Promise<string[]> => {
  try {
    const result = await axios.post(
      `https://aurora-sdg.labs.vu.nl/classifier/classify/aurora-sdg-multi`,
      {
        text: query
      }
    );

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
  options: Record<string, any>,
  subject?: string
) => {
  const result = await postAxios(
    `/search/by_document?nb_results=${nbResults}${subject ? `&subject=${subject}` : ''}`,
    options
  );

  if (!result) throw new Error('oopss');

  return result;
};

export const fetchStream = async (
  endpoint: string,
  body: { bodyContent: string }
): Promise<Response['body']> => {
  if (!API_BASE) throw new Error('API_BASE not defined');

  const response = await fetch(`${API_BASE}${API_VERSION}${endpoint}`, {
    method: 'POST',
    body: body.bodyContent,
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json',
      'X-API-Key': WL_API_KEY
    }
  });

  if (!response.body) throw new Error('Error fetching data');

  return response.body;
};

export const postBookmark = async (userId: string, documentId: string) => {
  const resp = await postAxios(
    `/user/:user_id/bookmarks/:document_id?user_id=${userId}&document_id=${documentId}`
  );
  return resp;
};

export const deleteBookmark = async (userId: string, documentId: string) => {
  const resp = await axios.delete(
    `${API_BASE}${API_VERSION}/user/:user_id/bookmarks/:document_id?user_id=${userId}&document_id=${documentId}`,
    {
      headers: {
        'X-API-Key': WL_API_KEY
      }
    }
  );
  return resp;
};

export const deleteAllBookmarks = async (userId: string) => {
  await axios.delete(`${API_BASE}${API_VERSION}/user/:user_id/bookmarks?user_id=${userId}`, {
    headers: {
      'X-API-Key': WL_API_KEY
    }
  });
};

export const getBookmarks = async (userId: string) => {
  const bookmarksIds = await getAxios(`/user/:user_id/bookmarks?user_id=${userId}`);
  const ids = bookmarksIds.bookmarks.reduce((acc: string[], curr: { document_id: string }) => {
    acc.push(curr.document_id);
    return acc;
  }, []);
  const docsPayloads = await postAxios('/search/documents/by_ids', ids);
  return docsPayloads;
};
