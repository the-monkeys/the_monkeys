'use client';

import Editor from '@/components/editor/preview';
import Container from '@/components/layout/Container';
import { PublishedBlogSkeleton } from '@/components/skeletons/blogSkeleton';
import { Separator } from '@/components/ui/separator';
import useGetPublishedBlogDetailByBlogId from '@/hooks/useGetPublishedBlogDetailByBlogId';

import BlogInfoSection from './components/blog/BlogInfoSection';
import BlogReactions from './components/blog/BlogReactions';
import BlogCommentsSection from './components/comments/BlogCommentsSection';

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
    <Container className='min-h-screen px-5 pb-12'>
      <BlogInfoSection blog={blog} />

      <Separator />

      <Editor data={blog?.blog} />

      <BlogReactions
        blog_id={blog?.blog_id}
        className='px-1 border-t-1 border-b-1 border-secondary-lightGrey/25 my-6 mx-auto w-full sm:w-4/5'
      />

      <BlogCommentsSection />
    </Container>
  );
};

export default BlogPage;
