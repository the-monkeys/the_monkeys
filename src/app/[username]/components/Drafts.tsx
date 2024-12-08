'use client';

import { useParams, useRouter } from 'next/navigation';

import { BlogCard } from '@/components/blog/cards/BlogCard';
import { BlogListCardSkeleton } from '@/components/skeletons/blogSkeleton';
import useGetAllDraftBlogs from '@/hooks/blog/useGetAllDraftBlogs';
import { useSession } from 'next-auth/react';

export const Drafts = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const params = useParams<{ username: string }>();
  const { blogs, isLoading } = useGetAllDraftBlogs(session?.user.account_id);

  const handleEdit = (blogId: string) => {
    router.push(`/edit/${blogId}?source=draft`);
  };

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
            No drafts created yet.
          </p>
        ) : (
          blogs?.blogs &&
          blogs?.blogs.map((blog) => {
            return (
              <BlogCard
                key={blog?.blog_id}
                blog={blog}
                status={status}
                isDraft={true}
                onEdit={handleEdit}
                modificationEnable={session?.user.username === params.username}
                bookmarkEnable={false}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
