'use client';

import { useEffect, useRef } from 'react';

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

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  ).filter(
    (el) =>
      !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true'
  );
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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const prevOpenRef = useRef(isDrawerOpen);

  // Restore focus to trigger button when drawer closes
  useEffect(() => {
    if (prevOpenRef.current && !isDrawerOpen) {
      triggerRef.current?.focus();
    } else if (!prevOpenRef.current && isDrawerOpen) {
      const timer = setTimeout(() => {
        if (drawerRef.current) {
          const focusable = getFocusableElements(drawerRef.current);
          if (focusable.length > 0) {
            focusable[0].focus();
          }
        }
      }, 0);
      return () => clearTimeout(timer);
    }
    prevOpenRef.current = isDrawerOpen;
  }, [isDrawerOpen]);

  // Escape key listener & focus trapping
  useEffect(() => {
    if (!isDrawerOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onCloseDrawer();
        return;
      }

      if (e.key === 'Tab') {
        if (!drawerRef.current) return;
        const focusableElements = getFocusableElements(drawerRef.current);
        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (
            document.activeElement === firstElement ||
            !drawerRef.current.contains(document.activeElement)
          ) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (
            document.activeElement === lastElement ||
            !drawerRef.current.contains(document.activeElement)
          ) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, onCloseDrawer]);

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
          ref={triggerRef}
          type='button'
          onClick={onOpenDrawer}
          aria-label='Open full studio menu'
          aria-expanded={isDrawerOpen}
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
          ref={drawerRef}
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
