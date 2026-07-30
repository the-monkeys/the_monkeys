import Icon from '@/components/icon';
import {
  CONNECTION_COUNT_QUERY_KEY,
  IS_FOLLOWING_USER_QUERY_KEY,
  useIsFollowingUser,
} from '@/hooks/user/useUserConnections';
import axiosInstance from '@/services/api/axiosInstance';
import {
  ConnectionCountResponse,
  IsFollowedResponse,
} from '@/services/profile/userApiTypes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@the-monkeys/ui/atoms/button';
import { Skeleton } from '@the-monkeys/ui/atoms/skeleton';
import { toast } from '@the-monkeys/ui/hooks/use-toast';
import { twMerge } from 'tailwind-merge';

const followUser = (username: string) => {
  return axiosInstance.post(`/user/follow/${username}`);
};

const unfollowUser = (username: string) => {
  return axiosInstance.post(`/user/unfollow/${username}`);
};

type FollowMutationVariables = {
  username: string;
  nextIsFollowing: boolean;
};

const useFollowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ username, nextIsFollowing }: FollowMutationVariables) =>
      nextIsFollowing ? followUser(username) : unfollowUser(username),

    onMutate: async ({
      username,
      nextIsFollowing,
    }: FollowMutationVariables) => {
      const followingKey = [IS_FOLLOWING_USER_QUERY_KEY, username];
      const countKey = [CONNECTION_COUNT_QUERY_KEY, username];

      const previousFollowStatus =
        queryClient.getQueryData<IsFollowedResponse>(followingKey);
      const previousCount =
        queryClient.getQueryData<ConnectionCountResponse>(countKey);

      queryClient.setQueryData<IsFollowedResponse>(followingKey, {
        status: previousFollowStatus?.status ?? 'ok',
        isFollowing: nextIsFollowing,
      });

      if (previousCount) {
        queryClient.setQueryData<ConnectionCountResponse>(countKey, {
          ...previousCount,
          followers: previousCount.followers + (nextIsFollowing ? 1 : -1),
        });
      }

      queryClient.cancelQueries({ queryKey: followingKey });
      queryClient.cancelQueries({ queryKey: countKey });

      return { previousFollowStatus, previousCount, followingKey, countKey };
    },

    onError: (err: unknown, _variables, context) => {
      if (context?.previousFollowStatus) {
        queryClient.setQueryData(
          context.followingKey,
          context.previousFollowStatus
        );
      }
      if (context?.previousCount) {
        queryClient.setQueryData(context.countKey, context.previousCount);
      }

      toast({
        variant: 'error',
        title: 'Error',
        description:
          err instanceof Error ? err.message : 'Something went wrong.',
      });
    },

    onSettled: (_data, _error, _variables, context) => {
      if (!context) return;

      queryClient.invalidateQueries({
        queryKey: context.followingKey,
        refetchType: 'active',
      });
      queryClient.invalidateQueries({
        queryKey: context.countKey,
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
  const { mutate, isPending } = useFollowMutation();

  const isFollowing = !!followStatus?.isFollowing;

  const handleFollow = () => {
    if (!username) return;
    mutate({ username, nextIsFollowing: true });
  };

  const handleUnfollow = () => {
    if (!username) return;
    mutate({ username, nextIsFollowing: false });
  };

  return (
    <>
      {isFollowing ? (
        <Button
          variant='secondary'
          disabled={isPending}
          onClick={handleUnfollow}
          className={twMerge(className, '!text-base rounded-full')}
        >
          Unfollow
        </Button>
      ) : (
        <Button
          variant={'outline'}
          size={'sm'}
          disabled={isPending}
          onClick={handleFollow}
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
  const { mutate, isPending } = useFollowMutation();

  if (isLoading) return <Skeleton className='size-9 rounded-full' />;

  if (isError) return null;

  const isFollowing = !!followStatus?.isFollowing;

  const handleFollow = () => {
    if (!username) return;
    mutate({ username, nextIsFollowing: true });
  };

  const handleUnfollow = () => {
    if (!username) return;
    mutate({ username, nextIsFollowing: false });
  };

  return (
    <>
      {isFollowing ? (
        <Button
          variant='secondary'
          size='icon'
          disabled={isPending}
          onClick={handleUnfollow}
          className={twMerge(className, 'rounded-full')}
        >
          <Icon name='RiUserUnfollow' size={18} />
        </Button>
      ) : (
        <Button
          size='icon'
          disabled={isPending}
          onClick={handleFollow}
          className={twMerge(className, 'rounded-full')}
        >
          <Icon name='RiUserFollow' size={18} />
        </Button>
      )}
    </>
  );
};
