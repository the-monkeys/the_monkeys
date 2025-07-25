import Link from 'next/link';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import { BlogImage, BlogTitle } from '@/components/blog/getBlogContent';
import { UserInfoCardShowcase } from '@/components/user/userInfo';
import { BLOG_ROUTE, TOPIC_ROUTE } from '@/constants/routeConstants';
import { MetaBlog } from '@/services/blog/blogTypes';

export const HeadlineBlogCard = ({ blog }: { blog: MetaBlog }) => {
  const authorId = blog?.owner_account_id;
  const blogId = blog?.blog_id;
  const date = blog?.published_time;

  const titleContent = blog?.title;
  const imageContent = blog?.first_image;

  const blogSlug = generateSlug(titleContent);

  return (
    <div className='px-4 py-3 space-y-2 bg-foreground-light/40 dark:bg-foreground-dark/40'>
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

      <div className='flex flex-col gap-[10px]'>
        <Link href={`${BLOG_ROUTE}/${blogSlug}-${blogId}`}>
          <BlogTitle
            title={titleContent}
            className='font-medium text-lg leading-[1.3] hover:underline underline-offset-2 line-clamp-2'
          />
        </Link>

        <UserInfoCardShowcase authorID={authorId} date={date} />
      </div>
    </div>
  );
};
