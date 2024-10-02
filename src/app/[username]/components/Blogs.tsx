'use client';

import { useRouter } from 'next/navigation';

import { Loader } from '@/components/loader';
import useGetPublishedBlogByAccountId from '@/hooks/useGetPublishedBlogByAccountId';
import { useSession } from 'next-auth/react';

import BlogCard from './blog/BlogCard';

const Blogs = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { blogs, isLoading } = useGetPublishedBlogByAccountId(
    session?.user.account_id
  );

  const handleEdit = (blogId: string) => {
    router.push(`/edit/${blogId}?source=published`);
  };

  return (
    <div className='min-h-screen'>
      <div className='flex flex-col items-center'>
        {isLoading ? (
          <Loader />
        ) : !blogs?.blogs || blogs?.blogs?.length === 0 ? (
          <p className='font-jost italic opacity-75'>No blogs available</p>
        ) : (
          blogs?.blogs &&
          blogs?.blogs.map((blog) => {
            const description = blog?.blog?.blocks[1]
              ? blog?.blog?.blocks[1]?.data?.text
              : blog?.blog?.blocks[0]?.data?.text;

            return (
              <BlogCard
                key={blog?.blog_id}
                title={blog?.blog?.blocks[0]?.data?.text}
                description={description}
                author={session?.user.username as string}
                date={blog?.blog?.time}
                tags={blog?.tags}
                blogId={blog?.blog_id}
                onEdit={handleEdit}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default Blogs;
