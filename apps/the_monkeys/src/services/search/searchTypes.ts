// ---------------------------------------------------------------------------
// Search v2 (Phase 4) — wire types for the new gateway endpoints
//
//   GET /api/v2/user/search           ← people search, ranked + Active-only
//   GET /api/v2/blog/search/v2        ← blog search, function_score + highlights
//   GET /api/v2/search/suggest        ← title autocomplete
//
// Shapes mirror what the Go gateway emits exactly. Keep them as plain
// types (not classes) so React Query's structural sharing keeps working.
// ---------------------------------------------------------------------------

export interface SearchUserV2 {
  account_id: string;
  username: string;
  first_name: string;
  last_name: string;
  bio: string;
  avatar_url: string;
}

export interface SearchUsersV2Response {
  users: SearchUserV2[] | null;
  limit: number;
  offset: number;
}

/**
 * Highlight fragments returned by ES, wrapped in `<mark>` tags. We must
 * sanitise these before rendering — the gateway uses ES's `html` encoder
 * so attacker-controlled content in the source is escaped, but we still
 * never trust this map and pipe it through DOMPurify on the client.
 */
export type SearchHighlightMap = Partial<
  Record<'title' | 'summary' | 'body', string[]>
>;

export interface SearchBlogHit {
  blog_id: string;
  title?: string;
  summary?: string;
  slug?: string;
  author_username?: string;
  author_display_name?: string;
  owner_account_id?: string;
  published_time?: string;
  like_count: number;
  view_count: number;
  tags?: string[];
  highlight?: SearchHighlightMap;
  score: number;
}

export interface SearchBlogsV2Response {
  hits: SearchBlogHit[];
  next_cursor?: string;
  took_ms: number;
  total: number;
}

export interface SearchSuggestResponse {
  hits: Pick<
    SearchBlogHit,
    'blog_id' | 'title' | 'slug' | 'author_username' | 'published_time'
  >[];
}
