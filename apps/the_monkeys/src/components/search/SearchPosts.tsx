import Link from 'next/link';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import { BLOG_ROUTE } from '@/constants/routeConstants';
import { useGetSearchBlog } from '@/hooks/blog/useGetSearchBlog';
import { MetaBlog } from '@/services/blog/blogTypes';

import { BlogTitle } from '../blog/getBlogContent';
import { SearchResultsPostSkeleton } from '../skeletons/searchSkeleton';

const SearchBlogTitle = ({
  blog,
  onClose,
}: {
  blog: MetaBlog;
  onClose?: () => void;
}) => {
  const blogId = blog?.blog_id;

  const titleContent = blog?.title;

  const blogSlug = generateSlug(titleContent);

  return (
    <Link
      target='_blank'
      href={`${BLOG_ROUTE}/${blogSlug}-${blogId}`}
      className='group p-1'
      onClick={onClose}
    >
      <BlogTitle
        title={titleContent}
        className='font-medium group-hover:underline leading-[1.4] line-clamp-2'
      />
    </Link>
  );
};

export const SearchPosts = ({
  query,
  onClose,
}: {
  query: string;
  onClose?: () => void;
}) => {
  // TODO: Cache the search results using zustand store

  const { searchBlogs, searchBlogsLoading, searchBlogsError } =
    useGetSearchBlog({
      searchQuery: query.trim() ? query : undefined,
      limit: 5,
      offset: 0,
    });

  if (searchBlogsLoading) {
    return <SearchResultsPostSkeleton />;
  }

  if (searchBlogsError) {
    return (
      <p className='text-sm opacity-90 text-center'>
        Failed to load search results.
      </p>
    );
  }

  const blogs = searchBlogs?.blogs;

  return (
    <>
      {!blogs || blogs === null ? (
        <p className='py-2 text-sm opacity-90 text-center'>
          No posts found for your search
        </p>
      ) : (
        <div className='flex flex-col gap-2'>
          {blogs?.slice(0, 3).map((blog) => {
            return (
              <SearchBlogTitle
                blog={blog}
                onClose={onClose}
                key={blog?.blog_id}
              />
            );
          })}
        </div>
      )}
    </>
  );
};
