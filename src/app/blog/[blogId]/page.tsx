'use client';

import { ContributeAndSponsorCard } from '@/components/branding/sponsor/ContributeAndSponsorCard';
import Editor from '@/components/editor/preview';
import Container from '@/components/layout/Container';
import { PublishedBlogSkeleton } from '@/components/skeletons/blogSkeleton';
import { Separator } from '@/components/ui/separator';
import useGetPublishedBlogDetailByBlogId from '@/hooks/blog/useGetPublishedBlogDetailByBlogId';

import { BlogInfoSection } from './components/blog/BlogInfoSection';
import { BlogReactions } from './components/blog/BlogReactions';
import { BlogRecommendations } from './components/blog/BlogRecommendations';
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

  if (isError)
    return (
      <Container className='min-h-screen'>
        <p className='py-4 font-roboto text-sm text-alert-red text-center'>
          Error fetching blog. Try again.
        </p>
      </Container>
    );

  return (
    <Container className='pb-12 min-h-screen grid grid-cols-3'>
      <div className='p-4 col-span-3 md:col-span-2'>
        <BlogInfoSection blog={blog} />

        <Separator className='mt-2' />

        <Editor data={blog?.blog} />

        <Separator className='mt-12 mb-6' />

        <BlogTopics topics={blog?.tags || []} className='mb-4' />

        <BlogReactions blogId={blog?.blog_id} />
      </div>

      <div className='p-4 col-span-3 md:col-span-1'>
        <ContributeAndSponsorCard className='mb-4' />

        <h4 className='px-1 font-dm_sans font-medium text-base sm:text-lg opacity-80'>
          You might also like
        </h4>

        <Separator className='mt-1 mb-3' />

        <BlogRecommendations />
      </div>
    </Container>
  );
};

export default BlogPage;
