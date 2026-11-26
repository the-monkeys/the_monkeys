import { metadata } from '@/app/feed/layout';
import FeedPage from '@/app/feed/page';
import { buildMainSitemap } from '@/app/sitemap';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({ value: 'anonymous', cookie: '' }));
vi.mock('next/headers', () => ({
  cookies: () => ({ toString: () => state.cookie }),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
  redirect: (href: string) => {
    throw new Error(`redirect:${href}`);
  },
}));
vi.mock('@/lib/followingSession', () => ({
  loadFollowingSession: async () => ({
    state: state.value,
    viewer: { username: 'dave', accountId: 'account-dave' },
  }),
}));
vi.mock('@/components/feed/FollowingFeedClient', () => ({
  default: ({ viewer }: { viewer: { username: string } }) => (
    <div>Private following feed for {viewer.username}</div>
  ),
}));
afterEach(() => {
  cleanup();
  state.value = 'anonymous';
  state.cookie = '';
});

it('redirects a guest to login with the following page as the callback', async () => {
  await expect(FeedPage()).rejects.toThrow(
    'redirect:/auth/login?callbackURL=%2Ffeed'
  );
});

it('does not render personalized content when session validation is unavailable', async () => {
  state.value = 'unavailable';
  render(await FeedPage());
  expect(screen.queryByText('Private following feed for dave')).toBeNull();
  expect(screen.getByRole('button', { name: 'Try again' })).toBeTruthy();
});

it('admits a validated session', async () => {
  state.value = 'authenticated';
  render(await FeedPage());
  expect(screen.getByText('Private following feed for dave')).toBeTruthy();
});

it('excludes the private following page from indexing and the sitemap', () => {
  expect(metadata.robots).toMatchObject({ index: false });
  expect(
    buildMainSitemap([]).some(
      (entry) => new URL(entry.url).pathname === '/feed'
    )
  ).toBe(false);
});
