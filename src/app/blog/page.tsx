'use client';

import dynamic from 'next/dynamic';

import { ContributeAndSponsorCard } from '@/components/branding/sponsor/ContributeAndSponsorCard';
import Container from '@/components/layout/Container';
import {
  EditorBlockSkeleton,
  PublishedBlogSkeleton,
} from '@/components/skeletons/blogSkeleton';
import { Separator } from '@/components/ui/separator';
import { ProfileInfoCard } from '@/components/user/cards/ProfileInfoCard';
import useGetPublishedBlogDetailByBlogId from '@/hooks/blog/useGetPublishedBlogDetailByBlogId';

import { BlogInfoSection } from './components/blog/BlogInfoSection';
import { BlogReactions } from './components/blog/BlogReactions';
import { BlogRecommendations } from './components/blog/BlogRecommendations';
import { BlogTopics } from './components/blog/BlogTopics';

const Editor = dynamic(() => import('@/components/editor/preview'), {
  ssr: false,
  loading: () => <EditorBlockSkeleton />,
});

const BlogPage = ({
  searchParams,
}: {
  searchParams: {
    id: string;
  };
}) => {
  const { blog, isError, isLoading } = useGetPublishedBlogDetailByBlogId(
    searchParams.id
  );

  if (isLoading) {
    return <PublishedBlogSkeleton />;
  }

  if (isError)
    return (
      <Container className='min-h-screen'>
        <p className='py-4 text-sm text-alert-red text-center'>
          Error fetching blog content. Try again.
        </p>
      </Container>
    );

  return (
    <Container className='py-8 px-4 min-h-screen grid grid-cols-3 gap-6 lg:gap-8'>
      <div className='col-span-3 lg:col-span-2'>
        <BlogInfoSection blog={blog} />

        <Separator className='mt-2' />

        <div className='overflow-hidden'>
          <Editor key={blog?.blog_id} data={blog?.blog} />
        </div>

        <Separator className='mt-10 mb-4' />

        <BlogReactions blogId={blog?.blog_id} />
      </div>

      <div className='col-span-3 lg:col-span-1 space-y-6'>
        <BlogTopics topics={blog?.tags || []} />

        <div className='space-y-1'>
          <h4 className='px-1 font-dm_sans font-medium'>About Author</h4>

          <ProfileInfoCard
            userId={blog?.owner_account_id}
            className='max-w-[500px]'
          />
        </div>

        <BlogRecommendations />
      </div>
    </Container>
  );
};

export default BlogPage;
