'use client';

import Editor from '@/components/editor/preview';
import Container from '@/components/layout/Container';
import { PublishedBlogSkeleton } from '@/components/skeletons/blogSkeleton';
import { Separator } from '@/components/ui/separator';
import useGetPublishedBlogDetailByBlogId from '@/hooks/useGetPublishedBlogDetailByBlogId';
import moment from 'moment';

import { BlogInfoSection } from './components/blog/BlogInfoSection';
import { BlogReactions } from './components/blog/BlogReactions';
import { BlogTopics } from './components/blog/BlogTopics';

const BlogPage = ({
  params,
}: {
  params: {
    blogId: string;
  };
}) => {
  const { blog, isError, isLoading } = useGetPublishedBlogDetailByBlogId(
    params.blogId
  );

  if (isLoading) {
    return <PublishedBlogSkeleton />;
  }

  return (
    <Container className='pb-12 grid grid-cols-3'>
      <div className='p-4 col-span-3 md:col-span-2'>
        <BlogInfoSection blog={blog} />

        <Separator className='mt-4' />

        <p className='mt-2 font-jost text-xs md:text-sm'>
          <span className='opacity-75'>Last Updated: </span>
          {moment(blog?.blog?.time).format('MMM DD, YYYY')}
        </p>

        <Editor data={blog?.blog} />

        <Separator className='mt-12 mb-6' />

        <BlogTopics topics={blog?.tags || []} className='mb-4' />

        <BlogReactions blogId={blog?.blog_id} />
      </div>

      <div className='p-4 col-span-3 md:col-span-1'>
        <h4 className='font-josefin_Sans text-base sm:text-lg'>
          Recommended Blogs
        </h4>
      </div>
    </Container>
  );
};

export default BlogPage;
