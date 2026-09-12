import Link from 'next/link';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import {
  BlogImage,
  BlogPlaceholderImage,
} from '@/components/blog/getBlogContent';
import BlogActionBar from '@/components/editorial/BlogActionBar';
import Icon from '@/components/icon';
import { UserInfoCardShowcase } from '@/components/user/userInfo';
import {
  BLOG_ROUTE,
  EVENTS_ROUTE,
  TOPIC_ROUTE,
} from '@/constants/routeConstants';
import {
  eventDateParts,
  eventTypeLabel,
  formatEventCardWhen,
} from '@/lib/eventTime';
import { getRelativeTime } from '@/lib/utils';
import { MetaBlog } from '@/services/blog/blogTypes';
import { EventItem } from '@/services/events/eventTypes';
import { isNonValidBannerImage } from '@/utils/imageUtils';
import { purifyHTMLString } from '@/utils/purifyHTML';
import { topicToSlug } from '@/utils/topicUtils';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background-dark';

function postDetails(post: MetaBlog) {
  const title = purifyHTMLString(post.title);
  return {
    title,
    description: purifyHTMLString(post.first_paragraph),
    href: `${BLOG_ROUTE}/${generateSlug(title)}-${post.blog_id}`,
    topic: post.tags?.[0],
    time: post.published_time ? getRelativeTime(post.published_time) : '',
  };
}

function PostImage({ post, title }: { post: MetaBlog; title: string }) {
  return isNonValidBannerImage(post.first_image) ? (
    <BlogPlaceholderImage
      title={title}
      className='object-cover transition-transform duration-500 group-hover:scale-105'
    />
  ) : (
    <BlogImage
      title={title}
      image={post.first_image}
      className='object-cover transition-transform duration-500 group-hover:scale-105'
    />
  );
}

function TopicLink({ topic }: { topic?: string }) {
  if (!topic) return null;
  return (
    <Link
      href={`${TOPIC_ROUTE}/${topicToSlug(topic)}`}
      className={`w-fit font-inter text-[10px] font-bold uppercase tracking-[0.16em] text-brand-orange hover:underline ${focusRing}`}
    >
      {topic}
    </Link>
  );
}

