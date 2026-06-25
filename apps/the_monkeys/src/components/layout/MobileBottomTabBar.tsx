'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import Icon, { IconName } from '@/components/icon';
import {
  BOOKMARK_ROUTE,
  EXPLORE_TOPICS_ROUTE,
  HOME_ROUTE,
} from '@/constants/routeConstants';
import useAuth from '@/hooks/auth/useAuth';
import { cn } from '@/lib/utils';

type Tab = {
  href: string;
  label: string;
  icon: IconName;
  match: (pathname: string) => boolean;
  requiresAuth?: boolean;
};

const tabs: Tab[] = [
  {
    href: HOME_ROUTE,
    label: 'Home',
    icon: 'RiNewspaper',
    match: (p) => p === '/' || p === '/feed',
  },
  {
    href: EXPLORE_TOPICS_ROUTE,
    label: 'Explore',
    icon: 'RiCompass',
    match: (p) => p.startsWith('/topics'),
  },
  {
    href: '#',
    label: 'Create',
    icon: 'RiAdd',
    match: (p) => p.startsWith('/edit'),
    requiresAuth: true,
  },
  {
    href: BOOKMARK_ROUTE,
    label: 'Saved',
    icon: 'RiBookmark',
    match: (p) => p.startsWith('/library'),
    requiresAuth: true,
  },
  {
    href: '/settings',
    label: 'Profile',
    icon: 'RiUser',
    match: (p) => p.startsWith('/settings'),
    requiresAuth: true,
  },
];

/**
 * Fixed bottom tab bar for mobile/tablet. Hidden on lg+ where the left
 * Sidebar takes over. Routes that require auth fall back to login.
 */
export function MobileBottomTabBar() {
  const pathname = usePathname() ?? '';
  const { data: session } = useAuth();

  // Hide on auth, blog reading, and editor routes (immersive surfaces)
  if (
    pathname.startsWith('/auth') ||
    (pathname.startsWith('/blog/') && pathname !== '/blog') ||
    pathname.startsWith('/edit')
  ) {
    return null;
  }

  return (
    <nav
      className='lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border-light dark:border-border-dark/60 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur supports-[backdrop-filter]:bg-background-light/80'
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label='Primary'
    >
      <ul className='grid grid-cols-5'>
        {tabs.map((tab) => {
          const active = tab.match(pathname);
          const href = tab.requiresAuth && !session ? '/auth/login' : tab.href;
          const handleTabClick = (e: React.MouseEvent, tab: Tab) => {
            if (tab.label === 'Create') {
              e.preventDefault();
              const blogId = Math.random().toString(36).substring(7);
              window.location.href = `/edit/${blogId}?isNew=true`;
              return;
            }
          };

          return (
            <li key={tab.label} className='flex'>
              <Link
                href={href}
                onClick={(e) => handleTabClick(e, tab)}
                className={cn(
                  'flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-inter font-semibold uppercase tracking-[0.12em] transition-colors',
                  active
                    ? 'text-brand-orange'
                    : 'text-gray-500 dark:text-gray-400 hover:text-text-light dark:hover:text-text-dark'
                )}
                aria-current={active ? 'page' : undefined}
              >
                <Icon name={tab.icon} size={22} />
                <span>{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default MobileBottomTabBar;
