import { ProfileBlogCard } from '@/components/cards/blog/ProfileBlogCard';
import { MetaBlog } from '@/services/blog/blogTypes';
import { fromMetaBlog } from '@/utils/blogCardAdapters';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@/components/blog/actions/BlogShareDialog', () => ({
  BlogShareDialog: () => <button data-testid='blog-share'>Share post</button>,
}));

vi.mock('@/components/blog/actions/DeleteBlogDialog', () => ({
  DeleteBlogDialog: () => <button>Delete</button>,
}));

vi.mock('@/components/blog/actions/EditBlogDialog', () => ({
  EditBlogDialog: () => <button>Edit</button>,
}));

vi.mock('@/components/blog/getBlogContent', () => ({
  BlogDescription: ({ description }: { description: string }) => (
    <p>{description}</p>
  ),
  BlogImage: ({ title }: { title: string }) => <img alt={title} />,
  BlogPlaceholderImage: ({ title }: { title: string }) => <img alt={title} />,
  BlogTitle: ({ title }: { title: string }) => <h2>{title}</h2>,
  getCardContent: vi.fn(),
}));

vi.mock('@/components/user/userInfo', () => ({
  UserInfoCardShowcase: () => <span>Author</span>,
}));

const metaBlog: MetaBlog = {
  blog_id: 'post-1',
  title: 'Writing together',
  first_image: '',
  first_paragraph: 'A group writing post.',
  owner_account_id: 'author-1',
  published_time: '2026-09-19T10:00:00Z',
  tags: ['writing'],
};

afterEach(cleanup);

describe('ProfileBlogCard publication scope', () => {
  it('shows real members-only and group metadata without a public share action', () => {
    render(
      <ProfileBlogCard
        blog={{
          ...metaBlog,
          audience: 'group_only',
          group_slug: 'writers',
        }}
        isAuthenticated
        modificationEnable
      />
    );

    expect(screen.getByText('Members only')).toBeTruthy();
    expect(
      screen.getByRole('link', { name: 'writers' }).getAttribute('href')
    ).toBe('/groups/writers');
    expect(screen.queryByTestId('blog-share')).toBeNull();
  });

  it('does not invent scope metadata for old cards', () => {
    expect(fromMetaBlog(metaBlog)).toMatchObject({
      audience: undefined,
      groupSlug: undefined,
    });
  });

  it('preserves supplied scope metadata for bookmark and feed cards', () => {
    expect(
      fromMetaBlog({
        ...metaBlog,
        audience: 'group_only',
        group_slug: 'writers',
      })
    ).toMatchObject({
      audience: 'group_only',
      groupSlug: 'writers',
    });
  });
});
