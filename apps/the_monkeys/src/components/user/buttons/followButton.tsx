import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import {
  useFollowUser,
  useIsFollowingUser,
} from '@/hooks/user/useUserConnections';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@the-monkeys/ui/atoms/button';
import { Skeleton } from '@the-monkeys/ui/atoms/skeleton';
import { twMerge } from 'tailwind-merge';

export const FollowButton = ({
  username,
  className,
  onFollowSuccess,
  onUnfollowSuccess,
}: {
  username: string;
  className?: string;
  onFollowSuccess?: () => void;
  onUnfollowSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  const { followStatus, isLoading, isError } = useIsFollowingUser(username);
  const { followMutation, unfollowMutation } = useFollowUser(username, {
    onFollowSuccess,
    onUnfollowSuccess,
  });

  const isPending = followMutation.isPending || unfollowMutation.isPending;

  if (isLoading) return <Skeleton className='h-9 w-32 rounded-full' />;

  if (isError) {
    return (
      <Button
        variant='outline'
        size='sm'
        disabled={isPending}
        onClick={() =>
          queryClient.invalidateQueries({
            queryKey: ['is-following-user', username],
          })
        }
        className={twMerge(className, '!text-base rounded-full')}
        data-testid='follow-button'
      >
        {isPending && <Loader />}
        Retry
      </Button>
    );
  }

  if (followStatus?.isFollowing) {
    return (
      <Button
        variant='secondary'
        size='sm'
        disabled={isPending}
        onClick={() => unfollowMutation.mutate()}
        className={twMerge(className, '!text-base rounded-full')}
        data-testid='unfollow-button'
      >
        {isPending && <Loader />}
        Unfollow
      </Button>
    );
  }

  return (
    <Button
      variant='outline'
      size='sm'
      disabled={isPending}
      onClick={() => followMutation.mutate()}
      className={twMerge(className, '!text-base rounded-full')}
      data-testid='follow-button'
    >
      {isPending && <Loader />}
      Follow
    </Button>
  );
};

export const FollowButtonIcon = ({
  username,
  className,
  onFollowSuccess,
  onUnfollowSuccess,
}: {
  username: string;
  className?: string;
  onFollowSuccess?: () => void;
  onUnfollowSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  const { followStatus, isLoading, isError } = useIsFollowingUser(username);
  const { followMutation, unfollowMutation } = useFollowUser(username, {
    onFollowSuccess,
    onUnfollowSuccess,
  });

  const isPending = followMutation.isPending || unfollowMutation.isPending;

  if (isLoading) return <Skeleton className='size-9 rounded-full' />;

  if (isError) {
    return (
      <Button
        size='icon'
        disabled={isPending}
        onClick={() =>
          queryClient.invalidateQueries({
            queryKey: ['is-following-user', username],
          })
        }
        className={twMerge(className, 'rounded-full')}
        data-testid='retry-follow-icon-button'
        aria-label='Retry follow status'
      >
        {isPending ? <Loader /> : <Icon name='RiResetRight' size={18} />}
      </Button>
    );
  }

  if (followStatus?.isFollowing) {
    return (
      <Button
        variant='secondary'
        size='icon'
        disabled={isPending}
        onClick={() => unfollowMutation.mutate()}
        className={twMerge(className, 'rounded-full')}
        data-testid='unfollow-icon-button'
        aria-label='Unfollow user'
      >
        {isPending ? <Loader /> : <Icon name='RiUserUnfollow' size={18} />}
      </Button>
    );
  }

  return (
    <Button
      size='icon'
      disabled={isPending}
      onClick={() => followMutation.mutate()}
      className={twMerge(className, 'rounded-full')}
      data-testid='follow-icon-button'
      aria-label='Follow user'
    >
      {isPending ? <Loader /> : <Icon name='RiUserFollow' size={18} />}
    </Button>
  );
};
