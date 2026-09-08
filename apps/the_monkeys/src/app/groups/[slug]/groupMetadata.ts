import { cookies } from 'next/headers';

import { API_URL } from '@/constants/api';
import { GroupResp } from '@/services/groups/groupsTypes';

export async function loadGroupForMetadata(
  slug: string
): Promise<GroupResp | null> {
  if (!API_URL) return null;

  try {
    const mat = cookies().get('mat')?.value;
    const init: RequestInit = { cache: 'no-store' };

    if (mat) {
      init.headers = { Authorization: `Bearer ${mat}` };
    }

    const res = await fetch(
      `${API_URL}/groups/${encodeURIComponent(slug)}`,
      init
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
