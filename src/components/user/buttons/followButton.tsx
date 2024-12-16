import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useIsFollowingUser } from '@/hooks/user/useUserConnections';
import axiosInstance from '@/services/api/axiosInstance';
import { useSession } from 'next-auth/react';
import { mutate } from 'swr';

export const FollowButton = ({ username }: { username?: string }) => {
  const { data, status } = useSession();
  const { followStatus, isLoading, isError } = useIsFollowingUser(username);

  const [loading, setLoading] = useState<boolean>(false);

  if (status === 'unauthenticated' || data?.user?.username === username)
    return null;

  if (isLoading) return null;

  const onUserFollow = async () => {
    setLoading(true);

    const previousFollowStatus = followStatus;

    mutate(`/user/is-followed/${username}`, { isFollowing: true }, false);

    try {
      const response = await axiosInstance.post(`/user/follow/${username}`);

      if (response.status === 200) {
        mutate(`/user/is-followed/${username}`);
      }
    } catch (err: unknown) {
      mutate(
        `/user/is-followed/${username}`,
        { isFollowing: previousFollowStatus },
        false
      );

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

    const previousFollowStatus = followStatus;

    mutate(`/user/is-followed/${username}`, { isFollowing: false }, false);

    try {
      const response = await axiosInstance.post(`/user/unfollow/${username}`);

      if (response.status === 200) {
        mutate(`/user/is-followed/${username}`);
      }
    } catch (err: unknown) {
      mutate(
        `/user/is-followed/${username}`,
        { isFollowing: previousFollowStatus },
        false
      );

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
          variant='outline'
          className='rounded-full'
          disabled={loading}
          onClick={onUserUnfollow}
        >
          Unfollow
        </Button>
      ) : (
        <Button
          variant='brand'
          className='rounded-full'
          disabled={loading}
          onClick={onUserFollow}
        >
          Follow
        </Button>
      )}
    </>
  );
};

export const FollowButtonCompact = ({ username }: { username?: string }) => {
  const { data, status } = useSession();
  const { followStatus, isLoading, isError } = useIsFollowingUser(username);

  const [loading, setLoading] = useState<boolean>(false);

  if (status === 'unauthenticated' || data?.user?.username === username)
    return null;

  if (isLoading) return null;

  if (isError) return null;

  const onUserFollow = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.post(`/user/follow/${username}`);

      if (response.status === 200) {
        mutate(`/user/is-followed/${username}`);
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
        <button
          disabled={loading}
          onClick={onUserUnfollow}
          className='font-dm_sans font-medium text-sm sm:text-base text-alert-red hover:opacity-80'
        >
          Unfollow
        </button>
      ) : (
        <button
          disabled={loading}
          onClick={onUserFollow}
          className='font-dm_sans font-medium text-sm sm:text-base text-brand-orange hover:opacity-80'
        >
          Follow
        </button>
      )}
    </>
  );
};
