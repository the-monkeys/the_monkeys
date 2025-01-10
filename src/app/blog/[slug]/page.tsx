'use client';

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

import { BlogActionsDropdown } from '@/components/blog/actions/BlogActionsDropdown';
import Container from '@/components/layout/Container';
import {
  EditorBlockSkeleton,
  PublishedBlogSkeleton,
} from '@/components/skeletons/blogSkeleton';
import { Separator } from '@/components/ui/separator';
import { ProfileInfoCard } from '@/components/user/cards/ProfileInfoCard';
import { UserInfoCard } from '@/components/user/userInfo';
import useGetPublishedBlogDetailByBlogId from '@/hooks/blog/useGetPublishedBlogDetailByBlogId';

import { BlogReactionsContainer } from '../components/BlogReactions';
import { BlogRecommendations } from '../components/BlogRecommendations';
import { BlogTopics } from '../components/BlogTopics';

const Editor = dynamic(() => import('@/components/editor/preview'), {
  ssr: false,
  loading: () => <EditorBlockSkeleton />,
});

const BlogPage = () => {
  const params = useParams();

  // Assuming your route is `/blog/[slug]`, `params.slug` will contain the full slug.
  const fullSlug = params?.slug || '';
  const blogId = typeof fullSlug === 'string' ? fullSlug.split('-').pop() : ''; // Extract the blog ID from the slug

  const { blog, isError, isLoading } =
    useGetPublishedBlogDetailByBlogId(blogId);

  if (isLoading) {
    return <PublishedBlogSkeleton />;
  }

  if (isError || !blog) {
    return (
      <Container className='min-h-screen'>
        <p className='py-4 text-sm text-alert-red text-center'>
          Error fetching blog content. Try again.
        </p>
      </Container>
    );
  }

  const blogIdfromAPI = blog?.blog_id;
  const authorId = blog?.owner_account_id;
  const date = blog?.published_time || blog?.blog?.time;
  const tags = blog?.tags;

  return (
    <>
      <div className='relative col-span-3 lg:col-span-2'>
        <div className='mb-2 flex justify-between items-center'>
          <UserInfoCard id={authorId} date={date} />

          <BlogActionsDropdown blogURL={fullSlug} />
        </div>

        <Separator className='mt-4' />

        <div className='pb-10 min-h-screen overflow-hidden'>
          <Editor key={blogId} data={blog?.blog} />
        </div>

        <BlogReactionsContainer blogURL={fullSlug} blogId={blogIdfromAPI} />
      </div>

      <div className='col-span-3 lg:col-span-1 space-y-6'>
        <BlogTopics topics={tags || []} />

        <div className='space-y-1'>
          <h4 className='px-1 font-dm_sans font-medium'>About Author</h4>

          <ProfileInfoCard userId={authorId} className='max-w-[500px]' />
        </div>

        <BlogRecommendations blogId={blogIdfromAPI} />
      </div>
    </>
  );
};

export default BlogPage;
