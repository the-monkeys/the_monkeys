import Link from 'next/link';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import BlogActionBar from '@/components/editorial/BlogActionBar';
import { BLOG_ROUTE, TOPIC_ROUTE } from '@/constants/routeConstants';
import { MetaBlog } from '@/services/blog/blogTypes';
import { purifyHTMLString } from '@/utils/purifyHTML';

/**
 * Bordered, image-less card showing just category label + title.
 * Designed for tight 2-column grids that emphasize headline scanning.
 *
 * `label` overrides the auto-derived category (first tag, uppercased).
 */
export const MinimalBlogCard = ({
  blog,
  label,
}: {
  blog: MetaBlog;
  label?: string;
}) => {
  const title = purifyHTMLString(blog?.title);
  const slug = generateSlug(title);
  const url = `${BLOG_ROUTE}/${slug}-${blog?.blog_id}`;
  const tag = blog?.tags?.[0];
  const display = (label ?? tag ?? 'Research').toUpperCase();

  return (
    <article className='h-full group p-4 sm:p-5 rounded-md  transition-colors bg-background-light dark:bg-background-dark'>
      {tag ? (
        <Link
          href={`${TOPIC_ROUTE}/${tag}`}
          className='inline-block font-inter font-bold text-[11px] text-brand-orange uppercase tracking-[0.15em] hover:opacity-80 transition-opacity'
        >
          {display}
        </Link>
      ) : (
        <span className='inline-block font-inter font-bold text-[11px] text-brand-orange uppercase tracking-[0.15em]'>
          {display}
        </span>
      )}

      <Link href={url} className='block mt-2 group/title'>
        <h3
          className='font-newsreader font-bold text-lg sm:text-xl leading-[1.2] text-text-light dark:text-text-dark group-hover/title:text-brand-orange transition-colors line-clamp-3'
          dangerouslySetInnerHTML={{ __html: title || 'Untitled' }}
        />
      </Link>

      <div className='mt-3'>
        <BlogActionBar
          blogId={blog?.blog_id}
          blogURL={url}
          size={16}
          initialLikeCount={blog?.like_count}
        />
      </div>
    </article>
  );
};

export default MinimalBlogCard;
