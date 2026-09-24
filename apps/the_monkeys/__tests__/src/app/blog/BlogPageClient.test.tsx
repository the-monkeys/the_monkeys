import BlogPageClient from '@/app/blog/[slug]/BlogPageClient';
import useGetPublishedBlogDetailByBlogId from '@/hooks/blog/useGetPublishedBlogDetailByBlogId';
import { useGroupDetail } from '@/hooks/groups/useGroupQueries';
import { Blog } from '@/services/blog/blogTypes';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/dynamic', () => ({
  default: () => () => <div>Article body</div>,
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/blog/post-123',
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@/components/blog/actions/BlogReportDialog', () => ({
  BlogReportDialog: () => <button>Report</button>,
}));

vi.mock('@/components/blog/actions/BlogShareDialog', () => ({
  BlogShareDialog: () => <button data-testid='blog-share'>Share</button>,
}));

vi.mock('@/components/blog/actions/EditBlogDialog', () => ({
  EditBlogDialog: () => <button>Edit</button>,
}));

vi.mock('@/components/blog/buttons/BookmarkButton', () => ({
  BookmarkButton: () => <button>Bookmark</button>,
}));

vi.mock('@/components/blog/buttons/LikeButton', () => ({
  LikeButton: () => <button>Like</button>,
}));

vi.mock('@/components/blog/LikesCount', () => ({
  LikesCount: () => <span>0 likes</span>,
}));

vi.mock('@/components/blog/getBlogContent', () => ({
  BlogHeading: ({ title }: { title: string }) => <h1>{title}</h1>,
  getCardContent: vi.fn(),
  withoutPostTitle: (data: { blocks?: unknown[] } | undefined) => data,
}));

vi.mock('@/components/buttons/backButton', () => ({
  BackButton: () => <button>Back</button>,
}));

vi.mock('@/components/social/SocialSnapshot', () => ({
  SocialSnapshotCard: () => <div data-testid='social-snapshot'>Snapshot</div>,
}));

vi.mock('@/components/topics/topicsContainer', () => ({
  TopicLinksContainerCompact: () => <div>Topics</div>,
}));

vi.mock('@/components/user/userInfo', () => ({
  UserInfoCardBlogPage: () => <div>Author</div>,
}));

vi.mock('@/hooks/auth/useAuth', () => ({
  default: () => ({
    data: { account_id: 'viewer-1' },
    isSuccess: true,
    isError: false,
  }),
}));

vi.mock('@/hooks/blog/useGetPublishedBlogDetailByBlogId', () => ({
  default: vi.fn(),
}));

vi.mock('@/hooks/groups/useGroupQueries', () => ({
  useGroupDetail: vi.fn(),
}));

vi.mock('@/hooks/user/useGetProfileInfoByUserId', () => ({
  default: () => ({ user: undefined }),
}));

vi.mock('@/app/blog/components/BlogRecommendations', () => ({
  BlogRecommendations: () => <div>Recommendations</div>,
}));

vi.mock('@growthbook/growthbook-react', () => ({
  useFeatureIsOn: () => false,
}));

const publicBlog: Blog = {
  blog_id: '123',
  owner_account_id: 'author-1',
  blog: {
    time: 1,
    blocks: [
      {
        id: 'title',
        type: 'header',
        data: { text: 'Post' },
        author: [],
        time: 1,
      },
    ],
  },
  is_draft: false,
  published_time: '2026-09-19T10:00:00Z',
  tags: ['writing'],
  LikeCount: 0,
  like_count: 0,
  BookmarkCount: 0,
  bookmark_count: 0,
};

const mockedArticleHook = vi.mocked(useGetPublishedBlogDetailByBlogId);
const mockedGroupDetail = vi.mocked(useGroupDetail);

describe('BlogPageClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
    mockedGroupDetail.mockReturnValue({
      data: { group: { name: 'Writers Guild', slug: 'writers' } },
      isLoading: false,
      isError: false,
    } as never);
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('does not record activity or render interactions when the article failed', () => {
    mockedArticleHook.mockReturnValue({
      blog: undefined,
      isLoading: false,
      isError: true,
    });

    const { unmount } = render(
      <BlogPageClient urlBlogId='hidden' fullSlug='hidden-hidden' />
    );
    vi.advanceTimersByTime(1500);
    unmount();

    expect(fetch).not.toHaveBeenCalled();
    expect(screen.queryByText('Members only')).toBeNull();
    expect(screen.queryByTestId('blog-reactions')).toBeNull();
  });

  it('hides public sharing and snapshots for members-only articles', () => {
    mockedArticleHook.mockReturnValue({
      blog: {
        ...publicBlog,
        audience: 'group_only',
        group_slug: 'writers',
      },
      isLoading: false,
      isError: false,
    });

    render(<BlogPageClient urlBlogId='123' fullSlug='post-123' />);

    expect(screen.getByText('Members only')).toBeTruthy();
    expect(
      screen.getByRole('link', { name: 'Writers Guild' }).getAttribute('href')
    ).toBe('/groups/writers');
    expect(screen.getByTestId('blog-reactions')).toBeTruthy();
    expect(screen.queryByTestId('blog-share')).toBeNull();
    expect(screen.queryByTestId('social-snapshot')).toBeNull();
  });

  it('keeps sharing and snapshots available for public articles', () => {
    mockedArticleHook.mockReturnValue({
      blog: publicBlog,
      isLoading: false,
      isError: false,
    });

    render(<BlogPageClient urlBlogId='123' fullSlug='post-123' />);

    expect(screen.getByTestId('blog-share')).toBeTruthy();
    expect(screen.getByTestId('social-snapshot')).toBeTruthy();
    expect(screen.queryByText('Members only')).toBeNull();
  });
});
