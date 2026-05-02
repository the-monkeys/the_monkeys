'use client';

import { usePathname, useSearchParams } from 'next/navigation';

import {
  ACTIVITY_ROUTE,
  FEED_ROUTE,
  HOME_ROUTE,
} from '@/constants/routeConstants';

const pathMatches = (pathname: string, hrefPath: string): boolean => {
  if (hrefPath === HOME_ROUTE)
    return pathname === HOME_ROUTE || pathname === FEED_ROUTE;
  if (hrefPath === ACTIVITY_ROUTE) return pathname.startsWith(ACTIVITY_ROUTE);
  return pathname === hrefPath || pathname.startsWith(`${hrefPath}/`);
};

/**
 * Returns a function that checks whether a given href is the active route.
 * Handles query-string-bearing hrefs: they are never considered active.
 */
export function useActiveRoute() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (href: string): boolean => {
    const [path, query] = href.split('?');
    if (!path || !pathMatches(pathname, path)) return false;
    return !query;
  };
}
