import Link from 'next/link';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import {
  BlogImage,
  BlogPlaceholderImage,
  BlogTitle,
} from '@/components/blog/getBlogContent';
import { UserInfoCardShowcase } from '@/components/user/userInfo';
import { BLOG_ROUTE, TOPIC_ROUTE } from '@/constants/routeConstants';
import { MetaBlog } from '@/services/blog/blogTypes';

export const FeedBlogCard = ({ blog }: { blog: MetaBlog }) => {
  const authorId = blog?.owner_account_id;
  const blogId = blog?.blog_id;
  const date = blog?.published_time;

  const titleContent = blog?.title;
  const imageContent = blog?.first_image;

  const blogSlug = generateSlug(titleContent);

  return (
    <div className='space-y-2'>
      <div className='group flex flex-col sm:flex-row gap-[10px] sm:gap-4'>
        <div className='shrink-0 h-[230px] sm:h-[120px] w-full sm:w-[200px] bg-foreground-light dark:bg-foreground-dark rounded-md shadow-sm overflow-hidden'>
          {!imageContent ? (
            <BlogPlaceholderImage title={titleContent} />
          ) : (
            <BlogImage title={titleContent} image={imageContent} />
          )}
        </div>

        <div className='w-full space-y-[10px]'>
          {blog?.tags.length && (
            <div className='w-fit flex items-center gap-1'>
              <Link
                href={`${TOPIC_ROUTE}/${blog?.tags[0]}`}
                className='shrink-0 font-medium text-sm text-brand-orange capitalize hover:underline'
              >
                {blog?.tags[0]}
              </Link>
            </div>
          )}

          <div className='space-y-2'>
            <Link
              href={`${BLOG_ROUTE}/${blogSlug}-${blogId}`}
              className='w-full'
            >
              <BlogTitle
                title={titleContent}
                className='font-semibold text-lg leading-normal hover:underline underline-offset-2 line-clamp-2'
              />
            </Link>

            <UserInfoCardShowcase authorID={authorId} date={date} />
          </div>
        </div>
      </div>
    </div>
  );
};
