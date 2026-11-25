import Link from 'next/link';

import {
  BlogImage,
  BlogPlaceholderImage,
} from '@/components/blog/getBlogContent';
import { ContentGate } from '@/components/moderation/ContentGate';
import { BLOG_ROUTE } from '@/constants/routeConstants';
import { MetaBlog } from '@/services/blog/blogTypes';
import { fromMetaBlog } from '@/utils/blogCardAdapters';
import { isNonValidBannerImage } from '@/utils/imageUtils';
import { purifyHTMLString } from '@/utils/purifyHTML';

/**
 * Full-width dark feature card with a background image and overlay headline.
 * Used as a visual break between feed sections (e.g. "Weekly Analysis").
 */
export const FeatureCard = ({ blog }: { blog: MetaBlog }) => {
  const title = purifyHTMLString(blog?.title);
  const slug = fromMetaBlog(blog).slug;
  const url = `${BLOG_ROUTE}/${slug}-${blog?.blog_id}`;
  const image = blog?.first_image;

  return (
    <ContentGate
      content={blog}
      target={{ kind: 'blog', id: blog.blog_id }}
      compact
      href={url}
    >
      <Link
        href={url}
        className='block group relative w-full overflow-hidden rounded-lg'
      >
        <div className='relative w-full aspect-[16/9] sm:aspect-[2/1] bg-gray-900'>
          {isNonValidBannerImage(image) ? (
            <BlogPlaceholderImage
              title={title}
              className='opacity-70 group-hover:opacity-80 group-hover:scale-[1.02] transition-all duration-700 ease-out'
            />
          ) : (
            <BlogImage
              content={blog}
              title={title}
              image={image}
              className='opacity-70 group-hover:opacity-80 group-hover:scale-[1.02] transition-all duration-700 ease-out'
            />
          )}

          {/* Gradient for legible overlay text */}
          <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent' />

          <div className='absolute inset-x-0 bottom-0 p-5 sm:p-7'>
            <h3
              className='font-newsreader font-bold text-2xl sm:text-3xl md:text-4xl leading-[1.15] text-white line-clamp-3 group-hover:text-brand-orange transition-colors'
              dangerouslySetInnerHTML={{ __html: title || 'Untitled' }}
            />
          </div>
        </div>
      </Link>
    </ContentGate>
  );
};

export default FeatureCard;
