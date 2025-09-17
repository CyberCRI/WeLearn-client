import { postAxios } from '@/utils/fetch';

export const getUserAndSession = async () => {
  const userID = localStorage.getItem('userId');
  const sessionID = localStorage.getItem('sessionId');

  const newUserId = await postAxios(`/user/user?user_id=${userID || ''}`);
  const newSessionId = await postAxios(
    `/user/session?user_id=${newUserId.data.user_id || ''}&session_id=${sessionID || ''}`
  );

  localStorage.setItem('userId', newUserId.data.user_id);
  localStorage.setItem('sessionId', newSessionId.data.session_id);
};
