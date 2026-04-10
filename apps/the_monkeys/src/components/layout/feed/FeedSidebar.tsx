'use client';

import { Suspense } from 'react';

import Link from 'next/link';
import {
  ReadonlyURLSearchParams,
  usePathname,
  useSearchParams,
} from 'next/navigation';

import Icon, { IconName } from '@/components/icon';
import Footer from '@/components/layout/footer';
import Logo from '@/components/logo';
import {
  ACTIVITY_ROUTE,
  EXPLORE_TOPICS_ROUTE,
  FEED_ROUTE,
  HOME_ROUTE,
  LIBRARY_ROUTE,
  NOTIFICATIONS_ROUTE,
  SETTINGS_ROUTE,
} from '@/constants/routeConstants';
import useAuth from '@/hooks/auth/useAuth';
import { cn } from '@/lib/utils';

const pathMatches = (pathname: string, hrefPath: string) => {
  if (hrefPath === HOME_ROUTE) {
    return pathname === HOME_ROUTE || pathname === FEED_ROUTE;
  }
  if (hrefPath === LIBRARY_ROUTE) {
    return pathname.startsWith(LIBRARY_ROUTE);
  }
  if (hrefPath === ACTIVITY_ROUTE) {
    return pathname.startsWith(ACTIVITY_ROUTE);
  }
  return pathname === hrefPath || pathname.startsWith(`${hrefPath}/`);
};

const itemIsActive = (
  pathname: string,
  searchParams: ReadonlyURLSearchParams,
  href: string
) => {
  const [path, query] = href.split('?');
  if (!path) return false;
  if (!pathMatches(pathname, path)) return false;
  if (path === LIBRARY_ROUTE && query) {
    const wanted = new URLSearchParams(query).get('source') || 'bookmarks';
    const current = searchParams.get('source') || 'bookmarks';
    return wanted === current;
  }
  return !query;
};

type NavItem = {
  href: string;
  label: string;
  icon: IconName;
};

const discoverItems: NavItem[] = [
  { href: HOME_ROUTE, label: 'Feed', icon: 'RiNewspaper' },
  { href: FEED_ROUTE, label: 'For You', icon: 'RiBard' },
  { href: EXPLORE_TOPICS_ROUTE, label: 'Topics', icon: 'RiCompass' },
  { href: ACTIVITY_ROUTE, label: 'Activity', icon: 'RiMenu4' },
  { href: LIBRARY_ROUTE, label: 'Library', icon: 'RiBookShelf' },
  { href: NOTIFICATIONS_ROUTE, label: 'Notifications', icon: 'RiNotification3' },
  { href: SETTINGS_ROUTE, label: 'Settings', icon: 'RiSettings3' },
];

const libraryItems: NavItem[] = [];

const linkBase = (active: boolean) =>
  cn(
    'flex items-center rounded-xl py-2.5 font-dm_sans text-sm transition-colors',
    active
      ? 'bg-brand-orange/10 font-medium text-brand-orange'
      : 'text-text-light/90 opacity-90 hover:bg-foreground-light/40 hover:opacity-100 dark:text-text-dark/90 dark:hover:bg-foreground-dark/30'
  );

function NavRows({
  pathname,
  searchParams,
  items,
}: {
  pathname: string;
  searchParams: ReadonlyURLSearchParams;
  items: NavItem[];
}) {
  return (
    <nav
      className='flex flex-col gap-0.5'
      aria-label='Navigation'
    >
      {items.map(({ href, label, icon }) => {
        const active = itemIsActive(pathname, searchParams, href);
        return (
          <Link
            key={href}
            href={href}
            title={label}
            className={cn(
              linkBase(active),
              'px-0 justify-center md:px-3 md:justify-start md:gap-3'
            )}
          >
            <Icon
              name={icon}
              size={18}
              className={cn('shrink-0', active && 'text-brand-orange ')}
            />
            <span className='hidden md:inline'>{label}</span>
            <span className='sr-only md:hidden'>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarFallback() {
  return (
    <div className='space-y-3 p-3'>
      <div className='h-[88px] animate-pulse rounded-xl bg-foreground-light/20 dark:bg-foreground-dark/20' />
      <div className='h-24 animate-pulse rounded-xl bg-foreground-light/15 dark:bg-foreground-dark/15' />
    </div>
  );
}

function SidebarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session, isLoading } = useAuth();

  return (
    <div className='flex flex-col h-full'>
      {/* Scrollable nav area */}
      <div className='flex-1 overflow-y-auto overflow-x-hidden'>
        {/* LOGO */}
        <div className='px-2 md:px-3 pb-2 mt-4'>
          <Link href={HOME_ROUTE} className='group flex items-center gap-[6px]'>
            <div className='w-9 flex justify-center items-center filter group-hover:brightness-90'>
              <Logo />
            </div>
            <p className='hidden md:block pt-1 font-dm_sans font-medium tracking-tight text-[25px] group-hover:opacity-90'>
              Monkeys
            </p>
          </Link>
        </div>

        <div className='mt-8 px-0 md:px-3'>
          <NavRows
            pathname={pathname}
            searchParams={searchParams}
            items={
              session && !isLoading
                ? [...discoverItems, ...libraryItems]
                : discoverItems
            }
          />
        </div>
      </div>

      {/* Footer - always pinned to bottom, never scrolls */}
      <Footer/>
    </div>
  );
}

export function FeedSidebarDesktop() {
  return (
    <aside
      className='shrink-0 relative transition-[width] duration-200 ease-out w-[76px] md:w-[238px]'
      aria-label='Site navigation'
    >
      <div className='sticky top-0 h-screen overflow-hidden'>
        <Suspense fallback={<SidebarFallback />}>
          <SidebarInner />
        </Suspense>
      </div>
    </aside>
  );
}
