import { DiscussionCard } from '@/components/discussions/DiscussionCard';
import type { Discussion } from '@/services/discussions/discussionsTypes';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const useUserMock = vi.hoisted(() => vi.fn());

beforeEach(() => {
  useUserMock.mockReturnValue({ user: undefined });
});
afterEach(() => {
  cleanup();
  useUserMock.mockReset();
});

vi.mock('@/components/discussions/DiscussionAvatar', () => ({
  DiscussionAvatar: () => null,
}));
vi.mock('@/hooks/user/useUser', () => ({ default: useUserMock }));
vi.mock('@/hooks/groups/useGroupQueries', () => ({
  useGroupDetail: (slug?: string) => ({
    data: slug
      ? { group: { slug, name: 'Tea Circle', visibility: 'public' } }
      : undefined,
  }),
}));
vi.mock('@/components/discussions/DiscussionLinkPreview', () => ({
  DiscussionLinkPreview: ({
    target,
    href,
  }: {
    target: { kind: string };
    href: string;
  }) => <span>{`preview ${target.kind} ${href}`}</span>,
}));

const post: Discussion = {
  public_id: 'abc',
  body: 'Hello thread',
  status: 'visible',
  author_username: 'dave',
  author_gone: false,
  group_slug: '',
  reply_count: 2,
  like_count: 3,
  liked: false,
  created_at: '2026-10-05T04:00:00Z',
};

describe('DiscussionCard', () => {
  it('does not leave invisible inline links focusable inside a clamped preview', () => {
    const linkedPost = {
      ...post,
      body: `${'A long public thought. '.repeat(20)} @ada https://example.com/read`,
    };
    const { rerender } = render(
      <DiscussionCard linked post={linkedPost} compact />
    );
    expect(screen.queryByRole('link', { name: '@ada' })).toBeNull();
    expect(
      screen.queryByRole('link', {
        name: 'https://example.com/read',
      })
    ).toBeNull();
    expect(document.querySelector('a[href="/discussions/abc"]')).not.toBeNull();
    rerender(<DiscussionCard linked post={linkedPost} />);
    expect(screen.getByRole('link', { name: '@ada' })).toBeDefined();
    expect(
      screen.getByRole('link', {
        name: 'https://example.com/read',
      })
    ).toBeDefined();
  });
  it('limits only compact landing previews while preserving full-card rich previews', () => {
    const linkedPost = {
      ...post,
      body: 'Read https://monkeys.com.co/groups/gophers',
    };
    const { rerender } = render(
      <DiscussionCard linked post={linkedPost} compact />
    );
    expect(screen.queryByText(/preview group/)).toBeNull();
    expect(screen.getByText(/Read/).className).toContain('line-clamp-3');
    rerender(<DiscussionCard linked post={linkedPost} />);
    expect(screen.getByText('preview group /groups/gophers')).toBeDefined();
    expect(screen.getByText(/Read/).className).not.toContain('line-clamp-3');
  });
  it('links the body and shows like and reply counts', () => {
    render(<DiscussionCard post={post} linked />);
    expect(
      screen.getByRole('link', { name: 'Hello thread' }).getAttribute('href')
    ).toBe('/discussions/abc');
    expect(screen.getByLabelText('3 likes')).toBeTruthy();
    expect(screen.getByLabelText('2 replies')).toBeTruthy();
  });

  it('keeps links in the body outside the full-card link', () => {
    render(
      <DiscussionCard
        linked
        post={{ ...post, body: 'see https://example.com/x today' }}
      />
    );
    const external = screen.getByRole('link', {
      name: 'https://example.com/x',
    });
    expect(external.parentElement?.closest('a')).toBeNull();
    expect(
      screen
        .getByRole('link', { name: 'see https://example.com/x today' })
        .getAttribute('href')
    ).toBe('/discussions/abc');
  });

  it('previews only the first own-site link', () => {
    render(
      <DiscussionCard
        linked={false}
        post={{
          ...post,
          body: 'a https://example.com b https://monkeys.com.co/groups/gophers c https://monkeys.com.co/events/meet',
        }}
      />
    );
    expect(screen.getByText('preview group /groups/gophers')).toBeTruthy();
    expect(screen.queryByText(/preview event/)).toBeNull();
  });

  it('shows no preview without an own-site link', () => {
    render(<DiscussionCard linked={false} post={post} />);
    expect(screen.queryByText(/preview/)).toBeNull();
  });

  it('renders a post whose author fields were omitted by the API', () => {
    const gone = {
      public_id: 'g1',
      body: 'Orphan post',
      status: 'visible',
    } as unknown as Discussion;
    render(<DiscussionCard post={gone} linked={false} />);
    expect(screen.getByText('Deleted account')).toBeTruthy();
    expect(screen.getByLabelText('0 likes')).toBeTruthy();
  });

  it('shows the full name, verified check and @username from the profile', () => {
    useUserMock.mockReturnValue({
      user: {
        username: 'dave',
        first_name: 'Dave',
        last_name: 'Kumar',
        is_verified: true,
      },
    });
    render(<DiscussionCard linked={false} post={post} />);
    expect(useUserMock).toHaveBeenCalledWith('dave');
    expect(
      screen.getByRole('link', { name: 'Dave Kumar' }).getAttribute('href')
    ).toBe('/dave');
    expect(screen.getByTitle('Verified account')).toBeTruthy();
    expect(screen.getByText('@dave')).toBeTruthy();
  });

  it('falls back to @username while the profile loads and hides the check', () => {
    useUserMock.mockReturnValue({ user: undefined });
    render(<DiscussionCard linked={false} post={post} />);
    expect(
      screen.getByRole('link', { name: '@dave' }).getAttribute('href')
    ).toBe('/dave');
    expect(screen.getAllByText('@dave')).toHaveLength(1);
    expect(screen.queryByTitle('Verified account')).toBeNull();
  });

  it('shows the footer slot instead of the counts', () => {
    render(
      <DiscussionCard
        footer={<span>Actions here</span>}
        linked={false}
        post={post}
      />
    );
    expect(screen.getByText('Actions here')).toBeTruthy();
    expect(screen.queryByLabelText('3 likes')).toBeNull();
  });

  it('shows the group name and a members-only badge', () => {
    render(
      <DiscussionCard
        linked={false}
        post={{
          ...post,
          group_slug: 'tea',
          audience: 'group_only',
        }}
      />
    );
    expect(
      screen.getByRole('link', { name: 'Tea Circle' }).getAttribute('href')
    ).toBe('/groups/tea');
    expect(screen.getByText('Members only')).toBeTruthy();
  });
});
