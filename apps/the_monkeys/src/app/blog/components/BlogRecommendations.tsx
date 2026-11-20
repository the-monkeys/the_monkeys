import { useEffect, useState } from 'react';

import { TrendingBlogCardSmall } from '@/components/cards/blog/TrendingBlogCard';
import { BlogPageRecommendationSkeleton } from '@/components/skeletons/blogSkeleton';
import {
  formatRelatedPostDate,
  selectPublicRelatedPosts,
} from '@/lib/publicRelatedPosts';
import axiosInstanceNoAuthV2 from '@/services/api/axiosInstanceNoAuthV2';
import { MetaBlog } from '@/services/blog/blogTypes';

export const BlogRecommendations = ({
  blogId,
  topics,
  initialBlogs,
}: {
  blogId: string;
  topics: string[];
  initialBlogs?: MetaBlog[];
}) => {
  const validTopics = Array.isArray(topics)
    ? topics.filter((tag) => typeof tag === 'string')
    : [];
  const topicsKey = JSON.stringify(validTopics);
  const requestKey = `${blogId}:${topicsKey}`;
  const [result, setResult] = useState<{
    key: string;
    blogs?: MetaBlog[];
    error?: boolean;
  }>({ key: requestKey });

  useEffect(() => {
    if (initialBlogs !== undefined) return;
    let cancelled = false;
    setResult({ key: requestKey });
    axiosInstanceNoAuthV2
      .post('/blog/meta-feed', { tags: JSON.parse(topicsKey) })
      .then((response) => {
        if (!cancelled)
          setResult({
            key: requestKey,
            blogs: selectPublicRelatedPosts(
              response.data,
              blogId,
              JSON.parse(topicsKey)
            ),
          });
      })
      .catch(() => {
        if (!cancelled) setResult({ key: requestKey, blogs: [], error: true });
      });
    return () => {
      cancelled = true;
    };
  }, [blogId, topicsKey, requestKey, initialBlogs]);

  const blogs =
    initialBlogs !== undefined
      ? selectPublicRelatedPosts({ blogs: initialBlogs }, blogId, validTopics)
      : result.key === requestKey
        ? result.blogs
        : undefined;
  if (blogs === undefined) return <BlogPageRecommendationSkeleton />;
  if (initialBlogs === undefined && result.error) {
    return (
      <div className='p-2 flex items-center justify-center'>
        <p className='opacity-90'>No results found.</p>
      </div>
    );
  }
  return (
    <div className='grid grid-cols-2 lg:grid-cols-3 gap-8'>
      {blogs.length ? (
        blogs.map((blog) => (
          <div className='col-span-2 sm:col-span-1' key={blog.blog_id}>
            <TrendingBlogCardSmall
              blog={blog}
              dateLabel={formatRelatedPostDate(blog.published_time)}
            />
          </div>
        ))
      ) : (
        <div className='col-span-full p-2 flex items-center justify-center'>
          <p className='opacity-90'>No similar posts available.</p>
        </div>
      )}
    </div>
  );
};
