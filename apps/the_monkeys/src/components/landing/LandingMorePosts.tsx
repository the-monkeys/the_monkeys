'use client';

import { useEffect, useRef, useState } from 'react';

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
  FEED_ROUTE,
  GROUPS_ROUTE,
  TOPIC_ROUTE,
} from '@/constants/routeConstants';
import { getRelativeTime } from '@/lib/utils';
import { MetaBlog } from '@/services/blog/blogTypes';
import { isNonValidBannerImage } from '@/utils/imageUtils';
import { purifyHTMLString } from '@/utils/purifyHTML';
import { topicToSlug } from '@/utils/topicUtils';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background-dark';

function getPostDetails(post: MetaBlog) {
  const title = purifyHTMLString(post.title);

  return {
    title,
    description: purifyHTMLString(post.first_paragraph),
    href: `${BLOG_ROUTE}/${generateSlug(title)}-${post.blog_id}`,
    topic: post.tags?.[0],
    published: post.published_time ? getRelativeTime(post.published_time) : '',
  };
}

function PostImage({
  post,
  title,
  prominent,
}: {
  post: MetaBlog;
  title: string;
  prominent: boolean;
}) {
  const imageClass =
    'object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]';
  const sizes = prominent
    ? '(min-width: 1024px) 42vw, (min-width: 768px) 50vw, 100vw'
    : '(min-width: 1280px) 21vw, (min-width: 640px) 50vw, 100vw';

  return isNonValidBannerImage(post.first_image) ? (
    <BlogPlaceholderImage
      title={title}
      className={imageClass}
      priority={false}
      sizes={sizes}
    />
  ) : (
    <BlogImage
      title={title}
      image={post.first_image}
      className={imageClass}
      priority={false}
      sizes={sizes}
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

function MorePostCard({
  post,
  prominent = false,
}: {
  post: MetaBlog;
  prominent?: boolean;
}) {
  const { title, description, href, topic, published } = getPostDetails(post);
  const titleId = `more-post-title-${post.blog_id}`;

  return (
    <article
      aria-labelledby={titleId}
      data-card-variant={prominent ? 'prominent' : 'compact'}
      className='group flex min-w-0 flex-col overflow-hidden rounded-xl border border-border-light/70 bg-background-light transition-shadow hover:shadow-md dark:border-border-dark/40 dark:bg-background-dark'
    >
      <Link
        href={href}
        aria-label={`Open post: ${title}`}
        className={`relative block overflow-hidden bg-gray-100 dark:bg-gray-900 ${
          prominent ? 'aspect-[16/9]' : 'aspect-[16/10]'
        } ${focusRing}`}
      >
        <PostImage post={post} title={title} prominent={prominent} />
      </Link>

      <div className={`flex flex-1 flex-col ${prominent ? 'p-5' : 'p-4'}`}>
        <TopicLink topic={topic} />
        <Link href={href} className={`mt-2 block ${focusRing}`}>
          <h3
            id={titleId}
            className={`line-clamp-3 font-newsreader font-semibold text-text-light transition-colors group-hover:text-brand-orange dark:text-text-dark ${
              prominent
                ? 'text-2xl leading-[1.12] sm:text-[1.7rem]'
                : 'text-xl leading-[1.15]'
            }`}
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </Link>
        {description ? (
          <p
            className={`mt-3 font-inter text-sm leading-5 text-gray-500 dark:text-gray-400 ${
              prominent ? 'line-clamp-3' : 'line-clamp-2'
            }`}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        ) : null}

        <DeferredPostMeta
          post={post}
          href={href}
          published={published}
          prominent={prominent}
        />
      </div>
    </article>
  );
}

function DeferredPostMeta({
  post,
  href,
  published,
  prominent,
}: {
  post: MetaBlog;
  href: string;
  published: string;
  prominent: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    if (!('IntersectionObserver' in window)) {
      setIsReady(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setIsReady(true);
        observer.disconnect();
      },
      { rootMargin: '320px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className='mt-auto flex min-h-11 flex-wrap items-center justify-between gap-3 border-t border-border-light/70 pt-4 dark:border-border-dark/40'
    >
      {isReady ? (
        <>
          <div className='min-w-0 text-gray-500 dark:text-gray-400'>
            <UserInfoCardShowcase
              authorID={post.owner_account_id}
              date={published}
            />
          </div>
          <BlogActionBar
            blogId={post.blog_id}
            blogURL={href}
            size={prominent ? 16 : 15}
            initialLikeCount={post.like_count}
          />
        </>
      ) : (
        <div
          aria-hidden='true'
          className='h-5 w-full animate-pulse rounded bg-gray-100 dark:bg-white/[0.05]'
        />
      )}
    </div>
  );
}

const discoveryLinks = [
  { label: 'Explore all posts', href: FEED_ROUTE, icon: 'RiNewspaper' },
  { label: 'Browse events', href: EVENTS_ROUTE, icon: 'RiCalendar' },
  { label: 'Discover groups', href: GROUPS_ROUTE, icon: 'RiGroup' },
] as const;

export function LandingMorePosts({ posts }: { posts: MetaBlog[] }) {
  const visiblePosts = posts.slice(0, 6);
  const prominentPosts = visiblePosts.slice(0, 2);
  const compactPosts = visiblePosts.slice(2);

  if (!visiblePosts.length) return null;

  return (
    <section
      aria-labelledby='more-from-community-heading'
      className='pb-12 sm:pb-16'
    >
      <div className='mb-5 flex items-end justify-between gap-4'>
        <div>
          <p className='font-inter text-[10px] font-bold uppercase tracking-[0.18em] text-brand-orange'>
            Keep exploring
          </p>
          <h2
            id='more-from-community-heading'
            className='mt-1 font-newsreader text-3xl font-semibold leading-tight text-text-light dark:text-text-dark sm:text-4xl'
          >
            More from the community
          </h2>
        </div>
        <Link
          href={FEED_ROUTE}
          className={`hidden min-h-11 items-center gap-2 font-inter text-sm font-semibold text-brand-orange hover:opacity-80 sm:inline-flex ${focusRing}`}
        >
          View all posts
          <Icon name='RiArrowRight' size={16} />
        </Link>
      </div>

      {prominentPosts.length ? (
        <div className='grid gap-4 md:grid-cols-2'>
          {prominentPosts.map((post) => (
            <MorePostCard key={post.blog_id} post={post} prominent />
          ))}
        </div>
      ) : null}

      {compactPosts.length ? (
        <div className='mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          {compactPosts.map((post) => (
            <MorePostCard key={post.blog_id} post={post} />
          ))}
        </div>
      ) : null}

      <nav
        aria-label='Continue exploring'
        className='mt-5 grid overflow-hidden rounded-xl border border-border-light/70 bg-background-light dark:border-border-dark/40 dark:bg-background-dark sm:grid-cols-3'
      >
        {discoveryLinks.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex min-h-14 items-center justify-between gap-3 px-4 font-inter text-sm font-semibold text-text-light transition hover:bg-gray-50 hover:text-brand-orange dark:text-text-dark dark:hover:bg-white/[0.04] sm:px-5 ${
              index
                ? 'border-t border-border-light/70 dark:border-border-dark/40 sm:border-l sm:border-t-0'
                : ''
            } ${focusRing}`}
          >
            <span className='flex items-center gap-2.5'>
              <Icon name={item.icon} size={18} />
              {item.label}
            </span>
            <Icon name='RiArrowRight' size={16} />
          </Link>
        ))}
      </nav>
    </section>
  );
}
