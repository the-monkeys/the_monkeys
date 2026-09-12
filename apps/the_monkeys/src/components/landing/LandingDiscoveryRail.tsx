import Link from 'next/link';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import NewsletterCard from '@/components/editorial/NewsletterCard';
import ProfileImage, { ProfileFrame } from '@/components/profileImage';
import { FollowButton } from '@/components/user/buttons/followButton';
import {
  BLOG_ROUTE,
  LOGIN_ROUTE,
  TOPIC_ROUTE,
} from '@/constants/routeConstants';
import useAuth from '@/hooks/auth/useAuth';
import { getRelativeTime } from '@/lib/utils';
import { MetaBlog } from '@/services/blog/blogTypes';
import { EventItem } from '@/services/events/eventTypes';
import { purifyHTMLString } from '@/utils/purifyHTML';
import { topicToSlug } from '@/utils/topicUtils';

import { LandingEventsSection } from './LandingEventsSection';

const FEATURED_HOSTS = [
  { username: 'k_young', name: 'Karen' },
  { username: 'innovation_hub', name: 'Innovation' },
  { username: 'euro_centric', name: 'Euro' },
] as const;

interface LandingDiscoveryRailProps {
  events: EventItem[];
  eventsTitle?: string;
  trending: MetaBlog[];
  eventsLoading: boolean;
  eventsError: boolean;
  trendingLoading?: boolean;
  trendingError?: boolean;
}

function TrendingPosts({
  posts,
  isLoading,
  isError,
}: {
  posts: MetaBlog[];
  isLoading: boolean;
  isError: boolean;
}) {
  return (
    <section className='rounded-xl border border-border-light/70 bg-background-light p-5 dark:border-border-dark/40 dark:bg-background-dark'>
      <h2 className='font-inter text-xs font-bold uppercase tracking-[0.16em] text-text-light dark:text-text-dark'>
        Trending posts
      </h2>
      {isLoading ? (
        <div className='mt-4 space-y-3' aria-label='Loading trending posts'>
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className='h-10 animate-pulse rounded bg-gray-100 dark:bg-gray-800'
            />
          ))}
        </div>
      ) : null}
      {!isLoading && isError ? (
        <p className='mt-3 font-inter text-xs text-gray-500 dark:text-gray-400'>
          Trending posts could not be loaded.
        </p>
      ) : null}
      {!isLoading && !isError && !posts.length ? (
        <p className='mt-3 font-inter text-xs text-gray-500 dark:text-gray-400'>
          No trending posts are available yet.
        </p>
      ) : null}
      {!isLoading && !isError && posts.length ? (
        <div className='mt-2 divide-y divide-border-light/70 dark:divide-border-dark/40'>
          {posts.slice(0, 4).map((post, index) => {
            const title = purifyHTMLString(post.title);
            const topic = post.tags?.[0];
            const href = `${BLOG_ROUTE}/${generateSlug(title)}-${post.blog_id}`;
            const time = post.published_time
              ? getRelativeTime(post.published_time)
              : '';

            return (
              <article
                key={post.blog_id}
                className='group grid grid-cols-[2rem_minmax(0,1fr)] gap-2 py-3'
              >
                <span className='font-newsreader text-xl text-gray-300 dark:text-gray-600'>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className='min-w-0'>
                  <Link
                    href={href}
                    className='line-clamp-2 font-inter text-sm font-semibold leading-5 text-text-light transition group-hover:text-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange dark:text-text-dark'
                  >
                    {title}
                  </Link>
                  <div className='mt-1 flex flex-wrap items-center gap-1.5 font-inter text-[10px] uppercase tracking-[0.08em] text-gray-400'>
                    {topic && (
                      <Link
                        href={`${TOPIC_ROUTE}/${topicToSlug(topic)}`}
                        className='hover:text-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange'
                      >
                        {topic}
                      </Link>
                    )}
                    {topic && time && <span aria-hidden='true'>•</span>}
                    {time && <span>{time}</span>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

function FeaturedHosts({
  viewerUsername,
  isAuthenticated,
}: {
  viewerUsername?: string;
  isAuthenticated: boolean;
}) {
  return (
    <section className='rounded-xl border border-border-light/70 bg-background-light p-5 dark:border-border-dark/40 dark:bg-background-dark'>
      <h2 className='font-inter text-xs font-bold uppercase tracking-[0.16em] text-text-light dark:text-text-dark'>
        Featured hosts and writers
      </h2>
      <div className='mt-3 space-y-3'>
        {FEATURED_HOSTS.map((host) => (
          <div key={host.username} className='flex items-center gap-3'>
            <Link
              href={`/${host.username}`}
              aria-label={`View ${host.name}'s profile`}
              className='flex min-w-0 flex-1 items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange'
            >
              <ProfileFrame className='size-9 shrink-0'>
                <ProfileImage username={host.username} alt={host.name} />
              </ProfileFrame>
              <span className='min-w-0'>
                <span className='block truncate font-inter text-xs font-semibold text-text-light dark:text-text-dark'>
                  {host.name}
                </span>
                <span className='block truncate font-inter text-[10px] text-gray-400'>
                  @{host.username}
                </span>
              </span>
            </Link>
            {isAuthenticated && host.username !== viewerUsername ? (
              <FollowButton
                username={host.username}
                className='h-8 min-w-16 px-3 !text-[11px]'
              />
            ) : null}
            {!isAuthenticated ? (
              <Link
                href={`${LOGIN_ROUTE}?callbackURL=%2F`}
                className='inline-flex h-8 min-w-16 items-center justify-center rounded-full border border-border-light px-3 font-inter text-[11px] font-semibold text-text-light transition hover:border-brand-orange hover:text-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange dark:border-border-dark dark:text-text-dark'
              >
                Follow
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export function LandingDiscoveryRail({
  events,
  eventsTitle = "This week's events",
  trending,
  eventsLoading,
  eventsError,
  trendingLoading = false,
  trendingError = false,
}: LandingDiscoveryRailProps) {
  const { data: session, isSuccess: isAuthenticated } = useAuth();

  return (
    <aside aria-label='Discover more' className='min-w-0 space-y-4'>
      <LandingEventsSection
        events={events}
        isLoading={eventsLoading}
        isError={eventsError}
        variant='compact'
        title={eventsTitle}
      />
      <TrendingPosts
        posts={trending}
        isLoading={trendingLoading}
        isError={trendingError}
      />
      <FeaturedHosts
        viewerUsername={session?.username}
        isAuthenticated={isAuthenticated}
      />
      <NewsletterCard
        eyebrow='Daily intelligence'
        title='The Morning Monkeys Dispatch'
        description='Get thoughtful posts, community updates, and upcoming events delivered to your inbox.'
        buttonLabel='Subscribe free'
      />
    </aside>
  );
}
