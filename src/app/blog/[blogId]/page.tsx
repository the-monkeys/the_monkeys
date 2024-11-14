'use client';

import Editor from '@/components/editor/preview';
import Icon from '@/components/icon';
import Container from '@/components/layout/Container';
import { PublishedBlogSkeleton } from '@/components/skeletons/blogSkeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import useGetPublishedBlogDetailByBlogId from '@/hooks/useGetPublishedBlogDetailByBlogId';

import { BlogOwnerCard } from './components/BlogOwnerCard';

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

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(`https://themonkeys.live/blog/${text}`)
        .then(
          () => {
            toast({
              variant: 'default',
              title: 'Blog Link Copied',
              description: 'The blog link has been copied to the clipboard.',
            });
          },
          () => {
            toast({
              variant: 'error',
              title: 'Copy Failed',
              description: 'Unable to copy the blog link.',
            });
          }
        );
    }
  };

  return (
    <Container className='min-h-screen px-5 pb-12'>
      <div className='py-4 mx-auto w-full sm:w-4/5 space-y-4'>
        <BlogOwnerCard
          owner_id={blog?.owner_account_id}
          time={blog?.blog.time}
        />

        <div className='flex items-center gap-1 flex-wrap'>
          <p className='pr-1 font-jost text-sm opacity-75'>Published in:</p>

          {blog?.tags && blog?.tags.length ? (
            blog?.tags?.map((tag) => (
              <Badge
                variant='outline'
                key={tag}
                className='font-josefin_Sans text-xs'
              >
                {tag}
              </Badge>
            ))
          ) : (
            <p className='font-jost opacity-75'>- -</p>
          )}
        </div>

        <div className='flex justify-end items-center gap-3'>
          <button className='group flex items-center gap-1'>
            <Icon
              name='RiHeart3'
              className='opacity-75 group-hover:opacity-100'
            />
            <span className='font-jost text-sm opacity-75'>27</span>
          </button>

          <button className='group flex items-center gap-1'>
            <Icon
              name='RiChat1'
              className='opacity-75 group-hover:opacity-100'
            />
            <span className='font-jost text-sm opacity-75'>5</span>
          </button>

          <button
            className='group'
            onClick={() => copyToClipboard(blog?.blog_id || '')}
          >
            <Icon
              name='RiShareForward'
              className='opacity-75 group-hover:opacity-100'
            />
          </button>

          <button className='group'>
            <Icon
              name='RiMore'
              className='opacity-75 group-hover:opacity-100'
            />
          </button>
        </div>
      </div>

      <Separator />

      <Editor data={blog?.blog} />
    </Container>
  );
};

export default BlogPage;
