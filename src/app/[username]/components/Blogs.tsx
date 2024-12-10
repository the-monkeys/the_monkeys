'use client';

import { useParams, useRouter } from 'next/navigation';

import { BlogCard } from '@/components/blog/cards/BlogCard';
import { BlogListCardSkeleton } from '@/components/skeletons/blogSkeleton';
import useGetPublishedBlogByAccountId from '@/hooks/blog/useGetPublishedBlogByAccountId';
import { useSession } from 'next-auth/react';

export const Blogs = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const params = useParams<{ username: string }>();
  const { blogs, isLoading, isError } = useGetPublishedBlogByAccountId(
    params.username
  );

  const handleEdit = (blogId: string) => {
    router.push(`/edit/${blogId}?source=published`);
  };

  if (isError)
    return (
      <p className='w-full font-roboto text-sm opacity-80 text-center'>
        No blogs published yet.
      </p>
    );

  return (
    <div className='min-h-screen'>
      <div className='flex flex-col gap-6 sm:gap-8'>
        {isLoading ? (
          <div className='w-full space-y-6'>
            {Array(4)
              .fill(null)
              .map((_, index) => (
                <BlogListCardSkeleton key={index} />
              ))}
          </div>
        ) : !blogs?.blogs || blogs?.blogs?.length === 0 ? (
          <p className='w-full font-roboto text-sm opacity-80 text-center'>
            No blogs published yet.
          </p>
        ) : (
          blogs?.blogs &&
          blogs?.blogs.map((blog) => {
            return (
              <BlogCard
                key={blog?.blog_id}
                blog={blog}
                status={status}
                onEdit={handleEdit}
                modificationEnable={session?.user.username === params.username}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
