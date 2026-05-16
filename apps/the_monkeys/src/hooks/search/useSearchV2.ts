import { fetcherV2 } from '@/services/fetcher';
import {
  SearchBlogsV2Response,
  SearchSuggestResponse,
  SearchUsersV2Response,
} from '@/services/search/searchTypes';
import { useQuery } from '@tanstack/react-query';

// React Query keys for the search-v2 endpoints. Exported so callers
// can call `queryClient.invalidateQueries({ queryKey: [SEARCH_BLOGS_V2_KEY] })`
// after a publish without having to know the param shape.
export const SEARCH_BLOGS_V2_KEY = 'search-blogs-v2';
export const SEARCH_PEOPLE_V2_KEY = 'search-people-v2';
export const SEARCH_SUGGEST_KEY = 'search-suggest-v2';

// Server caps these too (gateway hard caps people=50, blogs=50,
// suggest=10). Mirroring them here means the client never asks for
// something the server will silently clamp — keeps query keys stable
// across "limit=200" vs "limit=50" callers.
const PEOPLE_LIMIT_MAX = 50;
const BLOGS_LIMIT_MAX = 50;
const SUGGEST_LIMIT_MAX = 10;

// Empirically chosen so a fast typist (5 keystrokes/sec) issues at
// most ~4 requests per word. The gateway rate limit is 30 req/s on
// the search routes; this keeps a single user well clear of it.
const SEARCH_STALE_MS = 30 * 1000;

// ---------------------------------------------------------------------------
// People search (Phase 1 backend, Phase 4 frontend)
// ---------------------------------------------------------------------------

export interface UseSearchPeopleArgs {
  query?: string;
  limit?: number;
  offset?: number;
  enabled?: boolean;
}

/**
 * Hits `GET /api/v2/user/search`. Server-side: ranked (exact > prefix >
 * trigram similarity), active-only, 500 ms deadline, Redis-cached.
 *
 * Returns `enabled: false` for empty queries so React Query never
 * fires a request for an empty input — cheaper than a server-side 400.
 */
export const useSearchPeopleV2 = ({
  query,
  limit = 10,
  offset = 0,
  enabled = true,
}: UseSearchPeopleArgs) => {
  const q = (query ?? '').trim();
  const clampedLimit = Math.min(Math.max(limit, 1), PEOPLE_LIMIT_MAX);

  const { data, isLoading, isError, error } = useQuery<
    SearchUsersV2Response,
    Error
  >({
    queryKey: [SEARCH_PEOPLE_V2_KEY, q, clampedLimit, offset],
    queryFn: () =>
      fetcherV2(
        `user/search?search_term=${encodeURIComponent(q)}&limit=${clampedLimit}&offset=${offset}`
      ),
    enabled: enabled && q.length > 0,
    staleTime: SEARCH_STALE_MS,
    // Aborted requests on unmount / key change come for free via
    // React Query 5's built-in signal handling.
  });

  return {
    users: data?.users ?? null,
    isLoading,
    isError: isError || !!error,
  };
};

// ---------------------------------------------------------------------------
// Blog search (Phase 3 backend, Phase 4 frontend)
// ---------------------------------------------------------------------------

export interface UseSearchBlogsArgs {
  query?: string;
  cursor?: string;
  limit?: number;
  enabled?: boolean;
}

/**
 * Hits `GET /api/v2/blog/search/v2`. Cursor-based pagination using the
 * opaque `next_cursor` returned by the server. We deliberately do NOT
 * expose `offset` — deep-offset paging is a known DoS vector against ES
 * and the gateway refuses it.
 */
export const useSearchBlogsV2 = ({
  query,
  cursor,
  limit = 20,
  enabled = true,
}: UseSearchBlogsArgs) => {
  const q = (query ?? '').trim();
  const clampedLimit = Math.min(Math.max(limit, 1), BLOGS_LIMIT_MAX);
  const c = cursor ?? '';

  const params = new URLSearchParams({ q, limit: String(clampedLimit) });
  if (c) params.set('cursor', c);

  const { data, isLoading, isError, error, isFetching } = useQuery<
    SearchBlogsV2Response,
    Error
  >({
    queryKey: [SEARCH_BLOGS_V2_KEY, q, clampedLimit, c],
    queryFn: () => fetcherV2(`blog/search/v2?${params.toString()}`),
    enabled: enabled && q.length > 0,
    staleTime: SEARCH_STALE_MS,
    // Keep previous page visible while we fetch the next one — avoids
    // the dropdown / results list collapsing during pagination.
    placeholderData: (prev) => prev,
  });

  return {
    hits: data?.hits ?? [],
    nextCursor: data?.next_cursor,
    totalApprox: data?.total ?? 0,
    isLoading,
    isFetching,
    isError: isError || !!error,
  };
};

// ---------------------------------------------------------------------------
// Suggest (autocomplete) — Phase 3 backend, Phase 4 frontend
// ---------------------------------------------------------------------------

/**
 * Hits `GET /api/v2/search/suggest`. Cheap, capped at 10. Server fails
 * closed (empty list) on errors so we never propagate a 5xx into the
 * typing UX. We mirror that here: callers don't need to handle errors.
 */
export const useSearchSuggest = ({
  query,
  limit = 5,
  enabled = true,
}: {
  query?: string;
  limit?: number;
  enabled?: boolean;
}) => {
  const q = (query ?? '').trim();
  const clampedLimit = Math.min(Math.max(limit, 1), SUGGEST_LIMIT_MAX);

  const { data, isLoading } = useQuery<SearchSuggestResponse, Error>({
    queryKey: [SEARCH_SUGGEST_KEY, q, clampedLimit],
    queryFn: () =>
      fetcherV2(
        `search/suggest?q=${encodeURIComponent(q)}&limit=${clampedLimit}`
      ),
    // Suggest needs at least 2 chars to be useful; matches the server's
    // suggestQueryMinLen constant.
    enabled: enabled && q.length >= 2,
    staleTime: 15 * 1000,
    placeholderData: (prev) => prev,
  });

  return {
    suggestions: data?.hits ?? [],
    isLoading,
  };
};
