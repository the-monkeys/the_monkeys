import { GetMetaFeedBlogs } from '@/services/blog/blogTypes';
import { GetUserSearchResponse } from '@/services/search/searchTypes';
import { create } from 'zustand';

type SearchStore = {
  usersCache: Map<string, GetUserSearchResponse>;
  blogsCache: Map<string, GetMetaFeedBlogs>;
  setUserSearchCache: (query: string, users: GetUserSearchResponse) => void;
  setBlogCache: (query: string, blogs: GetMetaFeedBlogs) => void;
  clearSearchCache: () => void;
};

const MAX_CACHE_SIZE = 15;

export const useSearchStore = create<SearchStore>((set) => ({
  usersCache: new Map(),

  blogsCache: new Map(),

  setUserSearchCache: (query, users) =>
    set((state) => {
      const newCache = new Map(state.usersCache);
      newCache.set(query, users);

      if (newCache.size > MAX_CACHE_SIZE) {
        const oldestKey = newCache.keys().next().value;
        oldestKey && newCache.delete(oldestKey);
      }

      return { usersCache: newCache };
    }),

  setBlogCache: (query, blogs) =>
    set((state) => {
      const newCache = new Map(state.blogsCache);
      newCache.set(query, blogs);

      if (newCache.size > MAX_CACHE_SIZE) {
        const oldestKey = newCache.keys().next().value;
        oldestKey && newCache.delete(oldestKey);
      }

      return { blogsCache: newCache };
    }),

  clearSearchCache: () => set({ blogsCache: new Map() }),
}));
