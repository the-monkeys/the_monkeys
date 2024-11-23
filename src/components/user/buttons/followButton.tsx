import { useState } from 'react';

import { Loader } from '@/components/loader';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useIsFollowingUser } from '@/hooks/user/useFollowStatus';
import axiosInstance from '@/services/api/axiosInstance';
import { useSession } from 'next-auth/react';
import { mutate } from 'swr';

export const FollowButton = ({ username }: { username?: string }) => {
  const { data, status } = useSession();
  const { followStatus, isLoading, isError } = useIsFollowingUser(username);

  const [loading, setLoading] = useState<boolean>(false);

  if (status === 'unauthenticated' || data?.user?.username === username)
    return null;

  if (isLoading) return <Loader />;

  const onUserFollow = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.post(`/user/follow/${username}`, {
        headers: {
          Authorization: `Bearer ${data?.user.token}`,
        },
      });

      if (response.status === 200) {
        toast({
          variant: 'success',
          title: 'Success',
          description: 'User followed successfully.',
        });

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
      const response = await axiosInstance.post(`/user/unfollow/${username}`, {
        headers: {
          Authorization: `Bearer ${data?.user.token}`,
        },
      });

      if (response.status === 200) {
        toast({
          variant: 'success',
          title: 'Success',
          description: 'User unfollowed successfully.',
        });

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
        <Button
          variant='outline'
          className='rounded-full'
          disabled={loading}
          onClick={onUserUnfollow}
        >
          <p>Unfollow</p>
        </Button>
      ) : (
        <Button
          variant='default'
          className='rounded-full'
          disabled={loading}
          onClick={onUserFollow}
        >
          <p>Follow</p>
        </Button>
      )}
    </>
  );
};

export const FollowButtonCompact = ({ username }: { username?: string }) => {
  const { data, status } = useSession();
  const { followStatus, isLoading, isError } = useIsFollowingUser(username);

  if (status === 'unauthenticated' || data?.user?.username === username)
    return null;

  const [loading, setLoading] = useState<boolean>(false);

  if (isLoading) {
    return (
      <button
        className='font-jost text-sm md:text-base opacity-75'
        disabled={true}
      >
        Follow
      </button>
    );
  }

  const onUserFollow = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.post(`/user/follow/${username}`, {
        headers: {
          Authorization: `Bearer ${data?.user.token}`,
        },
      });

      if (response.status === 200) {
        toast({
          variant: 'success',
          title: 'Success',
          description: 'User followed successfully.',
        });

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
      const response = await axiosInstance.post(`/user/unfollow/${username}`, {
        headers: {
          Authorization: `Bearer ${data?.user.token}`,
        },
      });

      if (response.status === 200) {
        toast({
          variant: 'success',
          title: 'Success',
          description: 'User unfollowed successfully.',
        });

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
          className='font-jost text-sm md:text-base text-alert-red hover:opacity-75'
          disabled={loading}
          onClick={onUserUnfollow}
        >
          Unfollow
        </button>
      ) : (
        <button
          className='font-jost text-sm md:text-base text-primary-monkeyOrange hover:opacity-75'
          disabled={loading}
          onClick={onUserFollow}
        >
          Follow
        </button>
      )}
    </>
  );
};
