import { API_URL } from '@/constants/api';
import {
  selectLandingDiscussions,
  selectLandingGroups,
} from '@/lib/landingCommunity';
import { queryKeys } from '@/lib/queryKeys';

async function readCommunityList(
  path: string,
  field: string,
  signal?: AbortSignal,
  authenticated = false
): Promise<unknown> {
  const origin =
    typeof window === 'undefined' ? API_URL?.replace(/\/$/, '') : '/api/v1';
  if (!origin) throw new Error('The public community API is unavailable.');
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (signal?.aborted) abort();
  else signal?.addEventListener('abort', abort, { once: true });
  const timeout = setTimeout(abort, 5000);
  try {
    const res = await fetch(`${origin}${path}`, {
      credentials:
        authenticated && typeof window !== 'undefined' ? 'same-origin' : 'omit',
      cache: 'no-store',
      signal: controller.signal,
    });
    if (!res.ok)
      throw new Error(`Public community request failed: ${res.status}`);
    const data: unknown = await res.json();
    if (
      !data ||
      typeof data !== 'object' ||
      !(field in data) ||
      ((data as Record<string, unknown>)[field] !== null &&
        !Array.isArray((data as Record<string, unknown>)[field]))
    ) {
      throw new Error('The public community response is unavailable.');
    }
    return data;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abort);
  }
}

export async function readLandingDiscussions(
  signal?: AbortSignal,
  authenticated = false
) {
  return selectLandingDiscussions(
    await readCommunityList(
      '/discussions',
      'discussions',
      signal,
      authenticated
    )
  );
}

export async function readLandingGroups(
  signal?: AbortSignal,
  authenticated = false
) {
  return selectLandingGroups(
    await readCommunityList(
      '/groups?limit=6&status=published&public_only=1',
      'groups',
      signal,
      authenticated
    )
  );
}

// Shared by server prefetch and the client. Never reuse personalized feed or membership keys.
export const landingDiscussionQuery = {
  queryKey: queryKeys.landing.discussions(),
  queryFn: ({ signal }: { signal?: AbortSignal }) =>
    readLandingDiscussions(signal),
  staleTime: 0,
  retry: false,
};
export const landingGroupQuery = {
  queryKey: queryKeys.landing.groups(),
  queryFn: ({ signal }: { signal?: AbortSignal }) => readLandingGroups(signal),
  staleTime: 0,
  retry: false,
};
