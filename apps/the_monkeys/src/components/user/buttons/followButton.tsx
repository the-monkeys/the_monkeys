import Icon from '@/components/icon';
import {
  CONNECTION_COUNT_QUERY_KEY,
  IS_FOLLOWING_USER_QUERY_KEY,
  useIsFollowingUser,
} from '@/hooks/user/useUserConnections';
import axiosInstance from '@/services/api/axiosInstance';
import { IsFollowedResponse } from '@/services/profile/userApiTypes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@the-monkeys/ui/atoms/button';
import { Skeleton } from '@the-monkeys/ui/atoms/skeleton';
import { toast } from '@the-monkeys/ui/hooks/use-toast';
import { twMerge } from 'tailwind-merge';

// Shape of the follower-count cache data.
// Adjust `count` field name if your actual API response uses a different key.
interface ConnectionCountResponse {
  status?: string;
  count: number;
}

const useFollowMutation = (username?: string) => {
  const queryClient = useQueryClient();

  // Exact query keys used everywhere in this hook.
  const followingKey = [IS_FOLLOWING_USER_QUERY_KEY, username];
  const countKey = [CONNECTION_COUNT_QUERY_KEY, username];

  return useMutation({
    // Calls the follow or unfollow API based on the button clicked.
    mutationFn: (nextIsFollowing: boolean) =>
      axiosInstance.post(
        `/user/${nextIsFollowing ? 'follow' : 'unfollow'}/${username}`
      ),

    // Runs immediately when mutate() is called — before the API responds.
    onMutate: async (nextIsFollowing: boolean) => {
      // Snapshot current values FIRST (before cancelling), so we have
      // something to roll back to if the request fails.
      const previousFollowStatus =
        queryClient.getQueryData<IsFollowedResponse>(followingKey);
      const previousCount =
        queryClient.getQueryData<ConnectionCountResponse>(countKey);

      // Update the UI immediately — this is NOT awaited, so the button
      // and count change instantly, even on the very first click when
      // an initial fetch might still be in flight.
      queryClient.setQueryData<IsFollowedResponse>(followingKey, {
        status: previousFollowStatus?.status ?? 'ok',
        isFollowing: nextIsFollowing,
      });

      // Only bump the count if we have a valid number to start from —
      // avoids briefly flashing 0 if the cache was empty/loading.
      if (previousCount && typeof previousCount.count === 'number') {
        queryClient.setQueryData<ConnectionCountResponse>(countKey, {
          ...previousCount,
          count: previousCount.count + (nextIsFollowing ? 1 : -1),
        });
      }

      // Cancel any in-flight fetches in the background so they don't
      // later overwrite our optimistic values. Intentionally NOT awaited
      // here — awaiting this before the setQueryData calls above caused
      // the first-click lag, since cancellation can take a moment to
      // resolve when a fetch is freshly in flight.
      queryClient.cancelQueries({ queryKey: followingKey });
      queryClient.cancelQueries({ queryKey: countKey });

      // Passed into onError as `context` so we can roll back.
      return { previousFollowStatus, previousCount };
    },

    // Runs if the API call fails — undo everything onMutate changed.
    onError: (err: unknown, _nextIsFollowing, context) => {
      if (context?.previousFollowStatus) {
        queryClient.setQueryData(followingKey, context.previousFollowStatus);
      }
      if (context?.previousCount) {
        queryClient.setQueryData(countKey, context.previousCount);
      }

      toast({
        variant: 'error',
        title: 'Error',
        description:
          err instanceof Error ? err.message : 'Something went wrong.',
      });
    },

    // Runs after success OR failure — refetch from server to stay in sync.
    // `refetchType: 'active'` keeps the last known value visible on screen
    // while refetching, instead of blanking out to 0/undefined.
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: followingKey,
        refetchType: 'active',
      });
      queryClient.invalidateQueries({
        queryKey: countKey,
        refetchType: 'active',
      });
    },
  });
};

export const FollowButton = ({
  username,
  className,
}: {
  username?: string;
  className?: string;
}) => {
  const { followStatus } = useIsFollowingUser(username);
  const { mutate, isPending } = useFollowMutation(username);

  const isFollowing = !!followStatus?.isFollowing;

  return (
    <>
      {isFollowing ? (
        <Button
          variant='secondary'
          disabled={isPending}
          onClick={() => mutate(false)}
          className={twMerge(className, '!text-base rounded-full')}
        >
          {/* Loader removed: text switches instantly via the optimistic
              update, so showing a spinner here made it feel laggy even
              though the state had already changed. `disabled` still
              silently blocks double-clicks while the request is in flight. */}
          Unfollow
        </Button>
      ) : (
        <Button
          variant={'outline'}
          size={'sm'}
          disabled={isPending}
          onClick={() => mutate(true)}
          className={twMerge(className, '!text-base rounded-full')}
        >
          Follow
        </Button>
      )}
    </>
  );
};

export const FollowButtonIcon = ({
  username,
  className,
}: {
  username?: string;
  className?: string;
}) => {
  const { followStatus, isLoading, isError } = useIsFollowingUser(username);
  const { mutate, isPending } = useFollowMutation(username);

  if (isLoading) return <Skeleton className='size-9 rounded-full' />;

  if (isError) return null;

  const isFollowing = !!followStatus?.isFollowing;

  return (
    <>
      {isFollowing ? (
        <Button
          variant='secondary'
          size='icon'
          disabled={isPending}
          onClick={() => mutate(false)}
          className={twMerge(className, 'rounded-full')}
        >
          {/* Icon renders immediately instead of swapping with a spinner,
              so the icon change feels instant on click. */}
          <Icon name='RiUserUnfollow' size={18} />
        </Button>
      ) : (
        <Button
          size='icon'
          disabled={isPending}
          onClick={() => mutate(true)}
          className={twMerge(className, 'rounded-full')}
        >
          <Icon name='RiUserFollow' size={18} />
        </Button>
      )}
    </>
  );
};
