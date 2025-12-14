'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import Icon from '@/components/icon';
import useAuth from '@/hooks/auth/useAuth';
import { ALL_TOPICS_QUERY_KEY } from '@/hooks/user/useGetAllTopics';
import { PROFILE_TOPICS_QUERY_KEY } from '@/hooks/user/useGetProfileTopics';
import useUser, { USER_QUERY_KEY } from '@/hooks/user/useUser';
import axiosInstance from '@/services/api/axiosInstance';
import { followTopicApi, unfollowTopicApi } from '@/services/user/user';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@the-monkeys/ui/atoms/button';
import { toast } from '@the-monkeys/ui/hooks/use-toast';

interface TopicFollowButtonProps {
  topic: string;
}
const TopicFollowButton = ({ topic }: TopicFollowButtonProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
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
    const username = session?.username;

    if (!username) {
      toast({
        title: 'Login Required',
        description: `You need to login to follow ${topic}`,
      });
      const callbackURL = encodeURIComponent(`${pathname}?${searchParams}`);
      router.push(`/auth/login?callbackURL=${callbackURL}`);
      return;
    }

    try {
      await followTopicApi(username, topic);
      toast({
        variant: 'success',
        title: 'Topic followed',
        description: `You have successfully followed ${topic}`,
      });
      queryClient.invalidateQueries({ queryKey: [ALL_TOPICS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [PROFILE_TOPICS_QUERY_KEY] });
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

  const handleUnfollowButton = async () => {
    const username = session?.username;

    if (!username) {
      router.push('/auth/login');
      return;
    }

    try {
      await unfollowTopicApi(username, topic);
      toast({
        variant: 'success',
        title: 'Topic Unfollowed',
        description: `You have successfully unfollowed ${topic}`,
      });
      queryClient.invalidateQueries({ queryKey: [ALL_TOPICS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [PROFILE_TOPICS_QUERY_KEY] });
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

  return (
    <div>
      <Button
        variant={isFollowed ? 'secondary' : 'default'}
        size='sm'
        className='rounded-full'
        onClick={isFollowed ? handleUnfollowButton : handleFollowButton}
        data-testid={isFollowed ? 'unFollowButton' : 'followButton'}
      >
        <Icon name={isFollowed ? 'RiSubtract' : 'RiAdd'} className='mr-1' />
        {isFollowed ? 'Unfollow' : 'Follow'}
      </Button>
    </div>
  );
};

export default TopicFollowButton;
