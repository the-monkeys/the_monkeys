'use client';

import { useCallback, useMemo } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type PaginationOptions = {
  /** URL query param name. Defaults to "page". */
  paramName?: string;
};

type PaginationReturn = {
  /** Current 0-based page index */
  page: number;
  /** 1-based page number (matches the URL value) */
  pageNumber: number;
  next: () => void;
  prev: () => void;
  /** Navigate to a specific 1-based page number */
  jump: (pageNumber: number) => void;
  /** Reset to the first page */
  reset: () => void;
};

/**
 * ref: https://nextjs.org/docs/app/api-reference/functions/use-search-params
 * Convention:
 *   - URL param is 1-based  (?page=1 → first page)
 *   - `page` returned is 0-based  (page === 0 → first page)
 *   - `pageNumber` returned is 1-based (mirrors the URL)
 *
 * @example
 * const { page, next, prev } = usePagination({ paramName: 'blogPage' });
 */
export function usePagination(
  options: PaginationOptions = {}
): PaginationReturn {
  const { paramName = 'page' } = options;

  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const page = useMemo(() => {
    const raw = Number(searchParams.get(paramName)) - 1; // 1-based URL -> 0-based internal
    const parsed = Number.isFinite(raw) && raw >= 0 ? Math.floor(raw) : 0;
    return parsed;
  }, [searchParams, paramName]);

  const buildUrl = useCallback(
    (zeroBasedPage: number): string => {
      const params = new URLSearchParams(searchParams.toString());

      if (zeroBasedPage === 0) {
        // Keep URLs clean — drop the param on the first page
        params.delete(paramName);
      } else {
        params.set(paramName, (zeroBasedPage + 1).toString()); // 0-based internal -> 1-based URL
      }

      const query = params.toString();
      return query ? `${pathName}?${query}` : pathName;
    },
    [searchParams, pathName, paramName]
  );

  const navigate = useCallback(
    (zeroBasedPage: number) => {
      const target = Math.max(0, Math.floor(zeroBasedPage));
      if (target === page) return; // no-op guard
      router.push(buildUrl(target));
    },
    [page, router, buildUrl]
  );

  const next = useCallback(() => {
    navigate(page + 1);
  }, [page, navigate]);

  const prev = useCallback(() => {
    navigate(page - 1);
  }, [page, navigate]);

  const jump = useCallback(
    (pageNumber: number) => {
      navigate(pageNumber - 1);
    },
    [navigate]
  );

  const reset = useCallback(() => navigate(0), [navigate]);

  return {
    page,
    pageNumber: page + 1,
    next,
    prev,
    jump,
    reset,
  };
}
