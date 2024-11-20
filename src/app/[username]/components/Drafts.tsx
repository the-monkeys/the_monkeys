'use client';

import { useRouter } from 'next/navigation';

import { BlogListCardSkeleton } from '@/components/skeletons/blogSkeleton';
import useGetAllDraftBlogs from '@/hooks/useGetAllDraftBlogs';
import { useSession } from 'next-auth/react';

import { BlogCard } from './blog/BlogCard';

export const Drafts = () => {
  const { data: session } = useSession();
  const { blogs, isLoading } = useGetAllDraftBlogs(session?.user.account_id);
  const router = useRouter();

  const handleEdit = (blogId: string) => {
    router.push(`/edit/${blogId}?source=draft`);
  };

  return (
    <div className='min-h-screen'>
      <div className='flex flex-col items-center'>
        {isLoading ? (
          <div className='w-full space-y-6'>
            {Array(4)
              .fill(null)
              .map((_, index) => (
                <BlogListCardSkeleton key={index} />
              ))}
          </div>
        ) : !blogs?.blogs || blogs?.blogs?.length === 0 ? (
          <p className='font-jost italic opacity-75'>No drafts available</p>
        ) : (
          blogs?.blogs &&
          blogs?.blogs.map((blog) => {
            return (
              <BlogCard
                key={blog?.blog_id}
                titleBlock={blog?.blog?.blocks[0]}
                descriptionBlock={blog?.blog?.blocks[1]}
                author_id={blog?.owner_account_id}
                date={blog?.blog?.time}
                blogId={blog?.blog_id}
                isDraft={true}
                onEdit={handleEdit}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
