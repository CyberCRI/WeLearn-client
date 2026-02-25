import { postAxios } from '@/utils/fetch';

export const getUserAndSession = async (
  userId?: string,
  sessionId?: string,
  referer?: string
): Promise<{ userId: string; sessionId: string }> => {
  try {
    if (!userId && sessionId) {
      localStorage.removeItem('sessionId');
    }

    const newUserId = await getUserId(userId, referer);
    const newSessionId = await getSessionId(newUserId, sessionId, referer);

    if (!newUserId || !newSessionId) {
      throw new Error('Failed to retrieve user ID or session ID');
    }

    return { userId: newUserId, sessionId: newSessionId };
  } catch (error) {
    console.warn('Failed to get user and session:', error);
    throw error;
  }
};

const getUserId = async (userId?: string, referer?: string): Promise<string> => {
  const parts: string[] = [];

  if (userId) parts.push(`user_id=${encodeURIComponent(userId)}`);
  if (referer) parts.push(`referer=${encodeURIComponent(referer)}`);

  const query = parts.length ? `?${parts.join('&')}` : '';
  const respUserId = await postAxios(`/user/user${query}`);
  return respUserId.data.user_id;
};

const getSessionId = async (
  userId: string,
  sessionId?: string,
  referer?: string
): Promise<string> => {
  const parts: string[] = [];
  parts.push(`user_id=${encodeURIComponent(userId)}`);
  if (sessionId) parts.push(`session_id=${encodeURIComponent(sessionId)}`);
  if (referer) parts.push(`referer=${encodeURIComponent(referer)}`);

  const query = `?${parts.join('&')}`;
  const respSessionId = await postAxios(`/user/session${query}`);
  return respSessionId.data.session_id;
};
