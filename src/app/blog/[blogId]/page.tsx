'use client';

import Editor from '@/components/editor/preview';
import Container from '@/components/layout/Container';
import { Loader } from '@/components/loader';
import useGetPublishedBlogDetailByBlogId from '@/hooks/useGetPublishedBlogDetailByBlogId';

export default function BlogPage({
  params,
}: {
  params: {
    blogId: string;
  };
}) {
  const { blog, isError, isLoading } = useGetPublishedBlogDetailByBlogId(
    params.blogId
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Container className='min-h-screen px-5 py-4 pb-12'>
      <Editor data={blog?.blog} />
    </Container>
  );
}
