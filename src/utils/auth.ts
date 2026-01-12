import { postAxios } from '@/utils/fetch';

export const getUserAndSession = async (
  userId?: string,
  sessionId?: string,
  referer?: string
): { userId: string; sessionId: string } => {
  try {
    if (userId && sessionId) return { userId, sessionId };

    if (!userId && sessionId) {
      localStorage.removeItem('sessionId');
    }

    let newUserId = userId;
    let newSessionId = sessionId;

    if (!newUserId) {
      const parts: string[] = [];
      if (userId) parts.push(`user_id=${encodeURIComponent(userId)}`);
      if (referer) parts.push(`referer=${encodeURIComponent(referer)}`);

      const query = parts.length ? `?${parts.join('&')}` : '';
      const respUserId = await postAxios(`/user/user${query}`);
      newUserId = respUserId.data.user_id;
    }

    if (newUserId) {
      const parts: string[] = [];
      parts.push(`user_id=${encodeURIComponent(newUserId)}`);
      if (referer) parts.push(`referer=${encodeURIComponent(referer)}`);

      const query = `?${parts.join('&')}`;
      const respSessionId = await postAxios(`/user/session${query}`);

      newSessionId = respSessionId.data.session_id;
    }
    return { userId: newUserId, sessionId: newSessionId };
  } catch (error) {
    console.warn('Failed to get user and session:', error);
    throw error;
  }
};
