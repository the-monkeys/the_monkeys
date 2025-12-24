import Icon from '@/components/icon';
import axiosInstance from '@/services/api/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@the-monkeys/ui/hooks/use-toast';

export const RemoveBookmarkButton = ({
  blogId,
  size = 18,
}: {
  blogId?: string;
  size?: number;
}) => {
  const queryClient = useQueryClient();

  const { mutate: onPostRemoveBookmark, isPending } = useMutation({
    mutationFn: (blogId) =>
      axiosInstance.delete(`/user/remove-bookmark/${blogId}`),
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Removed bookmark successfully.',
      });

      queryClient.invalidateQueries({ queryKey: ['bookmarked-blogs'] });
    },
    onError: (err: unknown) => {
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
    },
  });

  const handleBookmarkRemoveClick = () => {
    if (blogId) {
      onPostRemoveBookmark();
    }
  };

  return (
    <button
      className={`group p-1 flex items-center justify-center hover:opacity-80 ${
        isPending ? 'cursor-default opacity-50' : 'cursor-pointer'
      }`}
      onClick={handleBookmarkRemoveClick}
      disabled={isPending}
      title='Remove Bookmark'
    >
      <Icon name='RiBookmark2' size={size} className='text-alert-red' />
    </button>
  );
};
