'use client';

import { ProfileBlogCard } from '@/components/cards/blog/ProfileBlogCard';
import { FeedBlogCardListSkeleton } from '@/components/skeletons/blogSkeleton';
import useGetPublishedBlogByUsername from '@/hooks/blog/useGetPublishedBlogByUsername';
import { IUser } from '@/services/models/user';

export const Blogs = ({
  username,
  user,
}: {
  username: string;
  user?: IUser;
}) => {
  const { blogs, isLoading, isError } = useGetPublishedBlogByUsername(username);

  if (isError)
    return (
      <div className='min-h-screen'>
        <p className='w-full text-sm opacity-80 text-center'>
          No blogs published yet.
        </p>
      </div>
    );

  return (
    <div className='min-h-screen'>
      <div className='flex flex-col gap-10'>
        {isLoading ? (
          <FeedBlogCardListSkeleton />
        ) : !blogs?.blogs || blogs?.blogs?.length === 0 ? (
          <p className='w-full text-sm opacity-80 text-center'>
            No blogs published yet.
          </p>
        ) : (
          blogs?.blogs &&
          blogs?.blogs.map((blog) => {
            return (
              <ProfileBlogCard
                blog={blog}
                isAuthenticated={!!user}
                modificationEnable={user?.username === username}
                key={blog?.blog_id}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
