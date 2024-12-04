'use client';

import { useParams, useRouter } from 'next/navigation';

import { BlogCard } from '@/components/blog/cards/BlogCard';
import { BlogListCardSkeleton } from '@/components/skeletons/blogSkeleton';
import useGetPublishedBlogByAccountId from '@/hooks/blog/useGetPublishedBlogByAccountId';
import { useSession } from 'next-auth/react';

export const Blogs = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const params = useParams<{ username: string }>();
  const { blogs, isLoading } = useGetPublishedBlogByAccountId(params.username);

  const handleEdit = (blogId: string) => {
    router.push(`/edit/${blogId}?source=published`);
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
          <p className='font-roboto italic opacity-75'>No blogs available</p>
        ) : (
          blogs?.blogs &&
          blogs?.blogs.map((blog) => {
            return (
              <BlogCard
                key={blog?.blog_id}
                titleBlock={blog?.blog?.blocks[0]}
                descriptionBlock={blog?.blog?.blocks[1]}
                authorId={blog?.owner_account_id}
                date={blog?.blog?.time}
                blogId={blog?.blog_id}
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
