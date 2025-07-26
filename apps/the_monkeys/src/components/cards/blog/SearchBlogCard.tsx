import Link from 'next/link';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import { BlogTitle } from '@/components/blog/getBlogContent';
import { BLOG_ROUTE } from '@/constants/routeConstants';
import { MetaBlog } from '@/services/blog/blogTypes';

export const SearchBlogCard = ({ blog }: { blog: MetaBlog }) => {
  const blogId = blog?.blog_id;

  const titleContent = blog?.title;

  const blogSlug = generateSlug(titleContent);

  return (
    <Link
      href={`${BLOG_ROUTE}/${blogSlug}-${blogId}`}
      className='p-2 hover:bg-foreground-light/40 hover:dark:bg-foreground-dark/40'
    >
      <BlogTitle title={titleContent} className='font-medium line-clamp-2' />
    </Link>
  );
};
