import { useState } from 'react';

import Link from 'next/link';

import { DeleteBlogDialog } from '@/components/blog/actions/DeleteBlogDialog';
import {
  BlogImage,
  BlogPlaceholderImage,
} from '@/components/blog/getBlogContent';
import { ScheduledBlog } from '@/hooks/blog/schedule/useGetScheduledBlogs';
import { ALL_SCHEDULED_BLOGS_QUERY_KEY } from '@/hooks/blog/schedule/useGetScheduledBlogs';
import axiosInstanceV2 from '@/services/api/axiosInstanceV2';
import { isNonValidBannerImage } from '@/utils/imageUtils';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@the-monkeys/ui/atoms/button';
import { toast } from '@the-monkeys/ui/hooks/use-toast';
import { format } from 'date-fns';

const ScheduledBlogCard = ({ blog }: { blog: ScheduledBlog }) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const scheduledTime = blog.schedule_time
    ? new Date(blog.schedule_time)
    : null;

  const onCancel = async () => {
    if (
      !confirm(
        'Are you sure you want to stop scheduling and move this blog to drafts?'
      )
    )
      return;

    setLoading(true);
    try {
      await axiosInstanceV2.post(`blog/to-draft/${blog.blog_id}`);
      toast({
        variant: 'success',
        title: 'Moved to Drafts',
        description: 'Blog is now in your drafts.',
      });
      queryClient.invalidateQueries({
        queryKey: [ALL_SCHEDULED_BLOGS_QUERY_KEY],
      });
      queryClient.invalidateQueries({ queryKey: ['all-draft-blogs'] });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to move to drafts.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='pb-4 border-b-1 border-border-light/60 dark:border-border-dark/60'>
      <article className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
        <div className='shrink-0 aspect-[3/2] h-[200px] sm:h-fit w-full sm:w-[200px] bg-foreground-light/60 dark:bg-foreground-dark/60 rounded-sm shadow-sm overflow-hidden relative'>
          <Link href={''} className='group'>
            {isNonValidBannerImage(blog.first_image) ? (
              <BlogPlaceholderImage
                title={blog.title}
                className='group-hover:scale-105 transition-transform duration-200'
              />
            ) : (
              <BlogImage
                title={blog.title}
                image={blog.first_image}
                className='group-hover:scale-105 transition-transform duration-200'
              />
            )}
          </Link>
        </div>

        <div className='w-full flex flex-col justify-between gap-[10px]'>
          <div>
            <div className='flex items-center gap-2 text-sm text-muted-foreground mb-2 flex-wrap'>
              <span className='bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full text-xs font-medium'>
                Scheduled
              </span>
              {scheduledTime && (
                <>
                  <span>{format(scheduledTime, 'PPp')}</span>
                  {blog.timezone && (
                    <span className='text-xs opacity-70'>
                      ({blog.timezone})
                    </span>
                  )}
                </>
              )}
            </div>

            <h3 className='font-semibold text-lg line-clamp-2 mb-2'>
              {blog.title || 'Untitled Blog'}
            </h3>

            {blog.first_paragraph && (
              <p className='text-sm line-clamp-2 opacity-90'>
                {blog.first_paragraph}
              </p>
            )}
          </div>

          <div className='flex gap-2 w-full sm:w-auto mt-2 sm:mt-0'>
            <Button
              variant='secondary'
              size='sm'
              onClick={onCancel}
              disabled={loading}
              className='flex-1 sm:flex-none'
            >
              To Drafts
            </Button>

            <DeleteBlogDialog blogId={`${blog.blog_id}`} />
          </div>
        </div>
      </article>
    </div>
  );
};

export default ScheduledBlogCard;
