import { useState } from 'react';

import {
  PaginationNextButton,
  PaginationPrevButton,
} from '@/components/buttons/paginationButton';
import { ProfileBlogCard } from '@/components/cards/blog/ProfileBlogCard';
import { FeedBlogCardListSkeleton } from '@/components/skeletons/blogSkeleton';
import { PROFILE_POSTS_PER_PAGE } from '@/constants/posts';
import useGetPublishedBlogByUsername from '@/hooks/blog/useGetPublishedBlogByUsername';
import { IUser } from '@/services/models/user';

export const Blogs = ({
  username,
  user,
}: {
  username: string;
  user?: IUser;
}) => {
  const [page, setPage] = useState<number>(0);
  const offset = page * PROFILE_POSTS_PER_PAGE;

  const { blogs, isLoading, isError } = useGetPublishedBlogByUsername({
    username,
    limit: PROFILE_POSTS_PER_PAGE,
    offset,
  });

  const hasNextPage =
    blogs &&
    blogs?.total_blogs &&
    blogs?.total_blogs > (page + 1) * PROFILE_POSTS_PER_PAGE;

  const hasPrevPage = page > 0;
  const showPagination =
    blogs?.total_blogs && blogs?.total_blogs > PROFILE_POSTS_PER_PAGE;

  if (isError)
    return (
      <div className='min-h-[800px]'>
        <p className='w-full text-sm opacity-80 text-center'>
          No blogs published yet.
        </p>
      </div>
    );

  return (
    <div className='flex flex-col gap-4'>
      {isLoading ? (
        <FeedBlogCardListSkeleton count={PROFILE_POSTS_PER_PAGE} />
      ) : !blogs?.blogs || blogs?.blogs?.length === 0 ? (
        <p className='w-full opacity-90 text-center'>No posts yet.</p>
      ) : (
        <>
          {blogs?.blogs &&
            blogs?.blogs.map((blog) => {
              return (
                <ProfileBlogCard
                  blog={blog}
                  isAuthenticated={!!user}
                  modificationEnable={user?.username === username}
                  key={blog?.blog_id}
                />
              );
            })}

          {showPagination && (
            <div className='flex justify-start gap-[10px] mt-4'>
              {hasPrevPage && (
                <PaginationPrevButton
                  onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                  disable={!hasPrevPage}
                />
              )}

              {hasNextPage && (
                <PaginationNextButton
                  onClick={() => setPage((prev) => prev + 1)}
                  disable={!hasNextPage}
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
