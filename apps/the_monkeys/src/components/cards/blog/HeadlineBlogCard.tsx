import Link from 'next/link';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import { getCardContent } from '@/components/blog/getBlogContent';
import { BLOG_ROUTE } from '@/constants/routeConstants';
import { Blog } from '@/services/blog/blogTypes';

export const HeadlineBlogCard = ({ blog }: { blog: Blog }) => {
  const blogId = blog?.blog_id;

  const { titleContent } = getCardContent({
    blog,
  });

  const blogSlug = generateSlug(titleContent);

  return (
    <div className='pb-4 pt-2 first:pt-0 flex gap-3 items-start'>
      <div className='mt-2 size-2 bg-brand-orange shrink-0' />
      <div className=''>
        <Link
          href={`${BLOG_ROUTE}/${blogSlug}-${blogId}`}
          className='font-medium text-lg hover:underline decoration-1 underline-offset-2'
        >
          {titleContent}
        </Link>
      </div>
    </div>
  );
};
