import Link from 'next/link';

import { LikesCount } from '@/components/blog/LikesCount';
import { BlogShareDialog } from '@/components/blog/actions/BlogShareDialog';
import { BookmarkButton } from '@/components/blog/buttons/BookmarkButton';
import { LikeButton } from '@/components/blog/buttons/LikeButton';
import { LIVE_URL } from '@/constants/api';
import { BLOG_ROUTE, LOGIN_ROUTE } from '@/constants/routeConstants';
import useAuth from '@/hooks/auth/useAuth';
import { twMerge } from 'tailwind-merge';

export const BlogReactions = ({
  className,
  blogId,
}: {
  className?: string;
  blogId?: string;
}) => {
  const { isSuccess, isError } = useAuth();

  if (isError || !isSuccess)
    return (
      <div className='p-1 flex justify-center items-center gap-1'>
        <Link
          href={`${LOGIN_ROUTE}?callbackURL=${globalThis.location}`}
          className='text-sm font-medium text-brand-orange underline'
        >
          Login
        </Link>

        <p className='text-sm'>to interact with this post.</p>
      </div>
    );

  return (
    <div className={twMerge(className, 'flex justify-between items-center')}>
      <div className='flex-1 flex items-center'>
        <LikeButton blogId={blogId} size={20} />

        <LikesCount blogId={blogId} />
      </div>

      <div className='flex items-center gap-[2px]'>
        <BookmarkButton blogId={blogId} size={20} />
      </div>
    </div>
  );
};

export const BlogReactionsContainer = ({
  blogId,
  blogURL,
}: {
  blogId?: string;
  blogURL: string | string[];
}) => {
  const url = `${LIVE_URL}${BLOG_ROUTE}/${blogURL}`;

  return (
    <div className='sticky left-0 bottom-[20px] mx-auto w-full flex items-center gap-2 z-20'>
      <div className='flex-1 px-[14px] py-[6px] bg-foreground-light/80 dark:bg-foreground-dark/80 backdrop-blur-sm rounded-full shadow-sm ring-1 ring-border-light dark:ring-border-dark'>
        <BlogReactions blogId={blogId} />
      </div>

      <div className='shrink-0 px-[10px] py-[6px] bg-foreground-light/80 dark:bg-foreground-dark/80 backdrop-blur-sm rounded-full shadow-sm ring-1 ring-border-light dark:ring-border-dark'>
        <BlogShareDialog blogURL={url} size={20} />
      </div>
    </div>
  );
};
