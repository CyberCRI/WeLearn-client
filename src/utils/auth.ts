import { basePostAxios } from '@/utils/fetch';

export const getUserAndSession = async (referer?: string): Promise<string> => {
  try {
    const status = await handleUserAndSessionPost(referer);

    return status;
  } catch (error) {
    console.warn('Failed to get user and session:', error);
    throw error;
  }
};

const handleUserAndSessionPost = async (referer?: string): Promise<string> => {
  const parts: string[] = [];
  if (referer) parts.push(`referer=${encodeURIComponent(referer)}`);

  const query = parts.length ? `?${parts.join('&')}` : '';
  const response = await basePostAxios(`/user/user_and_session${query}`);

  if (!response || !response.data) {
    throw new Error('Invalid response from server');
  }
  return response.data.message;
};
