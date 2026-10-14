import { API_URL_V2 } from '@/constants/api';
import { requestCache } from '@/lib/requestCache';
import { GetMetaFeedBlogs, MetaBlog } from '@/services/blog/blogTypes';

function normalizeTopicPost(value: unknown): MetaBlog | null {
  if (!value || typeof value !== 'object') return null;
  const post = value as Partial<MetaBlog>;
  if (typeof post.blog_id !== 'string' || typeof post.title !== 'string') {
    return null;
  }
  return {
    blog_id: post.blog_id,
    title: post.title,
    first_image: typeof post.first_image === 'string' ? post.first_image : '',
    first_paragraph:
      typeof post.first_paragraph === 'string' ? post.first_paragraph : '',
    owner_account_id:
      typeof post.owner_account_id === 'string' ? post.owner_account_id : '',
    published_time:
      typeof post.published_time === 'string' ? post.published_time : '',
    tags: Array.isArray(post.tags)
      ? post.tags.filter((tag): tag is string => typeof tag === 'string')
      : [],
    like_count:
      typeof post.like_count === 'number' ? post.like_count : undefined,
    bookmark_count:
      typeof post.bookmark_count === 'number' ? post.bookmark_count : undefined,
    content_type:
      typeof post.content_type === 'string' ? post.content_type : undefined,
  };
}

export const fetchTopicPosts = requestCache(
  async (topic: string): Promise<GetMetaFeedBlogs> => {
    if (!topic || !API_URL_V2) return { blogs: [], total_blogs: 0 };
    try {
      const response = await fetch(`${API_URL_V2}/blog/meta-feed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: [topic] }),
        next: { revalidate: 3600 },
      });
      if (!response.ok) return { blogs: [], total_blogs: 0 };
      const data = (await response.json()) as Partial<GetMetaFeedBlogs>;
      const blogs = Array.isArray(data.blogs)
        ? data.blogs
            .map(normalizeTopicPost)
            .filter((post): post is MetaBlog => post !== null)
        : [];
      return {
        blogs,
        total_blogs:
          typeof data.total_blogs === 'number'
            ? data.total_blogs
            : blogs.length,
      };
    } catch {
      return { blogs: [], total_blogs: 0 };
    }
  }
);
