import { cookies } from 'next/headers';

import { API_URL } from '@/constants/api';
import { requestCache } from '@/lib/requestCache';
import { EventResp } from '@/services/events/eventTypes';

export const loadEventForMetadata = requestCache(
  async (slug: string): Promise<EventResp | null | undefined> => {
    if (!slug) return null;
    if (!API_URL) return undefined;

    try {
      const mat = cookies().get('mat')?.value;
      const init: RequestInit = { cache: 'no-store' };

      if (mat) {
        init.headers = { Authorization: `Bearer ${mat}` };
      }

      const res = await fetch(
        `${API_URL}/events/${encodeURIComponent(slug)}`,
        init
      );
      if (res.status === 404) return null;
      if (!res.ok) return undefined;
      const value = (await res.json()) as EventResp;
      return value?.event ? value : undefined;
    } catch {
      return undefined;
    }
  }
);
