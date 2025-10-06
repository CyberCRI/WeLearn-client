import { postAxios } from '@/utils/fetch';

export const getUserAndSession = async (userId?: string, sessionId?: string) => {
  try {
    if (userId && sessionId) return;

    if (!userId && sessionId) {
      localStorage.removeItem('sessionId');
    }

    if (!userId) {
      const newUserId = await postAxios(`/user/user${userId ? `?user_id=${userId}` : ''}`);
      userId = newUserId.data.user_id;
    }

    if (userId) {
      const newSessionId = await postAxios(`/user/session?user_id=${userId}`);
      sessionId = newSessionId.data.session_id;
    }
    localStorage.setItem('userId', userId);
    localStorage.setItem('sessionId', sessionId);
    return { userId, sessionId };
  } catch (error) {
    console.warn('Failed to get user and session:', error);
  }
};
