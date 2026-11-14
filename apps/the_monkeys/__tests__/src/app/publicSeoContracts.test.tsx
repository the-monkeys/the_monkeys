import DiscussionPage from '@/app/discussions/[id]/page';
import { metadata as searchMetadata } from '@/app/search/layout';
import Footer from '@/components/layout/footer';
import { footerSocialsList } from '@/constants/footer';
import { cleanup, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react')>()),
  cache: (loader: (...args: unknown[]) => unknown) => loader,
}));

vi.mock('next/headers', () => ({ cookies: () => ({ toString: () => '' }) }));
vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NOT_FOUND');
  },
}));
vi.mock('@/lib/discussionPageData', () => ({
  loadDiscussion: async () => ({
    state: 'ok',
    indexable: true,
    discussion: {
      public_id: 'local',
      body: 'Community research with practical sources',
      status: 'visible',
    },
    publicDiscussion: {
      public_id: 'local',
      body: 'Community research with practical sources',
      status: 'visible',
    },
  }),
}));
vi.mock('@/components/discussions/DiscussionThread', () => ({
  DiscussionThread: () => <article>Thread content</article>,
}));

afterEach(cleanup);
describe('public discovery semantics', () => {
  it('names every footer social link for screen readers and browsing agents', () => {
    render(<Footer />);
    for (const social of footerSocialsList) {
      expect(
        screen
          .getByRole('link', { name: `Monkeys on ${social.account}` })
          .getAttribute('href')
      ).toBe(social.link);
    }
  });

  it('keeps search noindex while using the search canonical for social metadata', () => {
    expect(searchMetadata.robots).toMatchObject({ index: false, follow: true });
    expect(searchMetadata.openGraph).toMatchObject({
      url: searchMetadata.alternates?.canonical,
    });
  });

  it('provides one accessible discussion heading without a large visible introduction', async () => {
    const html = renderToStaticMarkup(
      await DiscussionPage({ params: { id: 'local' } })
    );
    expect(html).toContain(
      '<h1 class="sr-only">Community research with practical sources</h1>'
    );
  });
});
