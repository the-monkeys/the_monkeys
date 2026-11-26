import type { ContentTarget } from '@/services/moderation/moderationTypes';
import type { QueryClient } from '@tanstack/react-query';

/** Reload the existing card sources without navigating or refetching identity/settings. */
export function refreshContentQueries(
  client: QueryClient,
  target: ContentTarget
) {
  return client.refetchQueries(
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
    { throwOnError: true }
  );
}
