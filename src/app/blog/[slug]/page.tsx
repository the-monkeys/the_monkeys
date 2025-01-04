'use client';

import dynamic from 'next/dynamic';

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

import { BlogReactionsContainer } from '../components/blog/BlogReactions';
import { BlogRecommendations } from '../components/blog/BlogRecommendations';
import { BlogTopics } from '../components/blog/BlogTopics';

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

  console.log(searchParams.id);

  const blogId = blog?.blog_id;
  const authorId = blog?.owner_account_id;
  const date = blog?.published_time || blog?.blog?.time;
  const tags = blog?.tags;

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
    <Container className='px-4 py-5 grid grid-cols-3 gap-6 lg:gap-8'>
      <div className='relative col-span-3 lg:col-span-2'>
        <div className='mb-2 flex justify-between items-center'>
          <UserInfoCard id={authorId} date={date} />

          <BlogActionsDropdown blogId={blogId} />
        </div>

        <Separator className='mt-4' />

        <div className='pb-10 min-h-screen overflow-hidden'>
          <Editor key={blogId} data={blog?.blog} />
        </div>

        <BlogReactionsContainer blogId={blogId} />
      </div>

      <div className='col-span-3 lg:col-span-1 space-y-6'>
        <BlogTopics topics={tags || []} />

        <div className='space-y-1'>
          <h4 className='px-1 font-dm_sans font-medium'>About Author</h4>

          <ProfileInfoCard userId={authorId} className='max-w-[500px]' />
        </div>

        <BlogRecommendations />
      </div>
    </Container>
  );
};

export default BlogPage;
