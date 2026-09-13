import { ReactNode } from 'react';

import Link from 'next/link';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import {
  BlogImage,
  BlogPlaceholderImage,
} from '@/components/blog/getBlogContent';
import BlogActionBar from '@/components/editorial/BlogActionBar';
import FeaturedAuthorsStrip from '@/components/editorial/FeaturedAuthorsStrip';
import Icon from '@/components/icon';
import { UserInfoCardShowcase } from '@/components/user/userInfo';
import { BLOG_ROUTE } from '@/constants/routeConstants';
import { getRelativeTime } from '@/lib/utils';
import { MetaBlog } from '@/services/blog/blogTypes';
import { EventItem } from '@/services/events/eventTypes';
import { isNonValidBannerImage } from '@/utils/imageUtils';
import { purifyHTMLString } from '@/utils/purifyHTML';

import { LandingFeaturedEvent } from './LandingFeaturedEvent';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background-dark';

export function LandingHero({
  lead,
  featuredEvent,
  primaryContent,
  secondaryContent,
}: {
  lead?: MetaBlog;
  featuredEvent?: EventItem;
  primaryContent?: ReactNode;
  secondaryContent?: ReactNode;
}) {
  const title = lead ? purifyHTMLString(lead.title) : '';
  const description = lead ? purifyHTMLString(lead.first_paragraph) : '';
  const postHref = lead
    ? `${BLOG_ROUTE}/${generateSlug(title)}-${lead.blog_id}`
    : '';
  const topic = lead?.tags?.[0];
  const published = lead?.published_time
    ? getRelativeTime(lead.published_time)
    : '';
  const hasLandingContent =
    lead || featuredEvent || primaryContent || secondaryContent;

  return (
    <section>
      {!lead ? <h1 className='sr-only'>Monkeys</h1> : null}
      <FeaturedAuthorsStrip title='Live & hosts' variant='compact' />

      {hasLandingContent && (
        <div className='flex flex-col gap-4 pb-8 pt-4 lg:grid lg:grid-cols-[minmax(0,1.65fr)_minmax(19rem,1fr)] lg:items-start lg:gap-4'>
          <section
            aria-label='Featured posts and feed'
            className='contents lg:flex lg:min-w-0 lg:flex-col lg:gap-4'
          >
            {lead && (
              <article
                aria-label='Featured post'
                className='group order-1 flex min-h-full min-w-0 flex-col overflow-hidden rounded-xl border border-border-light/70 bg-background-light shadow-sm dark:border-border-dark/40 dark:bg-background-dark lg:order-none'
              >
                <Link
                  href={postHref}
                  className={`relative block aspect-[16/9] min-h-72 overflow-hidden bg-gray-900 sm:min-h-80 ${focusRing}`}
                >
                  {isNonValidBannerImage(lead.first_image) ? (
                    <BlogPlaceholderImage
                      title={title}
                      className='transition-transform duration-700 ease-out group-hover:scale-[1.025]'
                    />
                  ) : (
                    <BlogImage
                      title={title}
                      image={lead.first_image}
                      className='object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]'
                    />
                  )}
                  <div className='absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10' />
                  <div className='absolute inset-x-0 top-0 flex items-center p-4 sm:p-5'>
                    <span className='rounded-md bg-brand-orange px-3 py-1 font-inter text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow-sm'>
                      Lead post
                    </span>
                  </div>
                  <div className='absolute inset-x-0 bottom-0 p-5 text-white sm:p-6'>
                    {topic && (
                      <span className='font-inter text-[10px] font-bold uppercase tracking-[0.18em] text-[#ff8b7d]'>
                        {topic}
                      </span>
                    )}
                    <h1
                      className='mt-2 max-w-3xl font-newsreader text-[1.8rem] font-semibold leading-[1.06] tracking-[-0.025em] text-white sm:text-[2.25rem]'
                      dangerouslySetInnerHTML={{ __html: title }}
                    />
                  </div>
                </Link>
                <div className='flex flex-1 flex-col p-4 sm:p-5'>
                  {description && (
                    <p
                      className='line-clamp-2 font-inter text-sm leading-6 text-gray-600 dark:text-gray-400'
                      dangerouslySetInnerHTML={{ __html: description }}
                    />
                  )}
                  <div
                    role='group'
                    aria-label='Featured post byline and actions'
                    className='mt-auto flex min-h-12 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-border-light/70 pt-3 dark:border-border-dark/40'
                  >
                    <div className='min-w-0 text-gray-500 dark:text-gray-400'>
                      <UserInfoCardShowcase
                        authorID={lead.owner_account_id}
                        date={published}
                      />
                    </div>
                    <div className='flex shrink-0 items-center gap-3'>
                      <BlogActionBar
                        blogId={lead.blog_id}
                        blogURL={postHref}
                        size={17}
                        initialLikeCount={lead.like_count}
                      />
                      <Link
                        href={postHref}
                        className={`inline-flex min-h-11 shrink-0 items-center gap-1.5 font-inter text-sm font-semibold text-brand-orange transition hover:opacity-80 ${focusRing}`}
                      >
                        Read post
                        <Icon name='RiArrowRight' size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            )}
            {featuredEvent && (
              <div
                data-layout='mobile-featured-event'
                className='order-2 min-w-0 lg:hidden'
              >
                <LandingFeaturedEvent event={featuredEvent} />
              </div>
            )}
            {primaryContent && (
              <div className='order-3 min-w-0 lg:order-none'>
                {primaryContent}
              </div>
            )}
          </section>

          <section
            aria-label='Featured events and discovery'
            className='contents lg:flex lg:min-w-0 lg:flex-col lg:gap-4'
          >
            {featuredEvent && (
              <div
                data-layout='desktop-featured-event'
                className='hidden min-w-0 lg:block'
              >
                <LandingFeaturedEvent event={featuredEvent} />
              </div>
            )}
            {secondaryContent && (
              <div className='order-4 min-w-0 lg:order-none'>
                {secondaryContent}
              </div>
            )}
          </section>
        </div>
      )}
    </section>
  );
}
