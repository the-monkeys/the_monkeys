import { useState } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';

import { AuthPromptDialog } from '@/components/auth/AuthPromptDialog';
import Icon from '@/components/icon';
import {
  LIKES_COUNT_QUERY_KEY,
  LIKE_STATUS_QUERY_KEY,
  useIsPostLiked,
} from '@/hooks/user/useLikeStatus';
import axiosInstance from '@/services/api/axiosInstance';
import { isAuthError } from '@/utils/errorUtils';
import { useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@the-monkeys/ui/atoms/skeleton';
import { toast } from '@the-monkeys/ui/hooks/use-toast';

export const LikeButton = ({
  blogId,
  size = 18,
  isDisable = false,
}: {
  blogId?: string;
  size?: number;
  isDisable?: boolean;
}) => {
  const queryClient = useQueryClient();
  const { likeStatus, isLoading, isError } = useIsPostLiked(blogId);

  const [loading, setLoading] = useState<boolean>(false);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const currentPath = `${pathname}${search ? `?${search}` : ''}`;

  if (isLoading) {
    return (
      <div className='p-1 flex items-center justify-center opacity-80 cursor-not-allowed'>
        <Skeleton className='w-2 ' />
      </div>
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
        queryClient.invalidateQueries({
          queryKey: [LIKE_STATUS_QUERY_KEY, blogId],
        });
        queryClient.invalidateQueries({
          queryKey: [LIKES_COUNT_QUERY_KEY, blogId],
        });
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
        queryClient.invalidateQueries({
          queryKey: [LIKE_STATUS_QUERY_KEY, blogId],
        });
        queryClient.invalidateQueries({
          queryKey: [LIKES_COUNT_QUERY_KEY, blogId],
        });
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

      {likeStatus?.isLiked ? (
        <button
          className={`like-active group p-1 flex items-center justify-center hover:opacity-80 ${
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
            className='like-icon text-brand-orange'
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
          <Icon name='RiHeart3' size={size} className='like-icon' />
        </button>
      )}
    </>
  );
};
