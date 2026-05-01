'use client';

import { useState } from 'react';

import { AuthPromptDialog } from '@/components/auth/AuthPromptDialog';
import Icon from '@/components/icon';
import { BOOKMARKED_BLOGS_QUERY_KEY } from '@/hooks/blog/useGetBookmarkedBlogs';
import {
  BOOKMARKS_COUNT_QUERY_KEY,
  BOOKMARK_STATUS_QUERY_KEY,
  useIsPostBookmarked,
} from '@/hooks/user/useBookmarkStatus';
import axiosInstance from '@/services/api/axiosInstance';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@the-monkeys/ui/hooks/use-toast';
import axios from 'axios';

export const BookmarkButton = ({
  blogId,
  size = 18,
  isDisable = false,
}: {
  blogId?: string;
  size?: number;
  isDisable?: boolean;
}) => {
  const queryClient = useQueryClient();
  const { bookmarkStatus, isLoading, isError } = useIsPostBookmarked(blogId);

  const [loading, setLoading] = useState<boolean>(false);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);

  const isAuthError = (err: unknown) =>
    axios.isAxiosError(err) &&
    (err.response?.status === 401 || err.response?.status === 403);

  if (isLoading) {
    return (
      <div className='p-1 flex items-center justify-center opacity-80 cursor-not-allowed'>
        <Icon name='RiBookmark' size={size} />
      </div>
    );
  }

  if (isError) {
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

  const onPostBookmark = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.post(`/user/bookmark/${blogId}`);

      if (response.status === 200) {
        toast({
          variant: 'success',
          title: 'Success',
          description: 'Blog bookmarked successfully.',
        });

        queryClient.invalidateQueries({
          queryKey: [BOOKMARK_STATUS_QUERY_KEY, blogId],
        });
        queryClient.invalidateQueries({
          queryKey: [BOOKMARKS_COUNT_QUERY_KEY, blogId],
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
          description: err.message || 'Failed to bookmark post.',
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

  const onPostRemoveBookmark = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.post(
        `/user/remove-bookmark/${blogId}`
      );

      if (response.status === 200) {
        toast({
          variant: 'success',
          title: 'Success',
          description: 'Removed bookmark successfully.',
        });

        queryClient.invalidateQueries({
          queryKey: [BOOKMARK_STATUS_QUERY_KEY, blogId],
        });
        queryClient.invalidateQueries({
          queryKey: [BOOKMARKS_COUNT_QUERY_KEY, blogId],
        });
        queryClient.invalidateQueries({
          queryKey: [BOOKMARKED_BLOGS_QUERY_KEY],
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
          description: err.message || 'Failed to remove post bookmark.',
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
          onClick={onPostRemoveBookmark}
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
          onClick={onPostBookmark}
          disabled={loading || isDisable}
          title='Add Bookmark'
        >
          <Icon name='RiBookmark' size={size} />
        </button>
      )}
    </>
  );
};
