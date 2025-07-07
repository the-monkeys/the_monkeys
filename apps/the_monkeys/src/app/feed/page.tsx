'use client';

import Container from '@/components/layout/Container';
import { ShowcaseBlogCardListSkeleton } from '@/components/skeletons/blogSkeleton';
import useGetLatest100Blogs from '@/hooks/blog/useGetLatest100Blogs';

import TrendingSection from './sections/Trending';

const BlogFeedPage = () => {
  const { blogs, isLoading, isError } = useGetLatest100Blogs({ limit: 50 });

  if (isLoading || isError) {
    return <ShowcaseBlogCardListSkeleton />;
  }

  const filteredBlogs = blogs?.blogs?.filter((blog) => {
    if (!blog?.tags?.length) return false;

    if (blog?.blog?.blocks.length < 5) return false;

    return blog;
  });

  if (!filteredBlogs) {
    return (
      <div>
        <p>Blogs not available</p>
      </div>
    );
  }

  return (
    <div className=''>
      <TrendingSection blogs={filteredBlogs} />
    </div>
  );
};

export default BlogFeedPage;
