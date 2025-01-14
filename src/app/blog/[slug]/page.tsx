'use client';

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

import { TopicBadgeShowcase } from '@/components/badges/topicBadge';
import {
  EditorBlockSkeleton,
  PublishedBlogSkeleton,
} from '@/components/skeletons/blogSkeleton';
import { Separator } from '@/components/ui/separator';
import { ProfileInfoCard } from '@/components/user/cards/ProfileInfoCard';
import { UserInfoCard } from '@/components/user/userInfo';
import useGetPublishedBlogDetailByBlogId from '@/hooks/blog/useGetPublishedBlogDetailByBlogId';
import { purifyHTMLString } from '@/utils/purifyHTML';

import { BlogReactionsContainer } from '../components/BlogReactions';
import { BlogRecommendations } from '../components/BlogRecommendations';
import { BlogTopics } from '../components/BlogTopics';

const Editor = dynamic(() => import('@/components/editor/preview'), {
  ssr: false,
  loading: () => <EditorBlockSkeleton />,
});

const BlogPage = () => {
  const params = useParams();

  // Assuming route is `/blog/[slug]`, `params.slug` will contain the full slug.
  const fullSlug = params?.slug || '';
  const blogId = typeof fullSlug === 'string' ? fullSlug.split('-').pop() : ''; // Extract the blog ID from the slug

  const { blog, isError, isLoading } =
    useGetPublishedBlogDetailByBlogId(blogId);

  if (isLoading) {
    return <PublishedBlogSkeleton />;
  }

  if (isError || !blog) {
    return (
      <div className='col-span-3 min-h-screen'>
        <p className='py-4 text-sm text-alert-red text-center'>
          Error fetching blog content. Try again.
        </p>
      </div>
    );
  }

  const blogIdfromAPI = blog?.blog_id;
  const authorId = blog?.owner_account_id;
  const date = blog?.published_time || blog?.blog?.time;
  const tags = blog?.tags;

  const blogTitle = blog?.blog.blocks[0].data.text;
  const blogDataWithoutHeading = {
    ...blog.blog,
    blocks: blog?.blog.blocks.slice(1),
  };

  const tagColorCode = ['#5A9BD5', '#70AD47', '#FF5733', '#4472C4', '#8E44AD'];

  return (
    <>
      <div className='relative col-span-3 lg:col-span-2'>
        <div className='space-y-[6px]'>
          <div className='flex justify-between items-center'>
            <UserInfoCard id={authorId} date={date} />
          </div>
        </div>

        <Separator className='mt-2 mb-4 opacity-80' />

        <div>
          <h1
            dangerouslySetInnerHTML={{
              __html: purifyHTMLString(blogTitle),
            }}
            className='font-dm_sans font-semibold text-[30px] sm:text-[32px] leading-[1.3]'
          ></h1>

          <div className='mt-2 relative flex gap-1 flex-wrap'>
            {blog?.tags.length ? (
              blog?.tags.map((tag, index) => {
                return (
                  <TopicBadgeShowcase
                    key={index}
                    topic={tag}
                    colorCode={tagColorCode[index]}
                  />
                );
              })
            ) : (
              <div
                style={{
                  backgroundColor: '#696969' + '25',
                  borderColor: '#696969',
                }}
                className='px-2 py-[1px] border-1 rounded-full'
              >
                <p
                  style={{
                    color: '#696969',
                  }}
                  className='font-dm_sans text-xs whitespace-nowrap'
                >
                  no topics available
                </p>
              </div>
            )}
          </div>
        </div>

        <div className='pb-10 min-h-screen overflow-hidden'>
          <Editor key={blogId} data={blogDataWithoutHeading} />
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
