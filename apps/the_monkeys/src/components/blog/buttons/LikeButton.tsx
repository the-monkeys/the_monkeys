import { useState } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';

import { AuthPromptDialog } from '@/components/auth/AuthPromptDialog';
import { HeartBurst } from '@/components/blog/effects/HeartBurst';
import Icon from '@/components/icon';
import useAuth from '@/hooks/auth/useAuth';
import { useIsPostLiked } from '@/hooks/user/useLikeStatus';
import { usePostInteraction } from '@/hooks/user/usePostInteraction';
import { isAuthError } from '@/utils/errorUtils';
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
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const [burstKey, setBurstKey] = useState(0);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useAuth();
  const viewer = session?.username;
  const isAuthenticated = !!viewer;
  const { change, loading } = usePostInteraction('like', blogId, viewer);

  const { likeStatus, isLoading, isError } = useIsPostLiked(
    blogId,
    isAuthenticated,
    initialIsLiked
  );

  const search = searchParams.toString();
  const currentPath = `${pathname}${search ? `?${search}` : ''}`;
  const buttonSize = size + 8;

  if (!blogId) return null;

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

  if (isError || !isAuthenticated) {
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

  const toggleLike = async (shouldLike: boolean) => {
    if (loading || isDisable) return;
    if (shouldLike) setBurstKey((key) => key + 1);
    try {
      await change(shouldLike);
    } catch (err: unknown) {
      if (isAuthError(err)) {
        setAuthPromptOpen(true);
        return;
      }
      toast({
        variant: 'error',
        title: 'Error',
        description:
          err instanceof Error
            ? err.message
            : shouldLike
              ? 'Failed to like post.'
              : 'Failed to remove post reaction.',
      });
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
        onClick={() => toggleLike(!likeStatus)}
        disabled={loading || isDisable}
        title={likeStatus ? 'Unlike Post' : 'Like Post'}
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
