import { useState } from 'react';
import React from 'react';

import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import useAuth from '@/hooks/auth/useAuth';
import { ALL_TOPICS_QUERY_KEY } from '@/hooks/user/useGetAllTopics';
import useUser, { USER_QUERY_KEY } from '@/hooks/user/useUser';
import axiosInstance from '@/services/api/axiosInstance';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@the-monkeys/ui/atoms/button';
import { useToast } from '@the-monkeys/ui/hooks/use-toast';

export const CategoryButton = ({ topics }: { topics: string[] }) => {
  const queryClient = useQueryClient();
  const { data: session } = useAuth();
  const { toast } = useToast();
  const { user, isLoading } = useUser(session?.username);

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
    const username = session?.username;

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
      queryClient.invalidateQueries({ queryKey: [ALL_TOPICS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [USER_QUERY_KEY, username],
      });
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
    const username = session?.username;

    try {
      setLoading(true);
      setStatus(null);

      await axiosInstance.put(`/user/un-follow-topics/${username}`, {
        topics,
      });

      setStatus('success');
      queryClient.invalidateQueries({ queryKey: [ALL_TOPICS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [USER_QUERY_KEY, username],
      });
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
