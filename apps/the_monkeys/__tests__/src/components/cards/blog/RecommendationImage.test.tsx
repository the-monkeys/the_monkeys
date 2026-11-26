/* eslint-disable @next/next/no-img-element -- Native img is the test double for Next Image. */
import { TrendingBlogCardSmall } from '@/components/cards/blog/TrendingBlogCard';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/image', () => ({
  default: ({ priority, quality, sizes, ...props }: any) => (
    <img
      alt={props.alt}
      {...props}
      loading={priority ? 'eager' : 'lazy'}
      data-quality={quality}
      sizes={sizes}
    />
  ),
}));
vi.mock('@/components/user/userInfo', () => ({
  UserInfoCardShowcase: () => null,
}));
vi.mock('@/components/blog/actions/BlogShareDialog', () => ({
  BlogShareDialog: () => null,
}));
afterEach(cleanup);
describe('recommendation image delivery', () => {
  it('keeps the current layout while lazily loading a responsive compressed image', () => {
    const { container } = render(
      <TrendingBlogCardSmall
        blog={{
          blog_id: 'example',
          title: 'An engine diagram',
          tags: ['JavaScript'],
          first_image: '/api/v2/storage/posts/example/diagram.png',
          first_paragraph: 'An explanation.',
          published_time: '2026-01-01T00:00:00Z',
          owner_account_id: 'author',
        }}
      />
    );
    const image = screen.getByRole('img');
    expect(image.getAttribute('alt')).toBe('An engine diagram');
    expect(image.getAttribute('loading')).toBe('lazy');
    expect(image.getAttribute('data-quality')).toBe('80');
    expect(image.getAttribute('sizes')).toBe(
      '(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw'
    );
    expect(container.querySelector('article')?.className).toContain(
      'h-full w-full flex flex-col gap-4'
    );
  });
});
