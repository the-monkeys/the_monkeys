import Link from 'next/link';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import {
  BlogImage,
  BlogPlaceholderImage,
} from '@/components/blog/getBlogContent';
import BlogActionBar from '@/components/editorial/BlogActionBar';
import { BLOG_ROUTE, TOPIC_ROUTE } from '@/constants/routeConstants';
import { getRelativeTime } from '@/lib/utils';
import { MetaBlog } from '@/services/blog/blogTypes';
import { isNonValidBannerImage } from '@/utils/imageUtils';
import { purifyHTMLString } from '@/utils/purifyHTML';

/**
 * Compact research-feed row: category label on top, serif title, relative time,
 * with a small thumbnail on the right. Designed to stack vertically in lists.
 */
export const FeedListItem = ({ blog }: { blog: MetaBlog }) => {
  const title = purifyHTMLString(blog?.title);
  const slug = generateSlug(title);
  const url = `${BLOG_ROUTE}/${slug}-${blog?.blog_id}`;
  const tag = blog?.tags?.[0];
  const time = blog?.published_time ? getRelativeTime(blog.published_time) : '';
  const image = blog?.first_image;

  return (
    <article className='group flex items-start gap-4 sm:gap-6 py-5 border-b border-border-light dark:border-border-dark/40 last:border-b-0'>
      <div className='flex-1 min-w-0'>
        {tag ? (
          <Link
            href={`${TOPIC_ROUTE}/${tag}`}
            className='inline-block font-inter font-bold text-[11px] text-brand-orange uppercase tracking-[0.15em] hover:opacity-80 transition-opacity'
          >
            {tag}
          </Link>
        ) : null}

        <Link href={url} className='block mt-1.5 group/title'>
          <h3
            className='font-newsreader font-bold md:text-2xl text-lg leading-[1.25] text-text-light dark:text-text-dark group-hover/title:text-brand-orange transition-colors line-clamp-2'
            dangerouslySetInnerHTML={{ __html: title || 'Untitled' }}
          />
        </Link>

        {time ? (
          <p className='mt-2 font-inter text-[12px] text-gray-500 dark:text-gray-400'>
            {getRelativeTime(time)}
          </p>
        ) : null}

        <div className='mt-2'>
          <BlogActionBar
            blogId={blog?.blog_id}
            blogURL={url}
            size={16}
            initialLikeCount={blog?.like_count}
          />
        </div>
      </div>

      <Link
        href={url}
        className='shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800'
        aria-label={title}
      >
        {isNonValidBannerImage(image) ? (
          <BlogPlaceholderImage
            title={title}
            className='group-hover:scale-105 transition-transform duration-500 ease-out'
          />
        ) : (
          <BlogImage
            title={title}
            image={image}
            className='group-hover:scale-105 transition-transform duration-500 ease-out'
          />
        )}
      </Link>
    </article>
  );
};

export default FeedListItem;
