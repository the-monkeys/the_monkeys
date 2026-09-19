'use client';

import { FeedBlogCard } from '@/components/cards/blog/FeedBlogCard';
import { Loader } from '@/components/loader';
import { useGroupBlogs } from '@/hooks/groups/useGroupQueries';
import { GroupItem } from '@/services/groups/groupsTypes';
import { fromBlog } from '@/utils/blogCardAdapters';
import { Button } from '@the-monkeys/ui/atoms/button';

export function GroupBlogsPanel({ group }: { group: GroupItem }) {
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGroupBlogs(group.slug);
  const posts = data?.pages.flatMap((page) => page.blogs ?? []) ?? [];

  if (isLoading) {
    return (
      <div className='flex justify-center py-12' aria-label='Loading posts'>
        <Loader size={28} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='rounded-xl border border-dashed border-border-light px-4 py-10 text-center dark:border-border-dark'>
        <p className='font-inter text-sm text-gray-500'>
          Posts are unavailable right now. Please try again shortly.
        </p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className='rounded-xl border border-dashed border-border-light px-4 py-10 text-center dark:border-border-dark'>
        <p className='font-inter text-sm text-gray-500'>
          No posts have been published to this group yet.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-2'>
      <div
        data-testid='group-blog-grid'
        className='grid grid-cols-1 gap-x-5 gap-y-1 md:grid-cols-2'
      >
        {posts.map((post) => (
          <FeedBlogCard key={post.blog_id} blog={fromBlog(post)} />
        ))}
      </div>

      {hasNextPage && (
        <div className='flex justify-center pt-2'>
          <Button
            type='button'
            variant='outline'
            className='min-h-11 w-full sm:w-auto sm:min-w-40'
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? 'Loading posts...' : 'Load more posts'}
          </Button>
        </div>
      )}
    </div>
  );
}
