import Icon from '@/components/icon';
import useAuth from '@/hooks/auth/useAuth';
import { usePostInteraction } from '@/hooks/user/usePostInteraction';
import { toast } from '@the-monkeys/ui/hooks/use-toast';

export const RemoveBookmarkButton = ({
  blogId,
  size = 18,
}: {
  blogId?: string;
  size?: number;
}) => {
  const { data: session } = useAuth();
  const viewer = session?.username;
  const { change, loading } = usePostInteraction('bookmark', blogId, viewer);
  const onPostRemoveBookmark = async () => {
    try {
      if (!(await change(false))) return;
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Removed bookmark successfully.',
      });
    } catch (err: unknown) {
      toast({
        variant: 'error',
        title: 'Error',
        description:
          err instanceof Error
            ? err.message || 'Failed to remove post bookmark.'
            : 'An unknown error occurred.',
      });
    }
  };

  return (
    <button
      className={`group p-1 flex items-center justify-center hover:opacity-80 ${
        loading ? 'cursor-default opacity-50' : 'cursor-pointer'
      }`}
      onClick={onPostRemoveBookmark}
      disabled={loading || !viewer || !blogId}
      title='Remove Bookmark'
    >
      <Icon name='RiBookmark2' size={size} className='text-alert-red' />
    </button>
  );
};
