import { API_URL_V2 } from '@/constants/api';
import { normalizePublicPosts } from '@/lib/publicPostMetadata';
import { requestCache } from '@/lib/requestCache';
import { GetMetaFeedBlogs } from '@/services/blog/blogTypes';

export const fetchTopicPosts = requestCache(
  async (topic: string): Promise<GetMetaFeedBlogs> => {
    if (!topic) return { blogs: [], total_blogs: 0 };
    if (!API_URL_V2) throw new Error('Topic post API is not configured');
    const response = await fetch(`${API_URL_V2}/blog/meta-feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tags: [topic] }),
      next: { revalidate: 300 },
    });
    if (!response.ok)
      throw new Error(
        `Topic post request failed with status ${response.status}`
      );
    const data = (await response.json()) as Partial<GetMetaFeedBlogs>;
    if (!data || (data.blogs !== null && !Array.isArray(data.blogs))) {
      throw new Error('Topic post request returned an invalid post list');
    }
    const ids = new Set<string>();
    const blogs = normalizePublicPosts(data).filter((post) => {
      if (ids.has(post.blog_id)) return false;
      ids.add(post.blog_id);
      return true;
    });
    return {
      blogs,
      total_blogs:
        typeof data.total_blogs === 'number' &&
        Number.isFinite(data.total_blogs) &&
        data.total_blogs >= 0
          ? data.total_blogs
          : blogs.length,
    };
  }
);
