import { homepageBlogQuery } from '@/services/blog/homepageApi';
import { fetcherV2 } from '@/services/fetcher';
import {
  QueryClient,
  QueryClientProvider,
  dehydrate,
  hydrate,
} from '@tanstack/react-query';
import { act, cleanup, waitFor } from '@testing-library/react';
import { type Root, hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import useGetHomepageBlogs from './useGetHomepageBlogs';

vi.mock('@/services/fetcher', () => ({ fetcherV2: vi.fn() }));
const clients: QueryClient[] = [];
let root: Root | undefined;
let container: HTMLDivElement | undefined;
afterEach(async () => {
  if (root) await act(async () => root!.unmount());
  root = undefined;
  container?.remove();
  container = undefined;
  cleanup();
  for (const client of clients.splice(0)) client.clear();
  vi.resetAllMocks();
  vi.unstubAllGlobals();
});
const client = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  clients.push(qc);
  return qc;
};
const response = (sort: 'latest' | 'trending') => ({
  homepage_policy_version: 'homepage-v1',
  has_more: false,
  blogs: [
    {
      blog_id: `${sort}-article`,
      title: `${sort} server article`,
      first_image: '/cover.jpg',
      first_paragraph: 'A qualified article.',
      owner_account_id: 'author',
      published_time: '2026-01-01',
      tags: ['Science'],
      homepage_eligibility: {
        eligible: true,
        lead_eligible: true,
        word_count: 250,
        minimum_words: 250,
        reasons: [],
        version: 'homepage-v1',
      },
    },
  ],
});
type Snapshot = {
  latest?: string;
  trending?: string;
  latestLoading: boolean;
  trendingLoading: boolean;
};
function Articles({ snapshots }: { snapshots: Snapshot[] }) {
  const latest = useGetHomepageBlogs({ sort: 'latest' });
  const trending = useGetHomepageBlogs({ sort: 'trending' });
  snapshots.push({
    latest: latest.blogs?.blogs[0]?.title,
    trending: trending.blogs?.blogs[0]?.title,
    latestLoading: latest.isLoading,
    trendingLoading: trending.isLoading,
  });
  return (
    <main>
      {(
        [
          ['latest', latest],
          ['trending', trending],
        ] as const
      ).map(([sort, query]) => (
        <section aria-label={sort} key={sort}>
          {query.isLoading
            ? `Loading ${sort}`
            : query.isError
              ? `Unavailable ${sort}`
              : query.blogs?.blogs.map((blog) => (
                  <a key={blog.blog_id} href={`/blog/${blog.blog_id}`}>
                    {blog.title}
                  </a>
                ))}
        </section>
      ))}
    </main>
  );
}
const tree = (qc: QueryClient, snapshots: Snapshot[]) => (
  <QueryClientProvider client={qc}>
    <Articles snapshots={snapshots} />
  </QueryClientProvider>
);
function serverRender(qc: QueryClient, snapshots: Snapshot[]) {
  // Also catch an implementation that uses typeof window and mismatches hydration.
  const browserWindow = window;
  vi.stubGlobal('window', undefined);
  try {
    return renderToString(tree(qc, snapshots));
  } finally {
    vi.stubGlobal('window', browserWindow);
  }
}
async function prefetch(qc: QueryClient) {
  vi.mocked(fetcherV2).mockImplementation(async (url) =>
    response(url.includes('sort=trending') ? 'trending' : 'latest')
  );
  await Promise.all([
    qc.prefetchQuery(homepageBlogQuery({ sort: 'latest' })),
    qc.prefetchQuery(homepageBlogQuery({ sort: 'trending' })),
  ]);
}

describe('homepage SSR and hydration freshness', () => {
  it('renders validated prefetched latest and Trending links into server HTML despite optimistic fetching', async () => {
    const qc = client();
    await prefetch(qc);
    const snapshots: Snapshot[] = [];
    const html = serverRender(qc, snapshots);
    expect(html).toContain('href="/blog/latest-article"');
    expect(html).toContain('href="/blog/trending-article"');
    expect(html).not.toContain('Loading');
    expect(snapshots[0]).toEqual({
      latest: 'latest server article',
      trending: 'trending server article',
      latestLoading: false,
      trendingLoading: false,
    });
  });

  it('matches hydration and keeps both validated sections visible during routine browser revalidation', async () => {
    const serverClient = client();
    await prefetch(serverClient);
    const serverSnapshots: Snapshot[] = [];
    const html = serverRender(serverClient, serverSnapshots);
    const browserClient = client();
    hydrate(browserClient, dehydrate(serverClient));
    const resolve: Partial<
      Record<'latest' | 'trending', (value: unknown) => void>
    > = {};
    vi.mocked(fetcherV2).mockImplementation(
      (url) =>
        new Promise((done) => {
          resolve[url.includes('sort=trending') ? 'trending' : 'latest'] = done;
        })
    );
    const snapshots: Snapshot[] = [];
    const recoverable = vi.fn();
    container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);
    await act(async () => {
      root = hydrateRoot(container!, tree(browserClient, snapshots), {
        onRecoverableError: recoverable,
      });
    });
    expect(snapshots[0]).toEqual(serverSnapshots[0]);
    expect(snapshots[0].latest).toBe('latest server article');
    expect(snapshots[0].trending).toBe('trending server article');
    expect(recoverable).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(container!.textContent).toContain('latest server article');
      expect(container!.textContent).toContain('trending server article');
      expect(container!.textContent).not.toContain('Loading');
      expect(container!.querySelectorAll('a')).toHaveLength(2);
    });
    expect(
      browserClient.getQueryState(
        homepageBlogQuery({ sort: 'latest' }).queryKey
      )?.fetchStatus
    ).toBe('fetching');
    expect(
      browserClient.getQueryState(
        homepageBlogQuery({ sort: 'trending' }).queryKey
      )?.fetchStatus
    ).toBe('fetching');
    await act(async () => {
      resolve.latest!({
        blogs: [],
        has_more: false,
        homepage_policy_version: 'homepage-v1',
      });
      resolve.trending!({
        blogs: [{ blog_id: 'unfiltered', title: 'Old backend article' }],
      });
    });
    await waitFor(() =>
      expect(container!.textContent).toContain('Unavailable trending')
    );
    expect(container!.textContent).not.toContain('Loading latest');
    expect(container!.querySelectorAll('a')).toHaveLength(0);
    expect(container!.textContent).not.toContain('Old backend article');
    expect(recoverable).not.toHaveBeenCalled();
  });

  it('does not render articles in SSR when policy prefetch fails validation', async () => {
    const qc = client();
    vi.mocked(fetcherV2).mockResolvedValue({
      blogs: [{ title: 'Unvalidated article' }],
    });
    await Promise.all([
      qc.prefetchQuery(homepageBlogQuery({ sort: 'latest' })),
      qc.prefetchQuery(homepageBlogQuery({ sort: 'trending' })),
    ]);
    const html = serverRender(qc, []);
    expect(html).not.toContain('Unvalidated article');
    expect(html).not.toContain('<a');
  });
});
