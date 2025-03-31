import { useState } from 'react';

import Icon from '@/components/icon';
import { toast } from '@/components/ui/use-toast';
import { useIsPostLiked } from '@/hooks/user/useLikeStatus';
import axiosInstance from '@/services/api/axiosInstance';
import { mutate } from 'swr';

export const LikeButton = ({
  blogId,
  size = 18,
  isDisable = false,
}: {
  blogId?: string;
  size?: number;
  isDisable?: boolean;
}) => {
  const { likeStatus, isLoading, isError } = useIsPostLiked(blogId);

  const [loading, setLoading] = useState<boolean>(false);

  if (isLoading) {
    return (
      <div className='p-1 flex items-center justify-center opacity-50 cursor-default'>
        <Icon name='RiHeart3' size={size} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='p-1 flex items-center justify-center text-alert-red opacity-50 cursor-default'>
        <Icon name='RiHeart3' size={size} />
      </div>
    );
  }

  const onPostLike = async () => {
    setLoading(true);

    const previousLikeStatus = likeStatus;

    mutate(`/user/is-liked/${blogId}`, { isLiked: true }, false);

    try {
      const response = await axiosInstance.post(`/user/like/${blogId}`);

      if (response.status === 200) {
        mutate(`/user/is-liked/${blogId}`);
        mutate(`/user/count-likes/${blogId}`);
      }
    } catch (err: unknown) {
      mutate(`/user/is-liked/${blogId}`, previousLikeStatus, false);

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
          description: 'An unknown error occurred.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const onPostDislike = async () => {
    setLoading(true);

    const previousLikeStatus = likeStatus;

    mutate(`/user/is-liked/${blogId}`, { isLiked: false }, false);

    try {
      const response = await axiosInstance.post(`/user/unlike/${blogId}`);

      if (response.status === 200) {
        mutate(`/user/is-liked/${blogId}`);
        mutate(`/user/count-likes/${blogId}`);
      }
    } catch (err: unknown) {
      mutate(`/user/is-liked/${blogId}`, previousLikeStatus, false);

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
          description: 'An unknown error occurred.',
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
          className={`group p-1 flex items-center justify-center hover:opacity-80 animate-scale-up ${
            loading || isDisable
              ? 'cursor-default opacity-80'
              : 'cursor-pointer'
          }`}
          onClick={onPostDislike}
          disabled={loading || isDisable}
          title='Remove Like'
        >
          <Icon
            name='RiHeart3'
            type='Fill'
            size={size}
            className='text-brand-orange'
          />
        </button>
      ) : (
        <button
          className={`group p-1 flex items-center justify-center hover:text-brand-orange ${
            loading || isDisable
              ? 'cursor-default opacity-80'
              : 'cursor-pointer'
          }`}
          onClick={onPostLike}
          disabled={loading || isDisable}
          title='Add Like'
        >
          <Icon name='RiHeart3' size={size} />
        </button>
      )}
    </>
  );
};
