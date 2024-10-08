import React from 'react';

import Icon from '@/components/icon';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import axiosInstance from '@/services/api/axiosInstance';
import { useSession } from 'next-auth/react';
import { mutate } from 'swr';

interface TopicButtonProps {
  topic: string;
  isFollowed: boolean;
  loading: boolean;
  onSuccess: () => void;
}

const TopicButton = ({
  topic,
  isFollowed,
  loading,
  onSuccess,
}: TopicButtonProps) => {
  const { data: session, status } = useSession();

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
      await axiosInstance.put(
        `${process.env.NEXT_PUBLIC_API_URL}/user/follow-topics/${username}`,
        {
          topics: [topic],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      toast({
        title: 'Success',
        description: 'Topic added to your interests.',
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
      await axiosInstance.put(
        `${process.env.NEXT_PUBLIC_API_URL}/user/un-follow-topics/${username}`,
        {
          topics: [topic],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      toast({
        title: 'Success',
        description: 'Topic removed from your interests.',
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
      {status === 'authenticated' &&
        (isFollowed ? (
          <Button
            size='icon'
            variant='destructive'
            onClick={handleUnfollowCategory}
            disabled={loading}
            className='rounded-full'
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
        ))}
    </>
  );
};

export default TopicButton;
