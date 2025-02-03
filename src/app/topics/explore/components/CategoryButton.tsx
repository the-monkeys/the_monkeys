import { useEffect, useState } from 'react';
import React from 'react';

import { useSession } from '@/app/session-store-provider';
import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import useUser from '@/hooks/user/useUser';
import axiosInstance from '@/services/api/axiosInstance';
import { mutate } from 'swr';

export const CategoryButton = ({ topics }: { topics: string[] }) => {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const { user, isLoading } = useUser(session?.user?.username);

  const [loading, setLoading] = useState<boolean>(false);
  const [statusTopic, setStatus] = useState<'success' | 'error' | null>(null);
  const [isAllTopicsFollowed, setIsAllTopicsFollowed] = useState(false);
  const [isSomeTopicsFollowed, setIsSomeTopicsFollowed] = useState(false);

  if (status === 'unauthenticated') return null;

  // useEffect(() => {
  //   if (!user || topics.length === 0) {
  //     setIsAllTopicsFollowed(false);
  //     setIsSomeTopicsFollowed(false);
  //     return;
  //   }

  //   const userTopics = user.topics || [];
  //   const allTopicsFollowed = topics.every((topic) =>
  //     userTopics.includes(topic)
  //   );
  //   const someTopicsFollowed = topics.some((topic) =>
  //     userTopics.includes(topic)
  //   );

  //   setIsAllTopicsFollowed(allTopicsFollowed);
  //   setIsSomeTopicsFollowed(someTopicsFollowed);
  // }, [user, topics]);

  const handleCategoryClick = async () => {
    const token = session?.user?.token;
    const username = session?.user?.username;

    if (!token) {
      toast({
        title: 'Error',
        description: 'Authorization token is missing.',
      });
      return;
    }

    if (!username) {
      toast({
        title: 'Error',
        description: 'Username is missing, please relogin.',
      });
      return;
    }

    try {
      setLoading(true);
      setStatus(null);

      await axiosInstance.put(`/user/follow-topics/${username}`, {
        topics,
      });

      setStatus('success');
      mutate('/user/topics');
      mutate(`/user/public/${username}`);
      setIsAllTopicsFollowed(true);
      setIsSomeTopicsFollowed(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Something went wrong.',
      });
      console.error('Error:', error.message);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollowCategory = async () => {
    const token = session?.user?.token;
    const username = session?.user?.username;

    if (!token || !username) {
      toast({
        title: 'Error',
        description: 'Authorization token or username is missing.',
      });
      return;
    }

    try {
      setLoading(true);
      setStatus(null);

      await axiosInstance.put(`/user/un-follow-topics/${username}`, {
        topics,
      });

      setStatus('success');
      mutate('/user/topics');
      mutate(`/user/public/${username}`);
      setIsAllTopicsFollowed(false);
      setIsSomeTopicsFollowed(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to remove topics.',
      });
      console.error('Error:', error.message);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='hidden group-hover:flex gap-2'>
      {!loading && !isAllTopicsFollowed && (
        <Button
          size='icon'
          variant='secondary'
          onClick={handleCategoryClick}
          disabled={loading || isLoading}
          className='rounded-full'
        >
          <Icon name='RiAdd' />
        </Button>
      )}

      {loading && <Loader />}

      {statusTopic === 'error' && <Icon name='RiClose' />}

      {(isAllTopicsFollowed || isSomeTopicsFollowed) && (
        <Button
          size='icon'
          variant='destructive'
          onClick={handleUnfollowCategory}
          disabled={loading || isLoading}
          className='rounded-full'
        >
          <Icon name='RiSubtract' />
        </Button>
      )}
    </div>
  );
};
