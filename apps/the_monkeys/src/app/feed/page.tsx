'use client';

import { FeaturedAuthorsSection } from '@/app/feed/sections/FeaturedAuthor/FeaturedAuthorsSection';
import { FeedBlogPostListCard } from '@/components/cards/blog/FeedBlogCard';
import { recommendedUsers } from '@/constants/social';
import useGetFollowingFeed from '@/hooks/blog/useGetFollowingFeed';

const BlogFeedPage = () => {
  const { blogs, isError, isLoading } = useGetFollowingFeed({ limit: 30 });

  // Todo: write an better fallback
  if (isError) {
    return (
      <div className='px-4 py-12 flex flex-col items-center justify-center'>
        <h2 className='py-1 font-dm_sans font-medium text-lg text-center text-alert-red'>
          {"You don't follow any one!"}
        </h2>
      </div>
    );
  }

  return (
    <div className='min-h-screen'>
      <h1 className='text-2xl font-bold hidden'>
        Monkeys - Quality Blogging Community for Technology, Business, Science,
        Lifestyle, Philosophy, and More
      </h1>

      <FeaturedAuthorsSection users={recommendedUsers} />

      <div className='grid grid-cols-1 gap-y-4 gap-x-6 '>
        {blogs &&
          blogs.map((blog) => {
            return <FeedBlogPostListCard blog={blog} key={blog?.blog_id} />;
          })}
      </div>
    </div>
  );
};

export default BlogFeedPage;
