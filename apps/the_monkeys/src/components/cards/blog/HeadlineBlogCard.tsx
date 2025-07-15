import Link from 'next/link';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import { BLOG_ROUTE } from '@/constants/routeConstants';
import { MetaBlog } from '@/services/blog/blogTypes';

export const HeadlineBlogCard = ({ blog }: { blog: MetaBlog }) => {
  const blogId = blog?.blog_id;

  const titleContent = blog?.title;

  const blogSlug = generateSlug(titleContent);

  return (
    <div className='group relative pb-4 pt-2 flex gap-3 items-start border-l-1 border-border-light dark:border-border-dark pointer-events-none'>
      <div className='absolute top-[10px] -left-[4px] mt-2 size-2 bg-background-dark dark:bg-background-light rounded-full shrink-0 group-hover:bg-brand-orange group-hover:dark:bg-brand-orange' />

      <div className='p-1 pl-4 space-y-2 pointer-events-auto'>
        <Link
          href={`${BLOG_ROUTE}/${blogSlug}-${blogId}`}
          className='font-medium text-lg hover:underline underline-offset-2 line-clamp-4'
        >
          {titleContent}
        </Link>
      </div>
    </div>
  );
};