function PrimaryFeedPost({ post }: { post: MetaBlog }) {
  const { title, description, href, topic, time } = postDetails(post);

  return (
    <article
      aria-label='Feed post'
      className='group overflow-hidden rounded-xl border border-border-light/70 bg-background-light dark:border-border-dark/40 dark:bg-background-dark'
    >
      <div className='grid sm:grid-cols-[minmax(0,1fr)_13rem] xl:grid-cols-[minmax(0,1fr)_15rem]'>
        <Link
          href={href}
          aria-label={title}
          className={`relative order-1 block aspect-[16/10] min-h-48 overflow-hidden bg-gray-100 dark:bg-gray-900 sm:order-2 sm:aspect-auto ${focusRing}`}
        >
          <PostImage post={post} title={title} />
        </Link>
        <div className='order-2 flex min-w-0 flex-col p-5 sm:order-1'>
          <TopicLink topic={topic} />
          <Link href={href} className={`mt-2 block ${focusRing}`}>
            <h2
              className='font-newsreader text-2xl font-semibold leading-[1.12] text-text-light transition-colors group-hover:text-brand-orange dark:text-text-dark'
              dangerouslySetInnerHTML={{ __html: title }}
            />
          </Link>
          {description ? (
            <p
              className='mt-3 line-clamp-2 font-inter text-sm leading-5 text-gray-500 dark:text-gray-400'
              dangerouslySetInnerHTML={{ __html: description }}
            />
          ) : null}
          <div className='mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border-light/70 pt-4 dark:border-border-dark/40'>
            <UserInfoCardShowcase
              authorID={post.owner_account_id}
              date={time}
            />
            <BlogActionBar
              blogId={post.blog_id}
              blogURL={href}
              size={15}
              initialLikeCount={post.like_count}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

function FeedPostCard({ post }: { post: MetaBlog }) {
  const { title, description, href, topic, time } = postDetails(post);

  return (
    <article
      aria-label='Feed post'
      className='group flex min-w-0 flex-col overflow-hidden rounded-xl border border-border-light/70 bg-background-light dark:border-border-dark/40 dark:bg-background-dark'
    >
      <Link
        href={href}
        aria-label={title}
        className={`relative block aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-900 ${focusRing}`}
      >
        <PostImage post={post} title={title} />
      </Link>
      <div className='flex flex-1 flex-col p-5'>
        <TopicLink topic={topic} />
        <Link href={href} className={`mt-2 block ${focusRing}`}>
          <h2
            className='line-clamp-3 font-newsreader text-2xl font-semibold leading-[1.15] text-text-light transition-colors group-hover:text-brand-orange dark:text-text-dark'
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </Link>
        {description ? (
          <p
            className='mt-3 line-clamp-2 font-inter text-sm leading-5 text-gray-500 dark:text-gray-400'
            dangerouslySetInnerHTML={{ __html: description }}
          />
        ) : null}
        {time ? (
          <p className='mt-auto pt-5 font-inter text-xs text-gray-500 dark:text-gray-400'>
            {time}
          </p>
        ) : null}
      </div>
    </article>
  );
}

function FeedEvent({ event }: { event: EventItem }) {
  const date = eventDateParts(event.start_time, event.timezone);
  const href = `${EVENTS_ROUTE}/${event.slug}`;
  const description = purifyHTMLString(event.description || '');
  const label = event.tags?.[0] || eventTypeLabel(event.event_type);

  return (
    <article
      aria-label='Feed event'
      className='grid gap-4 rounded-xl border border-brand-orange/25 bg-background-light p-4 dark:border-brand-orange/30 dark:bg-background-dark sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:items-center sm:p-5'
    >
      <div className='flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-gray-50 text-center dark:bg-white/[0.05]'>
        <span className='font-inter text-[9px] font-bold uppercase tracking-wider text-brand-orange'>
          {date?.month || 'Soon'}
        </span>
        <span className='font-newsreader text-2xl font-semibold leading-none text-text-light dark:text-text-dark'>
          {date?.day || ''}
        </span>
      </div>
      <div className='min-w-0'>
        <p className='font-inter text-[10px] font-bold uppercase tracking-[0.14em] text-brand-orange'>
          {label}
        </p>
        <Link href={href} className={`mt-1 block ${focusRing}`}>
          <h2 className='line-clamp-2 font-newsreader text-xl font-semibold leading-tight text-text-light hover:text-brand-orange dark:text-text-dark sm:text-2xl'>
            {event.title}
          </h2>
        </Link>
        <p className='mt-1 font-inter text-xs text-gray-500 dark:text-gray-400'>
          {formatEventCardWhen(event.start_time, event.timezone)}
        </p>
        {description ? (
          <p
            className='mt-1 line-clamp-1 font-inter text-xs text-gray-500 dark:text-gray-400'
            dangerouslySetInnerHTML={{ __html: description }}
          />
        ) : null}
      </div>
      <div className='flex items-center justify-between gap-3 sm:flex-col sm:items-end'>
        {typeof event.attendee_count === 'number' ? (
          <span className='font-inter text-xs text-gray-500 dark:text-gray-400'>
            {event.attendee_count} attending
          </span>
        ) : null}
        <Link
          href={href}
          className={`inline-flex min-h-10 items-center gap-2 rounded-lg bg-text-light px-4 py-2 font-inter text-xs font-semibold text-background-light transition hover:bg-brand-orange dark:bg-text-dark dark:text-background-dark ${focusRing}`}
        >
          View event
          <Icon name='RiArrowRight' size={15} />
        </Link>
      </div>
    </article>
  );
}

export function LandingEditorialFeed({
  posts,
  events,
}: {
  posts: MetaBlog[];
  events: EventItem[];
}) {
  const [primary, ...cards] = posts.slice(0, 3);
  const [firstEvent, secondEvent] = events.slice(0, 2);

  if (!primary && !firstEvent) return null;

  return (
    <section
      id='latest-posts'
      aria-label='Editorial feed'
      className='space-y-4 pt-3'
    >
      {primary ? <PrimaryFeedPost post={primary} /> : null}
      {firstEvent ? <FeedEvent event={firstEvent} /> : null}
      {cards.length ? (
        <div className='grid gap-4 sm:grid-cols-2'>
          {cards.map((post) => (
            <FeedPostCard key={post.blog_id} post={post} />
          ))}
        </div>
      ) : null}
      {secondEvent ? <FeedEvent event={secondEvent} /> : null}
    </section>
  );
}
