import { queryKeys } from '@/lib/queryKeys';
import axiosInstance from '@/services/api/axiosInstance';
import {
  GetMetaFeedBlogs,
  IsBookmarkedResponse,
  IsLikedResponse,
} from '@/services/blog/blogTypes';
import {
  QueryClient,
  QueryKey,
  useIsMutating,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

type Interaction = 'like' | 'bookmark';
type Snapshot = { key: QueryKey; previous: unknown; optimistic: unknown };

async function changeInteraction(
  client: QueryClient,
  kind: Interaction,
  blogId: string,
  viewer: string,
  enabled: boolean
) {
  const authKey = queryKeys.auth.session();
  const getViewer = () =>
    client.getQueryData<{ username?: string } | null>(authKey)?.username;
  let sessionUnchanged = getViewer() === viewer;
  // Observe every transition, including logout and login as the same viewer before a response arrives.
  const unsubscribe = client.getQueryCache().subscribe((event) => {
    if (
      event.query.queryKey[0] === authKey[0] &&
      (event.type === 'removed' || getViewer() !== viewer)
    )
      sessionUnchanged = false;
  });
  const isCurrent = () => sessionUnchanged && getViewer() === viewer;
  const keys =
    kind === 'like' ? queryKeys.blog.likes : queryKeys.blog.bookmarks;
  const statusKey = keys.status(blogId, viewer);
  const countKey = keys.count(blogId);
  const listPrefix = [...queryKeys.blog.bookmarks.lists(), viewer];
  const snapshots: Snapshot[] = [];
  function write(key: QueryKey, next: unknown) {
    const previous = client.getQueryData(key);
    client.setQueryData(key, next);
    snapshots.push({ key, previous, optimistic: client.getQueryData(key) });
  }
  try {
    await Promise.all([
      client.cancelQueries({ queryKey: statusKey, exact: true }),
      client.cancelQueries({ queryKey: countKey, exact: true }),
      ...(kind === 'bookmark'
        ? [client.cancelQueries({ queryKey: listPrefix })]
        : []),
    ]);
    if (!isCurrent()) return false;
    const oldStatus = client.getQueryData<
      IsLikedResponse & IsBookmarkedResponse
    >(statusKey);
    const previousEnabled =
      kind === 'like' ? oldStatus?.isLiked : oldStatus?.bookMarked;
    write(
      statusKey,
      kind === 'like'
        ? { status: 'success', isLiked: enabled }
        : { status: 'success', bookMarked: enabled }
    );
    const count = client.getQueryData<{ count: number }>(countKey);
    // Protobuf JSON may omit a zero count. Only calculate from an actual
    // numeric count; otherwise reconcile the protected count after success.
    const hasCount =
      typeof count?.count === 'number' &&
      Number.isFinite(count.count) &&
      count.count >= 0;
    if (hasCount && previousEnabled !== enabled)
      write(countKey, {
        ...count,
        count: Math.max(0, count.count + (enabled ? 1 : -1)),
      });
    if (kind === 'bookmark' && !enabled) {
      for (const [key, page] of client.getQueriesData<GetMetaFeedBlogs>({
        queryKey: listPrefix,
      })) {
        if (!page) continue;
        write(key, {
          ...page,
          blogs: page.blogs.filter((blog) => blog.blog_id !== blogId),
          ...(page.total_blogs === undefined
            ? {}
            : { total_blogs: Math.max(0, page.total_blogs - 1) }),
        });
      }
    }
    await axiosInstance.post(
      '/user/' +
        (kind === 'like'
          ? enabled
            ? 'like/'
            : 'unlike/'
          : enabled
            ? 'bookmark/'
            : 'remove-bookmark/') +
        blogId
    );
    if (!isCurrent()) return false;
    if (kind === 'bookmark')
      await client.invalidateQueries({ queryKey: listPrefix });
    // Known counts and personal status already reflect the successful operation.
    if (!hasCount)
      await client.invalidateQueries({ queryKey: countKey, exact: true });
    return isCurrent();
  } catch (error) {
    if (!isCurrent()) return false;
    for (const { key, previous, optimistic } of snapshots) {
      if (client.getQueryData(key) !== optimistic) {
        void client.invalidateQueries({ queryKey: key, exact: true });
      } else if (previous === undefined) {
        client.removeQueries({ queryKey: key, exact: true });
      } else {
        client.setQueryData(key, previous);
      }
    }
    throw error;
  } finally {
    unsubscribe();
  }
}

// A shared mutation key blocks duplicate clicks across cards and the library.
export function usePostInteraction(
  kind: Interaction,
  blogId: string | undefined,
  viewer: string | undefined
) {
  const client = useQueryClient();
  const keys =
    kind === 'like' ? queryKeys.blog.likes : queryKeys.blog.bookmarks;
  const mutationKey = [...keys.status(blogId, viewer), 'write'];
  const pending = useIsMutating({ mutationKey, exact: true }) > 0;
  const mutation = useMutation({
    mutationKey,
    mutationFn: ({
      id,
      username,
      enabled,
    }: {
      id: string;
      username: string;
      enabled: boolean;
    }) => changeInteraction(client, kind, id, username, enabled),
    retry: false,
  });
  const change = async (enabled: boolean) => {
    if (
      !blogId ||
      !viewer ||
      client.getQueryData<{ username?: string } | null>(
        queryKeys.auth.session()
      )?.username !== viewer ||
      client.isMutating({ mutationKey, exact: true })
    )
      return false;
    return mutation.mutateAsync({ id: blogId, username: viewer, enabled });
  };
  return { change, loading: pending };
}
