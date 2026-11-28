import { API_URL } from '@/constants/api';

export type FollowingViewer = { accountId: string; username: string };
export type FollowingSession =
  | { state: 'authenticated'; viewer: FollowingViewer }
  | { state: 'anonymous' }
  | { state: 'unavailable' };

export async function loadFollowingSession(
  cookieHeader: string
): Promise<FollowingSession> {
  if (!cookieHeader) return { state: 'anonymous' };
  if (!API_URL) return { state: 'unavailable' };
  try {
    const res = await fetch(
      `${API_URL.replace(/\/$/, '')}/auth/validate-session`,
      {
        cache: 'no-store',
        headers: { Cookie: cookieHeader },
      }
    );
    if (res.status === 401 || res.status === 403) return { state: 'anonymous' };
    if (res.status !== 200) return { state: 'unavailable' };
    const data = await res.json();
    if (
      typeof data?.username !== 'string' ||
      !data.username.trim() ||
      typeof data?.account_id !== 'string' ||
      !data.account_id.trim()
    )
      return { state: 'unavailable' };
    return {
      state: 'authenticated',
      viewer: { accountId: data.account_id, username: data.username },
    };
  } catch {
    return { state: 'unavailable' };
  }
}
