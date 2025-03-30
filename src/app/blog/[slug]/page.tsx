'use client';

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

import { getCardContent } from '@/components/blog/getBlogContent';
import Icon from '@/components/icon';
import LinksRedirectArrow from '@/components/links/LinksRedirectArrow';
import {
  EditorBlockSkeleton,
  PublishedBlogSkeleton,
} from '@/components/skeletons/blogSkeleton';
import {
  HashTopicLinksContainer,
  TopicLinksContainer,
} from '@/components/topics/topicsContainer';
import { ProfileInfoCard } from '@/components/user/cards/ProfileInfoCard';
import { UserInfoCardBlogPage } from '@/components/user/userInfo';
import useGetPublishedBlogDetailByBlogId from '@/hooks/blog/useGetPublishedBlogDetailByBlogId';
import useGetProfileInfoById from '@/hooks/user/useGetProfileInfoByUserId';
import { purifyHTMLString } from '@/utils/purifyHTML';

import { BlogReactionsContainer } from '../components/BlogReactions';
import { BlogRecommendations } from '../components/BlogRecommendations';
import { generateBlogSchema } from './utils/utils';

const Editor = dynamic(() => import('@/components/editor/preview'), {
  ssr: false,
  loading: () => <EditorBlockSkeleton />,
});

const BlogPage = () => {
  const params = useParams();

  const fullSlug = params?.slug || '';
  const blogId = typeof fullSlug === 'string' ? fullSlug.split('-').pop() : ''; // Extract the blog ID from the slug

  const { blog, isError, isLoading } =
    useGetPublishedBlogDetailByBlogId(blogId);
  const authorId = blog?.owner_account_id;

  const { user } = useGetProfileInfoById(authorId);
  const authorName = user?.user?.username || 'Monkeys Writer';

  if (isLoading) {
    return <PublishedBlogSkeleton />;
  }

  if (isError || !blog) {
    return (
      <div className='col-span-3 min-h-screen'>
        <div className='py-5 flex flex-col items-center space-y-1'>
          <div className='p-2'>
            <Icon name='RiErrorWarning' size={50} className='text-alert-red' />
          </div>

          <p className='text-lg text-center'>
            The blog content isn&apos;t available.
          </p>

          <p className='text-center opacity-80'>
            It might have been removed by the owner or is temporarily
            inaccessible.
          </p>
        </div>

        <LinksRedirectArrow link='/feed' className='py-4 mx-auto w-fit'>
          <p className='font-dm_sans'>Visit Our Showcase</p>
        </LinksRedirectArrow>
      </div>
    );
  }

  const blogIdfromAPI = blog?.blog_id;
  const date = blog?.published_time || blog?.blog?.time;
  const tags = blog?.tags;

  const blogTitle = blog?.blog.blocks[0].data.text;
  const blogDataWithoutHeading = {
    ...blog.blog,
    blocks: blog?.blog.blocks.slice(1),
  };

  const { titleContent, descriptionContent, imageContent } = getCardContent({
    blog,
  });

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBlogSchema(
              titleContent,
              descriptionContent,
              imageContent,
              blog?.published_time,
              fullSlug,

              tags,
              authorName,
              blog
            )
          ),
        }}
      />
      <div className='relative col-span-3 lg:col-span-2'>
        <div className='mb-6'>
          <UserInfoCardBlogPage id={authorId} date={date} />
        </div>

        <div className='space-y-2'>
          <h1
            dangerouslySetInnerHTML={{
              __html: purifyHTMLString(blogTitle),
            }}
            className='font-dm_sans font-bold text-[30px] md:text-[34px] leading-[1.3]'
          ></h1>

          <HashTopicLinksContainer topics={tags} />
        </div>

        <div className='pb-10 min-h-screen overflow-hidden'>
          <Editor key={blogId} data={blogDataWithoutHeading} />
        </div>

        <BlogReactionsContainer blogURL={fullSlug} blogId={blogIdfromAPI} />

        <div className='mt-[50px]'>
          <TopicLinksContainer topics={tags} />
        </div>
      </div>

      <div className='col-span-3 lg:col-span-1 space-y-8'>
        <div className='space-y-2'>
          <h4 className='px-1 font-dm_sans font-medium'>Author Spotlight</h4>

          <ProfileInfoCard userId={authorId} className='max-w-[500px]' />
        </div>

        <BlogRecommendations blogId={blogIdfromAPI} />
      </div>
    </>
  );
};

export default BlogPage;
