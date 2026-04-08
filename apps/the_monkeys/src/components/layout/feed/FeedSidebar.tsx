'use client';

import { Suspense, useEffect, useState } from 'react';

import Link from 'next/link';
import {
  ReadonlyURLSearchParams,
  usePathname,
  useSearchParams,
} from 'next/navigation';

import Icon, { IconName } from '@/components/icon';
import { SidebarFooter } from '@/components/layout/footer';
import Logo from '@/components/logo';
import { SIDEBAR_COLLAPSED_KEY } from '@/constants/layoutStorage';
import {
  ACTIVITY_ROUTE,
  EXPLORE_TOPICS_ROUTE,
  FEED_ROUTE,
  HOME_ROUTE,
  LIBRARY_ROUTE,
} from '@/constants/routeConstants';
import useAuth from '@/hooks/auth/useAuth';
import { cn } from '@/lib/utils';
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from '@the-monkeys/ui/atoms/drawer';

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
  { href: EXPLORE_TOPICS_ROUTE, label: 'Topics', icon: 'RiCompass' },
];

const libraryItems: NavItem[] = [
  {
    href: `${LIBRARY_ROUTE}`,
    label: 'Library',
    icon: 'RiBookShelf',
  },
];

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
  onNavigate,
  collapsed,
}: {
  pathname: string;
  searchParams: ReadonlyURLSearchParams;
  items: NavItem[];
  onNavigate?: () => void;
  collapsed?: boolean;
}) {
  return (
    <nav
      className={`flex flex-col gap-0.5 ${collapsed ? 'mt-4' : ''}`}
      aria-label='Navigation'
    >
      {items.map(({ href, label, icon }) => {
        const active = itemIsActive(pathname, searchParams, href);
        return (
          <Link
            key={href}
            href={href}
            title={collapsed ? label : undefined}
            onClick={onNavigate}
            className={cn(
              linkBase(active),
              collapsed ? 'justify-center px-2' : 'gap-3 px-3'
            )}
          >
            <Icon
              name={icon}
              size={18}
              className={cn('shrink-0', active && 'text-brand-orange')}
            />
            {!collapsed && label}
            {collapsed && <span className='sr-only'>{label}</span>}
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

function SidebarInner({
  onNavigate,
  variant,
  collapsed,
}: {
  onNavigate?: () => void;
  variant: 'desktop' | 'drawer';
  collapsed?: boolean;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session, isLoading } = useAuth();
  const isCollapsed = variant === 'desktop' && collapsed;

  return (
    <div
      className={cn(
        'flex flex-col h-full',
        variant === 'drawer' && 'max-h-[85vh]'
      )}
    >
      {variant === 'drawer' && (
        <div className='border-b border-border-light px-4 pb-3 pt-4 dark:border-border-dark shrink-0'>
          <DrawerTitle className='font-dm_sans text-lg font-medium' />
        </div>
      )}

      {/* Scrollable nav area */}
      <div className='flex-1 overflow-y-auto overflow-x-hidden'>
        {/* LOGO */}
        <div className='px-3 pb-2 mt-4'>
          <Link href={HOME_ROUTE} className='group flex items-center gap-[6px]'>
            <div className='w-9 flex justify-center items-center filter group-hover:brightness-90'>
              <Logo />
            </div>
            <div className='hidden md:block pt-1'>
              <p
                className={cn(
                  'font-dm_sans font-medium tracking-tight text-[25px] group-hover:opacity-90',
                  collapsed ? 'hidden' : 'block'
                )}
              >
                Monkeys
              </p>
            </div>
          </Link>
        </div>

        <div className='mt-8 px-3'>
          <NavRows
            pathname={pathname}
            searchParams={searchParams}
            items={
              session && !isLoading
                ? [...discoverItems, ...libraryItems]
                : discoverItems
            }
            onNavigate={onNavigate}
            collapsed={isCollapsed}
          />
        </div>
      </div>

      {/* Footer - always pinned to bottom, never scrolls */}
      <SidebarFooter collapsed={isCollapsed} />
    </div>
  );
}

export function FeedSidebarMobile() {
  const [open, setOpen] = useState(false);

  return (
    <div className='lg:hidden'>
      <Drawer
        direction='left'
        open={open}
        onOpenChange={setOpen}
        repositionInputs={false}
      >
        <DrawerTrigger asChild>
          <button
            type='button'
            className='inline-flex h-10 items-center gap-2 rounded-full border border-border-light bg-background-light px-3 font-dm_sans text-sm font-medium shadow-sm dark:border-border-dark dark:bg-background-dark'
            aria-label='Open navigation menu'
          >
            <Icon name='RiMenu2' size={20} />
            Menu
          </button>
        </DrawerTrigger>
        <DrawerContent className='h-full max-h-full rounded-none p-0'>
          <Suspense fallback={<SidebarFallback />}>
            <SidebarInner variant='drawer' onNavigate={() => setOpen(false)} />
          </Suspense>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export function FeedSidebarDesktop() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1')
        setCollapsed(true);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? '1' : '0');
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  return (
    <aside
      className={cn(
        'hidden shrink-0 relative transition-[width] duration-200 ease-out lg:block',
        collapsed ? 'w-[76px]' : 'w-[238px]'
      )}
      aria-label='Site navigation'
    >
      <button
        type='button'
        onClick={toggleCollapsed}
        className='absolute -right-3.5 top-1/2 -translate-y-1/2 z-50 flex h-7 w-7 items-center justify-center rounded-full bg-brand-orange text-white shadow-md border-1 border-background-light dark:border-background-dark transition-colors hover:bg-brand-orange/80'
        aria-expanded={!collapsed}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <Icon name={collapsed ? 'RiArrowRightS' : 'RiArrowLeftS'} size={16} />
      </button>
      <div className='sticky top-0 h-screen overflow-hidden'>
        <Suspense fallback={<SidebarFallback />}>
          <SidebarInner variant='desktop' collapsed={collapsed} />
        </Suspense>
      </div>
    </aside>
  );
}
