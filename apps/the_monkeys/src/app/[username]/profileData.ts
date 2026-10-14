import { API_URL } from '@/constants/api';
import { requestCache } from '@/lib/requestCache';
import { GetPublicUserProfileApiResponse } from '@/services/profile/userApiTypes';

export const loadPublicProfile = requestCache(
  async (
    username: string
  ): Promise<GetPublicUserProfileApiResponse | null | undefined> => {
    if (!username) return null;
    if (!API_URL) return undefined;
    try {
      const response = await fetch(
        `${API_URL}/user/public/${encodeURIComponent(username)}`,
        { next: { revalidate: 300 } }
      );
      if (response.status === 404) return null;
      if (!response.ok) return undefined;
      const value = (await response.json()) as GetPublicUserProfileApiResponse;
      return value?.username ? value : undefined;
    } catch {
      return undefined;
    }
  }
);
