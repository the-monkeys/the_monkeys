import { useState } from 'react';

import {
  PaginationNextButton,
  PaginationPrevButton,
} from '@/components/buttons/paginationButton';
import { ProfileBlogCard } from '@/components/cards/blog/ProfileBlogCard';
import { FeedBlogCardListSkeleton } from '@/components/skeletons/blogSkeleton';
import { PROFILE_DRAFTS_PER_PAGE } from '@/constants/posts';
import useGetAllDraftBlogs from '@/hooks/blog/useGetAllDraftBlogs';
import { IUser } from '@/services/models/user';

export const Drafts = ({
  username,
  user,
}: {
  username: string;
  user?: IUser;
}) => {
  const [page, setPage] = useState<number>(0);
  const offset = page * PROFILE_DRAFTS_PER_PAGE;

  const { blogs, isLoading, isError } = useGetAllDraftBlogs({
    limit: PROFILE_DRAFTS_PER_PAGE,
    offset,
  });

  const hasNextPage =
    blogs &&
    blogs?.total_blogs &&
    blogs?.total_blogs > (page + 1) * PROFILE_DRAFTS_PER_PAGE;

  const hasPrevPage = page > 0;
  const showPagination =
    blogs?.total_blogs && blogs?.total_blogs > PROFILE_DRAFTS_PER_PAGE;

  if (isError)
    return (
      <div className='min-h-screen'>
        <p className='w-full opacity-90 text-center'>No drafts created yet.</p>
      </div>
    );

  return (
    <div className='flex flex-col gap-6'>
      {isLoading ? (
        <FeedBlogCardListSkeleton count={PROFILE_DRAFTS_PER_PAGE} />
      ) : !blogs?.blogs || blogs?.blogs?.length === 0 ? (
        <p className='w-full text-sm opacity-80 text-center'>
          No drafts created yet.
        </p>
      ) : (
        <>
          {blogs?.blogs &&
            blogs?.blogs.map((blog) => {
              return (
                <ProfileBlogCard
                  blog={blog}
                  isAuthenticated={!!user}
                  modificationEnable={user?.username === username}
                  isDraft={true}
                  key={blog?.blog_id}
                />
              );
            })}

          {showPagination && (
            <div className='py-4 flex justify-center gap-4 mt-6'>
              <PaginationPrevButton
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                disable={!hasPrevPage}
              />

              <PaginationNextButton
                onClick={() => setPage((prev) => prev + 1)}
                disable={!hasNextPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
