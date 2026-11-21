type QueryId = string | null | undefined;
type Viewer = string | null;

// Omitting a viewer preserves public hydration and invalidation prefixes.
const scoped = <T extends readonly unknown[]>(key: T, viewer?: Viewer) =>
  viewer == null ? key : ([...key, { viewer }] as const);

const personal = <T extends readonly unknown[]>(key: T, viewer?: Viewer) =>
  viewer === undefined ? key : ([...key, { viewer }] as const);

const blogRoot = ['blog'] as const;

const blogById = (blogId: QueryId) => [...blogRoot, blogId] as const;

const blogInteractionRoot = (blogId: QueryId) =>
  [...blogById(blogId), 'interaction'] as const;

const eventRoot = ['events'] as const;
const eventAttendees = (slug: QueryId) =>
  [...eventRoot, 'attendees', slug] as const;

const groupRoot = ['groups'] as const;

export const queryKeys = {
  auth: { session: () => ['auth'] as const },
  profile: {
    image: (username: QueryId) => ['profile-image', username] as const,
    byUsername: (username: QueryId) => ['current-user', username] as const,
    byAccount: (accountId: QueryId) =>
      ['user-profile-info', accountId] as const,
    authenticated: (username: QueryId, viewer?: Viewer) =>
      scoped(['user', username] as const, viewer),
    connectionCount: (username?: string) =>
      username === undefined
        ? (['connection-count'] as const)
        : (['connection-count', username] as const),
    followers: (viewer: Viewer) => ['followers', viewer] as const,
    following: (viewer: Viewer) => ['following', viewer] as const,
    followStatus: (username: QueryId, viewer?: Viewer) =>
      scoped(['is-following-user', username] as const, viewer),
    topics: (viewer?: Viewer) =>
      viewer === undefined
        ? (['profile-topics'] as const)
        : (['profile-topics', viewer] as const),
    activities: (username: QueryId) => ['user-activities', username] as const,
    activeUsers: (range: string) => ['active-users', range] as const,
    addresses: (viewer?: Viewer) =>
      viewer === undefined
        ? (['user-addresses'] as const)
        : (['user-addresses', viewer] as const),
    verification: (viewer?: Viewer) =>
      viewer === undefined
        ? (['verification', 'me'] as const)
        : (['verification', 'me', viewer] as const),
  },
  topics: {
    all: () => ['all-topics'] as const,
    categories: () => ['all-categories'] as const,
  },
  notifications: {
    list: (viewer?: Viewer) =>
      viewer === undefined
        ? (['notifications'] as const)
        : (['notifications', viewer] as const),
  },
  search: {
    people: (q: string, limit: number, offset: number) =>
      ['search-people-v2', q, limit, offset] as const,
    blogs: (q: string, limit: number, cursor: string) =>
      ['search-blogs-v2', q, limit, cursor] as const,
    suggest: (q: string, limit: number) =>
      ['search-suggest-v2', q, limit] as const,
  },
  landing: {
    discussions: () => ['discussions', 'landing', 'public'] as const,
    groups: () => ['groups', 'landing', 'public'] as const,
  },
  discussions: {
    preview: (target: unknown, timezone?: string) =>
      ['discussion-link-preview', target, timezone] as const,
    following: (viewer?: string) =>
      viewer === undefined
        ? (['following-discussions'] as const)
        : (['following-discussions', viewer] as const),
  },
  blog: {
    all: blogRoot,
    homepageRoot: () => ['meta-feed-blogs', 'homepage'] as const,
    homepage: (
      sort: 'latest' | 'trending',
      limit: number,
      offset: number,
      version: string
    ) =>
      [
        'meta-feed-blogs',
        'homepage',
        'public',
        version,
        sort,
        limit,
        offset,
      ] as const,
    byId: blogById,
    detail: (blogId: QueryId) => ['blog-detail', blogId] as const,
    published: (account: QueryId, blogId: QueryId) =>
      ['published-blog-detail', account, blogId] as const,
    byUsername: (username: QueryId, limit?: number, offset?: number) =>
      limit === undefined
        ? (['blogs-by-username', username] as const)
        : (['blogs-by-username', username, limit, offset] as const),
    drafts: {
      all: () => ['all-draft-blogs'] as const,
      list: (viewer: Viewer, limit: number, offset: number) =>
        ['all-draft-blogs', viewer, limit, offset] as const,
      detail: (blogId: QueryId, viewer?: Viewer) =>
        scoped(['draft-blog-detail', blogId] as const, viewer),
      publicationGroup: (username: QueryId, slug: QueryId) =>
        ['draft-publication-group', username, slug] as const,
    },
    scheduled: {
      all: () => ['all-scheduled-blogs'] as const,
      list: (viewer: Viewer, limit: number, offset: number) =>
        ['all-scheduled-blogs', viewer, limit, offset] as const,
    },
    followingAuthors: (viewer: Viewer) =>
      ['following-authors-blogs', viewer] as const,
    followingFeed: (viewer?: string, limit?: number, offset?: number) =>
      limit === undefined
        ? (['following-feed-blogs'] as const)
        : (['following-feed-blogs', viewer, limit, offset] as const),
    latest: (limit: number) => ['latest-100-blogs', limit] as const,
    meta: (limit: number) => ['meta-feed-blogs', limit] as const,
    trending: () => ['trending-blogs'] as const,
    tags: (username: QueryId) => ['user-tags', username] as const,
    category: (category: QueryId, limit: number) =>
      ['category-blogs', category, limit] as const,
    likes: {
      status: (blogId: QueryId, viewer?: Viewer) =>
        personal(
          [...blogInteractionRoot(blogId), 'like-status'] as const,
          viewer
        ),
      count: (blogId: QueryId) =>
        [...blogInteractionRoot(blogId), 'likes-count'] as const,
    },
    bookmarks: {
      lists: () => ['bookmarked-blogs'] as const,
      list: (viewer: Viewer, limit: number, offset: number) =>
        ['bookmarked-blogs', viewer, limit, offset] as const,
      status: (blogId: QueryId, viewer?: Viewer) =>
        personal(
          [...blogInteractionRoot(blogId), 'bookmark-status'] as const,
          viewer
        ),
      count: (blogId: QueryId) =>
        [...blogInteractionRoot(blogId), 'bookmarks-count'] as const,
    },
  },
  events: {
    all: eventRoot,
    list: (
      filters: Record<string, string | number | undefined>,
      viewer?: Viewer
    ) => scoped([...eventRoot, 'list', filters] as const, viewer),
    user: (
      username: QueryId,
      filters: Record<string, string | number | undefined> = {},
      viewer?: Viewer
    ) => scoped([...eventRoot, 'user', username, filters] as const, viewer),
    group: (
      slug: QueryId,
      filters: Record<string, string | number | undefined> = {},
      viewer?: Viewer
    ) => scoped([...eventRoot, 'group', slug, filters] as const, viewer),
    attending: [...eventRoot, 'attending'] as const,
    attendingList: (viewer: Viewer, filters: Record<string, unknown> = {}) =>
      [...eventRoot, 'attending', viewer, filters] as const,
    detail: (slug: QueryId, viewer?: Viewer) =>
      scoped([...eventRoot, 'detail', slug] as const, viewer),
    comments: (slug: QueryId, offset = 0, viewer?: Viewer) =>
      scoped([...eventRoot, 'comments', slug, offset] as const, viewer),
    attendees: eventAttendees,
    attendeePage: (
      slug: QueryId,
      params: { limit?: number; offset?: number; status?: string },
      viewer?: Viewer
    ) => scoped([...eventAttendees(slug), params] as const, viewer),
    coupons: (slug: QueryId, viewer?: Viewer) =>
      scoped([...eventRoot, 'coupons', slug] as const, viewer),
    photos: (slug: QueryId) => [...eventRoot, 'photos', slug] as const,
  },
  groups: {
    all: groupRoot,
    list: (filters: Record<string, unknown>, viewer?: Viewer) =>
      scoped([...groupRoot, 'list', filters] as const, viewer),
    user: (
      username: QueryId,
      filters: Record<string, unknown> = {},
      viewer?: Viewer
    ) => scoped([...groupRoot, 'user', username, filters] as const, viewer),
    detail: (slug: QueryId, viewer?: Viewer) =>
      scoped([...groupRoot, 'detail', slug] as const, viewer),
    members: (
      slug: QueryId,
      params: Record<string, unknown> = {},
      viewer?: Viewer
    ) => scoped([...groupRoot, 'members', slug, params] as const, viewer),
    blogs: (slug: QueryId, params: Record<string, unknown> = {}) =>
      [...groupRoot, 'blogs', slug, params] as const,
    invites: (slug: QueryId, viewer?: Viewer) =>
      scoped([...groupRoot, 'invites', slug] as const, viewer),
  },
} as const;
