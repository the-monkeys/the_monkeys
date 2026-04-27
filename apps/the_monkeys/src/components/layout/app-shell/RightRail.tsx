'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import Icon from '@/components/icon';
import LinksRedirectArrow from '@/components/links/LinksRedirectArrow';
import { TopicLinksContainer } from '@/components/topics/topicsContainer';
import { RecommendedUserCard } from '@/components/user/userInfo';
import { RAIL_AUTH_CARD_DISMISSED_KEY } from '@/constants/layoutStorage';
import { LOGIN_ROUTE, TOPIC_ROUTE } from '@/constants/routeConstants';
import { recommendedUsers } from '@/constants/social';
import { recommendedTopics } from '@/constants/topics';
import useAuth from '@/hooks/auth/useAuth';
import useGetMetaFeedBlogs from '@/hooks/blog/useGetMetaFeedBlogs';
import { cn } from '@/lib/utils';

import { TrendingWidget } from './TrendingWidget';

const REGISTER_HREF = '/auth/register';

function RailSection({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('space-y-5', className)}>
      <h2 className='font-newsreader font-bold text-2xl text-stitch-on-surface ml-1'>
        {title}
      </h2>
      {children}
    </section>
  );
}

function RailSurface({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('', className)}>{children}</div>;
}

function DismissibleAuthCard() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(RAIL_AUTH_CARD_DISMISSED_KEY) === '1') {
        setDismissed(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(RAIL_AUTH_CARD_DISMISSED_KEY, '1');
    } catch {
      /* ignore */
    }
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <RailSurface>
      <div className='relative p-6 bg-white rounded-xl border border-gray-100 shadow-sm'>
        <div className='space-y-2'>
          <p className='font-newsreader font-bold text-xl text-stitch-on-surface'>
            Join Monkeys
          </p>
          <p className='text-sm font-inter text-stitch-secondary leading-relaxed'>
            Sign in to write, bookmark, and follow writers you care about.
          </p>
        </div>
        <div className='mt-6 flex flex-col gap-3'>
          <Link
            href={LOGIN_ROUTE}
            className='flex h-10 items-center justify-center rounded-lg bg-stitch-primary px-4 font-inter font-bold text-white hover:opacity-90 transition-opacity shadow-sm'
          >
            Log in
          </Link>
          <Link
            href={REGISTER_HREF}
            className='flex h-10 items-center justify-center rounded-lg border border-gray-200 bg-white font-inter font-bold text-stitch-on-surface hover:bg-gray-50 transition-colors'
          >
            Create account
          </Link>
        </div>
      </div>
    </RailSurface>
  );
}

export function RightRail() {
  const { data: session, isLoading: isAuthLoading } = useAuth();
  const { blogs, isLoading: isBlogsLoading } = useGetMetaFeedBlogs({
    limit: 10,
  });

  return (
    <aside
      className='hidden w-[400px] shrink-0 xl:block'
      aria-label='Featured and community'
    >
      <div className=' top-[60px]  px-8 py-12 space-y-16 overflow-y-auto scrollbar-hide'>
        <TrendingWidget blogs={blogs?.blogs} isLoading={isBlogsLoading} />

        <RailSection title='Featured Authors'>
          <RailSurface>
            <div className='flex flex-col gap-6'>
              {recommendedUsers.slice(0, 4).map((user, index: number) => (
                <RecommendedUserCard key={index.toString()} />
              ))}
            </div>
          </RailSurface>
        </RailSection>

        <RailSection title='Topics on the Rise'>
          <RailSurface>
            <div className='flex flex-col gap-6'>
              <TopicLinksContainer topics={recommendedTopics} />

              <LinksRedirectArrow
                target='_blank'
                link={`${TOPIC_ROUTE}/explore`}
              >
                <p className='px-1 text-[13px] font-inter font-bold text-stitch-primary hover:underline transition-all uppercase tracking-widest'>
                  Explore more topics
                </p>
              </LinksRedirectArrow>
            </div>
          </RailSurface>
        </RailSection>
      </div>
    </aside>
  );
}
