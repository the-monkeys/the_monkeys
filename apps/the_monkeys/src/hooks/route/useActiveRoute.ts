'use client';

import { usePathname } from 'next/navigation';

const pathMatches = (pathname: string, hrefPath: string): boolean => {
  return pathname === hrefPath || pathname.startsWith(`${hrefPath}/`);
};

/**
 * Returns a function that checks whether a given href is the active route.
 * Handles query-string-bearing hrefs: they are never considered active.
 */
export function useActiveRoute() {
  const pathname = usePathname();

  return (href: string): boolean => {
    const [path, query] = href.split('?');
    if (!path || !pathMatches(pathname, path)) return false;
    return !query;
  };
}
