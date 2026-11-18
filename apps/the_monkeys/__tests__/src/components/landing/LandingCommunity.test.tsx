import { LandingCommunity } from '@/components/landing/LandingCommunity';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/hooks/user/useUser', () => ({
  default: () => ({ user: undefined }),
}));
vi.mock('@/components/discussions/DiscussionAvatar', () => ({
  DiscussionAvatar: () => <span />,
}));
vi.mock('@/components/discussions/DiscussionCardMenu', () => ({
  DiscussionCardMenu: () => <button aria-label='Discussion options'>…</button>,
}));
afterEach(cleanup);

const discussions = {
  data: [
    {
      public_id: 'public-one',
      body: 'हिन्दी 中文 a useful discussion',
      status: 'visible',
      author_username: 'dave',
    },
  ],
};
const groups = {
  data: [
    {
      id: 1,
      name: 'Real community',
      slug: 'real-community',
      visibility: 'public' as const,
      status: 'published' as const,
      description: 'Real ideas shared together.',
    },
  ],
};

describe('landing community presentation', () => {
  it('keeps the themed group fallback visible until an image loads and after a failed image', async () => {
    render(
      <LandingCommunity
        discussions={discussions}
        groups={{
          data: [{ ...groups.data[0], logo_image: '/local-logo.png' }],
        }}
      />
    );
    const image = document.querySelector('img')!;
    expect(new URL(image.src, window.location.origin).pathname).toBe(
      '/local-logo.png'
    );
    expect(image.className).toContain('object-contain');
    expect(image.className).toContain('opacity-0');
    fireEvent.load(image);
    await waitFor(() => expect(image.className).toContain('opacity-100'));
    fireEvent.error(image);
    expect(document.querySelector('img')).toBeNull();
    expect(
      screen.getByRole('link', { name: 'View group Real community' })
    ).toBeDefined();
  });
  it('shows real compact discussions and public groups with working browse/detail links', () => {
    render(<LandingCommunity discussions={discussions} groups={groups} />);
    expect(
      screen
        .getByRole('link', { name: 'View all discussions' })
        .getAttribute('href')
    ).toBe('/discussions');
    expect(
      screen.getByRole('link', { name: 'View all groups' }).getAttribute('href')
    ).toBe('/groups');
    const discussionSection = screen.getByRole('region', {
      name: 'Top discussions',
    });
    expect(
      within(discussionSection)
        .getByRole('link', { name: /हिन्दी/ })
        .getAttribute('href')
    ).toBe('/discussions/public-one');
    expect(within(discussionSection).getByText('@dave')).toBeDefined();
    expect(
      within(discussionSection).getByRole('button', {
        name: 'Discussion options',
      })
    ).toBeDefined();
    expect(
      screen
        .getByRole('link', { name: 'View group Real community' })
        .getAttribute('href')
    ).toBe('/groups/real-community');
    expect(screen.getByText('Public group')).toBeDefined();
    expect(screen.queryByText(/undefined/)).toBeNull();
  });

  it('keeps groups and browse links available when discussions fail, without showing stale failed data', () => {
    render(
      <LandingCommunity
        discussions={{ ...discussions, isError: true }}
        groups={groups}
      />
    );
    expect(screen.queryByText('हिन्दी 中文 a useful discussion')).toBeNull();
    expect(screen.getByText('Real community')).toBeDefined();
    expect(
      screen.getByRole('link', { name: 'View all discussions' })
    ).toBeDefined();
  });

  it('handles empty, loading and independently failed sections without sample content', () => {
    const { rerender } = render(
      <LandingCommunity
        discussions={{ isPending: true }}
        groups={{ isError: true }}
      />
    );
    expect(screen.getByLabelText('Loading discussions')).toBeDefined();
    expect(
      screen.getByText('Groups are taking a little longer to load.')
    ).toBeDefined();
    rerender(
      <LandingCommunity discussions={{ data: [] }} groups={{ data: [] }} />
    );
    expect(
      screen.getByText('No public discussions to show yet.')
    ).toBeDefined();
    expect(screen.getByText('No public groups to discover yet.')).toBeDefined();
    expect(screen.queryByText('Developers & builders')).toBeNull();
  });

  it('handles missing images, removed authors, unsafe image URLs and unusually long names', () => {
    render(
      <LandingCommunity
        discussions={{
          data: [
            {
              ...discussions.data[0],
              author_username: undefined,
              author_gone: true,
            },
          ],
        }}
        groups={{
          data: [
            {
              ...groups.data[0],
              name: 'क'.repeat(200),
              logo_image: 'javascript:alert(1)',
            },
          ],
        }}
      />
    );
    expect(screen.getByText('Deleted account')).toBeDefined();
    expect(document.querySelector('img[src^="javascript:"]')).toBeNull();
  });
});
