import { SearchPosts as PageSearchPosts } from '@/app/search/components/SearchPosts';
import { SearchPosts as NavbarSearchPosts } from '@/components/search/SearchPosts';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  hits: [] as any[],
  search: new URLSearchParams(),
}));
vi.mock('next/navigation', () => ({ useSearchParams: () => state.search }));
vi.mock('@/hooks/search/useSearchV2', () => ({
  useSearchBlogsV2: () => ({
    hits: state.hits,
    isLoading: false,
    isError: false,
  }),
}));
afterEach(cleanup);

describe.each([
  ['navbar', NavbarSearchPosts],
  ['search page', PageSearchPosts],
] as const)('%s multilingual article links', (_label, Component) => {
  it.each([
    undefined,
    'भारत-में-तकनीक',
    'भारत-में-तकनीक-post123',
    encodeURIComponent('भारत-में-तकनीक-post123'),
  ])('uses one encoded prefix and one ID for stored slug %s', (slug) => {
    state.hits = [
      {
        blog_id: 'post123',
        title: 'भारत में तकनीक',
        slug,
        highlight: {
          title: ['<mark>भारत</mark> में तकनीक<script>bad()</script>'],
        },
      },
    ];
    const { container } = render(<Component query='भारत' />);
    expect(screen.getByRole('link').getAttribute('href')).toBe(
      `/blog/${encodeURIComponent('भारत-में-तकनीक')}-post123`
    );
    expect(container.querySelector('mark')?.textContent).toBe('भारत');
    expect(container.querySelector('script')).toBeNull();
  });
});
