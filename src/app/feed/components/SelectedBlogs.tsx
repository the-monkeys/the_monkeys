import { useEffect, useState } from 'react';

import Link from 'next/link';

import { FeedBlogCard } from '@/components/blog/cards/FeedBlogCard';
import Icon from '@/components/icon';
import { BlogCardSkeleton } from '@/components/skeletons/blogSkeleton';
import { Button } from '@/components/ui/button';
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
              <BlogCardSkeleton key={index} />
            ))}
        </div>
      ) : !blogs?.the_blogs || blogs?.the_blogs?.length === 0 ? (
        <div className='flex flex-col items-center gap-6'>
          <p className='font-roboto text-sm opacity-80 text-center'>
            No blogs available for this topic.
          </p>

          <Button size='sm' className='rounded-full ' asChild>
            <Link href='/create'>
              <Icon name='RiPencil' className='mr-1' />
              Write Your Own
            </Link>
          </Button>
        </div>
      ) : (
        blogs?.the_blogs.map((blog) => {
          return (
            <FeedBlogCard key={blog.blog_id} blog={blog} status={status} />
          );
        })
      )}
    </div>
  );
};
