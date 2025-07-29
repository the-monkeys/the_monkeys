'use client';

import { ProfileBlogCard } from '@/components/cards/blog/ProfileBlogCard';
import { BlogCardListSkeleton } from '@/components/skeletons/blogSkeleton';
import useGetAllDraftBlogs from '@/hooks/blog/useGetAllDraftBlogs';
import { IUser } from '@/services/models/user';

export const Drafts = ({
  username,
  user,
}: {
  username: string;
  user?: IUser;
}) => {
  const { blogs, isLoading, isError } = useGetAllDraftBlogs();

  if (isError)
    return (
      <div className='min-h-screen'>
        <p className='w-full text-sm opacity-80 text-center'>
          No drafts created yet.
        </p>
      </div>
    );

  return (
    <div className='min-h-screen'>
      <div className='flex flex-col gap-10'>
        {isLoading ? (
          <BlogCardListSkeleton />
        ) : !blogs?.blogs || blogs?.blogs?.length === 0 ? (
          <p className='w-full text-sm opacity-80 text-center'>
            No drafts created yet.
          </p>
        ) : (
          blogs?.blogs &&
          blogs?.blogs.map((blog) => {
            return (
              <ProfileBlogCard
                blog={blog}
                isAuthenticated={!!user}
                modificationEnable={user?.username === username}
                isDraft={true}
                key={blog?.blog_id}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
