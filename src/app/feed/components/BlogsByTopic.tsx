import { useEffect, useState } from 'react';

import Link from 'next/link';

import { FeedBlogCard } from '@/components/blog/cards/FeedBlogCard';
import Icon from '@/components/icon';
import { BlogCardListSkeleton } from '@/components/skeletons/blogSkeleton';
import { Button } from '@/components/ui/button';
import { getBlogsByTopicSchema } from '@/lib/schema/blog';
import axiosInstanceNoAuth from '@/services/api/axiosInstanceNoAuth';
import { GetBlogsByTopics } from '@/services/blog/blogTypes';

export const BlogsByTopic = ({
  topic,
  status,
}: {
  topic: string;
  status: 'authenticated' | 'loading' | 'unauthenticated';
}) => {
  const [blogs, setBlogs] = useState<GetBlogsByTopics>({ the_blogs: [] });
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [blogsError, setBlogsError] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      const payload = {
        tags: [topic],
      };

      try {
        setBlogsLoading(true);
        setBlogsError(false);

        getBlogsByTopicSchema.parse(payload);

        const response = await axiosInstanceNoAuth.post('/blog/tags', payload);

        setBlogs(response.data);
      } catch (err: unknown) {
        setBlogsError(true);
      } finally {
        setBlogsLoading(false);
      }
    };

    fetchBlogs();
  }, [topic]);

  if (blogsError)
    return (
      <p className='w-full font-roboto text-sm opacity-80 text-center'>
        Oops! Something went wrong. Please try again.
      </p>
    );

  if (blogsLoading) {
    return <BlogCardListSkeleton />;
  }

  return (
    <div className='flex flex-col gap-6 sm:gap-8'>
      {blogs.the_blogs ? (
        blogs.the_blogs.map((blog) => (
          <FeedBlogCard key={blog.blog_id} blog={blog} status={status} />
        ))
      ) : (
        <div className='flex flex-col items-center gap-4'>
          <p className='font-roboto text-sm opacity-80 text-center'>
            No blogs available for this topic.
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