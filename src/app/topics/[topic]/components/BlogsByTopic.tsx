'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { FeedBlogCard } from '@/components/blog/cards/FeedBlogCard';
import Icon from '@/components/icon';
import { FeedBlogCardListSkeleton } from '@/components/skeletons/blogSkeleton';
import { Button } from '@/components/ui/button';
import { getBlogsByTopicSchema } from '@/lib/schema/blog';
import axiosInstanceNoAuthV2 from '@/services/api/axiosInstanceNoAuthV2';
import { GetBlogsByTopics } from '@/services/blog/blogTypes';
import { useSession } from 'next-auth/react';

export const BlogsByTopic = ({ topic }: { topic: string }) => {
  const { status } = useSession();
  const [blogs, setBlogs] = useState<GetBlogsByTopics>({ blogs: [] });
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [blogsError, setBlogsError] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      const payload = { tags: [topic] };

      try {
        setBlogsLoading(true);
        setBlogsError(false);

        getBlogsByTopicSchema.parse(payload);

        const response = await axiosInstanceNoAuthV2.post(
          '/blog/tags',
          payload
        );

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
    return <FeedBlogCardListSkeleton />;
  }

  if (blogsError)
    return (
      <p className='w-full text-sm opacity-80 text-center'>
        Oops! Something went wrong. Please try again.
      </p>
    );

  return (
    <div className='flex flex-col gap-6 sm:gap-8'>
      {blogs.blogs ? (
        blogs.blogs.map((blog) => (
          <FeedBlogCard key={blog.blog_id} blog={blog} status={status} />
        ))
      ) : (
        <div className='flex flex-col items-center gap-4'>
          <p className='text-sm opacity-80 text-center'>
            No blogs available for selected topic.
          </p>
          <Button size='sm' className='rounded-full' asChild>
            <Link href='/create'>
              <Icon name='RiPencil' className='mr-1' />
              Write Your Own
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};
