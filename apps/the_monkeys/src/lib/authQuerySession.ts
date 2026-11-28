import type { IUser } from '@/services/models/user';
import type { Query, QueryClient } from '@tanstack/react-query';
import { notifyManager } from '@tanstack/react-query';

import { queryKeys } from './queryKeys';

export const accountIdentity = (session: IUser | null | undefined) =>
  session?.account_id || session?.username || null;

// A transient validation failure is not a confirmed anonymous identity.
export const hasKnownViewer = (auth: {
  data: unknown;
  status?: string;
  isPending?: boolean;
}) => !auth.isPending && (!!auth.data || auth.status === 'success');

const isAccountQuery = (query: Query) => query.queryKey[0] !== 'auth';

export async function clearAccountQueries(client: QueryClient) {
  await client.cancelQueries({ predicate: isAccountQuery });
  notifyManager.batch(() => {
    for (const query of client
      .getQueryCache()
      .findAll({ predicate: isAccountQuery })) {
      // Reset first: removing a query alone leaves mounted observers showing its data.
      query.reset();
      client.removeQueries({ queryKey: query.queryKey, exact: true });
    }
  });
}

export async function replaceAuthSession(
  client: QueryClient,
  session: IUser | null
) {
  await client.cancelQueries({ queryKey: queryKeys.auth.session() });
  await clearAccountQueries(client);
  client.setQueryData(queryKeys.auth.session(), session);
}

// Preserve pagination data only within the same viewer's cache.
export const keepPreviousViewerData =
  (viewer: string | null) =>
  <T>(data: T | undefined, query?: { queryKey: readonly unknown[] }) => {
    const key = query?.queryKey;
    const tail = key?.[key.length - 1];
    const previousViewer =
      tail && typeof tail === 'object' && 'viewer' in tail ? tail.viewer : null;
    return previousViewer === viewer ? data : undefined;
  };
