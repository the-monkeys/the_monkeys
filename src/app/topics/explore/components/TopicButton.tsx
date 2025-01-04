import React from 'react';

import { useSession } from '@/app/session-store-provider';
import Icon from '@/components/icon';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import axiosInstance from '@/services/api/axiosInstance';
import { mutate } from 'swr';

interface TopicButtonProps {
  topic: string;
  isFollowed: boolean;
  loading: boolean;
  onSuccess: () => void;
}

export const TopicButton = ({
  topic,
  isFollowed,
  loading,
  onSuccess,
}: TopicButtonProps) => {
  const { data: session, status } = useSession();

  if (status === 'unauthenticated') return null;

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
      await axiosInstance.put(`/user/follow-topics/${username}`, {
        topics: [topic],
      });

      onSuccess();

      mutate('/user/topics');
      mutate(`/user/public/${username}`);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Something went wrong while following the topic.',
      });
      console.error('Error:', error.message);
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
      await axiosInstance.put(`/user/un-follow-topics/${username}`, {
        topics: [topic],
      });

      onSuccess();

      mutate('/user/topics');
      mutate(`/user/public/${username}`);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to remove topics.',
      });
      console.error('Error:', error.message);
    }
  };

  return (
    <>
      {isFollowed ? (
        <Button
          size='icon'
          variant='ghost'
          onClick={handleUnfollowCategory}
          disabled={loading}
          className='text-alert-red rounded-full'
        >
          <Icon name='RiSubtract' size={18} />
        </Button>
      ) : (
        <Button
          size='icon'
          variant='ghost'
          onClick={handleCategoryClick}
          disabled={loading}
          className='rounded-full opacity-0 group-hover:opacity-100'
        >
          <Icon name='RiAdd' size={18} />
        </Button>
      )}
    </>
  );
};
