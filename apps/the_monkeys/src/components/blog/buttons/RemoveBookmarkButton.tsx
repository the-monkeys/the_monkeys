import { useState } from 'react';

import Icon from '@/components/icon';
import { BOOKMARKED_BLOGS_QUERY_KEY } from '@/hooks/blog/useGetBookmarkedBlogs';
import { optimisticallySetBookmark } from '@/lib/bookmarkCache';
import { queryKeys } from '@/lib/queryKeys';
import axiosInstance from '@/services/api/axiosInstance';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@the-monkeys/ui/hooks/use-toast';

export const RemoveBookmarkButton = ({
  blogId,
  size = 18,
}: {
  blogId?: string;
  size?: number;
}) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState<boolean>(false);

  const onPostRemoveBookmark = async () => {
    if (!blogId || loading) return;
    setLoading(true);

    let cacheUpdate:
      | Awaited<ReturnType<typeof optimisticallySetBookmark>>
      | undefined;
    try {
      cacheUpdate = await optimisticallySetBookmark(queryClient, blogId, false);
      const response = await axiosInstance.post(
        `/user/remove-bookmark/${blogId}`
      );

      if (response.status === 200) {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: queryKeys.blog.bookmarks.count(blogId),
          }),
          queryClient.invalidateQueries({
            queryKey: [BOOKMARKED_BLOGS_QUERY_KEY],
          }),
        ]);
        toast({
          variant: 'success',
          title: 'Success',
          description: 'Removed bookmark successfully.',
        });
      }
    } catch (err: unknown) {
      cacheUpdate?.rollback();
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
    <button
      className={`group p-1 flex items-center justify-center hover:opacity-80 ${
        loading ? 'cursor-default opacity-50' : 'cursor-pointer'
      }`}
      onClick={onPostRemoveBookmark}
      disabled={loading}
      title='Remove Bookmark'
    >
      <Icon name='RiBookmark2' size={size} className='text-alert-red' />
    </button>
  );
};
