import { useState } from 'react';

import Icon from '@/components/icon';
import { BOOKMARKED_BLOGS_QUERY_KEY } from '@/hooks/blog/useGetBookmarkedBlogs';
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
          queryKey: [BOOKMARKED_BLOGS_QUERY_KEY],
        });
      }
    } catch (err: unknown) {
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
