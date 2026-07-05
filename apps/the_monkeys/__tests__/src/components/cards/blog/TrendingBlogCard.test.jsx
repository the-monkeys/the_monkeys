import {
  TrendingBlogCardLarge,
  TrendingBlogCardSmall,
} from '@/components/cards/blog/TrendingBlogCard';
import { cleanup, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../../../utils';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('next/image', () => ({
  default: (props) => <img {...props} />,
}));

vi.mock('@/utils/imageUtils', () => ({
  isNonValidBannerImage: () => true,
}));

const mockBlog = {
  blog_id: 'test-blog-1',
  title: 'Test Blog Title',
  first_image: '',
  first_paragraph: 'Test description',
  like_count: 10,
  owner_account_id: 'user-1',
  published_time: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  tags: ['javascript'],
};

describe('TrendingBlogCardLarge', () => {
  afterEach(() => cleanup());

  it('Renders formatted relative time instead of raw ISO timestamp', () => {
    renderWithProviders(<TrendingBlogCardLarge blog={mockBlog} />);
    expect(screen.getByText('3 hr ago')).toBeDefined();
  });

  it('Does not render raw ISO timestamp', () => {
    renderWithProviders(<TrendingBlogCardLarge blog={mockBlog} />);
    expect(screen.queryByText(mockBlog.published_time)).toBeNull();
  });

  it('Renders the blog title', () => {
    renderWithProviders(<TrendingBlogCardLarge blog={mockBlog} />);
    expect(screen.getByText('Test Blog Title')).toBeDefined();
  });
});

describe('TrendingBlogCardSmall', () => {
  afterEach(() => cleanup());

  it('Renders formatted relative time instead of raw ISO timestamp', () => {
    renderWithProviders(<TrendingBlogCardSmall blog={mockBlog} />);
    expect(screen.getByText('3 hr ago')).toBeDefined();
  });

  it('Does not render raw ISO timestamp', () => {
    renderWithProviders(<TrendingBlogCardSmall blog={mockBlog} />);
    expect(screen.queryByText(mockBlog.published_time)).toBeNull();
  });
});
