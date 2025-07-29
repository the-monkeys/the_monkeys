'use client';

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

import { BlogTitle, getCardContent } from '@/components/blog/getBlogContent';
import Icon from '@/components/icon';
import Container from '@/components/layout/Container';
import LinksRedirectArrow from '@/components/links/LinksRedirectArrow';
import {
  BlogPageSkeleton,
  EditorBlockSkeleton,
} from '@/components/skeletons/blogSkeleton';
import { TopicLinksContainer } from '@/components/topics/topicsContainer';
import { AuthorInfoCard } from '@/components/user/cards/AuthorInfoCard';
import { UserInfoCardBlogPage } from '@/components/user/userInfo';
import useGetPublishedBlogDetailByBlogId from '@/hooks/blog/useGetPublishedBlogDetailByBlogId';
import useGetProfileInfoById from '@/hooks/user/useGetProfileInfoByUserId';
import moment from 'moment';

import { BlogReactionsContainer } from '../components/BlogReactions';
import { BlogRecommendations } from '../components/BlogRecommendations';
import { generateBlogSchema } from './utils';

const Editor = dynamic(() => import('@/components/editor/preview'), {
  ssr: false,
  loading: () => <EditorBlockSkeleton />,
});

const BlogPage = () => {
  const params = useParams();

  const fullSlug = params?.slug || '';
  const urlBlogId =
    typeof fullSlug === 'string' ? fullSlug.split('-').pop() : '';

  const { blog, isError, isLoading } =
    useGetPublishedBlogDetailByBlogId(urlBlogId);
  const authorId = blog?.owner_account_id;

  const { user } = useGetProfileInfoById(authorId);
  const authorName = user?.user?.username || 'Monkeys Author';

  if (isLoading) {
    return <BlogPageSkeleton />;
  }

  if (isError || !blog) {
    return (
      <div className='px-4 py-12 flex flex-col items-center justify-center'>
        <div className='p-4 flex items-center'>
          <p className='font-dm_sans font-bold text-6xl'>4</p>
          <Icon name='RiErrorWarning' size={50} className='text-alert-red' />
          <p className='font-dm_sans font-bold text-6xl'>4</p>
        </div>

        <h2 className='py-1 font-dm_sans font-medium text-lg text-center'>
          Page not found — but at least you found us!
        </h2>

        <p className='text-base opacity-90 text-center'>
          Try refreshing, or swing by again later.
        </p>
      </div>
    );
  }

  const blogId = blog?.blog_id;
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

      <>
        <div>
          <Container className='px-4 py-8 md:py-10 max-w-5xl flex flex-col items-center gap-4'>
            <div className='mb-1 flex justify-center items-center gap-2'>
              <p className='text-xs sm:text-sm opacity-90'>
                {moment(date).format('MMM DD, yyyy')}
              </p>

              <p>{' · '}</p>

              <p className='text-xs sm:text-sm opacity-90'>
                {moment(date).utc().format('hh:mm A')} UTC
              </p>
            </div>

            <BlogTitle
              title={blogTitle}
              className='py-[6px] font-dm_sans font-bold text-3xl sm:text-4xl !leading-snug text-center'
            />

            <UserInfoCardBlogPage id={authorId} />
          </Container>
        </div>

        <div className='space-y-20'>
          <Container className='px-4 max-w-3xl space-y-6'>
            <div className='overflow-hidden border-t-1 border-border-light dark:border-border-dark'>
              <Editor key={blogId} data={blogDataWithoutHeading} />
            </div>

            <BlogReactionsContainer blogURL={fullSlug} blogId={blogId} />
          </Container>

          <Container className='px-4 max-w-5xl space-y-12'>
            <TopicLinksContainer topics={tags} />

            <AuthorInfoCard userId={authorId} className='max-w-[600px]' />

            <div className='py-6 space-y-3'>
              <h6 className='p-1 font-dm_sans font-semibold'>
                Explore similar content
              </h6>

              <BlogRecommendations blogId={blogId} topics={tags} />
            </div>
          </Container>
        </div>
      </>
    </>
  );
};

export default BlogPage;
