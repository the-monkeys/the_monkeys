import { BlogsByTopic } from '@/app/topics/[topic]/components/BlogsByTopic';
import { MetaBlog } from '@/services/blog/blogTypes';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/components/cards/blog/FeedBlogCard', () => ({
  FeedBlogCard: ({ blog }: { blog: { title: string } }) => (
    <article>{blog.title}</article>
  ),
}));
vi.mock('@/services/api/axiosInstanceNoAuthV2', () => ({
  default: { post: () => new Promise(() => undefined) },
}));

const topicPost: MetaBlog = {
  blog_id: 'culture-1',
  title: 'Culture without borders',
  first_image: '/culture.jpg',
  first_paragraph: 'A story about communities across regions.',
  owner_account_id: 'author-1',
  published_time: '2026-09-14T08:00:00.000Z',
  tags: ['Culture'],
};

describe('BlogsByTopic', () => {
  it('renders server-provided posts without waiting for a browser request', () => {
    const ServerBackedBlogsByTopic = BlogsByTopic as unknown as React.FC<{
      blogs: MetaBlog[];
    }>;

    render(<ServerBackedBlogsByTopic blogs={[topicPost]} />);

    expect(screen.getByText('Culture without borders')).toBeDefined();
    expect(screen.queryByLabelText('Loading posts')).toBeNull();
  });
});
