import { useEffect, useState } from 'react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import useUser from '@/hooks/useUser';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { AiOutlineLoading, AiOutlinePlus } from 'react-icons/ai';
import { MdAdd, MdCheck, MdIndeterminateCheckBox } from 'react-icons/md';
import { RxCross2 } from 'react-icons/rx';
import { mutate } from 'swr';

type props = {
  category: string;
  topics: string[];
};

const CategoryButton = ({ category, topics }: props) => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [statusTopic, setStatus] = useState<'success' | 'error' | null>(null);
  const [isAllTopicsFollowed, setIsAllTopicsFollowed] = useState(false);
  const [isSomeTopicsFollowed, setIsSomeTopicsFollowed] = useState(false);
  const { toast } = useToast();
  const { user, isLoading, isError } = useUser(session?.user?.username);

  // Update the state based on the user's topics
  useEffect(() => {
    const userTopics = user?.topics || [];

    const allTopicsFollowed = topics.every((topic) =>
      userTopics.includes(topic)
    );
    const someTopicsFollowed = topics.some((topic) =>
      userTopics.includes(topic)
    );

    setIsAllTopicsFollowed(allTopicsFollowed);
    setIsSomeTopicsFollowed(someTopicsFollowed);
  }, [user, topics]);

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
        description: 'Username is missing, please relogin',
      });
      return;
    }

    try {
      setLoading(true);
      setStatus(null);

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/user/follow-topics/${username}`,
        {
          topics,
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
        description: 'Category successfully added to your interests.',
      });

      setStatus('success');
      mutate('/user/topics');
      mutate(`/user/public/${username}`);
      setIsAllTopicsFollowed(true);
      setIsSomeTopicsFollowed(false); // All topics followed after clicking
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

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/user/un-follow-topics/${username}`,
        {
          topics,
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
        description: 'Category successfully removed from your interests.',
      });

      setStatus('success');
      mutate('/user/topics');
      mutate(`/user/public/${username}`);

      setIsAllTopicsFollowed(false);
      setIsSomeTopicsFollowed(false); // No topics followed after unfollowing
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
    <div className='flex space-x-2'>
      {!loading && !isAllTopicsFollowed && status === 'authenticated' && (
        <Button
          onClick={handleCategoryClick}
          variant={'outline'}
          disabled={loading || isLoading}
        >
          <>
            {isAllTopicsFollowed ? null : isSomeTopicsFollowed ? (
              <div className='flex items-center justify-center'>
                <div className='h-5 flex items-center justify-center bg-yellow-500 '>
                  <AiOutlinePlus className='text-black' />
                </div>
              </div>
            ) : (
              <MdAdd className='text-blue-500' />
            )}
          </>
        </Button>
      )}

      {loading && (
        <span className='ml-2 animate-spin'>
          <AiOutlineLoading />
        </span>
      )}

      {statusTopic === 'error' && <RxCross2 className='ml-2 text-red-500' />}

      {(isAllTopicsFollowed || isSomeTopicsFollowed) && (
        <Button
          onClick={handleUnfollowCategory}
          variant={'outline'}
          disabled={loading || isLoading}
        >
          Unfollow all
        </Button>
      )}
    </div>
  );
};

export default CategoryButton;
