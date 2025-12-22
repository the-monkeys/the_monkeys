import React from 'react';

import Icon from '@/components/icon';
import { ALL_TOPICS_QUERY_KEY } from '@/hooks/user/useGetAllTopics';
import { USER_QUERY_KEY } from '@/hooks/user/useUser';
import axiosInstance from '@/services/api/axiosInstance';
import { GetPublicUserProfileApiResponse } from '@/services/profile/userApiTypes';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@the-monkeys/ui/atoms/button';
import { toast } from '@the-monkeys/ui/hooks/use-toast';

interface TopicButtonProps {
  topic: string;
  isFollowed: boolean;
  loading: boolean;
  onSuccess: () => void;
  user?: GetPublicUserProfileApiResponse;
}

export const TopicButton = ({
  topic,
  isFollowed,
  loading,
  onSuccess,
  user,
}: TopicButtonProps) => {
  const queryClient = useQueryClient();
  if (!user) return null;

  const handleCategoryClick = async () => {
    const username = user.username;

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

      queryClient.invalidateQueries({ queryKey: [ALL_TOPICS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [USER_QUERY_KEY, username],
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Something went wrong while following the topic.',
      });
      console.error('Error:', error.message);
    }
  };

  const handleUnfollowCategory = async () => {
    const username = user.username;

    try {
      await axiosInstance.put(`/user/un-follow-topics/${username}`, {
        topics: [topic],
      });

      onSuccess();

      queryClient.invalidateQueries({ queryKey: [ALL_TOPICS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [USER_QUERY_KEY, username],
      });
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
