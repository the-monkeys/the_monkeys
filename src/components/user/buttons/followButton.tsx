import { useState } from 'react';

import { Loader } from '@/components/loader';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useIsFollowingUser } from '@/hooks/user/useUserConnections';
import axiosInstance from '@/services/api/axiosInstance';
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
          description: 'An unknown error occured.',
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
          description: 'An unknown error occured.',
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
          className={twMerge(className, 'rounded-full')}
        >
          {loading && <Loader />}
          Unfollow
        </Button>
      ) : (
        <Button
          variant='brand'
          disabled={loading}
          onClick={onUserFollow}
          className={twMerge(className, 'rounded-full')}
        >
          {loading && <Loader />}
          Follow
        </Button>
      )}
    </>
  );
};

export const FollowButtonSecondary = ({
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
          description: 'An unknown error occured.',
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
          description: 'An unknown error occured.',
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
          className={twMerge(className, 'rounded-full')}
        >
          {loading && <Loader />}
          Unfollow
        </Button>
      ) : (
        <Button
          disabled={loading}
          onClick={onUserFollow}
          className={twMerge(className, 'rounded-full')}
        >
          {loading && <Loader />}
          Follow
        </Button>
      )}
    </>
  );
};
