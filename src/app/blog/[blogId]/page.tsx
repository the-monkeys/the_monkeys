'use client';

import Editor from '@/components/editor/preview';
import Container from '@/components/layout/Container';
import { PublishedBlogSkeleton } from '@/components/skeletons/blogSkeleton';
import { Separator } from '@/components/ui/separator';
import useGetPublishedBlogDetailByBlogId from '@/hooks/useGetPublishedBlogDetailByBlogId';

import { BlogInfoSection } from './components/blog/BlogInfoSection';
import { BlogReactions } from './components/blog/BlogReactions';
import { BlogTopics } from './components/blog/BlogTopics';
import { BlogCommentsSection } from './components/comments/BlogCommentsSection';

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

        <Editor data={blog?.blog} />

        <Separator className='my-12' />

        <BlogTopics topics={blog?.tags || []} />

        <BlogReactions blog_id={blog?.blog_id} className='mt-6' />

        <BlogCommentsSection />
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
