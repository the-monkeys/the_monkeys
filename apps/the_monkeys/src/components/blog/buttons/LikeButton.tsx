import { useState } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';

import { AuthPromptDialog } from '@/components/auth/AuthPromptDialog';
import HeartBurst from '@/components/common/HeartBurst';
import Icon from '@/components/icon';
import { useIsPostLiked } from '@/hooks/user/useLikeStatus';
import { queryKeys } from '@/lib/queryKeys';
import axiosInstance from '@/services/api/axiosInstance';
import { IsLikedResponse, likesCountResponse } from '@/services/blog/blogTypes';
import { isAuthError } from '@/utils/errorUtils';
import { useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@the-monkeys/ui/atoms/skeleton';
import { toast } from '@the-monkeys/ui/hooks/use-toast';

export const LikeButton = ({
  blogId,
  size = 18,
  isDisable = false,
  initialIsLiked,
}: {
  blogId?: string;
  size?: number;
  isDisable?: boolean;
  initialIsLiked?: boolean;
}) => {
  const queryClient = useQueryClient();
  const { likeStatus, isLoading, isError } = useIsPostLiked(
    blogId,
    initialIsLiked
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const [burstKey, setBurstKey] = useState(0);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const currentPath = `${pathname}${search ? `?${search}` : ''}`;
  const buttonSize = size + 8;

  if (!blogId) return null;

  const setLikeState = (isLiked: boolean) => {
    queryClient.setQueryData<IsLikedResponse>(
      queryKeys.blog.likes.status(blogId),
      {
        status: 'success',
        isLiked,
      }
    );
  };

  const updateLikesCount = (delta: 1 | -1) => {
    queryClient.setQueryData<likesCountResponse>(
      queryKeys.blog.likes.count(blogId),
      (previous) => ({
        count: Math.max(0, (previous?.count ?? 0) + delta),
      })
    );
  };

  const refetchLikeQueries = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.blog.likes.status(blogId),
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.blog.likes.count(blogId),
    });
  };

  if (isLoading) {
    return (
      <button
        className='p-1 flex items-center justify-center opacity-80 cursor-not-allowed'
        style={{ width: buttonSize, height: buttonSize }}
        type='button'
        disabled
        aria-label='Loading like status'
      >
        <Skeleton
          className='rounded-full'
          style={{ width: size, height: size }}
        />
      </button>
    );
  }

  if (isError) {
    return (
      <>
        <button
          className='group p-1 flex items-center justify-center hover:text-brand-orange cursor-pointer'
          onClick={() => setAuthPromptOpen(true)}
          title='Login to like this post'
          type='button'
        >
          <Icon name='RiHeart3' size={size} />
        </button>

        <AuthPromptDialog
          open={authPromptOpen}
          onOpenChange={setAuthPromptOpen}
          iconName='RiHeart3'
          iconType='Fill'
          iconClassName='text-brand-orange'
          title='Like a post to share the love.'
          description='Join Monkeys now to let the author know you like their post.'
          callbackPath={`${currentPath}`}
        />
      </>
    );
  }

  const onPostLike = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.post(`/user/like/${blogId}`);

      if (response.status === 200) {
        setBurstKey((k) => k + 1);

        setLikeState(true);
        updateLikesCount(1);

        refetchLikeQueries();
      }
    } catch (err: unknown) {
      if (isAuthError(err)) {
        setAuthPromptOpen(true);
        return;
      }

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

    try {
      const response = await axiosInstance.post(`/user/unlike/${blogId}`);

      if (response.status === 200) {
        setLikeState(false);
        updateLikesCount(-1);
        refetchLikeQueries();
      }
    } catch (err: unknown) {
      if (isAuthError(err)) {
        setAuthPromptOpen(true);
        return;
      }

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
      <AuthPromptDialog
        open={authPromptOpen}
        onOpenChange={setAuthPromptOpen}
      />

      <button
        type='button'
        className={`relative group p-1 flex items-center justify-center ${
          likeStatus ? 'hover:opacity-80' : 'hover:text-brand-orange'
        } ${
          loading || isDisable ? 'cursor-default opacity-80' : 'cursor-pointer'
        }`}
        onClick={likeStatus ? onPostDislike : onPostLike}
        disabled={loading || isDisable}
        title={likeStatus ? 'Remove Like' : 'Add Like'}
      >
        {burstKey > 0 && <HeartBurst key={burstKey} />}

        <Icon
          name='RiHeart3'
          type={likeStatus ? 'Fill' : undefined}
          size={size}
          className={`like-icon ${likeStatus ? 'text-brand-orange' : ''}`}
        />
      </button>
    </>
  );
};
