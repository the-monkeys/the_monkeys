'use client';

import { Suspense } from 'react';

import Link from 'next/link';
import {
  ReadonlyURLSearchParams,
  usePathname,
  useSearchParams,
} from 'next/navigation';

import Icon, { IconName } from '@/components/icon';
import {
  ACTIVITY_ROUTE,
  EXPLORE_TOPICS_ROUTE,
  FEED_ROUTE,
  HOME_ROUTE,
  LIBRARY_ROUTE,
  LOGIN_ROUTE,
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
  requiresAuth?: boolean;
};

const discoverItems: NavItem[] = [
  { href: HOME_ROUTE, label: 'Feed', icon: 'RiNewspaper' },
  { href: FEED_ROUTE, label: 'For You', icon: 'RiBard', requiresAuth: true },
  { href: EXPLORE_TOPICS_ROUTE, label: 'Topics', icon: 'RiCompass' },
  {
    href: ACTIVITY_ROUTE,
    label: 'Activity',
    icon: 'RiMenu4',
    requiresAuth: true,
  },
  {
    href: LIBRARY_ROUTE,
    label: 'Library',
    icon: 'RiBookShelf',
    requiresAuth: true,
  },
  {
    href: NOTIFICATIONS_ROUTE,
    label: 'Notifications',
    icon: 'RiNotification3',
    requiresAuth: true,
  },
  {
    href: SETTINGS_ROUTE,
    label: 'Settings',
    icon: 'RiSettings3',
    requiresAuth: true,
  },
];

const libraryItems: NavItem[] = [];

const linkBase = (active: boolean) =>
  cn(
    'flex items-center rounded-md py-3 font-inter text-sm transition-all duration-200 hover:bg-foreground-light/40 dark:hover:bg-foreground-dark/40',
    active
      ? 'bg-foreground-light dark:bg-foreground-dark/40 font-medium opacity-90'
      : '  hover:text-text-light dark:text-text-dark'
  );

function NavRows({
  pathname,
  searchParams,
  items,
  locked,
}: {
  pathname: string;
  searchParams: ReadonlyURLSearchParams;
  items: NavItem[];
  locked?: boolean;
}) {
  return (
    <nav className='flex flex-col gap-0.5' aria-label='Navigation'>
      {items.map(({ href, label, icon }) => {
        const active = itemIsActive(pathname, searchParams, href);
        return (
          <Link
            key={href}
            href={href}
            title={label}
            aria-label={label}
            tabIndex={locked ? -1 : undefined}
            aria-hidden={locked ? true : undefined}
            className={cn(
              linkBase(active),
              'relative overflow-hidden px-0 justify-center md:px-3 md:justify-start md:gap-3 text-sm',
              locked &&
                'pointer-events-none text-gray-400 dark:text-gray-500 hover:text-gray-500'
            )}
          >
            <Icon
              name={icon}
              size={18}
              className={cn('shrink-0', locked && 'opacity-45')}
            />
            <span className={cn('hidden md:inline', locked && 'opacity-45')}>
              {label}
            </span>
            <span className='sr-only md:hidden'>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function LockedNavRows({
  pathname,
  searchParams,
  items,
}: {
  pathname: string;
  searchParams: ReadonlyURLSearchParams;
  items: NavItem[];
}) {
  if (items.length === 0) return null;

  return (
    <div className='relative mt-0.5'>
      <NavRows
        pathname={pathname}
        searchParams={searchParams}
        items={items}
        locked
      />

      <Link
        href={LOGIN_ROUTE}
        title='Login to unlock'
        aria-label='Login to unlock'
        className='absolute inset-0 z-10 flex items-end justify-center rounded-md px-2 pb-2 text-gray-500 transition-colors hover:text-brand-orange dark:text-gray-400'
      >
        <span className='flex size-8 items-center justify-center rounded-full border border-border-light/70 bg-background-light/95 shadow-sm backdrop-blur dark:border-border-dark/80 dark:bg-background-dark/95 md:h-8 md:w-auto md:gap-1.5 md:px-2.5'>
          <Icon name='RiLock' size={13} className='shrink-0' />
          <span className='hidden font-inter text-[11px] font-semibold md:inline'>
            Login to unlock
          </span>
          <span className='sr-only md:hidden'>Login to unlock</span>
        </span>
      </Link>
    </div>
  );
}

function SidebarFallback() {
  return (
    <div className='space-y-3 p-3'>
      <div className='h-[88px] animate-pulse rounded-md bg-foreground-light/20 dark:bg-foreground-dark/20' />
      <div className='h-24 animate-pulse rounded-md bg-foreground-light/15 dark:bg-foreground-dark/15' />
    </div>
  );
}

function SidebarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session, isLoading } = useAuth();
  const allItems = [...discoverItems, ...libraryItems];
  const publicItems = allItems.filter((item) => !item.requiresAuth);
  const lockedItems = allItems.filter((item) => item.requiresAuth);

  return (
    <div className='flex flex-col h-full min-h-0 bg-background-light dark:bg-background-dark'>
      <div className='flex-1 overflow-y-auto overflow-x-hidden pt-6 px-0'>
        <div className='mt-2 px-0 md:px-4'>
          {!session ? (
            <>
              <NavRows
                pathname={pathname}
                searchParams={searchParams}
                items={publicItems}
              />
              <LockedNavRows
                pathname={pathname}
                searchParams={searchParams}
                items={lockedItems}
              />
            </>
          ) : (
            <NavRows
              pathname={pathname}
              searchParams={searchParams}
              items={allItems}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export function FeedSidebarDesktop() {
  return (
    <aside
      className='h-full shrink-0 relative transition-[width] duration-200 ease-out w-[76px] md:w-[265px]'
      aria-label='Site navigation'
    >
      <div className='h-full overflow-hidden flex flex-col'>
        <Suspense fallback={<SidebarFallback />}>
          <SidebarInner />
        </Suspense>
      </div>
    </aside>
  );
}
