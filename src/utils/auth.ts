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
      const respUserId =
        await postAxios(`/user/user${userId ? `?user_id=${userId}` : ''}${referer ? `&referer=${encodeURIComponent(referer)}` : ''}`);
      newUserId = respUserId.data.user_id;
    }

    if (newUserId) {
      const respSessionId =
        await postAxios(`/user/session?user_id=${newUserId}${referer ? `&referer=${encodeURIComponent(referer)}` : ''}`);
      newSessionId = respSessionId.data.session_id;
    }
    return { userId: newUserId, sessionId: newSessionId };
  } catch (error) {
    console.warn('Failed to get user and session:', error);
    throw error;
  }
};
