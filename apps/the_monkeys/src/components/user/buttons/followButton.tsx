import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import {
  useFollowUser,
  useIsFollowingUser,
} from '@/hooks/user/useUserConnections';
import { Button } from '@the-monkeys/ui/atoms/button';
import { Skeleton } from '@the-monkeys/ui/atoms/skeleton';
import { twMerge } from 'tailwind-merge';

export const FollowButton = ({
  username,
  className,
}: {
  username?: string;
  className?: string;
}) => {
  const { followStatus, isLoading, isError } = useIsFollowingUser(username);
  const { followMutation, unfollowMutation } = useFollowUser(username);

  const isPending = followMutation.isPending || unfollowMutation.isPending;

  if (isLoading) return <Skeleton className='h-9 w-32 rounded-full' />;

  if (isError) {
    return (
      <Button
        variant='outline'
        size='sm'
        disabled
        className={twMerge(className, '!text-base rounded-full')}
      >
        Follow
      </Button>
    );
  }

  if (followStatus?.isFollowing) {
    return (
      <Button
        variant='secondary'
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
}: {
  username?: string;
  className?: string;
}) => {
  const { followStatus, isLoading, isError } = useIsFollowingUser(username);
  const { followMutation, unfollowMutation } = useFollowUser(username);

  const isPending = followMutation.isPending || unfollowMutation.isPending;

  if (isLoading) return <Skeleton className='size-9 rounded-full' />;

  if (isError) {
    return (
      <Button
        variant='secondary'
        size='icon'
        disabled
        className={twMerge(className, 'rounded-full')}
      />
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
    >
      {isPending ? <Loader /> : <Icon name='RiUserFollow' size={18} />}
    </Button>
  );
};
