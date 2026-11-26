import type { ContentTarget } from '@/services/moderation/moderationTypes';
import type { QueryClient } from '@tanstack/react-query';

const pendingRefreshes = new WeakMap<QueryClient, Map<string, Promise<void>>>();

/** Reload the existing card sources without navigating or refetching identity/settings. */
export function refreshContentQueries(
  client: QueryClient,
  target: ContentTarget,
  { afterWrite = false }: { afterWrite?: boolean } = {}
): Promise<void> {
  let pending = pendingRefreshes.get(client);
  if (!pending) {
    pending = new Map();
    pendingRefreshes.set(client, pending);
  }
  const existing = pending.get(target.kind);
  if (existing) {
    // A request started before consent may still contain redacted data.
    if (afterWrite)
      return existing
        .catch(() => undefined)
        .then(() =>
          refreshContentQueries(client, target, { afterWrite: true })
        );
    return existing;
  }
  const refresh = client
    .refetchQueries(
      {
        type: 'active',
        predicate: (query) => {
          const root = query.queryKey[0];
          if (typeof root !== 'string') return false;
          const kind =
            target.kind === 'blog'
              ? /blog|post|meta-feed/
              : new RegExp(target.kind);
          return (
            kind.test(root) ||
            root === 'search-suggest-v2' ||
            (target.kind === 'blog' &&
              root === 'groups' &&
              query.queryKey[1] === 'blogs')
          );
        },
      },
      { throwOnError: true, cancelRefetch: afterWrite }
    )
    .finally(() => pending.delete(target.kind));
  pending.set(target.kind, refresh);
  return refresh;
}
