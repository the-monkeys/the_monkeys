import { useState } from 'react';

import Icon from '@/components/icon';
import { toast } from '@/components/ui/use-toast';
import { useIsPostBookmarked } from '@/hooks/user/useBookmarkStatus';
import axiosInstance from '@/services/api/axiosInstance';
import { useSession } from 'next-auth/react';
import { mutate } from 'swr';

export const BookmarkButton = ({
  blogId,
  isDisable = false,
}: {
  blogId?: string;
  isDisable?: boolean;
}) => {
  const { data } = useSession();
  const { bookmarkStatus, isLoading, isError } = useIsPostBookmarked(blogId);

  const [loading, setLoading] = useState<boolean>(false);

  if (isLoading) {
    return (
      <div className='p-1 flex items-center justify-center opacity-80 cursor-not-allowed'>
        <Icon name='RiBookmark' type='Fill' size={18} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='p-1 flex items-center justify-center opacity-80 cursor-not-allowed'>
        <Icon name='RiBookmark' type='Fill' size={18} />
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
          description: 'An unknown error occured.',
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

        mutate(`/user/is-bookmarked/${blogId}`);
        mutate(`/user/count-bookmarks/${blogId}`);
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
          description: err.message || 'Failed to remove post bookmark.',
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
      {bookmarkStatus?.bookMarked ? (
        <button
          className={`group p-1 flex items-center justify-center opacity-100 hover:opacity-80 ${
            loading || isDisable ? 'cursor-default' : 'cursor-pointer'
          }`}
          onClick={onPostRemoveBookmark}
          disabled={loading || isDisable}
          title='Remove Bookmark'
        >
          <Icon name='RiBookmark2' type='Fill' size={18} />
        </button>
      ) : (
        <button
          className={`group p-1 flex items-center justify-center opacity-100 hover:opacity-80 ${
            loading || isDisable ? 'cursor-default' : 'cursor-pointer'
          }`}
          onClick={onPostBookmark}
          disabled={loading || isDisable}
          title='Add Bookmark'
        >
          <Icon name='RiBookmark' size={18} />
        </button>
      )}
    </>
  );
};
