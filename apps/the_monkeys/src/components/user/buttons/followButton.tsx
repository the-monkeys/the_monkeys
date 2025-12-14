import { useState } from 'react';

import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import {
  CONNECTION_COUNT_QUERY_KEY,
  IS_FOLLOWING_USER_QUERY_KEY,
  useIsFollowingUser,
} from '@/hooks/user/useUserConnections';
import axiosInstance from '@/services/api/axiosInstance';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@the-monkeys/ui/atoms/button';
import { Skeleton } from '@the-monkeys/ui/atoms/skeleton';
import { toast } from '@the-monkeys/ui/hooks/use-toast';
import { twMerge } from 'tailwind-merge';

export const FollowButton = ({
  username,
  className,
}: {
  username?: string;
  className?: string;
}) => {
  const queryClient = useQueryClient();
  const { followStatus, isLoading, isError } = useIsFollowingUser(username);

  const [loading, setLoading] = useState<boolean>(false);

  if (isLoading) return <Skeleton className='h-9 w-32 rounded-full' />;

  if (isError) return null;

  const onUserFollow = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.post(`/user/follow/${username}`);

      if (response.status === 200) {
        queryClient.invalidateQueries({
          queryKey: [IS_FOLLOWING_USER_QUERY_KEY, username],
        });
        queryClient.invalidateQueries({
          queryKey: [CONNECTION_COUNT_QUERY_KEY, username],
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast({
          variant: 'error',
          title: 'Error',
          description: err.message || 'Failed to follow user.',
        });
      } else {
        toast({
          variant: 'error',
          title: 'Error',
          description: 'An unknown error occurred.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const onUserUnfollow = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.post(`/user/unfollow/${username}`);

      if (response.status === 200) {
        queryClient.invalidateQueries({
          queryKey: [IS_FOLLOWING_USER_QUERY_KEY, username],
        });
        queryClient.invalidateQueries({
          queryKey: [CONNECTION_COUNT_QUERY_KEY, username],
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast({
          variant: 'error',
          title: 'Error',
          description: err.message || 'Failed to unfollow user.',
        });
      } else {
        toast({
          variant: 'error',
          title: 'Error',
          description: 'An unknown error occurred.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {followStatus?.isFollowing ? (
        <Button
          variant='secondary'
          disabled={loading}
          onClick={onUserUnfollow}
          className={twMerge(className, '!text-base rounded-full')}
        >
          {loading && <Loader />}
          Unfollow
        </Button>
      ) : (
        <Button
          disabled={loading}
          onClick={onUserFollow}
          className={twMerge(className, '!text-base rounded-full')}
        >
          {loading && <Loader />}
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
  const queryClient = useQueryClient();
  const { followStatus, isLoading, isError } = useIsFollowingUser(username);

  const [loading, setLoading] = useState<boolean>(false);

  if (isLoading) return <Skeleton className='size-9 rounded-full' />;

  if (isError) return null;

  const onUserFollow = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.post(`/user/follow/${username}`);

      if (response.status === 200) {
        queryClient.invalidateQueries({
          queryKey: [IS_FOLLOWING_USER_QUERY_KEY, username],
        });
        queryClient.invalidateQueries({
          queryKey: [CONNECTION_COUNT_QUERY_KEY, username],
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast({
          variant: 'error',
          title: 'Error',
          description: err.message || 'Failed to follow user.',
        });
      } else {
        toast({
          variant: 'error',
          title: 'Error',
          description: 'An unknown error occurred.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const onUserUnfollow = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.post(`/user/unfollow/${username}`);

      if (response.status === 200) {
        queryClient.invalidateQueries({
          queryKey: [IS_FOLLOWING_USER_QUERY_KEY, username],
        });
        queryClient.invalidateQueries({
          queryKey: [CONNECTION_COUNT_QUERY_KEY, username],
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast({
          variant: 'error',
          title: 'Error',
          description: err.message || 'Failed to unfollow user.',
        });
      } else {
        toast({
          variant: 'error',
          title: 'Error',
          description: 'An unknown error occurred.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {followStatus?.isFollowing ? (
        <Button
          variant='secondary'
          size='icon'
          disabled={loading}
          onClick={onUserUnfollow}
          className={twMerge(className, 'rounded-full')}
        >
          {loading ? <Loader /> : <Icon name='RiUserUnfollow' size={18} />}
        </Button>
      ) : (
        <Button
          size='icon'
          disabled={loading}
          onClick={onUserFollow}
          className={twMerge(className, 'rounded-full')}
        >
          {loading ? <Loader /> : <Icon name='RiUserFollow' size={18} />}
        </Button>
      )}
    </>
  );
};
