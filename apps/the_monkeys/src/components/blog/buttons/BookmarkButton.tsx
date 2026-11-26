'use client';

import { useState } from 'react';

import { AuthPromptDialog } from '@/components/auth/AuthPromptDialog';
import Icon from '@/components/icon';
import useAuth from '@/hooks/auth/useAuth';
import { useIsPostBookmarked } from '@/hooks/user/useBookmarkStatus';
import { usePostInteraction } from '@/hooks/user/usePostInteraction';
import { isAuthError } from '@/utils/errorUtils';
import { toast } from '@the-monkeys/ui/hooks/use-toast';

export const BookmarkButton = ({
  blogId,
  size = 18,
  isDisable = false,
  initialIsBookmarked,
}: {
  blogId?: string;
  size?: number;
  isDisable?: boolean;
  initialIsBookmarked?: boolean;
}) => {
  const { data: session } = useAuth();
  const viewer = session?.username;
  const isAuthenticated = !!viewer;
  const { change, loading } = usePostInteraction('bookmark', blogId, viewer);
  const { bookmarkStatus, isLoading, isError } = useIsPostBookmarked(
    blogId,
    isAuthenticated,
    initialIsBookmarked
  );

  const [authPromptOpen, setAuthPromptOpen] = useState(false);

  if (isLoading) {
    return (
      <div className='p-1 flex items-center justify-center opacity-80 cursor-not-allowed'>
        <Icon name='RiBookmark' size={size} />
      </div>
    );
  }

  if (isError || !isAuthenticated) {
    return (
      <>
        <button
          className='group p-1 flex items-center justify-center hover:text-brand-orange cursor-pointer'
          onClick={() => setAuthPromptOpen(true)}
          title='Login to bookmark this post'
          type='button'
        >
          <Icon name='RiBookmark' size={size} />
        </button>

        <AuthPromptDialog
          open={authPromptOpen}
          onOpenChange={setAuthPromptOpen}
          iconName='RiBookmark'
          title='Save posts for later.'
          description='Join Monkeys to build your reading library and come back to this post anytime.'
        />
      </>
    );
  }

  const toggleBookmark = async (shouldBookmark: boolean) => {
    if (loading || isDisable) return;
    try {
      if (!(await change(shouldBookmark))) return;
      toast({
        variant: 'success',
        title: 'Success',
        description: shouldBookmark
          ? 'Blog bookmarked successfully.'
          : 'Removed bookmark successfully.',
      });
    } catch (err: unknown) {
      if (isAuthError(err)) {
        setAuthPromptOpen(true);
        return;
      }
      toast({
        variant: 'error',
        title: 'Error',
        description:
          err instanceof Error ? err.message : 'An unknown error occurred.',
      });
    }
  };

  return (
    <>
      <AuthPromptDialog
        open={authPromptOpen}
        onOpenChange={setAuthPromptOpen}
        iconName='RiBookmark'
        title='Save posts for later.'
        description='Join Monkeys to build your reading library and come back to this post anytime.'
      />

      {bookmarkStatus?.bookMarked ? (
        <button
          className={`group p-1 flex items-center justify-center opacity-80 hover:opacity-100 ${
            loading || isDisable
              ? 'cursor-default opacity-80'
              : 'cursor-pointer'
          }`}
          onClick={() => toggleBookmark(false)}
          disabled={loading || isDisable}
          title='Remove Bookmark'
        >
          <Icon name='RiBookmark' type='Fill' size={size} />
        </button>
      ) : (
        <button
          className={`group p-1 flex items-center justify-center opacity-100 hover:opacity-80 ${
            loading || isDisable
              ? 'cursor-default opacity-80'
              : 'cursor-pointer'
          }`}
          onClick={() => toggleBookmark(true)}
          disabled={loading || isDisable}
          title='Add Bookmark'
        >
          <Icon name='RiBookmark' size={size} />
        </button>
      )}
    </>
  );
};
