import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getUserAndSession } from '../auth';
import { basePostAxios } from '@/utils/fetch';

vi.mock('@/utils/fetch', () => ({
  basePostAxios: vi.fn()
}));

type PostResponse = Awaited<ReturnType<typeof basePostAxios>>;

describe('getUserAndSession', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.mocked(basePostAxios).mockReset();
    vi.restoreAllMocks();
  });

  it('stores the session id and returns the message', async () => {
    vi.mocked(basePostAxios).mockResolvedValue({
      data: { session_id: 'session-1', message: 'user and session created' }
    } as PostResponse);

    const message = await getUserAndSession();

    expect(basePostAxios).toHaveBeenCalledWith('/user/user_and_session');
    expect(message).toBe('user and session created');
    expect(localStorage.getItem('sessionId')).toBe('"session-1"');
  });

  it('sends the encoded referer', async () => {
    vi.mocked(basePostAxios).mockResolvedValue({
      data: { session_id: 'session-1', message: 'ok' }
    } as PostResponse);

    await getUserAndSession('https://example.org/?a=1&b=2');

    expect(basePostAxios).toHaveBeenCalledWith(
      '/user/user_and_session?referer=https%3A%2F%2Fexample.org%2F%3Fa%3D1%26b%3D2'
    );
  });

  it('rejects an empty response without touching the session', async () => {
    vi.mocked(basePostAxios).mockResolvedValue({} as PostResponse);

    await expect(getUserAndSession()).rejects.toThrow('Invalid response from server');
    expect(localStorage.getItem('sessionId')).toBeNull();
  });

  it('rethrows a request error', async () => {
    vi.mocked(basePostAxios).mockRejectedValue(new Error('Network Error'));

    await expect(getUserAndSession()).rejects.toThrow('Network Error');
    expect(console.warn).toHaveBeenCalled();
  });
});
