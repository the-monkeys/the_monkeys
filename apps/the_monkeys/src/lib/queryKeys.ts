type QueryId = string | undefined;

const blogRoot = ['blog'] as const;
const authRoot = ['auth'] as const;

const blogById = (blogId: QueryId) => [...blogRoot, blogId] as const;

const blogInteractionRoot = (blogId: QueryId) =>
  [...blogById(blogId), 'interaction'] as const;

const eventRoot = ['events'] as const;

const groupRoot = ['groups'] as const;

export const queryKeys = {
  auth: {
    session: authRoot,
  },
  blog: {
    all: blogRoot,
    byId: blogById,
    metaFeed: (limit: number) => ['meta-feed-blogs', limit] as const,
    trending: ['trending-blogs'] as const,
    latest: (limit: number) => ['latest-100-blogs', limit] as const,
    followingFeedRoot: ['following-feed-blogs'] as const,
    followingFeed: (accountId: QueryId, limit: number, offset: number) =>
      ['following-feed-blogs', accountId, limit, offset] as const,
    followingAuthorsRoot: ['following-authors-blogs'] as const,
    followingAuthors: (accountId: QueryId) =>
      ['following-authors-blogs', accountId] as const,
    publishedByUsername: (username: QueryId, limit: number, offset: number) =>
      ['blogs-by-username', username, limit, offset] as const,
    publishedByUsernameRoot: (username: QueryId) =>
      ['blogs-by-username', username] as const,
    publishedDetail: (accountId: QueryId, blogId: QueryId) =>
      ['published-blog-detail', accountId, blogId] as const,
    publishedDetailById: (blogId: QueryId) => ['blog-detail', blogId] as const,
    draftDetail: (accountId: QueryId, blogId: QueryId) =>
      ['draft-blog-detail', accountId, blogId] as const,
    drafts: {
      all: ['all-draft-blogs'] as const,
      forAccount: (accountId: QueryId) =>
        ['all-draft-blogs', accountId] as const,
      page: (accountId: QueryId, limit: number, offset: number) =>
        ['all-draft-blogs', accountId, limit, offset] as const,
    },
    scheduled: {
      all: ['all-scheduled-blogs'] as const,
      forAccount: (accountId: QueryId) =>
        ['all-scheduled-blogs', accountId] as const,
      page: (accountId: QueryId, limit: number, offset: number) =>
        ['all-scheduled-blogs', accountId, limit, offset] as const,
    },
    savedBlogs: {
      all: ['bookmarked-blogs'] as const,
      forAccount: (accountId: QueryId) =>
        ['bookmarked-blogs', accountId] as const,
      page: (accountId: QueryId, limit: number, offset: number) =>
        ['bookmarked-blogs', accountId, limit, offset] as const,
    },
    userTags: (username: QueryId) => ['user-tags', username] as const,
    category: (category: QueryId, limit: number) =>
      ['category-blogs', category, limit] as const,
    likes: {
      status: (blogId: QueryId, viewerId: QueryId) =>
        [...blogInteractionRoot(blogId), 'like-status', viewerId] as const,
      count: (blogId: QueryId) =>
        [...blogInteractionRoot(blogId), 'likes-count'] as const,
    },
    bookmarks: {
      status: (blogId: QueryId, viewerId: QueryId) =>
        [...blogInteractionRoot(blogId), 'bookmark-status', viewerId] as const,
      count: (blogId: QueryId) =>
        [...blogInteractionRoot(blogId), 'bookmarks-count'] as const,
    },
  },
  events: {
    all: eventRoot,
    list: (filters: Record<string, string | number | undefined>) =>
      [...eventRoot, 'list', filters] as const,
    user: (
      username: QueryId,
      filters: Record<string, string | number | undefined> = {}
    ) => [...eventRoot, 'user', username, filters] as const,
    group: (
      slug: QueryId,
      filters: Record<string, string | number | undefined> = {}
    ) => [...eventRoot, 'group', slug, filters] as const,
    attending: [...eventRoot, 'attending'] as const,
    detail: (slug: QueryId) => [...eventRoot, 'detail', slug] as const,
    comments: (slug: QueryId, offset = 0) =>
      [...eventRoot, 'comments', slug, offset] as const,
    attendees: (slug: QueryId) => [...eventRoot, 'attendees', slug] as const,
    coupons: (slug: QueryId) => [...eventRoot, 'coupons', slug] as const,
    photos: (slug: QueryId) => [...eventRoot, 'photos', slug] as const,
  },
  groups: {
    all: groupRoot,
    list: (filters: Record<string, unknown>) =>
      [...groupRoot, 'list', filters] as const,
    user: (username: QueryId, filters: Record<string, unknown> = {}) =>
      [...groupRoot, 'user', username, filters] as const,
    detail: (slug: QueryId) => [...groupRoot, 'detail', slug] as const,
    members: (slug: QueryId, params: Record<string, unknown> = {}) =>
      [...groupRoot, 'members', slug, params] as const,
    blogs: (slug: QueryId, params: Record<string, unknown> = {}) =>
      [...groupRoot, 'blogs', slug, params] as const,
    invites: (slug: QueryId) => [...groupRoot, 'invites', slug] as const,
  },
  user: {
    currentProfile: (username: QueryId) => ['current-user', username] as const,
    authenticatedProfile: (username: QueryId) => ['user', username] as const,
    publicProfileById: (userId: QueryId) =>
      ['user-profile-info', userId] as const,
    profileImage: (username: QueryId) => ['profile-image', username] as const,
    connectionCount: (username: QueryId) =>
      ['connection-count', username] as const,
    connectionCountRoot: ['connection-count'] as const,
    followers: (accountId: QueryId) => ['followers', accountId] as const,
    following: (accountId: QueryId) => ['following', accountId] as const,
    followStatusRoot: ['is-following-user'] as const,
    followStatus: (viewerId: QueryId, username: QueryId) =>
      ['is-following-user', viewerId, username] as const,
    profileTopics: (accountId: QueryId) =>
      ['profile-topics', accountId] as const,
    activities: (username: QueryId) => ['user-activities', username] as const,
    activeUsers: (timeRange: string) => ['active-users', timeRange] as const,
  },
  topics: {
    all: ['all-topics'] as const,
  },
  categories: {
    all: ['all-categories'] as const,
  },
  notifications: {
    all: ['notifications'] as const,
    forAccount: (accountId: QueryId) => ['notifications', accountId] as const,
  },
  search: {
    people: (query: string, limit: number, offset: number) =>
      ['search-people-v2', query, limit, offset] as const,
    blogs: (query: string, limit: number, c: string) =>
      ['search-blogs-v2', query, limit, c] as const,
    suggestions: (query: string, limit: number) =>
      ['search-suggest-v2', query, limit] as const,
  },
  verification: {
    mine: (accountId: QueryId) => ['verification', 'me', accountId] as const,
  },
  cards: {
    userAddresses: (accountId: QueryId) =>
      ['user-addresses', accountId] as const,
  },
} as const;
