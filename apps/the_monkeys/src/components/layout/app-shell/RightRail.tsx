'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import { ContributeAndSponsorCard } from '@/components/branding/sponsor/ContributeAndSponsorCard';
import Icon from '@/components/icon';
import LinksRedirectArrow from '@/components/links/LinksRedirectArrow';
import { TopicLinksContainer } from '@/components/topics/topicsContainer';
import { RecommendedUserCard } from '@/components/user/userInfo';
import { RAIL_AUTH_CARD_DISMISSED_KEY } from '@/constants/layoutStorage';
import {
  BLOG_ROUTE,
  LOGIN_ROUTE,
  TOPIC_ROUTE,
} from '@/constants/routeConstants';
import { recommendedUsers } from '@/constants/social';
import { recommendedTopics } from '@/constants/topics';
import useAuth from '@/hooks/auth/useAuth';
import useGetMetaFeedBlogs from '@/hooks/blog/useGetMetaFeedBlogs';
import { cn } from '@/lib/utils';
import { purifyHTMLString } from '@/utils/purifyHTML';
import SidebarFooter from '../footer';

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
    <section className={cn('space-y-3', className)}>
      <h2 className='font-dm_sans text-[13px] font-semibold uppercase tracking-wider text-text-light/55 dark:text-text-dark/55'>
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
      <div className='relative'>
        <button
          type='button'
          onClick={dismiss}
          className='absolute -right-1 -top-1 rounded-full p-1.5 text-text-light/50 transition-colors hover:bg-foreground-light/40 hover:text-text-light dark:text-text-dark/50 dark:hover:bg-foreground-dark/30 dark:hover:text-text-dark'
          aria-label='Dismiss sign-in prompt'
        >
          <Icon name='RiClose' size={16} />
        </button>
        <div className='space-y-2 pr-5'>
          <p className='font-dm_sans font-medium leading-snug'>Join Monkeys</p>
          <p className='text-xs leading-relaxed opacity-80'>
            Sign in to write, bookmark, and follow writers you care about.
          </p>
        </div>
        <div className='mt-4 flex flex-col gap-2'>
          <Link
            href={LOGIN_ROUTE}
            className='flex h-9 items-center justify-center rounded-full bg-brand-orange px-4 font-dm_sans font-medium text-white dark:text-black hover:opacity-90'
          >
            Log in
          </Link>
          <Link
            href={REGISTER_HREF}
            className='flex h-9 items-center justify-center rounded-full border-2 border-brand-orange font-dm_sans font-medium text-brand-orange hover:bg-brand-orange/10'
          >
            Create account
          </Link>
        </div>
      </div>
    </RailSurface>
  );
}

export function RightRail() {
  const { data: session, isLoading } = useAuth();

  return (
    <aside
      className='hidden w-[272px] shrink-0 xl:block border-l-[0.5px] border-border-light dark:border-border-dark'
      aria-label='Featured and community'
    >
      <div className='sticky top-0 h-screen overflow-y-auto px-4 py-8 space-y-6 pb-10'>
        {!isLoading && !session && <DismissibleAuthCard />}

        <RailSection title='Featured topics'>
          <RailSurface>
            <TopicLinksContainer topics={recommendedTopics.slice(0, 8)} />
            <LinksRedirectArrow
              className='mt-3'
              link={`${TOPIC_ROUTE}/explore`}
            >
              <p className='px-1 text-sm'>Explore more topics</p>
            </LinksRedirectArrow>
          </RailSurface>
        </RailSection>

        <RailSection title='Featured authors'>
          <RailSurface className='p-3'>
            <div className='flex flex-col gap-4'>
              {recommendedUsers.slice(0, 4).map((user, index: number) => (
                <RecommendedUserCard key={index.toString()} />
              ))}
            </div>
          </RailSurface>
        </RailSection>

        {/* <ContributeAndSponsorCard /> */}
      </div>
    </aside>
  );
}
