'use client';

import { useState } from 'react';

import Icon from '@/components/icon';
import { BOOKMARKS_PER_PAGE } from '@/constants/posts';
import { useIsPostBookmarked } from '@/hooks/user/useBookmarkStatus';
import axiosInstance from '@/services/api/axiosInstance';
import { updateSwrCache as updateBookmarkCache } from '@/utils/swrCacheValidation';
import { toast } from '@the-monkeys/ui/hooks/use-toast';
import { mutate } from 'swr';

export const BookmarkButton = ({
  blogId,
  size = 18,
  isDisable = false,
  page = 0,
}: {
  blogId?: string;
  size?: number;
  isDisable?: boolean;
  page?: number;
}) => {
  const { bookmarkStatus, isLoading, isError } = useIsPostBookmarked(blogId);
  const [loading, setLoading] = useState<boolean>(false);

  const offset = page * BOOKMARKS_PER_PAGE;

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

    mutate(`/user/is-bookmarked/${blogId}`, { bookMarked: true }, false);

    try {
      const response = await axiosInstance.post(`/user/bookmark/${blogId}`);

      if (response.status === 200) {
        toast({
          variant: 'success',
          title: 'Success',
          description: 'Blog bookmarked successfully.',
        });

        mutate(`/user/is-bookmarked/${blogId}`);
        mutate(`/user/count-bookmarks/${blogId}`);
        mutate(`/blog/my-bookmarks`);
      }
    } catch (err: unknown) {
      mutate(
        `/user/is-bookmarked/${blogId}`,
        { bookMarked: previousBookmarkStatus },
        false
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

    mutate(`/user/is-bookmarked/${blogId}`, { bookMarked: false }, false);
    const cacheKey = `blog/in-my-bookmark?limit=${BOOKMARKS_PER_PAGE}&offset=${offset}`;

    try {
      await mutate(
        cacheKey,
        async (currentData: any) => {
          const response = await axiosInstance.post(
            `/user/remove-bookmark/${blogId}`
          );

          if (response.status !== 200) {
            throw new Error('Failed to remove bookmarked post.');
          }

          toast({
            variant: 'success',
            title: 'Success',
            description: 'Removed bookmark successfully.',
          });

          return updateBookmarkCache(currentData, blogId ?? '');
        },
        {
          optimisticData: (currentData: any) => {
            return updateBookmarkCache(currentData, blogId ?? '');
          },
          rollbackOnError: true,
          populateCache: true,
          revalidate: false,
        }
      );
    } catch (err: unknown) {
      mutate(
        `/user/is-bookmarked/${blogId}`,
        { bookMarked: previousBookmarkStatus },
        false
      );

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
