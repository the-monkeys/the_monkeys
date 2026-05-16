import Link from 'next/link';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import {
  BlogDescription,
  BlogImage,
  BlogPlaceholderImage,
  BlogTitle,
} from '@/components/blog/getBlogContent';
import BlogActionBar from '@/components/editorial/BlogActionBar';
import { BLOG_ROUTE, TOPIC_ROUTE } from '@/constants/routeConstants';
import { MetaBlog } from '@/services/blog/blogTypes';
import { isNonValidBannerImage } from '@/utils/imageUtils';
import { purifyHTMLString } from '@/utils/purifyHTML';

/**
 * Editorial-style hero: full-bleed image as background with category badge
 * top-left and title + excerpt overlaid on a dark gradient at the bottom.
 * Mirrors the "background image, foreground text" pattern from the mock.
 */
export const EditorialHero = ({
  blog,
  badge,
}: {
  blog: MetaBlog;
  badge?: string;
}) => {
  const title = purifyHTMLString(blog?.title);
  const blogSlug = generateSlug(title);
  const blogURL = `${BLOG_ROUTE}/${blogSlug}-${blog?.blog_id}`;
  const category = (badge ?? blog?.tags?.[0] ?? 'Editorial').toUpperCase();
  const image = blog?.first_image;
  const description = purifyHTMLString(blog?.first_paragraph);

  return (
    <article className='w-full overflow-hidden rounded-lg'>
      <div className='group  relative w-full aspect-[16/10] sm:aspect-[16/9] bg-gray-900 overflow-hidden'>
        <Link
          href={blogURL}
          aria-label={title}
          className='absolute inset-0 z-0'
        >
          {isNonValidBannerImage(image) ? (
            <BlogPlaceholderImage
              title={title}
              className='opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-700 ease-out'
            />
          ) : (
            <BlogImage
              title={title}
              image={image}
              className='opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-700 ease-out'
            />
          )}
        </Link>

        {/* Bottom-up gradient for legible foreground text. */}
        <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/10 z-10' />

        {/* Category badge — top-left, sits above the gradient. */}
        {blog?.tags?.[0] ? (
          <Link
            href={`${TOPIC_ROUTE}/${blog.tags[0]}`}
            className='absolute top-4 left-4 z-20 inline-flex items-center px-3 py-1 bg-brand-orange text-white font-inter font-extrabold text-[11px] uppercase tracking-[0.22em] rounded-sm hover:bg-brand-orange/90 transition-colors'
          >
            {category}
          </Link>
        ) : (
          <span className='absolute top-4 left-4 z-20 inline-flex items-center px-3 py-1 bg-brand-orange text-white font-inter font-extrabold text-[11px] uppercase tracking-[0.22em] rounded-sm'>
            {category}
          </span>
        )}

        {/* Foreground content overlaid on the image. */}
        <div className=' absolute inset-x-0 bottom-0 p-5 sm:p-7 md:p-9 z-20 pointer-events-none'>
          <span className='font-inter font-extrabold text-[11px] uppercase tracking-[0.22em] text-brand-orange'>
            Analysis
          </span>
          <Link href={blogURL} className='w-full'>
            <BlogTitle
              className='group-hover:text-brand-orange pt-2 font-semibold md:text-4xl text-2xl leading-[1.4] hover:underline underline-offset-2 line-clamp-2 text-white '
              title={title || 'Untitled Post'}
            />
          </Link>
          {description !== '' && (
            <BlogDescription
              description={description}
              className='pt-[6px] text-[0.9rem] line-clamp-2 sm:line-clamp-1 opacity-90 text-white'
            />
          )}

          <div className='mt-4 pointer-events-auto'>
            <BlogActionBar
              blogId={blog?.blog_id}
              blogURL={blogURL}
              tone='dark'
              size={18}
              initialLikeCount={blog?.like_count}
            />
          </div>
        </div>
      </div>
    </article>
  );
};

export default EditorialHero;
