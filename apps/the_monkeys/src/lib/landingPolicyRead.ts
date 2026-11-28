import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';

import { accountIdentity } from '@/lib/authQuerySession';
import { queryKeys } from '@/lib/queryKeys';
import type { IUser } from '@/services/models/user';
import type { RatedContent } from '@/services/moderation/moderationTypes';
import {
  type QueryClient,
  type QueryKey,
  type UseQueryResult,
  hashKey,
} from '@tanstack/react-query';

type Receipt = {
  viewer: string;
  authQuery: object;
  sessionEpoch: number;
};
const receipts = new WeakMap<QueryClient, WeakMap<object, Receipt>>();
// A superseded response is only a reread hint; it never grants access.
const superseded = new WeakMap<QueryClient, WeakMap<object, string>>();
const isObject = (data: unknown): data is object =>
  data !== null && typeof data === 'object';
const authQuery = (client: QueryClient) =>
  client
    .getQueryCache()
    .find({ queryKey: queryKeys.auth.session(), exact: true });

/** Certifies only this network result, never copied/serialized data or a public read. */
export async function readLandingPolicy<T>(
  client: QueryClient,
  viewer: string | null | undefined,
  signal: AbortSignal | undefined,
  read: () => Promise<T>
): Promise<T> {
  const auth = authQuery(client);
  const epoch = auth?.state.dataUpdateCount;
  const identity = accountIdentity(
    auth?.state.data as IUser | null | undefined
  );
  const authenticated = auth?.state.status === 'success' && !!identity;
  if (signal?.aborted)
    throw new DOMException('Landing read cancelled.', 'AbortError');
  const data = await read();
  if (signal?.aborted)
    throw new DOMException('Landing read cancelled.', 'AbortError');
  if (isObject(data)) {
    receipts.get(client)?.delete(data);
    superseded.get(client)?.delete(data);
    if (
      typeof window !== 'undefined' &&
      viewer &&
      authenticated &&
      identity === viewer &&
      auth === authQuery(client) &&
      auth.state.status === 'success' &&
      auth.state.dataUpdateCount === epoch &&
      accountIdentity(auth.state.data as IUser) === viewer
    ) {
      let registry = receipts.get(client);
      if (!registry) {
        registry = new WeakMap();
        receipts.set(client, registry);
      }
      registry.set(data, { viewer, authQuery: auth, sessionEpoch: epoch! });
    } else {
      const latest = authQuery(client);
      if (
        typeof window !== 'undefined' &&
        viewer &&
        authenticated &&
        identity === viewer &&
        latest?.state.status === 'success' &&
        accountIdentity(latest.state.data as IUser) === viewer &&
        (latest !== auth || latest.state.dataUpdateCount !== epoch)
      ) {
        let rejected = superseded.get(client);
        if (!rejected) {
          rejected = new WeakMap();
          superseded.set(client, rejected);
        }
        rejected.set(data, viewer);
      }
    }
  }
  return data;
}

/** Identity provenance only; callers must also require a successful, non-invalidated mounted query. */
export function isCurrentLandingPolicy(
  client: QueryClient,
  viewer: string | null | undefined,
  data: unknown
): boolean {
  if (!viewer || !isObject(data)) return false;
  const receipt = receipts.get(client)?.get(data);
  const auth = authQuery(client);
  return (
    !!receipt &&
    receipt.viewer === viewer &&
    receipt.authQuery === auth &&
    auth?.state.status === 'success' &&
    receipt.sessionEpoch === auth.state.dataUpdateCount &&
    accountIdentity(auth.state.data as IUser | null | undefined) === viewer
  );
}

export type LandingPolicySource<T = unknown> = {
  viewer?: string;
  data: T | undefined;
  items: readonly RatedContent[];
  fresh: boolean;
  pending: boolean;
  failed: boolean;
  retry: () => Promise<unknown>;
};

/** Shared only by checked landing hooks; regular event observers do not subscribe. */
export function useLandingPolicySource<T>(
  client: QueryClient,
  viewer: string | null | undefined,
  queryKey: QueryKey,
  query: UseQueryResult<T>,
  items: readonly RatedContent[],
  enabled: boolean,
  checked = true
): LandingPolicySource<T> {
  const queryHash = hashKey(queryKey);
  const subscribe = useCallback(
    (changed: () => void) =>
      checked
        ? client.getQueryCache().subscribe((event) => {
            if (
              event.query.queryHash === queryHash ||
              event.query.queryHash === hashKey(queryKeys.auth.session())
            )
              changed();
          })
        : () => {},
    [client, queryHash, checked]
  );
  const sourceState = useSyncExternalStore(
    subscribe,
    () => (checked ? client.getQueryCache().get(queryHash)?.state : undefined),
    () => undefined
  );
  const sessionState = useSyncExternalStore(
    subscribe,
    () =>
      checked ? client.getQueryState(queryKeys.auth.session()) : undefined,
    () => undefined
  );
  const {
    data,
    isSuccess,
    isError,
    isFetching,
    isPaused,
    isFetchedAfterMount,
    refetch,
  } = query;
  const current = isCurrentLandingPolicy(client, viewer, data);
  const active = checked && enabled && !!viewer;
  const fresh =
    active &&
    isFetchedAfterMount &&
    isSuccess &&
    !sourceState?.isInvalidated &&
    current;
  const receipt = isObject(data) ? receipts.get(client)?.get(data) : undefined;
  const rejectedViewer = isObject(data)
    ? superseded.get(client)?.get(data)
    : undefined;
  const attempted = useRef<{
    queryHash: string;
    auth?: object;
    epoch?: number;
  }>();
  const currentAuth = authQuery(client);
  const alreadyAttempted =
    attempted.current?.queryHash === queryHash &&
    attempted.current?.auth === currentAuth &&
    attempted.current?.epoch === sessionState?.dataUpdateCount;
  const reconciling =
    !alreadyAttempted &&
    (receipt?.viewer === viewer || rejectedViewer === viewer) &&
    sessionState?.status === 'success' &&
    accountIdentity(sessionState.data as IUser) === viewer;
  const failed =
    active &&
    (isError ||
      (isFetchedAfterMount &&
        !current &&
        !reconciling &&
        !isFetching &&
        !isPaused));

  useEffect(() => {
    // A same-account validation advances dataUpdateCount without changing the query key.
    // Reconcile once through the normal query lifecycle; errors remain failed, never timer-retried.
    if (
      !active ||
      !isSuccess ||
      isFetching ||
      isPaused ||
      current ||
      !isObject(data)
    )
      return;
    if (reconciling) {
      attempted.current = {
        queryHash,
        auth: currentAuth,
        epoch: sessionState?.dataUpdateCount,
      };
      void refetch({ cancelRefetch: false });
    }
  }, [
    active,
    client,
    currentAuth,
    queryHash,
    current,
    data,
    isFetching,
    isPaused,
    isSuccess,
    refetch,
    reconciling,
    sessionState,
    viewer,
  ]);

  return {
    viewer: viewer || undefined,
    data,
    items,
    fresh,
    pending: active && !fresh && !failed,
    failed,
    retry: () => refetch(),
  };
}
