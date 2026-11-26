import { API_URL, API_URL_V2 } from '@/constants/api';
import { queryKeys } from '@/lib/queryKeys';
import type { QueryClient } from '@tanstack/react-query';

const object = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
const text = (value: unknown) => (typeof value === 'string' ? value : '');
const count = (value: unknown) =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : 0;
const stamp = (value: unknown) => {
  if (typeof value === 'string') return value;
  const source = object(value);
  return typeof source.seconds === 'number' ||
    typeof source.seconds === 'string'
    ? {
        seconds: source.seconds,
        ...(typeof source.nanos === 'number' ? { nanos: source.nanos } : {}),
      }
    : undefined;
};

/** Only fields in the public author-card contract may enter anonymous hydration. */
export function publicAuthorCard(value: unknown) {
  const source = object(value);
  const user = object(source.user);
  if (!text(user.username) || !text(user.account_id)) return undefined;
  return {
    user: {
      account_id: text(user.account_id),
      username: text(user.username),
      first_name: text(user.first_name),
      last_name: text(user.last_name),
      bio: text(user.bio),
      location: text(user.location),
      created_at: stamp(user.created_at),
      ...(typeof user.is_verified === 'boolean'
        ? { is_verified: user.is_verified }
        : {}),
    },
    followers: count(source.followers),
    following: count(source.following),
  };
}

/** Optional metadata has one shared deadline so it cannot hold up the page indefinitely. */
export async function prefetchPublicPageMetadata(
  client: QueryClient,
  {
    authorIds = [],
    activeUsers = false,
  }: { authorIds?: string[]; activeUsers?: boolean }
) {
  const signal = AbortSignal.timeout(1500);
  const read = async (origin: string | undefined, path: string) => {
    if (!origin) throw new Error('Public metadata API is unavailable');
    const response = await fetch(`${origin.replace(/\/$/, '')}${path}`, {
      credentials: 'omit',
      signal,
      next: { revalidate: 300 },
    });
    if (!response.ok) throw new Error('Public metadata request failed');
    return response.json() as Promise<unknown>;
  };
  const ids = Array.from(
    new Set(authorIds.filter((id) => typeof id === 'string' && id.trim()))
  ).slice(0, 32);
  const tasks: Promise<unknown>[] = ids.map(async (id) => {
    const key = queryKeys.profile.byAccount(id);
    if (client.getQueryData(key)) return;
    const card = publicAuthorCard(
      await read(API_URL, `/user/public/account/${encodeURIComponent(id)}`)
    );
    if (card && card.user.account_id === id) client.setQueryData(key, card);
  });
  if (activeUsers)
    tasks.push(
      (async () => {
        const source = object(
          await read(API_URL_V2, '/user/active-users?time_range=24h')
        );
        if (!Array.isArray(source.user_details)) return;
        client.setQueryData(queryKeys.profile.activeUsers('24h'), {
          active_users: count(source.active_users),
          user_details: source.user_details.map((raw) => {
            const user = object(raw);
            return {
              account_id: text(user.account_id) || text(user.accountId),
              username: text(user.username),
              first_name: text(user.first_name),
              last_name: text(user.last_name),
            };
          }),
        });
      })()
    );
  await Promise.allSettled(tasks);
}
