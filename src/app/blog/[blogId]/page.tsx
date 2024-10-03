'use client';

import Editor from '@/components/editor/preview';
import Container from '@/components/layout/Container';
import { PublishedBlogSkeleton } from '@/components/skeletons/blogSkeleton';
import { Badge } from '@/components/ui/badge';
import useGetPublishedBlogDetailByBlogId from '@/hooks/useGetPublishedBlogDetailByBlogId';
import moment from 'moment';

import { BlogOwnerCard } from './components/WriterCard';

const BlogPage = ({
  params,
}: {
  params: {
    blogId: string;
  };
}) => {
  const { blog, isError, isLoading } = useGetPublishedBlogDetailByBlogId(
    params.blogId
  );

  if (isLoading) {
    return <PublishedBlogSkeleton />;
  }

  return (
    <Container className='min-h-screen px-5 pb-12'>
      <div className='px-1 py-4 mx-auto w-full sm:w-4/5 border-b-1 border-secondary-lightGrey/25 space-y-4 sm:space-y-6'>
        <div className='flex flex-wrap justify-between sm:items-start gap-2'>
          <div className='font-josefin_Sans'>
            <p className='pb-1 block font-light text-xs sm:text-sm'>
              Authored by
            </p>

            <BlogOwnerCard owner_id={blog?.owner_account_id} />
          </div>

          <p className='font-josefin_Sans text-base sm:text-lg text-right space-y-1'>
            <span className='block font-light text-xs sm:text-sm'>
              Last updated
            </span>
            {moment(blog?.blog.time).format('MMM DD')}
          </p>
        </div>

        <div className='flex items-center gap-1 flex-wrap'>
          <p className='pr-2 font-josefin_Sans'>Topics: </p>

          {blog?.tags?.map((tag) => (
            <Badge variant='secondary' key={tag} className='font-josefin_Sans'>
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <Editor data={blog?.blog} />
    </Container>
  );
};

export default BlogPage;
