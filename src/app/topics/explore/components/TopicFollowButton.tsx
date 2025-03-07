"use client";

import { useParams } from 'next/navigation';
import Icon from '@/components/icon';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import useAuth from '@/hooks/auth/useAuth';
import useUser from '@/hooks/user/useUser';
import axiosInstance from '@/services/api/axiosInstance';
import { mutate } from 'swr';

const TopicFollowButton = () => {
  const params = useParams();
  const topic = Array.isArray(params.topic) ? params.topic[0] : params.topic;
  const { data: session } = useAuth();
  const { user } = useUser(session?.username);
  const followedTopics = user?.topics || [];
  const isFollowed = followedTopics.includes(topic);
  const handleFollowButton = async () => {
    const username = user?.username;

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
  const handleUnfollowButton = async () => {
    const username = user?.username;

    if (!username) {
      toast({
        title: 'Error',
        description: 'Username is missing, please relogin.',
      });
      return;
    }

    try {
      await axiosInstance.put(`/user/un-follow-topics/${username}`, {
        topics: [topic],
      });

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
  return (
    <div>
      {isFollowed ? (
        <Button
          variant='brand'
          size='sm'
          className='rounded-full'
          onClick={handleUnfollowButton}
        >
          <Icon name='RiSubtract' className='mr-1' />
          Unfollow
        </Button>
      ) : (
        <Button
          variant='brand'
          size='sm'
          className='rounded-full'
          onClick={handleFollowButton}
        >
          <Icon name='RiAdd' className='mr-1' />
          Follow
        </Button>
      )}
    </div>
  );
};

export default TopicFollowButton;
