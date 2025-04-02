import { useState } from 'react';

import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import { useIsFollowingUser } from '@/hooks/user/useUserConnections';
import axiosInstance from '@/services/api/axiosInstance';
import { Button } from '@the-monkeys/ui/atoms/button';
import { toast } from '@the-monkeys/ui/hooks/use-toast';
import { mutate } from 'swr';
import { twMerge } from 'tailwind-merge';

export const FollowButton = ({
  username,
  className,
}: {
  username?: string;
  className?: string;
}) => {
  const { followStatus, isLoading, isError } = useIsFollowingUser(username);

  const [loading, setLoading] = useState<boolean>(false);

  if (isLoading) return <Loader className='my-1' />;

  if (isError) return null;

  const onUserFollow = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.post(`/user/follow/${username}`);

      if (response.status === 200) {
        mutate(`/user/is-followed/${username}`);
        mutate(`/user/connection-count/${username}`);
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
        mutate(`/user/is-followed/${username}`);
        mutate(`/user/connection-count/${username}`);
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
          disabled={loading}
          onClick={onUserUnfollow}
          className={twMerge(className, '!text-base rounded-full')}
        >
          {loading && <Loader />}
          Unfollow
        </Button>
      ) : (
        <Button
          variant='brand'
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
  const { followStatus, isLoading, isError } = useIsFollowingUser(username);

  const [loading, setLoading] = useState<boolean>(false);

  if (isLoading) return <Loader />;

  if (isError) return null;

  const onUserFollow = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.post(`/user/follow/${username}`);

      if (response.status === 200) {
        mutate(`/user/is-followed/${username}`);
        mutate(`/user/connection-count/${username}`);
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
        mutate(`/user/is-followed/${username}`);
        mutate(`/user/connection-count/${username}`);
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
          size='icon'
          disabled={loading}
          onClick={onUserUnfollow}
          className={twMerge(className)}
        >
          {loading ? <Loader /> : <Icon name='RiUserUnfollow' size={18} />}
        </Button>
      ) : (
        <Button
          variant='brand'
          size='icon'
          disabled={loading}
          onClick={onUserFollow}
          className={twMerge(className)}
        >
          {loading ? <Loader /> : <Icon name='RiUserFollow' size={18} />}
        </Button>
      )}
    </>
  );
};
