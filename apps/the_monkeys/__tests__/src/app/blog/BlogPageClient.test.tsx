import BlogPageClient from '@/app/blog/[slug]/BlogPageClient';
import useAuth from '@/hooks/auth/useAuth';
import useGetPublishedBlogDetailByBlogId from '@/hooks/blog/useGetPublishedBlogDetailByBlogId';
import { useGroupDetail } from '@/hooks/groups/useGroupQueries';
import { Blog } from '@/services/blog/blogTypes';
import { cleanup, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/components/moderation/ContentGate', () => ({
  ContentGate: ({ content, children }: any) =>
    content.is_nsfw ||
    content.content_rating?.is_nsfw ||
    content.content_unavailable ? (
      <div>Sensitive content</div>
    ) : (
      <>{children}</>
    ),
}));
vi.mock('@/components/moderation/ContentOptions', () => ({
  ContentOptions: () => null,
}));
vi.mock('next/dynamic', () => ({
  default: (_loader: unknown, options: { loading?: () => React.ReactNode }) =>
    options?.loading ?? (() => null),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/blog/post-123',
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@/components/blog/actions/BlogReportDialog', () => ({
  BlogReportDialog: () => <button>Report</button>,
}));

vi.mock('@/components/blog/actions/BlogShareDialog', () => ({
  BlogShareDialog: () => <button>Share Blog</button>,
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

vi.mock('@/components/buttons/backButton', () => ({
  BackButton: () => <button>Back</button>,
}));

vi.mock('@/components/topics/topicsContainer', () => ({
  TopicLinksContainerCompact: () => <div>Topics</div>,
}));

vi.mock('@/components/user/userInfo', () => ({
  UserInfoCardBlogPage: () => <div>Author</div>,
}));

vi.mock('@/hooks/auth/useAuth', () => ({
  default: vi.fn(() => ({
    data: { account_id: 'viewer-1' },
    isSuccess: true,
    isError: false,
  })),
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
  it('does not mount article content or snapshot controls while the shared gate is locked', () => {
    mockedArticleHook.mockReturnValue({
      blog: { ...publicBlog, is_nsfw: true },
      isLoading: false,
      isError: false,
    });
    const { container } = render(
      <BlogPageClient urlBlogId='123' fullSlug='post-123' />
    );
    expect(screen.getByText('Sensitive content')).toBeTruthy();
    expect(container.querySelector('h1')).toBeNull();
    expect(container.querySelector('a[href*=snapshot]')).toBeNull();
    expect(container.querySelector('.monkeys-editor')).toBeNull();
  });

  it('includes readable article blocks in anonymous server HTML before the editor mounts', () => {
    vi.mocked(useAuth).mockReturnValue({
      data: null,
      isSuccess: false,
      isError: false,
    } as never);
    mockedArticleHook.mockReturnValue({
      blog: {
        ...publicBlog,
        blog: {
          ...publicBlog.blog,
          blocks: [
            ...publicBlog.blog.blocks,
            {
              type: 'paragraph',
              data: { text: 'Learn Go with <b>confidence</b>. नमस्ते 世界' },
            },
            { type: 'header', data: { text: 'Build a backend', level: 2 } },
            {
              type: 'list',
              data: {
                style: 'ordered',
                items: [
                  'Install Go',
                  {
                    content: 'Write an API',
                    items: [{ content: 'Test it', items: [] }],
                  },
                ],
              },
            },
            {
              type: 'code',
              data: { code: 'if x < 2 { return }', language: 'go' },
            },
          ],
        },
      } as Blog,
      isLoading: false,
      isError: false,
    });

    const html = renderToStaticMarkup(
      <BlogPageClient urlBlogId='123' fullSlug='post-123' />
    );
    const document = new DOMParser().parseFromString(html, 'text/html');
    document.querySelectorAll('script').forEach((script) => script.remove());

    expect(document.body.textContent).toContain(
      'Learn Go with confidence. नमस्ते 世界'
    );
    expect(document.querySelector('h2')?.textContent).toBe('Build a backend');
    expect(document.querySelector('ol li')?.textContent).toContain(
      'Install Go'
    );
    expect(document.querySelector('ol ol li')?.textContent).toBe('Test it');
    expect(document.querySelector('pre code')?.textContent).toBe(
      'if x < 2 { return }'
    );
    expect(document.querySelector('b')?.textContent).toBe('confidence');
    expect(document.querySelectorAll('h1')).toHaveLength(1);
    expect(
      document.querySelector('[data-article-body]')?.textContent
    ).not.toContain('Post');
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      data: { account_id: 'viewer-1' },
      isSuccess: true,
      isError: false,
    } as never);
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

  it.each([
    { isError: true, isLoading: false },
    { isError: false, isLoading: true },
  ])(
    'withholds stale article body HTML when access failed or is loading: %j',
    (state) => {
      mockedArticleHook.mockReturnValue({
        blog: {
          ...publicBlog,
          blog: {
            ...publicBlog.blog,
            blocks: [
              {
                type: 'paragraph',
                data: { text: 'Sensitive stale article body' },
              },
            ],
          },
        } as Blog,
        ...state,
      });

      const html = renderToStaticMarkup(
        <BlogPageClient urlBlogId='123' fullSlug='post-123' />
      );
      expect(html).not.toContain('Sensitive stale article body');
      expect(html).not.toContain('data-article-body');
      expect(fetch).not.toHaveBeenCalled();
    }
  );

  it('keeps the owner edit interaction available', () => {
    vi.mocked(useAuth).mockReturnValue({
      data: { account_id: 'author-1' },
      isSuccess: true,
      isError: false,
    } as never);
    mockedArticleHook.mockReturnValue({
      blog: publicBlog,
      isLoading: false,
      isError: false,
    });
    render(<BlogPageClient urlBlogId='123' fullSlug='post-123' />);
    expect(screen.getByRole('button', { name: 'Edit' })).toBeTruthy();
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
    expect(document.querySelector('[data-article-body]')).toBeNull();
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
    expect(screen.queryByRole('button', { name: 'Share Blog' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Open Studio →' })).toBeNull();
  });

  it('keeps sharing and snapshots available for public articles', () => {
    mockedArticleHook.mockReturnValue({
      blog: publicBlog,
      isLoading: false,
      isError: false,
    });

    render(<BlogPageClient urlBlogId='123' fullSlug='post-123' />);

    expect(screen.getByRole('button', { name: 'Share Blog' })).toBeTruthy();
    expect(
      screen.getByRole('link', { name: 'Open Studio →' }).getAttribute('href')
    ).toBe('/snapshot/123');
    expect(screen.queryByText('Members only')).toBeNull();
  });
});
