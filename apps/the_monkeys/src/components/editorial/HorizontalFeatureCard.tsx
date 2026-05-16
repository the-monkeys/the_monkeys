import Link from 'next/link';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import {
  BlogImage,
  BlogPlaceholderImage,
} from '@/components/blog/getBlogContent';
import BlogActionBar from '@/components/editorial/BlogActionBar';
import { UserInfoCardShowcase } from '@/components/user/userInfo';
import { BLOG_ROUTE, TOPIC_ROUTE } from '@/constants/routeConstants';
import { MetaBlog } from '@/services/blog/blogTypes';
import { isNonValidBannerImage } from '@/utils/imageUtils';
import { purifyHTMLString } from '@/utils/purifyHTML';

/**
 * Side-by-side feature: image on the left, category + title + excerpt on
 * the right, byline pinned to the bottom. Used as a secondary editorial
 * unit beneath the hero, distinct from the dark `FeatureCard` overlay.
 */
export const HorizontalFeatureCard = ({ blog }: { blog: MetaBlog }) => {
  const title = purifyHTMLString(blog?.title);
  const slug = generateSlug(title);
  const url = `${BLOG_ROUTE}/${slug}-${blog?.blog_id}`;
  const image = blog?.first_image;
  const category = (blog?.tags?.[0] ?? 'Feature').toUpperCase();

  return (
    <article className='w-full overflow-hidden rounded-lg  bg-background-light dark:bg-background-dark'>
      <div className='grid grid-cols-1 sm:grid-cols-2'>
        <Link
          href={url}
          className='group relative block aspect-[4/3] sm:aspect-auto sm:min-h-[280px] bg-gray-100 dark:bg-gray-800 overflow-hidden'
        >
          {isNonValidBannerImage(image) ? (
            <BlogPlaceholderImage
              title={title}
              className='group-hover:scale-[1.03] transition-transform duration-700 ease-out'
            />
          ) : (
            <BlogImage
              title={title}
              image={image}
              className='group-hover:scale-[1.03] transition-transform duration-700 ease-out'
            />
          )}
        </Link>

        <div className='flex flex-col p-5 sm:p-6'>
          {blog?.tags?.[0] ? (
            <Link
              href={`${TOPIC_ROUTE}/${blog.tags[0]}`}
              className='inline-block self-start font-inter font-extrabold text-[11px] uppercase tracking-[0.22em] text-brand-orange hover:underline'
            >
              {category}
            </Link>
          ) : (
            <span className='inline-block self-start font-inter font-extrabold text-[11px] uppercase tracking-[0.22em] text-brand-orange'>
              {category}
            </span>
          )}

          <Link href={url} className='block group/title mt-2'>
            <h3
              className='font-newsreader font-bold text-xl sm:text-2xl leading-snug text-text-light dark:text-text-dark line-clamp-3 group-hover/title:text-brand-orange transition-colors'
              dangerouslySetInnerHTML={{ __html: title || 'Untitled' }}
            />
          </Link>

          {blog?.first_paragraph ? (
            <p
              className='mt-3 text-sm font-inter text-text-light/75 dark:text-text-dark/70 leading-relaxed line-clamp-3'
              dangerouslySetInnerHTML={{ __html: blog.first_paragraph }}
            />
          ) : null}

          <div className='mt-auto pt-5 flex items-center justify-between gap-3'>
            <UserInfoCardShowcase
              authorID={blog?.owner_account_id}
              date={blog?.published_time}
            />
            <BlogActionBar
              blogId={blog?.blog_id}
              blogURL={url}
              size={16}
              initialLikeCount={blog?.like_count}
            />
          </div>
        </div>
      </div>
    </article>
  );
};

export default HorizontalFeatureCard;
