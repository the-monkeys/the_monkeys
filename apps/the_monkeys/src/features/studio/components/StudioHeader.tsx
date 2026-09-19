'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  RiAddLine,
  RiArrowRightSLine,
  RiMenuLine,
  RiSparklingFill,
} from '@remixicon/react';

interface StudioHeaderProps {
  onOpenMobileMenu: () => void;
}

const ROUTE_LABELS: Record<string, string> = {
  '/studio': 'Dashboard',
  '/studio/compose': 'Composer',
  '/studio/queue': 'Queue',
  '/studio/calendar': 'Calendar',
  '/studio/history': 'History',
  '/studio/media': 'Media Library',
  '/studio/snapshot': 'Snapshots',
  '/studio/snapshot/new': 'New Snapshot',
  '/studio/cards': 'Business Cards',
  '/studio/cards/new': 'New Card',
  '/studio/accounts': 'Connected Accounts',
};

export default function StudioHeader({ onOpenMobileMenu }: StudioHeaderProps) {
  const pathname = usePathname();

  // Determine current page label from pathname
  const currentPageLabel =
    ROUTE_LABELS[pathname] ??
    (pathname.startsWith('/studio/compose/')
      ? 'Edit Post'
      : pathname.startsWith('/studio/cards/')
        ? 'Edit Card'
        : pathname.startsWith('/studio/snapshot/')
          ? 'Edit Snapshot'
          : 'Workspace');

  const isDashboard = pathname === '/studio';

  return (
    <header className='sticky top-[60px] z-30 flex h-14 w-full items-center justify-between border-b border-border-light bg-background-light/85 px-4 backdrop-blur-md sm:px-6 lg:px-8 dark:border-border-dark/60 dark:bg-background-dark/85'>
      {/* Left: Mobile Menu Trigger + Breadcrumb Trail */}
      <div className='flex items-center gap-3'>
        <button
          type='button'
          onClick={onOpenMobileMenu}
          aria-label='Open navigation menu'
          className='flex h-9 w-9 items-center justify-center rounded-lg border border-border-light text-foreground/70 transition-colors hover:bg-foreground-light/40 hover:text-foreground lg:hidden dark:border-border-dark/60 dark:hover:bg-foreground-dark/40'
        >
          <RiMenuLine size={18} />
        </button>

        <nav
          aria-label='Breadcrumbs'
          className='flex items-center gap-1.5 text-xs sm:text-sm'
        >
          <Link
            href='/studio'
            className='flex items-center gap-1.5 font-medium text-foreground/60 transition-colors hover:text-brand-orange'
          >
            <RiSparklingFill size={14} className='text-brand-orange' />
            <span>Studio</span>
          </Link>
          <RiArrowRightSLine size={14} className='text-foreground/35' />
          <span className='font-semibold text-foreground dark:text-text-dark'>
            {currentPageLabel}
          </span>
        </nav>
      </div>

      {/* Right: Contextual Action */}
      <div className='flex items-center gap-2 sm:gap-3'>
        {isDashboard ? (
          <Link
            href='/studio/compose'
            className='flex items-center gap-1.5 rounded-lg bg-brand-orange px-3 py-1.5 text-xs font-semibold text-white shadow-sm shadow-brand-orange/20 transition-all hover:bg-brand-orange/95 hover:shadow active:scale-95'
          >
            <RiAddLine size={16} />
            <span className='hidden sm:inline'>Create Post</span>
            <span className='sm:hidden'>Post</span>
          </Link>
        ) : (
          <Link
            href='/studio/compose'
            className='hidden items-center gap-1.5 rounded-lg border border-brand-orange/40 bg-brand-orange/5 px-3 py-1.5 text-xs font-semibold text-brand-orange transition-colors hover:bg-brand-orange/10 sm:flex'
          >
            <RiAddLine size={16} />
            <span>New Post</span>
          </Link>
        )}
      </div>
    </header>
  );
}
