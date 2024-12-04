import { useState } from 'react';

import Icon from '@/components/icon';
import { toast } from '@/components/ui/use-toast';
import { useIsPostLiked } from '@/hooks/user/useLikeStatus';
import axiosInstance from '@/services/api/axiosInstance';
import { useSession } from 'next-auth/react';
import { mutate } from 'swr';

export const LikeButton = ({
  blogId,
  isDisable = false,
}: {
  blogId?: string;
  isDisable?: boolean;
}) => {
  const { data } = useSession();
  const { likeStatus, isLoading, isError } = useIsPostLiked(blogId);

  const [loading, setLoading] = useState<boolean>(false);

  if (isLoading) {
    return (
      <div className='p-1 flex items-center justify-center opacity-80'>
        <Icon
          name='RiHeart3'
          type='Fill'
          className='text-foreground-light dark:text-foreground-dark'
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='p-1 flex items-center justify-center opacity-80'>
        <Icon
          name='RiHeart3'
          type='Fill'
          className='text-foreground-light dark:text-foreground-dark'
        />
      </div>
    );
  }

  const onPostLike = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.post(`/user/like/${blogId}`, {
        headers: {
          Authorization: `Bearer ${data?.user.token}`,
        },
      });

      if (response.status === 200) {
        toast({
          variant: 'success',
          title: 'Success',
          description: 'Post liked successfully.',
        });

        mutate(`/user/is-liked/${blogId}`);
        mutate(`/user/count-likes/${blogId}`);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast({
          variant: 'error',
          title: 'Error',
          description: err.message || 'Failed to like post.',
        });
      } else {
        toast({
          variant: 'error',
          title: 'Error',
          description: 'An unknown error occured.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const onPostDislike = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.post(`/user/unlike/${blogId}`, {
        headers: {
          headers: {
            Authorization: `Bearer ${data?.user.token}`,
          },
        },
      });

      if (response.status === 200) {
        toast({
          variant: 'success',
          title: 'Success',
          description: 'Post reaction removed successfully.',
        });

        mutate(`/user/is-liked/${blogId}`);
        mutate(`/user/count-likes/${blogId}`);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast({
          variant: 'error',
          title: 'Error',
          description: err.message || 'Failed to remove post reaction.',
        });
      } else {
        toast({
          variant: 'error',
          title: 'Error',
          description: 'An unknown error occured.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {likeStatus?.isLiked ? (
        <button
          className={`group p-1 flex items-center justify-center opacity-100 hover:opacity-80 ${
            loading || isDisable ? 'cursor-not-allowed' : 'cursor-pointer'
          }`}
          onClick={onPostDislike}
          disabled={loading || isDisable}
        >
          <Icon name='RiHeart3' type='Fill' className='text-brand-orange' />
        </button>
      ) : (
        <button
          className={`group p-1 flex items-center justify-center opacity-100 hover:opacity-80 ${
            loading || isDisable ? 'cursor-not-allowed' : 'cursor-pointer'
          }`}
          onClick={onPostLike}
          disabled={loading || isDisable}
        >
          <Icon name='RiHeart3' />
        </button>
      )}
    </>
  );
};
