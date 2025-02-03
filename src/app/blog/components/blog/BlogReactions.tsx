import { useSession } from '@/app/session-store-provider';
import { LikesCount } from '@/components/blog/LikesCount';
import { BookmarkButton } from '@/components/blog/buttons/BookmarkButton';
import { CommentButton } from '@/components/blog/buttons/CommentButton';
import { LikeButton } from '@/components/blog/buttons/LikeButton';
import { Separator } from '@/components/ui/separator';
import { twMerge } from 'tailwind-merge';

export const BlogReactions = ({
  className,
  blogId,
}: {
  className?: string;
  blogId?: string;
}) => {
  const { status } = useSession();

  if (status === 'unauthenticated')
    return <p className='text-sm opacity-80'>Log in to interact with blogs.</p>;

  return (
    <div
      className={twMerge(className, 'flex justify-between items-center gap-8')}
    >
      <div className='flex items-center'>
        <LikeButton blogId={blogId} size={20} />

        {status === 'authenticated' && <LikesCount blogId={blogId} />}
      </div>

      <div className='flex items-center gap-2'>
        <CommentButton size={20} isDisable={true} />

        <Separator
          orientation='vertical'
          className='w-[2px] h-4 rounded-full'
        />

        <BookmarkButton blogId={blogId} size={20} />
      </div>
    </div>
  );
};

export const BlogReactionsContainer = ({ blogId }: { blogId?: string }) => {
  return (
    <div className='sticky left-0 bottom-[60px] md:bottom-[30px] mx-auto w-fit px-8 py-[10px] bg-background-light/80  dark:bg-background-dark/80 backdrop-blur-md border-1 border-border-light/50 dark:border-border-dark/50 shadow-md z-20 rounded-full'>
      <BlogReactions blogId={blogId} />
    </div>
  );
};
