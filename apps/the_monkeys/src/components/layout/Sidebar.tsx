'use client';

import { Suspense } from 'react';

import { NavList } from '@/components/layout/navbar/NavList';
import { DISCOVER_ITEMS } from '@/constants/routeConstants';
import useAuth from '@/hooks/auth/useAuth';

function SidebarFallback() {
  return (
    <div className='space-y-3 p-3'>
      <div className='h-[88px] animate-pulse rounded-md bg-foreground-light/20 dark:bg-foreground-dark/20' />
      <div className='h-24 animate-pulse rounded-md bg-foreground-light/15 dark:bg-foreground-dark/15' />
    </div>
  );
}

function SidebarInner() {
  const { data: session } = useAuth();

  const publicItems = DISCOVER_ITEMS.filter((item) => !item.requiresAuth);
  const lockedItems = DISCOVER_ITEMS.filter((item) => item.requiresAuth);

  return (
    <div className='flex flex-col h-full min-h-0 bg-background-light dark:bg-background-dark'>
      <div className='flex-1 overflow-y-auto overflow-x-hidden pt-6 px-0 md:px-4 mt-2'>
        <NavList
          items={session ? DISCOVER_ITEMS : publicItems}
          lockedItems={session ? [] : lockedItems}
          compact
        />
      </div>
    </div>
  );
}

export function FeedSidebarDesktop() {
  return (
    <aside
      className='hidden lg:block h-full shrink-0 transition-[width] duration-200 ease-out w-[76px] md:w-[265px]'
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
