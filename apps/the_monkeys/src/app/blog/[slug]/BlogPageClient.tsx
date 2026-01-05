'use client';

import { useEffect } from 'react';

import dynamic from 'next/dynamic';

import AdUnit from '@/components/AdSense/AdUnit';
import { BlogHeading, getCardContent } from '@/components/blog/getBlogContent';
import { AuthorInfoCard } from '@/components/cards/author/AuthorInfoCard';
import Icon from '@/components/icon';
import Container from '@/components/layout/Container';
import {
  BlogPageSkeleton,
  EditorBlockSkeleton,
} from '@/components/skeletons/blogSkeleton';
import { SocialSnapshotCard } from '@/components/social/SocialSnapshot';
import { TopicLinksContainerCompact } from '@/components/topics/topicsContainer';
import { UserInfoCardBlogPage } from '@/components/user/userInfo';
import useGetPublishedBlogDetailByBlogId from '@/hooks/blog/useGetPublishedBlogDetailByBlogId';
import useGetProfileInfoById from '@/hooks/user/useGetProfileInfoByUserId';
import { purifyHTMLString } from '@/utils/purifyHTML';
import moment from 'moment';

import { BlogReactionsContainer } from '../components/BlogReactions';
import { BlogRecommendations } from '../components/BlogRecommendations';

const Editor = dynamic(() => import('@/components/editor/preview'), {
  ssr: false,
  loading: () => <EditorBlockSkeleton />,
});

interface BlogPageClientProps {
  urlBlogId: string;
  fullSlug: string;
}

const BlogPageClient = ({ urlBlogId, fullSlug }: BlogPageClientProps) => {
  const { blog, isError, isLoading } =
    useGetPublishedBlogDetailByBlogId(urlBlogId);
  const authorId = blog?.owner_account_id;

  const { user } = useGetProfileInfoById(authorId);

  useEffect(() => {
    const startTime = Date.now();
    let hasSent = false;

    // Function to transmit data
    const sendData = () => {
      const durationMs = Date.now() - startTime;
      // Only send if substantial time spent (>1s) and not already sent
      if (!hasSent && durationMs > 1000 && urlBlogId) {
        hasSent = true;

        const payload = JSON.stringify({
          duration_ms: durationMs,
          interaction_type: 'read_duration',
        });
        const url = `/api/v2/blog/${urlBlogId}/activity`;

        // navigator.sendBeacon is more reliable for page unloads
        // Use fetch with keepalive as it supports application/json headers reliably
        // compared to sendBeacon which can be tricky with non-text types
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch((err) => {
          // Only log internal errors if valuable
          // console.error(err);
        });
      }
    };

    // Handle visibility change (e.g. switching tabs, minimizing window)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        sendData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function for component unmount
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      sendData();
    };
  }, [urlBlogId]);

  if (isLoading) {
    return <BlogPageSkeleton />;
  }

  if (isError || !blog) {
    return (
      <div className='px-4 pt-12 flex flex-col items-center justify-center'>
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
  const sanitizedBlogTitle = purifyHTMLString(blogTitle);

  const blogDataWithoutHeading = () => {
    const firstBlock = blog?.blog?.blocks[0];

    if (firstBlock?.type !== 'header') return blog?.blog;

    return {
      ...blog.blog,
      blocks: blog?.blog.blocks.slice(1),
    };
  };

  return (
    <>
      <div className='px-4'>
        <Container className='pt-8 sm:pt-10 pb-6 max-w-5xl flex flex-col items-center gap-3 border-b-1 border-border-light/80 dark:border-border-dark/80'>
          <p className='text-sm opacity-90'>
            {moment(date).format('MMM DD, yyyy')}
            {' / '}
            {moment(date).utc().format('hh:mm A')} UTC
          </p>

          <BlogHeading
            title={sanitizedBlogTitle || 'Untitled Post'}
            className='pt-1 pb-4 font-dm_sans font-semibold text-[28px] sm:text-3xl md:text-4xl !leading-[1.32] text-center'
          />

          <UserInfoCardBlogPage id={authorId} />
        </Container>
      </div>
      <AdUnit slot='4598536509' />
      <div className='p-4'>
        <Container className='max-w-3xl'>
          <div className='px-1 pb-4 overflow-hidden'>
            <Editor key={blogId} data={blogDataWithoutHeading()} />
          </div>

          <BlogReactionsContainer blogURL={fullSlug} blogId={blogId} />

          <div className='pt-10 space-y-12'>
            <div className='space-y-4'>
              <h6 className='font-dm_sans font-medium'>Topics included</h6>
              <TopicLinksContainerCompact topics={tags} />
            </div>

            <AuthorInfoCard userId={authorId} />

            <SocialSnapshotCard blog={blog} />
          </div>
        </Container>
      </div>

      <div className='px-4 mt-12'>
        <Container className='max-w-5xl space-y-12'>
          <div className='space-y-6'>
            <h6 className='font-dm_sans font-medium text-lg'>
              Explore similar content
            </h6>

            <BlogRecommendations blogId={blogId} topics={tags} />
          </div>
        </Container>
      </div>
    </>
  );
};

export default BlogPageClient;
