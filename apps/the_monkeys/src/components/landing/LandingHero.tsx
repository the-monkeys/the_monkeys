import { ReactNode } from 'react';

import Link from 'next/link';

import { PostCardGate } from '@/components/blog/PostCardGate';
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
import { fromMetaBlog } from '@/utils/blogCardAdapters';
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
  communityContent,
  groupsContent,
}: {
  lead?: MetaBlog;
  featuredEvent?: EventItem;
  primaryContent?: ReactNode;
  secondaryContent?: ReactNode;
  communityContent?: ReactNode;
  groupsContent?: ReactNode;
}) {
  const title = lead ? purifyHTMLString(lead.title) : '';
  const description = lead ? purifyHTMLString(lead.first_paragraph) : '';
  const postHref = lead
    ? `${BLOG_ROUTE}/${fromMetaBlog(lead).slug}-${lead.blog_id}`
    : '';
  const topic = lead?.tags?.[0];
  const published = lead?.published_time
    ? getRelativeTime(lead.published_time)
    : '';
  const hasLandingContent =
    lead ||
    featuredEvent ||
    primaryContent ||
    secondaryContent ||
    communityContent ||
    groupsContent;

  return (
    <section>
      {!lead ? <h1 className='sr-only'>Monkeys</h1> : null}
      <FeaturedAuthorsStrip title='Live & hosts' variant='compact' />

      {hasLandingContent && (
        <div className='flex flex-col gap-4 pb-8 pt-4 xl:grid xl:grid-cols-[minmax(0,1.65fr)_minmax(19rem,1fr)] xl:items-start xl:gap-4'>
          <section aria-label='Featured posts and feed' className='contents'>
            {lead && (
              <PostCardGate
                imageMenu='mobile'
                content={lead}
                target={{ kind: 'blog', id: lead.blog_id }}
                href={postHref}
                className='xl:col-start-1 xl:row-start-1 xl:h-full'
              >
                <article
                  aria-label='Featured post'
                  className='group flex min-w-0 flex-col overflow-hidden rounded-xl border border-border-light/70 bg-background-light shadow-sm dark:border-border-dark/40 dark:bg-background-dark xl:col-start-1 xl:row-start-1 xl:h-full'
                >
                  <Link
                    href={postHref}
                    aria-labelledby={`landing-lead-${lead.blog_id}`}
                    className={`grid min-w-0 flex-1 grid-cols-1 items-start gap-x-3 gap-y-2 p-3 pb-0 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-stretch sm:gap-x-4 sm:p-4 sm:pb-0 xl:grid-cols-[minmax(10rem,0.8fr)_minmax(0,1.6fr)] ${focusRing}`}
                  >
                    <div className='row-start-2 min-w-0 sm:col-start-2 sm:row-start-1 sm:pr-10'>
                      <span className='font-inter text-[10px] font-bold uppercase tracking-[0.16em] text-brand-orange'>
                        Lead post
                      </span>
                      {topic && (
                        <span className='ml-2 font-inter text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400'>
                          {topic}
                        </span>
                      )}
                    </div>
                    <h1
                      id={`landing-lead-${lead.blog_id}`}
                      className='row-start-3 min-w-0 break-words font-newsreader text-2xl font-semibold leading-[1.12] tracking-[-0.025em] text-text-light [overflow-wrap:anywhere] dark:text-text-dark sm:col-start-2 sm:row-start-2 sm:pr-9 sm:text-3xl'
                      dangerouslySetInnerHTML={{ __html: title }}
                    />
                    <div className='relative col-start-1 row-start-1 aspect-video overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900 sm:row-span-3 sm:aspect-auto sm:min-h-40'>
                      {isNonValidBannerImage(lead.first_image) ? (
                        <BlogPlaceholderImage
                          title={title}
                          className='absolute inset-0 object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]'
                          sizes='(min-width: 1280px) 25vw, (min-width: 640px) 160px, calc(100vw - 4rem)'
                        />
                      ) : (
                        <BlogImage
                          content={lead}
                          title={title}
                          image={lead.first_image}
                          className='absolute inset-0 object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]'
                          sizes='(min-width: 1280px) 25vw, (min-width: 640px) 160px, calc(100vw - 4rem)'
                        />
                      )}
                    </div>
                    {description && (
                      <p
                        className='row-start-4 min-w-0 line-clamp-2 font-inter text-sm leading-5 text-gray-600 dark:text-gray-400 sm:col-start-2 sm:row-start-3 sm:self-start'
                        dangerouslySetInnerHTML={{ __html: description }}
                      />
                    )}
                  </Link>
                  <div className='mt-auto p-3 sm:px-4'>
                    <div
                      role='group'
                      aria-label='Featured post byline and actions'
                      className='flex min-h-11 flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-border-light/70 pt-2 dark:border-border-dark/40'
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
              </PostCardGate>
            )}
            {(communityContent || primaryContent) && (
              <div className='contents min-w-0 xl:col-start-1 xl:row-start-2 xl:flex xl:flex-col xl:gap-4'>
                {communityContent && (
                  <div className='min-w-0'>{communityContent}</div>
                )}
                {primaryContent && (
                  <div className='order-1 min-w-0'>{primaryContent}</div>
                )}
              </div>
            )}
          </section>

          <section
            aria-label='Featured events and discovery'
            className='contents'
          >
            {(groupsContent || secondaryContent) && (
              <div className='contents min-w-0 xl:col-start-2 xl:row-start-2 xl:flex xl:flex-col xl:gap-4'>
                {groupsContent && (
                  <div className='min-w-0'>{groupsContent}</div>
                )}
                {secondaryContent && (
                  <div className='order-2 min-w-0'>{secondaryContent}</div>
                )}
              </div>
            )}
            {featuredEvent && (
              <div
                data-layout='featured-event'
                className='min-w-0 xl:col-start-2 xl:row-start-1'
              >
                <LandingFeaturedEvent event={featuredEvent} />
              </div>
            )}
          </section>
        </div>
      )}
    </section>
  );
}
