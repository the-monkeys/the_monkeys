import { Suspense } from 'react';

import {
  PaginationNextButton,
  PaginationPrevButton,
} from '@/components/buttons/paginationButton';
import { ProfileBlogCard } from '@/components/cards/blog/ProfileBlogCard';
import { FeedBlogCardListSkeleton } from '@/components/skeletons/blogSkeleton';
import { PROFILE_DRAFTS_PER_PAGE } from '@/constants/posts';
import useGetAllDraftBlogs from '@/hooks/blog/useGetAllDraftBlogs';
import { usePagination } from '@/hooks/user/usePagination';
import { IUser } from '@/services/models/user';

const DraftsInner = ({ user }: { user?: IUser }) => {
  const { page, next, prev } = usePagination();

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
      <div className='min-h-[800px]'>
        <p className='w-full opacity-90 text-center'>No drafts created yet.</p>
      </div>
    );

  return (
    <div className='flex flex-col gap-4'>
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
                  modificationEnable={true}
                  isDraft={true}
                  key={blog?.blog_id}
                />
              );
            })}

          {showPagination && (
            <div className='flex justify-center gap-[10px] mt-4'>
              {hasPrevPage && (
                <PaginationPrevButton onClick={prev} disable={!hasPrevPage} />
              )}

              {hasNextPage && (
                <PaginationNextButton onClick={next} disable={!hasNextPage} />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export const Drafts = ({ user }: { user?: IUser }) => {
  return (
    <Suspense fallback={<FeedBlogCardListSkeleton />}>
      <DraftsInner user={user} />
    </Suspense>
  );
};
