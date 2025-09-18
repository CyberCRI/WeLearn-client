import { postAxios } from '@/utils/fetch';

export const getUserAndSession = async () => {
  try {
    const userID = localStorage.getItem('userId');
    const sessionID = localStorage.getItem('sessionId');

    const newUserId = await postAxios(`/user/user${userID ? `?user_id=${userID}` : ''}`);
    localStorage.setItem('userId', newUserId.data.user_id);
    if (newUserId.data.user_id) {
      const newSessionId = await postAxios(
        `/user/session?user_id=${newUserId.data.user_id}${sessionID ? `&session_id=${sessionID}` : ''}`
      );
      localStorage.setItem('sessionId', newSessionId.data.session_id);
    }
  } catch (error) {
    console.warn('Failed to get user and session:', error);
  }
};
