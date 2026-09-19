'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  RiCalendarLine,
  RiCloseLine,
  RiDashboardLine,
  RiMenuLine,
  RiPencilLine,
  RiTimeLine,
} from '@remixicon/react';

import StudioSidebar from './StudioSidebar';

interface StudioMobileNavProps {
  isDrawerOpen: boolean;
  onCloseDrawer: () => void;
  onOpenDrawer: () => void;
}

const BOTTOM_TABS = [
  {
    label: 'Dashboard',
    href: '/studio',
    icon: RiDashboardLine,
  },
  {
    label: 'Compose',
    href: '/studio/compose',
    icon: RiPencilLine,
  },
  {
    label: 'Queue',
    href: '/studio/queue',
    icon: RiTimeLine,
  },
  {
    label: 'Calendar',
    href: '/studio/calendar',
    icon: RiCalendarLine,
  },
];

export default function StudioMobileNav({
  isDrawerOpen,
  onCloseDrawer,
  onOpenDrawer,
}: StudioMobileNavProps) {
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    if (href === '/studio') {
      return pathname === '/studio';
    }
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Fixed Mobile Bottom Bar (< lg) */}
      <nav
        aria-label='Mobile bottom navigation'
        className='fixed bottom-0 inset-x-0 z-40 flex h-16 items-center justify-around border-t border-border-light bg-background-light/95 px-2 backdrop-blur-lg lg:hidden dark:border-border-dark/60 dark:bg-background-dark/95'
      >
        {BOTTOM_TABS.map((tab) => {
          const active = isLinkActive(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center justify-center gap-1 py-1 text-center transition-colors ${
                active
                  ? 'font-semibold text-brand-orange'
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full transition-all ${
                  active ? 'bg-brand-orange/15' : ''
                }`}
              >
                <Icon size={18} />
              </div>
              <span className='text-[10px] tracking-tight'>{tab.label}</span>
            </Link>
          );
        })}

        {/* More Drawer Button */}
        <button
          type='button'
          onClick={onOpenDrawer}
          aria-label='Open full studio menu'
          className='flex flex-1 flex-col items-center justify-center gap-1 py-1 text-center text-foreground/60 transition-colors hover:text-foreground'
        >
          <div className='flex h-7 w-7 items-center justify-center rounded-full'>
            <RiMenuLine size={18} />
          </div>
          <span className='text-[10px] tracking-tight'>More</span>
        </button>
      </nav>

      {/* Slide-over Drawer for mobile navigation */}
      {isDrawerOpen && (
        <div
          role='dialog'
          aria-modal='true'
          aria-label='Studio Navigation Drawer'
          className='fixed inset-0 z-50 lg:hidden'
        >
          {/* Backdrop */}
          <div
            className='fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200'
            onClick={onCloseDrawer}
          />

          {/* Drawer Content */}
          <div className='fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-background-light shadow-2xl transition-transform duration-200 dark:bg-background-dark'>
            <div className='flex items-center justify-between border-b border-border-light px-4 py-3 dark:border-border-dark/60'>
              <span className='font-dm_sans text-xs font-bold uppercase tracking-wider text-foreground/50'>
                Studio Navigation
              </span>
              <button
                type='button'
                onClick={onCloseDrawer}
                aria-label='Close menu'
                className='flex h-8 w-8 items-center justify-center rounded-lg text-foreground/60 hover:bg-foreground-light/40 hover:text-foreground dark:hover:bg-foreground-dark/40'
              >
                <RiCloseLine size={20} />
              </button>
            </div>

            <div className='h-[calc(100%-53px)] overflow-y-auto'>
              <StudioSidebar
                onNavigate={onCloseDrawer}
                className='border-r-0'
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
