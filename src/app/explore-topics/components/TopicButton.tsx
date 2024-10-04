import React from 'react';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';
// Assuming you're using react-toastify for toasts
import { useSession } from 'next-auth/react';
import { MdAdd, MdCheck } from 'react-icons/md';
import { mutate } from 'swr';

interface TopicButtonProps {
  topic: string;
  isFollowed: boolean;
  loading: boolean;
  onSuccess: () => void; // Callback for when the follow/unfollow is successful
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
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/user/follow-topics/${username}`, // Adjust the endpoint as needed
        {
          topics: [topic], // Send the specific topic to follow
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
        description: 'Topic successfully added to your interests.',
      });
      onSuccess();
      mutate('/user/topics');
      mutate(`/user/public/${username}`); // Trigger the success callback to refresh state or data
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
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/user/un-follow-topics/${username}`,
        {
          topics: [topic], // Send the specific topic to unfollow
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
        description: 'Topic successfully removed from your interests.',
      });
      onSuccess();

      mutate('/user/topics');
      mutate(`/user/public/${username}`); // Trigger the success callback to refresh state or data
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to remove topics.',
      });
      console.error('Error:', error.message);
    }
  };

  return (
    <span>
      {status === 'authenticated' &&
        (isFollowed ? (
          <>
            <Button
              size='sm'
              variant='link'
              onClick={handleUnfollowCategory}
              disabled={loading}
            >
              <div className='flex items-center text-green-500'>
                <MdCheck className=' mr-1' />
                Unfollow
              </div>
            </Button>
          </>
        ) : (
          <Button
            size='sm'
            variant='link'
            className='opacity-30 hover:opacity-100'
            onClick={handleCategoryClick}
            disabled={loading}
          >
            <div className='flex gap-2 items-center'>
              <MdAdd className='text-black dark:text-white' />
              Follow
            </div>
          </Button>
        ))}
    </span>
  );
};

export default TopicButton;
