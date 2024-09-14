'use client';

import { Loader } from '@/components/loader';
import useGetDraftBlog from '@/hooks/useGetDraftBlog';
import { useSession } from 'next-auth/react';

import BlogCard from './BlogCard';

const Drafts = () => {
  const { data: session } = useSession();
  const { blogs, isLoading } = useGetDraftBlog(session?.user.account_id);

  return (
    <div className='min-h-screen'>
      <div className='flex flex-col items-center'>
        {isLoading ? (
          <Loader />
        ) : !blogs?.blogs || blogs?.blogs?.length === 0 ? (
          <p className='font-jost italic opacity-75'>No drafts available</p>
        ) : (
          blogs?.blogs &&
          blogs?.blogs.map((blog) => {
            return (
              <BlogCard
                key={blog?.blog_id}
                title={blog?.blog?.blocks[0]?.data?.text}
                description={blog?.blog?.blocks[0]?.data?.text}
                author={session?.user.username as string}
                date={blog?.blog?.time}
                tags={blog?.tags}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default Drafts;
