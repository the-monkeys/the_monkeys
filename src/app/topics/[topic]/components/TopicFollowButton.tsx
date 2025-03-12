'use client';

import { useRouter } from 'next/navigation';

import Icon from '@/components/icon';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import useAuth from '@/hooks/auth/useAuth';
import useUser from '@/hooks/user/useUser';
import axiosInstance from '@/services/api/axiosInstance';
import { followTopicApi, unfollowTopicApi } from '@/services/user/userService';
import { mutate } from 'swr';

interface TopicFollowButtonProps {
  topic: string;
}
const TopicFollowButton = ({ topic }: TopicFollowButtonProps) => {
  const router = useRouter();
  const { data: session } = useAuth();
  const { user } = useUser(session?.username);
  const followedTopics = user?.topics || [];
  const isFollowed = followedTopics.includes(topic);

  const handleApiCalls = async (url: string, topic: string) => {
    return axiosInstance.put(url, {
      topics: [topic],
    });
  };

  const handleFollowButton = async () => {
    const username = user?.username;

    if (!username) {
      toast({
        title: 'Error',
        description: 'Username is missing, please relogin.',
      });
      router.push('/auth/login');
      return;
    }

    try {
      await followTopicApi(username, topic);
      toast({
        variant: 'success',
        title: 'Topic Followed',
        description: `You have successfully followed ${topic}`,
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
      router.push('/auth/login');
      return;
    }

    try {
      await unfollowTopicApi(username, topic);
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
          variant='secondary'
          size='sm'
          className='rounded-full'
          onClick={handleUnfollowButton}
          data-testid='unFollowButton'
        >
          <Icon name='RiSubtract' className='mr-1' />
          Unfollow Topic
        </Button>
      ) : (
        <Button
          variant='brand'
          size='sm'
          className='rounded-full'
          onClick={handleFollowButton}
          data-testid='followButton'
        >
          <Icon name='RiAdd' className='mr-1' />
          Follow Topic
        </Button>
      )}
    </div>
  );
};

export default TopicFollowButton;
