import { cookies } from 'next/headers';

import { API_URL } from '@/constants/api';
import { EventResp } from '@/services/events/eventTypes';

export async function loadEventForMetadata(
  slug: string
): Promise<EventResp | null> {
  if (!API_URL) return null;

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
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
