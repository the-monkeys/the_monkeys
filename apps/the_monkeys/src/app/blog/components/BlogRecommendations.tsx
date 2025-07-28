import { useEffect, useState } from 'react';

import { TrendingBlogCardSmall } from '@/components/cards/blog/TrendingBlogCard';
import { BlogPageRecommendationSkeleton } from '@/components/skeletons/blogSkeleton';
import axiosInstanceNoAuthV2 from '@/services/api/axiosInstanceNoAuthV2';
import { GetMetaFeedBlogs } from '@/services/blog/blogTypes';

export const BlogRecommendations = ({
  blogId,
  topics,
}: {
  blogId: string;
  topics: string[];
}) => {
  const [blogs, setBlogs] = useState<GetMetaFeedBlogs>({ blogs: [] });

  const [blogsLoading, setBlogsLoading] = useState(true);
  const [blogsError, setBlogsError] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      setBlogsLoading(true);
      setBlogsError(false);

      try {
        const response = await axiosInstanceNoAuthV2.post(`/blog/meta-feed`, {
          tags: topics,
        });

        setBlogs(response.data);
      } catch (err: unknown) {
        setBlogsError(true);
      } finally {
        setBlogsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (blogsLoading) {
    return <BlogPageRecommendationSkeleton />;
  }

  if (
    !blogsLoading &&
    (blogsError || !blogs?.blogs || blogs?.blogs.length === 0)
  ) {
    return (
      <div className='p-2 flex items-center justify-center'>
        <p className='opacity-90'>No results found.</p>
      </div>
    );
  }

  const filteredRecommendations = blogs?.blogs.filter(
    (blog) => blog?.blog_id !== blogId
  );

  return (
    <div className='grid grid-cols-2 lg:grid-cols-3 gap-6'>
      {filteredRecommendations.slice(0, 6).map((blog) => {
        return (
          <div className='col-span-2 sm:col-span-1' key={blog?.blog_id}>
            <TrendingBlogCardSmall blog={blog} />
          </div>
        );
      })}
    </div>
  );
};
