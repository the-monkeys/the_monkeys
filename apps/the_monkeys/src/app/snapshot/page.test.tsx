import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import SnapshotPage from './page';

const { session, posts, push } = vi.hoisted(() => ({
  session: vi.fn(),
  posts: vi.fn(),
  push: vi.fn(),
}));

vi.mock('@/services/auth/auth', () => ({ validateSession: session }));
vi.mock('@/services/fetcher', () => ({ fetcherV2: posts }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

let client: QueryClient;

function page() {
  return (
    <QueryClientProvider client={client}>
      <SnapshotPage />
    </QueryClientProvider>
  );
}

beforeEach(() => {
  vi.resetAllMocks();
  client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  session.mockResolvedValue(null);
  posts.mockResolvedValue({ blogs: [] });
});

afterEach(() => {
  cleanup();
  client.clear();
});

describe('Snapshot public landing and account picker', () => {
  it('renders useful Studio guidance and editor links before auth resolves', () => {
    const html = renderToStaticMarkup(page());
    const doc = new DOMParser().parseFromString(html, 'text/html');
    expect(doc.querySelector('h1')?.textContent).toContain('Snapshot Studio');
    expect(doc.body.textContent).toContain('PNG');
    expect(doc.body.textContent).toContain('JPEG');
    expect(doc.querySelector('a[href="/snapshot/new"]')).not.toBeNull();
    expect(doc.querySelector('a[href="/snapshot/new?view=x"]')).not.toBeNull();
    expect(doc.querySelectorAll('h1')).toHaveLength(1);
  });

  it('keeps guest sign-in and scratch creation available without requesting posts', async () => {
    render(page());
    const signIn = await screen.findByRole('button', { name: 'Sign in' });
    await userEvent.click(signIn);
    expect(push).toHaveBeenCalledWith('/auth/login');
    expect(
      screen
        .getByRole('link', { name: 'Start from scratch' })
        .getAttribute('href')
    ).toBe('/snapshot/new');
    expect(posts).not.toHaveBeenCalled();
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(
      'Snapshot Studio'
    );
  });

  it('keeps the public explanation visible while the account request is pending', () => {
    session.mockImplementation(() => new Promise(() => {}));
    render(page());
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(
      'Snapshot Studio'
    );
    expect(screen.queryByRole('button', { name: 'Sign in' })).toBeNull();
    expect(posts).not.toHaveBeenCalled();
  });

  it('keeps signed-in post selection and encoded editor destinations', async () => {
    session.mockResolvedValue({ username: 'writer' });
    posts.mockResolvedValue({
      blogs: [
        {
          blog_id: 'post/one',
          title: 'Published research',
          first_image: '',
          first_paragraph: 'Summary',
        },
      ],
    });
    render(page());
    const link = await screen.findByRole('link', {
      name: /Published research/,
    });
    expect(link.getAttribute('href')).toBe('/snapshot/post%2Fone');
    expect(posts).toHaveBeenCalledWith('blog/user/writer?limit=30&offset=0');
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  it('keeps the signed-in empty state and scratch path', async () => {
    session.mockResolvedValue({ username: 'writer' });
    render(page());
    expect(
      await screen.findByText('You have no published posts yet.')
    ).toBeTruthy();
    expect(
      screen
        .getByRole('link', { name: /Start from scratch/ })
        .getAttribute('href')
    ).toBe('/snapshot/new');
  });

  it('keeps the post-loading error and scratch path usable', async () => {
    session.mockResolvedValue({ username: 'writer' });
    posts.mockRejectedValue(new Error('Local test failure'));
    render(page());
    expect((await screen.findByRole('alert')).textContent).toContain(
      'Could not load your posts'
    );
    expect(
      screen
        .getByRole('link', { name: /Start from scratch/ })
        .getAttribute('href')
    ).toBe('/snapshot/new');
  });
});
