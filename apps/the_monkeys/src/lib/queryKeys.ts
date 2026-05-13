type QueryId = string | undefined;

const blogRoot = ['blog'] as const;

const blogById = (blogId: QueryId) => [...blogRoot, blogId] as const;

const blogInteractionRoot = (blogId: QueryId) =>
  [...blogById(blogId), 'interaction'] as const;

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
} as const;
