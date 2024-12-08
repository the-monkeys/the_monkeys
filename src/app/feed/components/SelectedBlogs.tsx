import { useEffect, useState } from 'react';

import { FeedBlogCard } from '@/components/blog/cards/FeedBlogCard';
import { FeedListCardSkeleton } from '@/components/skeletons/blogSkeleton';
import axiosInstance from '@/services/api/axiosInstance';
import { GetBlogsByTopics } from '@/services/blog/blogTypes';
import { z } from 'zod';

const getBlogsByTopicSchema = z.object({
  tags: z.array(z.string()),
});

export const SelectedBlogs = ({
  topic,
  status,
}: {
  topic: string;
  status: 'authenticated' | 'loading' | 'unauthenticated';
}) => {
  const [blogs, setBlogs] = useState<GetBlogsByTopics>({ the_blogs: [] });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      const payload = {
        tags: [topic],
      };

      try {
        setIsLoading(true);

        getBlogsByTopicSchema.parse(payload);

        const response = await axiosInstance.post('/blog/tags', payload);

        console.log('Fetched blogs:', response.data);

        setBlogs(response.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('Error fetching blogs:', err.message);
        } else {
          console.error('Unknown error occurred:', err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [topic, status]);

  return (
    <div className='flex flex-col gap-6 sm:gap-8'>
      {isLoading ? (
        <div className='w-full space-y-6'>
          {Array(4)
            .fill(null)
            .map((_, index) => (
              <FeedListCardSkeleton key={index} />
            ))}
        </div>
      ) : !blogs?.the_blogs || blogs?.the_blogs?.length === 0 ? (
        <p className='font-roboto text-sm opacity-80 text-center'>
          No blogs available for this topic.
        </p>
      ) : (
        blogs?.the_blogs.map((blog) => {
          return (
            <FeedBlogCard key={blog.blog_id} blog={blog} status={status} />
          );
        })
      )}
      {/* {blogs.the_blogs.length > 0 ? (
        blogs.the_blogs.map((blog, index) => (
          <div key={index} className='border p-4 rounded-md shadow'>
            <h3 className='font-bold text-lg'>
              {blog.blog.blocks[0].data.text}
            </h3>
          </div>
        ))
      ) : (
        <p className='font-roboto text-sm opacity-80'>No blogs available.</p>
      )} */}
    </div>
  );
};
