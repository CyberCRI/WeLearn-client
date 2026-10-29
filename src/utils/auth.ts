import { basePostAxios } from '@/utils/fetch';
import { useUserStore } from '@/stores/user';
import type { ApiResponse } from '@/types/api';

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
  const response = await basePostAxios<ApiResponse<'/user/user_and_session', 'post'>>(
    `/user/user_and_session${query}`
  );

  if (!response || !response.data) {
    throw new Error('Invalid response from server');
  }
  // saves the session, and clears the previous user's data if the user changed
  useUserStore().syncUserId(response.data.user_id, response.data.session_id);
  return response.data.message;
};
