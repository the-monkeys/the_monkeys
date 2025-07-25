import Link from 'next/link';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import {
  BlogDescription,
  BlogImage,
  BlogPlaceholderImage,
  BlogTitle,
} from '@/components/blog/getBlogContent';
import Icon from '@/components/icon';
import { UserInfoCardShowcase } from '@/components/user/userInfo';
import { BLOG_ROUTE, TOPIC_ROUTE } from '@/constants/routeConstants';
import { MetaBlog } from '@/services/blog/blogTypes';
import { Badge } from '@the-monkeys/ui/atoms/badge';

export const FeedBlogCard = ({ blog }: { blog: MetaBlog }) => {
  const authorId = blog?.owner_account_id;
  const blogId = blog?.blog_id;
  const date = blog?.published_time;

  const titleContent = blog?.title;
  const descriptionContent = blog?.first_paragraph;
  const imageContent = blog?.first_image;

  const blogSlug = generateSlug(titleContent);

  return (
    <div className='space-y-2'>
      {blog?.tags.length && (
        <div className='flex items-center gap-1 overflow-hidden'>
          <p className='text-sm opacity-80'>in</p>

          <Link
            href={`${TOPIC_ROUTE}/${blog?.tags[0]}`}
            className='shrink-0 font-medium text-sm text-brand-orange capitalize hover:underline'
          >
            {blog?.tags[0]}
          </Link>
        </div>
      )}

      <div className='group flex flex-col sm:flex-row gap-3 sm:gap-4'>
        <div className='shrink-0 h-[200px] sm:h-[140px] w-full sm:w-[200px] bg-foreground-light dark:bg-foreground-dark rounded-md overflow-hidden'>
          {!imageContent ? (
            <BlogPlaceholderImage title={titleContent} />
          ) : (
            <BlogImage title={titleContent} image={imageContent} />
          )}
        </div>

        <div className='w-full space-y-[10px]'>
          <UserInfoCardShowcase authorID={authorId} date={date} />

          <div className='space-y-2'>
            <Link
              href={`${BLOG_ROUTE}/${blogSlug}-${blogId}`}
              className='w-full'
            >
              <BlogTitle
                title={titleContent}
                className='font-medium text-xl leading-[1.3] hover:underline underline-offset-2 line-clamp-2'
              />
            </Link>

            <BlogDescription
              description={descriptionContent}
              className='text-sm line-clamp-2 opacity-90'
            />
          </div>
        </div>
      </div>
    </div>
  );
};
