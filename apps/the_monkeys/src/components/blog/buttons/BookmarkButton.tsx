'use client';

import { useState } from 'react';

import Icon from '@/components/icon';
import { useIsPostBookmarked } from '@/hooks/user/useBookmarkStatus';
import axiosInstance from '@/services/api/axiosInstance';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@the-monkeys/ui/hooks/use-toast';

export const BookmarkButton = ({
  blogId,
  size = 18,
  isDisable = false,
}: {
  blogId?: string;
  size?: number;
  isDisable?: boolean;
}) => {
  const { bookmarkStatus, isLoading, isError } = useIsPostBookmarked(blogId);
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState<boolean>(false);

  if (isLoading) {
    return (
      <div className='p-1 flex items-center justify-center opacity-80 cursor-not-allowed'>
        <Icon name='RiBookmark' size={size} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='p-1 flex items-center justify-center text-alert-red opacity-50 cursor-default'>
        <Icon name='RiBookmark' size={size} />
      </div>
    );
  }

  const onPostBookmark = async () => {
    setLoading(true);

    const previousBookmarkStatus = bookmarkStatus;

    queryClient.setQueryData(['is-bookmarked', blogId], { bookMarked: true });

    try {
      const response = await axiosInstance.post(`/user/bookmark/${blogId}`);

      if (response.status === 200) {
        toast({
          variant: 'success',
          title: 'Success',
          description: 'Blog bookmarked successfully.',
        });

        queryClient.invalidateQueries({ queryKey: ['is-bookmarked', blogId] });
        queryClient.invalidateQueries({
          queryKey: ['count-bookmarks', blogId],
        });
        queryClient.invalidateQueries({ queryKey: ['bookmarked-blogs'] });
      }
    } catch (err: unknown) {
      queryClient.setQueryData(
        ['is-bookmarked', blogId],
        previousBookmarkStatus
      );

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
    const previousBookmarkStatus = bookmarkStatus;

    queryClient.setQueryData(['is-bookmarked', blogId], { bookMarked: false });

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

        queryClient.invalidateQueries({ queryKey: ['is-bookmarked', blogId] });
        queryClient.invalidateQueries({
          queryKey: ['count-bookmarks', blogId],
        });
        queryClient.invalidateQueries({ queryKey: ['bookmarked-blogs'] });
      }
    } catch (err: unknown) {
      queryClient.setQueryData(
        ['is-bookmarked', blogId],
        previousBookmarkStatus
      );

      if (err instanceof Error) {
        toast({
          variant: 'error',
          title: 'Error',
          description: err.message || 'Failed to remove bookmarked post.',
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
