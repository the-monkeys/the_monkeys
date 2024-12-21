import Link from 'next/link';

import { BlogRecommendationCard } from '@/components/blog/cards/BlogRecommendationCard';
import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import useGetLatest100Blogs from '@/hooks/blog/useGetLatest100Blogs';

export const BlogRecommendations = () => {
  const { blogs, isLoading, isError } = useGetLatest100Blogs();

  if (isLoading)
    return (
      <div className='pb-6 bg-foreground-light/25 dark:bg-foreground-dark/25 rounded-xl'>
        <h4 className='px-4 py-3 font-dm_sans text-sm md:text-base'>
          You might also like
        </h4>

        <Separator className='mb-3' />

        <Loader className='mx-auto' />
      </div>
    );

  if (isError) return null;

  return (
    <div className='pb-6 bg-foreground-light/25 dark:bg-foreground-dark/25 rounded-xl'>
      <h4 className='px-4 pt-3 pb-2 font-dm_sans text-sm md:text-base'>
        You might also like
      </h4>

      <Separator className='mb-3' />

      <div className='flex flex-col gap-6 lg:gap-8'>
        {blogs?.the_blogs.length ? (
          blogs?.the_blogs.slice(0, 5).map((blog) => {
            return blog?.blog?.blocks.length < 5 ? null : (
              <BlogRecommendationCard key={blog?.blog_id} blog={blog} />
            );
          })
        ) : (
          <div className='py-2 flex flex-col items-center gap-4'>
            <p className='font-roboto text-sm opacity-80 text-center'>
              No blogs available.
            </p>

            <Button size='sm' className='rounded-full ' asChild>
              <Link href='/create'>
                <Icon name='RiPencil' className='mr-1' />
                Write Your Own
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
