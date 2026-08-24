type QueryId = string | undefined;

const blogRoot = ['blog'] as const;

const blogById = (blogId: QueryId) => [...blogRoot, blogId] as const;

const blogInteractionRoot = (blogId: QueryId) =>
  [...blogById(blogId), 'interaction'] as const;

const eventRoot = ['events'] as const;

const groupRoot = ['groups'] as const;

export const queryKeys = {
  blog: {
    all: blogRoot,
    byId: blogById,
    likes: {
      status: (blogId: QueryId) =>
        [...blogInteractionRoot(blogId), 'like-status'] as const,
      count: (blogId: QueryId) =>
        [...blogInteractionRoot(blogId), 'likes-count'] as const,
    },
    bookmarks: {
      status: (blogId: QueryId) =>
        [...blogInteractionRoot(blogId), 'bookmark-status'] as const,
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
    invites: (slug: QueryId) => [...groupRoot, 'invites', slug] as const,
  },
} as const;
