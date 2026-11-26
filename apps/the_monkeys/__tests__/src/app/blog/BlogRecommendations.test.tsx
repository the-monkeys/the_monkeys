import { BlogRecommendations } from '@/app/blog/components/BlogRecommendations';
import axios from '@/services/api/axiosInstanceNoAuthV2';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/services/api/axiosInstanceNoAuthV2', () => ({
  default: { post: vi.fn() },
}));
vi.mock('@/components/cards/blog/TrendingBlogCard', () => ({
  TrendingBlogCardSmall: ({
    blog,
  }: {
    blog: { blog_id: string; title: string };
  }) => <a href={`/blog/${blog.blog_id}`}>{blog.title}</a>,
}));
vi.mock('@/components/skeletons/blogSkeleton', () => ({
  BlogPageRecommendationSkeleton: () => <div>Loading related posts</div>,
}));
const post = {
  blog_id: 'related',
  title: 'JavaScript engine guide',
  tags: ['JavaScript'],
  published_time: '2026-01-01T00:00:00Z',
  owner_account_id: 'author',
  first_image: '',
  first_paragraph: '',
};
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
describe('existing related article panel', () => {
  it('includes real article links in initial HTML using the existing card grid', () => {
    const html = renderToStaticMarkup(
      <BlogRecommendations
        blogId='current'
        topics={['JavaScript']}
        initialBlogs={[post]}
      />
    );
    expect(html).toContain('href="/blog/related"');
    expect(html).toContain('grid grid-cols-2 lg:grid-cols-3 gap-8');
    expect(html).not.toContain('Loading related posts');
  });
  it('does not make a duplicate request for server-provided results', () => {
    render(
      <BlogRecommendations
        blogId='current'
        topics={['JavaScript']}
        initialBlogs={[post]}
      />
    );
    expect(screen.getByRole('link').textContent).toBe(post.title);
    expect(axios.post).not.toHaveBeenCalled();
  });
  it('keeps the old client-only caller working and filters private records', async () => {
    vi.mocked(axios.post).mockResolvedValueOnce({
      data: {
        blogs: [post, { ...post, blog_id: 'private', audience: 'group_only' }],
      },
    });
    render(<BlogRecommendations blogId='current' topics={['JavaScript']} />);
    await waitFor(() => expect(screen.getAllByRole('link')).toHaveLength(1));
  });
  it('refreshes legacy callers when the current article changes', async () => {
    vi.mocked(axios.post)
      .mockResolvedValueOnce({ data: { blogs: [post] } })
      .mockResolvedValueOnce({
        data: {
          blogs: [{ ...post, blog_id: 'go', title: 'Go guide', tags: ['Go'] }],
        },
      });
    const { rerender } = render(
      <BlogRecommendations blogId='first' topics={['JavaScript']} />
    );
    await screen.findByText(post.title);
    rerender(<BlogRecommendations blogId='second' topics={['Go']} />);
    await screen.findByText('Go guide');
  });
});
