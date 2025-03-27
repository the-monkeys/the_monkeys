import Link from 'next/link';

import { BlogRecommendationCard } from '@/components/blog/cards/BlogRecommendationCard';
import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import { Button } from '@/components/ui/button';
import { CREATE_ROUTE } from '@/constants/routeConstants';
import useGetLatest100Blogs from '@/hooks/blog/useGetLatest100Blogs';

export const BlogRecommendations = ({ blogId }: { blogId: string }) => {
  const { blogs, isLoading, isError } = useGetLatest100Blogs();

  if (isLoading)
    return (
      <div className='py-4 flex justify-center'>
        <Loader />
      </div>
    );

  if (isError) return null;

  return (
    <div className='pb-6 space-y-3'>
      <h4 className='py-1 pl-2 font-dm_sans font-medium border-l-4 border-brand-orange'>
        Recommended for You
      </h4>

      <div className='divide-y-1 divide-foreground-light dark:divide-foreground-dark'>
        {blogs?.blogs.length ? (
          blogs?.blogs
            .filter((blog) => blog?.blog_id !== blogId)
            .slice(0, 6)
            .map((blog) => {
              return blog?.blog?.blocks.length < 5 ? null : (
                <BlogRecommendationCard key={blog?.blog_id} blog={blog} />
              );
            })
        ) : (
          <div className='py-2 flex flex-col items-center gap-4'>
            <p className='text-sm opacity-80 text-center'>
              No blogs available.
            </p>

            <Button size='sm' className='rounded-full ' asChild>
              <Link href={`${CREATE_ROUTE}`}>
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
