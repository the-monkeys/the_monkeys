import { GetMetaFeedBlogs } from '@/services/blog/blogTypes';
import { create } from 'zustand';

type BlogStore = {
  blogCache: Map<string, GetMetaFeedBlogs>;
  setBlogCache: (query: string, blogs: GetMetaFeedBlogs) => void;
  clearBlogCache: () => void;
};

const MAX_CACHE_SIZE = 15;

export const useBlogStore = create<BlogStore>((set) => ({
  blogCache: new Map(),

  setBlogCache: (query, blogs) =>
    set((state) => {
      const newCache = new Map(state.blogCache);
      newCache.set(query, blogs);

      if (newCache.size > MAX_CACHE_SIZE) {
        const oldestKey = newCache.keys().next().value;
        oldestKey && newCache.delete(oldestKey);
      }

      return { blogCache: newCache };
    }),

  clearBlogCache: () => set({ blogCache: new Map() }),
}));
